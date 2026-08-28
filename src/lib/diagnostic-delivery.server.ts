import { isIP } from "node:net";
import {
	DIAGNOSTIC_IDEMPOTENCY_HEADER,
	type DiagnosticApiErrorCode,
	type DiagnosticApiResponse,
	parseDiagnosticIdempotencyKey,
} from "./diagnostic-api-protocol";
import { type DiagnosticLead, parseDiagnosticLead } from "./diagnostic-schema";

const MAX_BODY_BYTES = 20_480;
const RATE_LIMIT_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1_000;
const RATE_LIMIT_BUCKET_CAP = 10_000;
const EMAIL_DELIVERY_TIMEOUT_MS = 10_000;

export interface DiagnosticDeliveryEnv {
	CLOUDFLARE_ACCOUNT_ID: string;
	CLOUDFLARE_EMAIL_API_TOKEN: string;
	CLOUDFLARE_EMAIL_FROM: string;
	MARKETING_LEAD_RECIPIENT: string;
}

export type DeliverDiagnosticLead = (input: {
	lead: DiagnosticLead;
	env: DiagnosticDeliveryEnv;
	idempotencyKey: string;
}) => Promise<void>;

export class DiagnosticDeliveryError extends Error {
	constructor(readonly code: "service_unavailable" | "delivery_unconfirmed") {
		super(code);
		this.name = "DiagnosticDeliveryError";
	}
}

export interface DiagnosticHandlerDeps {
	getEnv(): Record<string, string | undefined>;
	deliver: DeliverDiagnosticLead;
	now(): number;
}

class DiagnosticBodyError extends Error {
	constructor(readonly code: "invalid_request" | "payload_too_large") {
		super(code);
		this.name = "DiagnosticBodyError";
	}
}

interface RateLimitBucket {
	count: number;
	windowStartedAt: number;
}

function jsonResponse(status: number, body: DiagnosticApiResponse, retryAfter?: number): Response {
	const headers = new Headers({
		"Cache-Control": "no-store",
		"Content-Type": "application/json; charset=utf-8",
		"X-Content-Type-Options": "nosniff",
	});
	if (retryAfter !== undefined) headers.set("Retry-After", String(retryAfter));
	return new Response(JSON.stringify(body), { status, headers });
}

function errorResponse(status: number, code: DiagnosticApiErrorCode, retryAfter?: number): Response {
	return jsonResponse(status, { ok: false, code }, retryAfter);
}

function readDeliveryEnv(values: Record<string, string | undefined>): DiagnosticDeliveryEnv | null {
	const CLOUDFLARE_ACCOUNT_ID = values.CLOUDFLARE_ACCOUNT_ID?.trim();
	const CLOUDFLARE_EMAIL_API_TOKEN = values.CLOUDFLARE_EMAIL_API_TOKEN?.trim();
	const CLOUDFLARE_EMAIL_FROM = values.CLOUDFLARE_EMAIL_FROM?.trim();
	const MARKETING_LEAD_RECIPIENT = values.MARKETING_LEAD_RECIPIENT?.trim();
	if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_EMAIL_API_TOKEN || !CLOUDFLARE_EMAIL_FROM || !MARKETING_LEAD_RECIPIENT) {
		return null;
	}
	return { CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_EMAIL_API_TOKEN, CLOUDFLARE_EMAIL_FROM, MARKETING_LEAD_RECIPIENT };
}

function requestClientIp(request: Request): string {
	const candidate = request.headers.get("X-Yonaris-Client-IP");
	return candidate && isIP(candidate) !== 0 ? candidate : "unknown";
}

function oneLine(value: string): string {
	return value
		.replace(/[\r\n]+/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

function emailText(lead: DiagnosticLead): string {
	const contact = lead.locale === "en"
		? [
				"Region: Global",
				`Name: ${oneLine(lead.name)}`,
				`Work email: ${oneLine(lead.email)}`,
				`Company: ${oneLine(lead.company)}`,
			].join("\n")
		: [
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

function emailSubject(lead: DiagnosticLead): string {
	if (lead.requestType === "privacy") {
		return lead.locale === "en"
			? `Yonaris privacy request / ${oneLine(lead.company)}`
			: `Yonaris 隐私请求 / ${oneLine(lead.company)}`;
	}
	return lead.locale === "en"
		? `Yonaris global website lead / ${oneLine(lead.company)}`
		: `Yonaris 中国官网留资 / ${oneLine(lead.company)}`;
}

export async function readJsonBodyLimited(request: Request, maxBytes = MAX_BODY_BYTES): Promise<unknown> {
	if (!request.body) throw new DiagnosticBodyError("invalid_request");

	const reader = request.body.getReader();
	const chunks: Uint8Array[] = [];
	let totalBytes = 0;
	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			totalBytes += value.byteLength;
			if (totalBytes > maxBytes) {
				await reader.cancel().catch(() => undefined);
				throw new DiagnosticBodyError("payload_too_large");
			}
			chunks.push(value);
		}
	} catch (error) {
		if (error instanceof DiagnosticBodyError) throw error;
		throw new DiagnosticBodyError("invalid_request");
	}

	const bytes = new Uint8Array(totalBytes);
	let offset = 0;
	for (const chunk of chunks) {
		bytes.set(chunk, offset);
		offset += chunk.byteLength;
	}

	try {
		const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
		return JSON.parse(text);
	} catch {
		throw new DiagnosticBodyError("invalid_request");
	}
}

export function createDiagnosticLeadHandler(deps: DiagnosticHandlerDeps): (request: Request) => Promise<Response> {
	const rateLimitBuckets = new Map<string, RateLimitBucket>();

	function pruneExpiredBuckets(now: number): void {
		for (const [ip, bucket] of rateLimitBuckets) {
			if (bucket.windowStartedAt + RATE_LIMIT_WINDOW_MS > now) break;
			rateLimitBuckets.delete(ip);
		}
	}

	function consumeRateLimit(ip: string, now: number): { allowed: true } | { allowed: false; retryAfter: number } {
		pruneExpiredBuckets(now);
		let bucket = rateLimitBuckets.get(ip);
		if (!bucket) {
			bucket = { count: 0, windowStartedAt: now };
			rateLimitBuckets.set(ip, bucket);
			while (rateLimitBuckets.size > RATE_LIMIT_BUCKET_CAP) {
				const oldest = rateLimitBuckets.keys().next().value;
				if (oldest === undefined) break;
				rateLimitBuckets.delete(oldest);
			}
		}
		if (bucket.count >= RATE_LIMIT_ATTEMPTS) {
			const remainingMs = bucket.windowStartedAt + RATE_LIMIT_WINDOW_MS - now;
			return { allowed: false, retryAfter: Math.max(1, Math.ceil(remainingMs / 1_000)) };
		}
		bucket.count += 1;
		return { allowed: true };
	}

	return async (request: Request): Promise<Response> => {
		const requestUrl = new URL(request.url);
		if (request.headers.get("Origin") !== requestUrl.origin) return errorResponse(403, "forbidden_request");
		if (request.headers.get("Sec-Fetch-Site") !== "same-origin") return errorResponse(403, "forbidden_request");

		const contentType = request.headers.get("Content-Type")?.split(";", 1)[0]?.trim().toLowerCase();
		if (contentType !== "application/json") return errorResponse(415, "unsupported_media_type");
		const contentEncoding = request.headers.get("Content-Encoding")?.trim().toLowerCase();
		if (contentEncoding && contentEncoding !== "identity") return errorResponse(415, "unsupported_media_type");

		const contentLength = request.headers.get("Content-Length");
		if (contentLength !== null) {
			if (!/^\d+$/.test(contentLength)) return errorResponse(400, "invalid_request");
			if (Number(contentLength) > MAX_BODY_BYTES) return errorResponse(413, "payload_too_large");
		}

		const parsedIdempotencyKey = parseDiagnosticIdempotencyKey(request.headers.get(DIAGNOSTIC_IDEMPOTENCY_HEADER));
		if (!parsedIdempotencyKey.success) return errorResponse(400, "invalid_idempotency_key");

		const rateLimit = consumeRateLimit(requestClientIp(request), deps.now());
		if (!rateLimit.allowed) return errorResponse(429, "rate_limited", rateLimit.retryAfter);

		let input: unknown;
		try {
			input = await readJsonBodyLimited(request);
		} catch (error) {
			if (error instanceof DiagnosticBodyError && error.code === "payload_too_large") {
				return errorResponse(413, "payload_too_large");
			}
			return errorResponse(400, "invalid_request");
		}

		const parsedLead = parseDiagnosticLead(input);
		if (!parsedLead.success) return errorResponse(400, "invalid_request");

		const env = readDeliveryEnv(deps.getEnv());
		if (!env) return errorResponse(503, "service_unavailable");

		try {
			await deps.deliver({ lead: parsedLead.data, env, idempotencyKey: parsedIdempotencyKey.data });
			return jsonResponse(202, { ok: true });
		} catch (error) {
			const code = error instanceof DiagnosticDeliveryError ? error.code : "delivery_unconfirmed";
			return errorResponse(503, code);
		}
	};
}

function confirmedCloudflareRecipients(value: unknown): Set<string> | null {
	if (!value || typeof value !== "object") return null;
	const envelope = value as {
		success?: unknown;
		result?: { delivered?: unknown; queued?: unknown; permanent_bounces?: unknown };
	};
	if (envelope.success !== true || !envelope.result) return null;
	const { delivered, queued, permanent_bounces } = envelope.result;
	if (!Array.isArray(delivered) || !Array.isArray(queued) || !Array.isArray(permanent_bounces)) return null;
	if (![...delivered, ...queued, ...permanent_bounces].every((address) => typeof address === "string")) return null;
	if (permanent_bounces.length > 0) return null;
	return new Set([...delivered, ...queued]);
}

export async function sendLeadWithCloudflare(
	input: { lead: DiagnosticLead; env: DiagnosticDeliveryEnv; idempotencyKey: string },
	fetchImpl: typeof fetch = fetch,
): Promise<void> {
	const recipients = input.env.MARKETING_LEAD_RECIPIENT
		.split(",")
		.map((recipient) => recipient.trim())
		.filter(Boolean);
	const controller = new AbortController();
	let timeoutId: ReturnType<typeof setTimeout> | undefined;
	const timeout = new Promise<never>((_resolve, reject) => {
		timeoutId = setTimeout(() => {
			controller.abort();
			reject(new DiagnosticDeliveryError("delivery_unconfirmed"));
		}, EMAIL_DELIVERY_TIMEOUT_MS);
	});
	const payload: Record<string, unknown> = {
		from: { address: input.env.CLOUDFLARE_EMAIL_FROM, name: "Yonaris" },
		to: recipients,
		subject: emailSubject(input.lead),
		text: emailText(input.lead),
		headers: { "X-Yonaris-Submission-ID": input.idempotencyKey },
	};
	if (input.lead.locale === "en") payload.reply_to = input.lead.email;

	try {
		const response = await Promise.race([
			fetchImpl(`https://api.cloudflare.com/client/v4/accounts/${input.env.CLOUDFLARE_ACCOUNT_ID}/email/sending/send`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${input.env.CLOUDFLARE_EMAIL_API_TOKEN}`,
					"Content-Type": "application/json",
					Accept: "application/json",
					"User-Agent": "Yonaris-Diagnostic/1",
				},
				body: JSON.stringify(payload),
				signal: controller.signal,
			}),
			timeout,
		]);
		if (!response.ok) throw new DiagnosticDeliveryError("service_unavailable");
		const confirmed = confirmedCloudflareRecipients(await response.json());
		if (!confirmed || recipients.some((recipient) => !confirmed.has(recipient))) {
			throw new DiagnosticDeliveryError("delivery_unconfirmed");
		}
	} catch (error) {
		if (error instanceof DiagnosticDeliveryError) throw error;
		throw new DiagnosticDeliveryError("delivery_unconfirmed");
	} finally {
		if (timeoutId !== undefined) clearTimeout(timeoutId);
	}
}
