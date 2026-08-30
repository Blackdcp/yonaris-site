import { createHash } from "node:crypto";
import { isIP } from "node:net";
import {
	contactFieldErrors,
	contactLeadDraft,
	type ContactFormResult,
	type ContactLead,
	type ContactLocale,
	type ContactRequestType,
	parseContactLead,
} from "./contact-schema";
import { contactLeadFingerprint } from "./contact-client";
import {
	CONTACT_SUBMISSION_HEADER,
	parseContactSubmissionId,
	type ContactApiErrorCode,
} from "./contact-api-protocol";
import type { ContactFormUiCopy } from "@/content/public-site/contracts/contact-form-ui";
import {
	DIAGNOSTIC_IDEMPOTENCY_HEADER,
	type DiagnosticApiErrorCode,
	type DiagnosticApiResponse,
} from "./diagnostic-api-protocol";
import { type DiagnosticLead, parseDiagnosticLead } from "./diagnostic-schema";

const MAX_BODY_BYTES = 20_480;
const RATE_LIMIT_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1_000;
const RATE_LIMIT_BUCKET_CAP = 10_000;
const SUBMISSION_CACHE_CAP = 10_000;
const SUBMISSION_CACHE_TTL_MS = 30 * 60 * 1_000;
const EMAIL_DELIVERY_TIMEOUT_MS = 10_000;

export const CONTACT_PROCESS_LOCAL_IDEMPOTENCY_BOUNDARY =
	"Submission replay and single-flight state is bounded to this process; cross-instance exactly-once delivery requires a durable store.";

export interface ContactDeliveryEnv {
	readonly CLOUDFLARE_ACCOUNT_ID: string;
	readonly CLOUDFLARE_EMAIL_API_TOKEN: string;
	readonly CLOUDFLARE_EMAIL_FROM: string;
	readonly MARKETING_LEAD_RECIPIENT: string;
}

export type DeliverContactLead = (input: {
	readonly lead: ContactLead;
	readonly env: ContactDeliveryEnv;
	readonly submissionId: string;
}) => Promise<void>;

export class ContactDeliveryError extends Error {
	constructor(readonly code: "service_unavailable" | "delivery_unconfirmed") {
		super(code);
		this.name = "ContactDeliveryError";
	}
}

export interface ContactNativeRenderContext {
	readonly locale: ContactLocale;
	readonly requestType: ContactRequestType;
}

export type ContactServerUiCopy = Pick<
	ContactFormUiCopy,
	"validation" | "unconfirmedMessage" | "conflictMessage"
>;

export interface ContactHandlerDeps {
	readonly getEnv: () => Record<string, string | undefined>;
	readonly deliver: DeliverContactLead;
	readonly now: () => number;
	readonly createSubmissionId?: () => string;
	readonly renderNativeResult?: (
		result: ContactFormResult,
		submissionId: string,
		context: ContactNativeRenderContext,
	) => string;
	readonly getFormUiCopy: (context: ContactNativeRenderContext) => ContactServerUiCopy;
}

class RequestBodyError extends Error {
	constructor(readonly code: "invalid_request" | "payload_too_large" | "unsupported_media_type") {
		super(code);
		this.name = "RequestBodyError";
	}
}

interface ParsedRequestBody {
	readonly input: Record<string, unknown>;
	readonly native: boolean;
	readonly submittedId?: string;
}

interface RateLimitBucket {
	count: number;
	windowStartedAt: number;
}

type SubmissionRecord =
	| { readonly fingerprint: string; readonly status: "pending"; readonly promise: Promise<void>; readonly createdAt: number }
	| { readonly fingerprint: string; readonly status: "confirmed"; readonly createdAt: number };

class ProcessLocalRequestState {
	private readonly rateLimits = new Map<string, RateLimitBucket>();
	private readonly submissions = new Map<string, SubmissionRecord>();

	private prune(now: number): void {
		for (const [key, bucket] of this.rateLimits) {
			if (bucket.windowStartedAt + RATE_LIMIT_WINDOW_MS <= now) this.rateLimits.delete(key);
		}
		for (const [key, record] of this.submissions) {
			if (record.createdAt + SUBMISSION_CACHE_TTL_MS <= now) this.submissions.delete(key);
		}
	}

	consumeRateLimit(key: string, now: number): { allowed: true } | { allowed: false; retryAfter: number } {
		this.prune(now);
		let bucket = this.rateLimits.get(key);
		if (!bucket) {
			bucket = { count: 0, windowStartedAt: now };
			this.rateLimits.set(key, bucket);
			while (this.rateLimits.size > RATE_LIMIT_BUCKET_CAP) {
				const oldest = this.rateLimits.keys().next().value;
				if (oldest === undefined) break;
				this.rateLimits.delete(oldest);
			}
		}
		if (bucket.count >= RATE_LIMIT_ATTEMPTS) {
			return {
				allowed: false,
				retryAfter: Math.max(1, Math.ceil((bucket.windowStartedAt + RATE_LIMIT_WINDOW_MS - now) / 1_000)),
			};
		}
		bucket.count += 1;
		return { allowed: true };
	}

	getSubmission(id: string): SubmissionRecord | undefined {
		return this.submissions.get(id);
	}

	remember(id: string, record: SubmissionRecord): void {
		this.submissions.set(id, record);
		while (this.submissions.size > SUBMISSION_CACHE_CAP) {
			const oldest = this.submissions.keys().next().value;
			if (oldest === undefined) break;
			this.submissions.delete(oldest);
		}
	}

	removePending(id: string): void {
		if (this.submissions.get(id)?.status === "pending") this.submissions.delete(id);
	}
}

function responseHeaders(contentType: string): Headers {
	return new Headers({
		"Cache-Control": "no-store",
		"Content-Type": contentType,
		"Referrer-Policy": "no-referrer",
		"X-Content-Type-Options": "nosniff",
	});
}

function apiError(status: number, code: ContactApiErrorCode | DiagnosticApiErrorCode, retryAfter?: number): Response {
	const headers = responseHeaders("application/json; charset=utf-8");
	if (retryAfter !== undefined) headers.set("Retry-After", String(retryAfter));
	return new Response(JSON.stringify({ ok: false, code }), { status, headers });
}

function requestContentType(
	request: Request,
	allowed: readonly string[],
): { readonly success: true; readonly contentType: string } | { readonly success: false; readonly response: Response } {
	const url = new URL(request.url);
	if (request.headers.get("Origin") !== url.origin || request.headers.get("Sec-Fetch-Site") !== "same-origin") {
		return { success: false, response: apiError(403, "forbidden_request") };
	}
	const encoding = request.headers.get("Content-Encoding")?.trim().toLowerCase();
	if (encoding && encoding !== "identity") {
		return { success: false, response: apiError(415, "unsupported_media_type") };
	}
	const rawContentType = request.headers.get("Content-Type") ?? "";
	const contentType = rawContentType.split(";", 1)[0]?.trim().toLowerCase();
	if (!allowed.includes(contentType)) {
		return { success: false, response: apiError(415, "unsupported_media_type") };
	}
	const contentLength = request.headers.get("Content-Length");
	if (contentLength !== null && contentLength !== "") {
		if (!/^\d+$/.test(contentLength)) return { success: false, response: apiError(400, "invalid_request") };
		if (Number(contentLength) > MAX_BODY_BYTES) return { success: false, response: apiError(413, "payload_too_large") };
	}
	return { success: true, contentType };
}

function resultResponse(
	result: ContactFormResult,
	status: number,
	submissionId: string,
	native: boolean,
	context: ContactNativeRenderContext,
	renderNativeResult?: ContactHandlerDeps["renderNativeResult"],
): Response {
	if (native && renderNativeResult) {
		const headers = responseHeaders("text/html; charset=utf-8");
		headers.set("Content-Security-Policy", "default-src 'none'; style-src 'unsafe-inline'; img-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'");
		return new Response(renderNativeResult(result, submissionId, context), { status, headers });
	}
	return new Response(JSON.stringify(result), {
		status,
		headers: responseHeaders("application/json; charset=utf-8"),
	});
}

function deliveryEnv(values: Record<string, string | undefined>): ContactDeliveryEnv | null {
	const CLOUDFLARE_ACCOUNT_ID = values.CLOUDFLARE_ACCOUNT_ID?.trim();
	const CLOUDFLARE_EMAIL_API_TOKEN = values.CLOUDFLARE_EMAIL_API_TOKEN?.trim();
	const CLOUDFLARE_EMAIL_FROM = values.CLOUDFLARE_EMAIL_FROM?.trim();
	const MARKETING_LEAD_RECIPIENT = values.MARKETING_LEAD_RECIPIENT?.trim();
	if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_EMAIL_API_TOKEN || !CLOUDFLARE_EMAIL_FROM || !MARKETING_LEAD_RECIPIENT) {
		return null;
	}
	return { CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_EMAIL_API_TOKEN, CLOUDFLARE_EMAIL_FROM, MARKETING_LEAD_RECIPIENT };
}

async function readBodyLimited(request: Request, maxBytes = MAX_BODY_BYTES): Promise<Uint8Array> {
	if (!request.body) throw new RequestBodyError("invalid_request");
	const reader = request.body.getReader();
	const chunks: Uint8Array[] = [];
	let length = 0;
	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			length += value.byteLength;
			if (length > maxBytes) {
				await reader.cancel().catch(() => undefined);
				throw new RequestBodyError("payload_too_large");
			}
			chunks.push(value);
		}
	} catch (error) {
		if (error instanceof RequestBodyError) throw error;
		throw new RequestBodyError("invalid_request");
	}
	const body = new Uint8Array(length);
	let offset = 0;
	for (const chunk of chunks) {
		body.set(chunk, offset);
		offset += chunk.byteLength;
	}
	return body;
}

function decodeUtf8(bytes: Uint8Array): string {
	try {
		return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
	} catch {
		throw new RequestBodyError("invalid_request");
	}
}

function uniqueEntries(entries: Iterable<[string, FormDataEntryValue | string]>): Record<string, unknown> {
	const input: Record<string, unknown> = {};
	for (const [key, value] of entries) {
		if (Object.hasOwn(input, key) || typeof value !== "string") throw new RequestBodyError("invalid_request");
		input[key] = value;
	}
	return input;
}

async function parseRequestBody(request: Request, contentType: string): Promise<ParsedRequestBody> {
	const bytes = await readBodyLimited(request);
	if (contentType === "application/json") {
		try {
			const input: unknown = JSON.parse(decodeUtf8(bytes));
			if (typeof input !== "object" || input === null || Array.isArray(input)) throw new RequestBodyError("invalid_request");
			return { input: input as Record<string, unknown>, native: false };
		} catch (error) {
			if (error instanceof RequestBodyError) throw error;
			throw new RequestBodyError("invalid_request");
		}
	}

	let input: Record<string, unknown>;
	if (contentType === "application/x-www-form-urlencoded") {
		input = uniqueEntries(new URLSearchParams(decodeUtf8(bytes)).entries());
	} else if (contentType === "multipart/form-data") {
		try {
			const replayBody = new ArrayBuffer(bytes.byteLength);
			new Uint8Array(replayBody).set(bytes);
			const replay = new Request(request.url, {
				method: "POST",
				headers: { "Content-Type": request.headers.get("Content-Type") ?? "" },
				body: replayBody,
			});
			input = uniqueEntries((await replay.formData()).entries());
		} catch (error) {
			if (error instanceof RequestBodyError) throw error;
			throw new RequestBodyError("invalid_request");
		}
	} else {
		throw new RequestBodyError("unsupported_media_type");
	}

	const submittedId = typeof input.submissionId === "string" && input.submissionId !== ""
		? input.submissionId
		: undefined;
	delete input.submissionId;
	return { input, native: true, submittedId };
}

function forwardedIp(request: Request): string | null {
	if (!request.headers.get("X-Vercel-ID")) return null;
	for (const header of ["X-Vercel-Forwarded-For", "X-Forwarded-For"]) {
		const candidate = request.headers.get(header)?.split(",", 1)[0]?.trim();
		if (candidate && isIP(candidate) !== 0) return candidate;
	}
	return null;
}

function clientKey(request: Request, submissionId: string): string {
	const trustedIp = forwardedIp(request);
	if (trustedIp) return `ip:${trustedIp}`;
	const fingerprint = [
		request.headers.get("User-Agent") ?? "",
		request.headers.get("Accept-Language") ?? "",
		request.headers.get("Sec-CH-UA") ?? "",
		request.headers.get("Sec-CH-UA-Platform") ?? "",
	].join("\n");
	if (!fingerprint.replace(/\n/g, "")) return `submission:${submissionId}`;
	return `fallback:${createHash("sha256").update(fingerprint).digest("hex").slice(0, 32)}`;
}

export function createContactLeadHandler(deps: ContactHandlerDeps): (request: Request) => Promise<Response> {
	const state = new ProcessLocalRequestState();

	return async (request: Request): Promise<Response> => {
		const gate = requestContentType(request, ["application/json", "application/x-www-form-urlencoded", "multipart/form-data"]);
		if (!gate.success) return gate.response;

		let body: ParsedRequestBody;
		try {
			body = await parseRequestBody(request, gate.contentType);
		} catch (error) {
			if (error instanceof RequestBodyError && error.code === "payload_too_large") return apiError(413, error.code);
			if (error instanceof RequestBodyError && error.code === "unsupported_media_type") return apiError(415, error.code);
			return apiError(400, "invalid_request");
		}

		const candidateId = body.native
			? body.submittedId ?? deps.createSubmissionId?.() ?? crypto.randomUUID()
			: request.headers.get(CONTACT_SUBMISSION_HEADER);
		const submissionId = parseContactSubmissionId(candidateId);
		if (!submissionId) return apiError(400, "invalid_submission_id");

		const rateLimit = state.consumeRateLimit(clientKey(request, submissionId), deps.now());
		if (!rateLimit.allowed) return apiError(429, "rate_limited", rateLimit.retryAfter);

		const draft = contactLeadDraft(body.input);
		const renderContext: ContactNativeRenderContext = {
			locale: draft.locale,
			requestType: draft.requestType,
		};
		const formUiCopy = deps.getFormUiCopy(renderContext);

		const parsed = parseContactLead(body.input);
		if (!parsed.success) {
			return resultResponse(
				{ status: "invalid", values: draft, fieldErrors: contactFieldErrors(body.input, formUiCopy.validation) },
				422,
				submissionId,
				body.native,
				renderContext,
				deps.renderNativeResult,
			);
		}
		const lead = parsed.data;
		const fingerprint = contactLeadFingerprint(lead);
		if (!fingerprint) return apiError(400, "invalid_request");

		const existing = state.getSubmission(submissionId);
		if (existing?.fingerprint !== undefined && existing.fingerprint !== fingerprint) {
			if (body.native) {
				return resultResponse(
					{ status: "unconfirmed", values: contactLeadDraft(lead), message: formUiCopy.conflictMessage },
					409,
					submissionId,
					true,
					renderContext,
					deps.renderNativeResult,
				);
			}
			return apiError(409, "idempotency_conflict");
		}
		if (existing?.status === "confirmed") {
			return resultResponse({ status: "confirmed" }, 202, submissionId, body.native, renderContext, deps.renderNativeResult);
		}

		const env = deliveryEnv(deps.getEnv());
		if (!env) {
			return resultResponse(
				{ status: "unconfirmed", values: contactLeadDraft(lead), message: formUiCopy.unconfirmedMessage },
				503,
				submissionId,
				body.native,
				renderContext,
				deps.renderNativeResult,
			);
		}

		const promise = existing?.status === "pending"
			? existing.promise
			: deps.deliver({ lead, env, submissionId });
		if (!existing) state.remember(submissionId, { fingerprint, status: "pending", promise, createdAt: deps.now() });

		try {
			await promise;
			state.remember(submissionId, { fingerprint, status: "confirmed", createdAt: deps.now() });
			return resultResponse({ status: "confirmed" }, 202, submissionId, body.native, renderContext, deps.renderNativeResult);
		} catch {
			state.removePending(submissionId);
			return resultResponse(
				{ status: "unconfirmed", values: contactLeadDraft(lead), message: formUiCopy.unconfirmedMessage },
				503,
				submissionId,
				body.native,
				renderContext,
				deps.renderNativeResult,
			);
		}
	};
}

export type DiagnosticDeliveryEnv = ContactDeliveryEnv;

export type DeliverDiagnosticLead = (input: {
	readonly lead: DiagnosticLead;
	readonly env: DiagnosticDeliveryEnv;
	readonly idempotencyKey: string;
}) => Promise<void>;

export class DiagnosticDeliveryError extends ContactDeliveryError {
	constructor(code: "service_unavailable" | "delivery_unconfirmed") {
		super(code);
		this.name = "DiagnosticDeliveryError";
	}
}

export interface DiagnosticHandlerDeps {
	readonly getEnv: () => Record<string, string | undefined>;
	readonly deliver: DeliverDiagnosticLead;
	readonly now: () => number;
}

function diagnosticResponse(status: number, body: DiagnosticApiResponse, retryAfter?: number): Response {
	const headers = responseHeaders("application/json; charset=utf-8");
	if (retryAfter !== undefined) headers.set("Retry-After", String(retryAfter));
	return new Response(JSON.stringify(body), { status, headers });
}

export async function readJsonBodyLimited(request: Request, maxBytes = MAX_BODY_BYTES): Promise<unknown> {
	const bytes = await readBodyLimited(request, maxBytes);
	try {
		return JSON.parse(decodeUtf8(bytes));
	} catch (error) {
		if (error instanceof RequestBodyError) throw error;
		throw new RequestBodyError("invalid_request");
	}
}

export function createDiagnosticLeadHandler(deps: DiagnosticHandlerDeps): (request: Request) => Promise<Response> {
	const state = new ProcessLocalRequestState();

	return async (request: Request): Promise<Response> => {
		const gate = requestContentType(request, ["application/json"]);
		if (!gate.success) return gate.response;
		const idempotencyKey = parseContactSubmissionId(request.headers.get(DIAGNOSTIC_IDEMPOTENCY_HEADER));
		if (!idempotencyKey) return apiError(400, "invalid_idempotency_key");

		let input: unknown;
		try {
			input = await readJsonBodyLimited(request);
		} catch (error) {
			if (error instanceof RequestBodyError && error.code === "payload_too_large") return apiError(413, error.code);
			return apiError(400, "invalid_request");
		}

		const rateLimit = state.consumeRateLimit(clientKey(request, idempotencyKey), deps.now());
		if (!rateLimit.allowed) return apiError(429, "rate_limited", rateLimit.retryAfter);
		const parsed = parseDiagnosticLead(input);
		if (!parsed.success) return apiError(400, "invalid_request");
		const lead = parsed.data;
		const fingerprint = JSON.stringify(lead);
		const existing = state.getSubmission(idempotencyKey);
		if (existing && existing.fingerprint !== fingerprint) return apiError(409, "idempotency_conflict");
		if (existing?.status === "confirmed") return diagnosticResponse(202, { ok: true });

		const env = deliveryEnv(deps.getEnv());
		if (!env) return apiError(503, "service_unavailable");
		const promise = existing?.status === "pending"
			? existing.promise
			: deps.deliver({ lead, env, idempotencyKey });
		if (!existing) {
			state.remember(idempotencyKey, { fingerprint, status: "pending", promise, createdAt: deps.now() });
		}

		try {
			await promise;
			state.remember(idempotencyKey, { fingerprint, status: "confirmed", createdAt: deps.now() });
			return diagnosticResponse(202, { ok: true });
		} catch (error) {
			state.removePending(idempotencyKey);
			const code = error instanceof ContactDeliveryError ? error.code : "delivery_unconfirmed";
			return apiError(503, code);
		}
	};
}

function oneLine(value: string): string {
	return value.replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim();
}

function configuredRecipients(env: ContactDeliveryEnv): string[] | null {
	if (!/^[^\s@]+@yonaris\.com$/iu.test(env.CLOUDFLARE_EMAIL_FROM)) return null;
	const recipients = [...new Set(env.MARKETING_LEAD_RECIPIENT
		.split(",")
		.map((recipient) => recipient.trim().toLowerCase())
		.filter(Boolean))];
	if (recipients.length === 0 || recipients.length > 20) return null;
	if (recipients.some((recipient) => !/^[^\s@]+@(?:gmail|googlemail)\.com$/iu.test(recipient))) return null;
	return recipients;
}

function emailText(lead: ContactLead, submissionId: string): string {
	const rows = [
		`Submission ID: ${submissionId}`,
		`Locale: ${lead.locale}`,
		`Request type: ${lead.requestType}`,
		`Work email: ${oneLine(lead.workEmail)}`,
	];
	const optionalRows = [
		["Name", lead.name],
		["Company or website", lead.companyOrWebsite],
		["Curiosity", lead.curiosity],
		["Market question", lead.marketQuestion],
		["Market or language", lead.marketOrLanguage],
		["Buyer or commercial context", lead.buyerOrCommercialContext],
	] as const;
	for (const [label, value] of optionalRows) {
		if (value) rows.push(`${label}: ${oneLine(value)}`);
	}
	if (lead.requestType === "privacy") {
		rows.push("Manual privacy review requested.", "This request does not automatically delete records.");
	}
	return rows.join("\n");
}

function recipientAddress(value: unknown): string | null {
	if (typeof value === "string") return value.trim().toLowerCase();
	if (typeof value === "object" && value !== null && typeof (value as { address?: unknown }).address === "string") {
		return (value as { address: string }).address.trim().toLowerCase();
	}
	return null;
}

function confirmedRecipients(value: unknown): Set<string> | null {
	if (typeof value !== "object" || value === null) return null;
	const envelope = value as { success?: unknown; result?: { delivered?: unknown; queued?: unknown; permanent_bounces?: unknown } };
	if (envelope.success !== true || !envelope.result) return null;
	const { delivered, queued, permanent_bounces } = envelope.result;
	if (!Array.isArray(delivered) || !Array.isArray(queued) || !Array.isArray(permanent_bounces)) return null;
	if (permanent_bounces.length > 0) return null;
	const addresses = [...delivered, ...queued].map(recipientAddress);
	if (addresses.some((address) => address === null)) return null;
	return new Set(addresses as string[]);
}

interface CloudflareEmailMessage {
	readonly subject: string;
	readonly text: string;
	readonly replyTo?: string;
	readonly userAgent: string;
}

async function sendCloudflareMessage(
	env: ContactDeliveryEnv,
	submissionId: string,
	message: CloudflareEmailMessage,
	fetchImpl: typeof fetch,
): Promise<void> {
	const recipients = configuredRecipients(env);
	if (!recipients || !parseContactSubmissionId(submissionId)) throw new ContactDeliveryError("service_unavailable");

	const controller = new AbortController();
	let timeoutId: ReturnType<typeof setTimeout> | undefined;
	const timeout = new Promise<never>((_resolve, reject) => {
		timeoutId = setTimeout(() => {
			controller.abort();
			reject(new ContactDeliveryError("delivery_unconfirmed"));
		}, EMAIL_DELIVERY_TIMEOUT_MS);
	});
	const payload: Record<string, unknown> = {
		from: { address: env.CLOUDFLARE_EMAIL_FROM, name: "Yonaris" },
		to: recipients,
		subject: message.subject,
		text: message.text,
		headers: { "X-Yonaris-Submission-ID": submissionId },
	};
	if (message.replyTo) payload.reply_to = message.replyTo;

	try {
		const response = await Promise.race([
			fetchImpl(`https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(env.CLOUDFLARE_ACCOUNT_ID)}/email/sending/send`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${env.CLOUDFLARE_EMAIL_API_TOKEN}`,
					"Content-Type": "application/json",
					Accept: "application/json",
					"User-Agent": message.userAgent,
				},
				body: JSON.stringify(payload),
				signal: controller.signal,
			}),
			timeout,
		]);
		if (!response.ok) throw new ContactDeliveryError("delivery_unconfirmed");
		const confirmed = confirmedRecipients(await response.json().catch(() => null));
		if (!confirmed || recipients.some((recipient) => !confirmed.has(recipient))) {
			throw new ContactDeliveryError("delivery_unconfirmed");
		}
	} catch (error) {
		if (error instanceof ContactDeliveryError) throw error;
		throw new ContactDeliveryError("delivery_unconfirmed");
	} finally {
		if (timeoutId !== undefined) clearTimeout(timeoutId);
	}
}

export async function sendContactWithCloudflare(
	input: { readonly lead: ContactLead; readonly env: ContactDeliveryEnv; readonly submissionId: string },
	fetchImpl: typeof fetch = fetch,
): Promise<void> {
	await sendCloudflareMessage(input.env, input.submissionId, {
		replyTo: input.lead.workEmail,
		subject: input.lead.requestType === "privacy" ? "Yonaris privacy request" : "Yonaris website conversation",
		text: emailText(input.lead, input.submissionId),
		userAgent: "Yonaris-Contact/1",
	}, fetchImpl);
}

function diagnosticEmailText(lead: DiagnosticLead, submissionId: string): string {
	const contact = lead.locale === "en"
		? [
				`Submission ID: ${submissionId}`,
				"Region: Global",
				`Name: ${oneLine(lead.name)}`,
				`Work email: ${oneLine(lead.email)}`,
				`Company: ${oneLine(lead.company)}`,
			].join("\n")
		: [
				`Submission ID: ${submissionId}`,
				"区域：中国",
				`姓名：${oneLine(lead.name)}`,
				`电话：${oneLine(lead.phone)}`,
				`公司：${oneLine(lead.company)}`,
			].join("\n");
	if (lead.requestType !== "privacy") return contact;
	return lead.locale === "en"
		? ["Request type: Privacy/deletion request", "Manual privacy action requested", "", contact].join("\n")
		: ["请求类型：隐私/删除请求", "需要人工处理隐私请求", "", contact].join("\n");
}

function diagnosticEmailSubject(lead: DiagnosticLead): string {
	if (lead.requestType === "privacy") {
		return lead.locale === "en"
			? `Yonaris privacy request / ${oneLine(lead.company)}`
			: `Yonaris 隐私请求 / ${oneLine(lead.company)}`;
	}
	return lead.locale === "en"
		? `Yonaris global website lead / ${oneLine(lead.company)}`
		: `Yonaris 中国官网留资 / ${oneLine(lead.company)}`;
}

export async function sendLeadWithCloudflare(
	input: { readonly lead: DiagnosticLead; readonly env: DiagnosticDeliveryEnv; readonly idempotencyKey: string },
	fetchImpl: typeof fetch = fetch,
): Promise<void> {
	try {
		await sendCloudflareMessage(input.env, input.idempotencyKey, {
			replyTo: input.lead.locale === "en" ? input.lead.email : undefined,
			subject: diagnosticEmailSubject(input.lead),
			text: diagnosticEmailText(input.lead, input.idempotencyKey),
			userAgent: "Yonaris-Diagnostic-Compatibility/1",
		}, fetchImpl);
	} catch (error) {
		if (error instanceof ContactDeliveryError) throw new DiagnosticDeliveryError(error.code);
		throw new DiagnosticDeliveryError("delivery_unconfirmed");
	}
}
