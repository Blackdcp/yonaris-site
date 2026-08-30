export const CONTACT_API_PATH = "/api/contact";
export const CONTACT_SUBMISSION_HEADER = "Idempotency-Key";

export type ContactApiErrorCode =
	| "invalid_request"
	| "invalid_submission_id"
	| "idempotency_conflict"
	| "forbidden_request"
	| "unsupported_media_type"
	| "payload_too_large"
	| "rate_limited"
	| "service_unavailable";

const CANONICAL_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

export function parseContactSubmissionId(value: string | null | undefined): string | null {
	return value && CANONICAL_UUID.test(value) ? value : null;
}
