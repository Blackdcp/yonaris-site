import { type ContactLead, parseContactLead } from "./contact-schema";
import { CONTACT_API_PATH, CONTACT_SUBMISSION_HEADER } from "./contact-api-protocol";

export { CONTACT_API_PATH, CONTACT_SUBMISSION_HEADER } from "./contact-api-protocol";

export interface ContactRequestIdentity {
	readonly normalizedLeadFingerprint: string;
	readonly submissionId: string;
}

export type ContactRequestResult = { readonly status: "confirmed" } | { readonly status: "unconfirmed" };

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

function isConfirmedResponse(value: unknown): value is { status: "confirmed" } {
	return typeof value === "object" && value !== null && (value as { status?: unknown }).status === "confirmed";
}

export async function submitContactRequest(
	lead: ContactLead,
	submissionId: string,
	options: ContactRequestOptions = {},
): Promise<ContactRequestResult> {
	const parsed = parseContactLead(lead);
	if (!parsed.success) return { status: "unconfirmed" };

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
			body: JSON.stringify(parsed.data),
			signal: controller.signal,
		});
		if (response.status !== 202) return { status: "unconfirmed" };
		const body: unknown = await response.json().catch(() => null);
		return isConfirmedResponse(body) ? { status: "confirmed" } : { status: "unconfirmed" };
	} catch {
		return { status: "unconfirmed" };
	} finally {
		clearTimeout(timeout);
		options.signal?.removeEventListener("abort", abortFromCaller);
	}
}
