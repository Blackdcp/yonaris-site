import { CONTACT_SUBMISSION_HEADER, parseContactSubmissionId } from "./contact-api-protocol";

export const DIAGNOSTIC_API_PATH = "/api/diagnostic";
export const DIAGNOSTIC_IDEMPOTENCY_HEADER = CONTACT_SUBMISSION_HEADER;

export type DiagnosticApiErrorCode =
	| "invalid_request"
	| "invalid_idempotency_key"
	| "idempotency_conflict"
	| "forbidden_request"
	| "unsupported_media_type"
	| "payload_too_large"
	| "rate_limited"
	| "service_unavailable"
	| "delivery_unconfirmed";

export type DiagnosticApiResponse = { ok: true } | { ok: false; code: DiagnosticApiErrorCode };

export function parseDiagnosticIdempotencyKey(
	value: string | null,
): { success: true; data: string } | { success: false } {
	const parsed = parseContactSubmissionId(value);
	return parsed ? { success: true, data: parsed } : { success: false };
}
