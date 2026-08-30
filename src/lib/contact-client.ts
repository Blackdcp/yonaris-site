import {
	type ContactFieldErrors,
	type ContactFormResult,
	type ContactLead,
	type ContactLeadDraft,
	parseContactLead,
} from "./contact-schema";
import { CONTACT_API_PATH, CONTACT_SUBMISSION_HEADER } from "./contact-api-protocol";

export { CONTACT_API_PATH, CONTACT_SUBMISSION_HEADER } from "./contact-api-protocol";

export interface ContactRequestIdentity {
	readonly normalizedLeadFingerprint: string;
	readonly submissionId: string;
}

export type ContactRequestResult = ContactFormResult | { readonly status: "unconfirmed" };

interface ContactRequestOptions {
	readonly fetchImpl?: typeof fetch;
	readonly signal?: AbortSignal;
	readonly timeoutMs?: number;
}

const DEFAULT_CLIENT_TIMEOUT_MS = 10_000;

export function contactLeadFingerprint(input: unknown): string | null {
	const parsed = parseContactLead(input);
	return parsed.success ? JSON.stringify(parsed.data) : null;
}

export function resolveContactRequestIdentity(
	current: ContactRequestIdentity | null,
	input: unknown,
	createUuid: () => string = () => crypto.randomUUID(),
): ContactRequestIdentity | null {
	const normalizedLeadFingerprint = contactLeadFingerprint(input);
	if (!normalizedLeadFingerprint) return null;
	if (current?.normalizedLeadFingerprint === normalizedLeadFingerprint) return current;
	return { normalizedLeadFingerprint, submissionId: createUuid() };
}

const draftStringFields = [
	"workEmail",
	"name",
	"companyOrWebsite",
	"curiosity",
	"marketQuestion",
	"marketOrLanguage",
	"buyerOrCommercialContext",
	"botField",
] as const;

const errorFields = [...draftStringFields, "locale", "requestType", "form"] as const;

function record(value: unknown): Record<string, unknown> | null {
	return typeof value === "object" && value !== null && !Array.isArray(value)
		? value as Record<string, unknown>
		: null;
}

function parseContactLeadDraft(value: unknown): ContactLeadDraft | null {
	const input = record(value);
	if (!input || (input.locale !== "en" && input.locale !== "zh-CN") || (input.requestType !== "conversation" && input.requestType !== "privacy")) return null;
	if (draftStringFields.some((field) => typeof input[field] !== "string")) return null;
	return {
		locale: input.locale,
		workEmail: input.workEmail as string,
		name: input.name as string,
		companyOrWebsite: input.companyOrWebsite as string,
		curiosity: input.curiosity as string,
		marketQuestion: input.marketQuestion as string,
		marketOrLanguage: input.marketOrLanguage as string,
		buyerOrCommercialContext: input.buyerOrCommercialContext as string,
		requestType: input.requestType,
		botField: input.botField as string,
	};
}

function parseContactFieldErrors(value: unknown): ContactFieldErrors | null {
	const input = record(value);
	if (!input) return null;
	const allowed = new Set<string>(errorFields);
	const errors: ContactFieldErrors = {};
	for (const [field, message] of Object.entries(input)) {
		if (!allowed.has(field) || typeof message !== "string") return null;
		errors[field as keyof ContactFieldErrors] = message;
	}
	return errors;
}

function parseContactFormResult(value: unknown): ContactFormResult | null {
	const input = record(value);
	if (!input) return null;
	if (input.status === "confirmed") return { status: "confirmed" };
	const values = parseContactLeadDraft(input.values);
	if (!values) return null;
	if (input.status === "invalid") {
		const fieldErrors = parseContactFieldErrors(input.fieldErrors);
		return fieldErrors ? { status: "invalid", values, fieldErrors } : null;
	}
	if (input.status === "unconfirmed" && typeof input.message === "string") {
		return { status: "unconfirmed", values, message: input.message };
	}
	return null;
}

function prepareContactLeadForRequest(lead: ContactLead): ContactLead | null {
	const botField = typeof lead.botField === "string" ? lead.botField : undefined;
	const parsed = parseContactLead({ ...lead, botField: "" });
	if (!parsed.success) return null;
	return botField ? { ...parsed.data, botField } : parsed.data;
}

export async function submitContactRequest(
	lead: ContactLead,
	submissionId: string,
	options: ContactRequestOptions = {},
): Promise<ContactRequestResult> {
	const requestLead = prepareContactLeadForRequest(lead);
	if (!requestLead) return { status: "unconfirmed" };

	const controller = new AbortController();
	const abortFromCaller = () => controller.abort(options.signal?.reason);
	if (options.signal?.aborted) abortFromCaller();
	else options.signal?.addEventListener("abort", abortFromCaller, { once: true });
	const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? DEFAULT_CLIENT_TIMEOUT_MS);

	try {
		const response = await (options.fetchImpl ?? fetch)(CONTACT_API_PATH, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				[CONTACT_SUBMISSION_HEADER]: submissionId,
			},
			body: JSON.stringify(requestLead),
			signal: controller.signal,
		});
		const body: unknown = await response.json().catch(() => null);
		const result = parseContactFormResult(body);
		if (response.status === 202 && result?.status === "confirmed") return result;
		if (response.status === 422 && result?.status === "invalid") return result;
		if (response.status !== 202 && result?.status === "unconfirmed") return result;
		return { status: "unconfirmed" };
	} catch {
		return { status: "unconfirmed" };
	} finally {
		clearTimeout(timeout);
		options.signal?.removeEventListener("abort", abortFromCaller);
	}
}
