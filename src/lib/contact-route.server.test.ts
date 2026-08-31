import { describe, expect, it, vi } from "vitest";
import type { ContactFormResult } from "./contact-schema";
import type { ContactNativeRenderContext } from "./contact-delivery.server";
import {
	CONTACT_E2E_OUTCOME_HEADER,
	CONTACT_E2E_TOKEN_ENV,
	CONTACT_E2E_TOKEN_HEADER,
	CONTACT_E2E_TRANSPORT_HEADER,
	createContactRoutePostHandler,
} from "./contact-route.server";

const submissionId = "0198ef3d-34e1-7f14-a74d-e09b66d14b11";
const token = "0123456789abcdef0123456789abcdef0123456789abcdef";
const populatedEnv = {
	CLOUDFLARE_ACCOUNT_ID: "must-not-be-used",
	CLOUDFLARE_EMAIL_API_TOKEN: "must-not-be-used",
	CLOUDFLARE_EMAIL_FROM: "leads@yonaris.com",
	MARKETING_LEAD_RECIPIENT: "real-destination@gmail.com",
	[CONTACT_E2E_TOKEN_ENV]: token,
};
const serverCopy = {
	unconfirmedMessage: "Delivery unconfirmed.",
	conflictMessage: "Submission conflict.",
	validation: {
		workEmailRequired: "Email required.",
		workEmailInvalid: "Email invalid.",
		fieldTooLong: "Too long.",
		formInvalid: "Form invalid.",
	},
} as const;

function renderNative(result: ContactFormResult, id: string, _context: ContactNativeRenderContext) {
	return `<!doctype html><main data-v1-state="${result.status}" data-submission-id="${id}"></main>`;
}

function nativeRequest(headers: Record<string, string> = {}, url = "http://127.0.0.1:4319/api/contact") {
	const origin = new URL(url).origin;
	return new Request(url, {
		method: "POST",
		headers: {
			Origin: origin,
			"Sec-Fetch-Site": "same-origin",
			"Content-Type": "application/x-www-form-urlencoded",
			"User-Agent": "Task9A-native-safety",
			...headers,
		},
		body: new URLSearchParams({
			locale: "en",
			requestType: "conversation",
			submissionId,
			workEmail: "matrix.native@company.example",
			botField: "",
		}),
	});
}

function fixture() {
	const productionDeliver = vi.fn(async () => undefined);
	const e2eDeliver = vi.fn(async () => undefined);
	const post = createContactRoutePostHandler({
		getEnv: () => populatedEnv,
		productionDeliver,
		createE2EDeliver: () => e2eDeliver,
		now: () => 1_700_000_000_000,
		createSubmissionId: () => submissionId,
		renderNativeResult: renderNative,
		getFormUiCopy: () => serverCopy,
	});
	return { post, productionDeliver, e2eDeliver };
}

describe("Contact route E2E transport gate", () => {
	it.each([
		["missing token", { [CONTACT_E2E_OUTCOME_HEADER]: "confirmed" }],
		["mismatched token", { [CONTACT_E2E_TOKEN_HEADER]: `${token}x`, [CONTACT_E2E_OUTCOME_HEADER]: "confirmed" }],
	])("fails closed for %s without calling either transport", async (_label, headers) => {
		const { post, productionDeliver, e2eDeliver } = fixture();
		const response = await post(nativeRequest(headers));
		expect(response.status).toBe(403);
		expect(productionDeliver).not.toHaveBeenCalled();
		expect(e2eDeliver).not.toHaveBeenCalled();
	});

	it("rejects the E2E adapter away from loopback without falling through to production delivery", async () => {
		const { post, productionDeliver, e2eDeliver } = fixture();
		const response = await post(nativeRequest({
			[CONTACT_E2E_TOKEN_HEADER]: token,
			[CONTACT_E2E_OUTCOME_HEADER]: "confirmed",
		}, "https://www.yonaris.com/api/contact"));
		expect(response.status).toBe(403);
		expect(productionDeliver).not.toHaveBeenCalled();
		expect(e2eDeliver).not.toHaveBeenCalled();
	});

	it.each([
		["confirmed", 202],
		["unconfirmed", 503],
	] as const)("renders production native %s HTML through an authorized fake transport", async (outcome, status) => {
		const { post, productionDeliver, e2eDeliver } = fixture();
		if (outcome === "unconfirmed") e2eDeliver.mockRejectedValueOnce(new Error("fake unconfirmed"));
		const response = await post(nativeRequest({
			[CONTACT_E2E_TOKEN_HEADER]: token,
			[CONTACT_E2E_OUTCOME_HEADER]: outcome,
		}));
		expect(response.status).toBe(status);
		expect(response.headers.get("content-type")).toMatch(/^text\/html/);
		expect(response.headers.get(CONTACT_E2E_TRANSPORT_HEADER)).toBe("fake");
		expect(await response.text()).toContain(`data-v1-state="${outcome}"`);
		expect(productionDeliver).not.toHaveBeenCalled();
		expect(e2eDeliver).toHaveBeenCalledTimes(1);
	});
});
