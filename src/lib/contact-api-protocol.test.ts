import { describe, expect, it } from "vitest";
import {
	CONTACT_API_PATH,
	CONTACT_SUBMISSION_HEADER,
	parseContactSubmissionId,
} from "./contact-api-protocol";

describe("contact API protocol", () => {
	it("owns the canonical endpoint and stable submission header", () => {
		expect(CONTACT_API_PATH).toBe("/api/contact");
		expect(CONTACT_SUBMISSION_HEADER).toBe("Idempotency-Key");
	});

	it("accepts only canonical UUID submission identifiers", () => {
		expect(parseContactSubmissionId("0198ef3d-34e1-7f14-a74d-e09b66d14b11")).toBe("0198ef3d-34e1-7f14-a74d-e09b66d14b11");
		for (const value of [null, "", "not-a-uuid", "0198EF3D-34E1-7F14-A74D-E09B66D14B11"]) {
			expect(parseContactSubmissionId(value)).toBeNull();
		}
	});
});
