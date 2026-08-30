import { describe, expect, it, vi } from "vitest";
import {
	ContactDeliveryError,
	createContactLeadHandler,
	sendContactWithCloudflare,
} from "./contact-delivery.server";
import type { ContactLead, ContactFormResult } from "./contact-schema";
import type { ContactNativeRenderContext } from "./contact-delivery.server";

const submissionId = "0198ef3d-34e1-7f14-a74d-e09b66d14b11";
const secondSubmissionId = "0198ef3d-34e1-7f14-a74d-e09b66d14b12";
const env = {
	CLOUDFLARE_ACCOUNT_ID: "account_test",
	CLOUDFLARE_EMAIL_API_TOKEN: "cf_test",
	CLOUDFLARE_EMAIL_FROM: "leads@yonaris.com",
	MARKETING_LEAD_RECIPIENT: "owner@gmail.com,partner@gmail.com",
};
const lead: ContactLead = {
	locale: "en",
	workEmail: "ava@acme.example",
	name: "Ava Chen",
	companyOrWebsite: "acme.example",
	curiosity: "Could Yonaris help?",
	marketQuestion: "Which evidence changes the decision?",
	marketOrLanguage: "France / French",
	buyerOrCommercialContext: "A buying team is comparing approaches.",
	requestType: "conversation",
};

function jsonRequest(body: unknown, headers: Record<string, string> = {}, id = submissionId): Request {
	return new Request("https://www.yonaris.com/api/contact", {
		method: "POST",
		headers: {
			Origin: "https://www.yonaris.com",
			"Sec-Fetch-Site": "same-origin",
			"Content-Type": "application/json",
			"Idempotency-Key": id,
			"User-Agent": "contact-test-a",
			...headers,
		},
		body: JSON.stringify(body),
	});
}

function nativeRequest(body: Record<string, string>, headers: Record<string, string> = {}): Request {
	return new Request("https://www.yonaris.com/api/contact", {
		method: "POST",
		headers: {
			Origin: "https://www.yonaris.com",
			"Sec-Fetch-Site": "same-origin",
			"Content-Type": "application/x-www-form-urlencoded",
			"User-Agent": "contact-native-test",
			...headers,
		},
		body: new URLSearchParams(body),
	});
}

const serverCopy = {
	fieldsetLegend: "Test form",
	botFieldLabel: "Bot field",
	sendingLabel: "Sending",
	retryLabel: "Retry",
	privacySubmitLabel: "Privacy submit",
	unconfirmedMessage: "Test delivery was not confirmed.",
	conflictMessage: "Test submission changed.",
	privacyBoundary: "Test privacy boundary.",
	disclosure: "Test disclosure.",
	privacyLinkLabel: "Test privacy link",
	validation: {
		workEmailRequired: "Test email required.",
		workEmailInvalid: "Test email invalid.",
		fieldTooLong: "Test field too long.",
		formInvalid: "Test form invalid.",
	},
} as const;

function nativeRenderer(result: ContactFormResult, stableId: string, _context: ContactNativeRenderContext): string {
	const values = result.status === "confirmed" ? null : result.values;
	const message = result.status === "invalid"
		? result.fieldErrors.workEmail ?? result.fieldErrors.form ?? ""
		: result.status === "unconfirmed" ? result.message : "confirmed";
	return `<!doctype html><main data-v1-state="${result.status}" data-submission-id="${stableId}">${values ? `<input name="workEmail" value="${values.workEmail}">` : ""}<p>${message}</p></main>`;
}

function handler(overrides: Partial<Parameters<typeof createContactLeadHandler>[0]> = {}) {
	return createContactLeadHandler({
		getEnv: () => env,
		deliver: async () => undefined,
		now: () => 1_700_000_000_000,
		createSubmissionId: () => submissionId,
		renderNativeResult: nativeRenderer,
		getFormUiCopy: () => serverCopy,
		...overrides,
	});
}

describe("contact request security and native transport", () => {
	it("passes a safe locale and request-type context to native rendering, including confirmed responses", async () => {
		const renderNativeResult = vi.fn(nativeRenderer);
		const response = await handler({ renderNativeResult })(nativeRequest({
			locale: "zh-CN",
			workEmail: "ava@acme.example",
			requestType: "privacy",
			botField: "",
		}));
		expect(response.status).toBe(202);
		expect(renderNativeResult).toHaveBeenCalledWith(
			{ status: "confirmed" },
			submissionId,
			{ locale: "zh-CN", requestType: "privacy" },
		);
	});

	it("uses locale-resolved validation and delivery messages for native responses", async () => {
		const customCopy = {
			...serverCopy,
			unconfirmedMessage: "Localized unconfirmed.",
			validation: { ...serverCopy.validation, workEmailInvalid: "Localized invalid email." },
		};
		const invalid = await handler({ getFormUiCopy: () => customCopy })(nativeRequest({
			locale: "zh-CN",
			workEmail: "wrong",
			requestType: "conversation",
			botField: "",
		}));
		expect(await invalid.text()).toContain("Localized invalid email.");

		const unconfirmed = await handler({
			getFormUiCopy: () => customCopy,
			deliver: async () => { throw new ContactDeliveryError("delivery_unconfirmed"); },
		})(nativeRequest({
			locale: "zh-CN",
			workEmail: "ava@acme.example",
			requestType: "conversation",
			botField: "",
		}));
		expect(await unconfirmed.text()).toContain("Localized unconfirmed.");
	});

	it("accepts enhanced JSON and native form data with work email as the only user-entered value", async () => {
		const deliver = vi.fn(async () => undefined);
		const handle = handler({ deliver });
		const enhanced = await handle(jsonRequest({ locale: "en", workEmail: "ava@acme.example", requestType: "conversation", botField: "" }));
		expect(enhanced.status).toBe(202);
		expect(await enhanced.json()).toEqual({ status: "confirmed" });

		const native = await handle(nativeRequest({ locale: "en", workEmail: "ava@acme.example", requestType: "conversation", botField: "", submissionId: "" }));
		expect(native.status).toBe(202);
		expect(native.headers.get("Content-Type")).toMatch(/^text\/html/);
		expect(await native.text()).toContain('data-v1-state="confirmed"');
		expect(deliver).toHaveBeenCalledTimes(1);
	});

	it("returns value-preserving invalid and unconfirmed native documents", async () => {
		const invalid = await handler()(nativeRequest({ locale: "en", workEmail: "wrong", name: "Ava", requestType: "conversation", botField: "" }));
		expect(invalid.status).toBe(422);
		expect(await invalid.text()).toContain('data-v1-state="invalid"');

		const unconfirmed = await handler({ deliver: async () => { throw new ContactDeliveryError("delivery_unconfirmed"); } })(nativeRequest({ locale: "en", workEmail: "ava@acme.example", requestType: "conversation", botField: "" }));
		expect(unconfirmed.status).toBe(503);
		const html = await unconfirmed.text();
		expect(html).toContain('data-v1-state="unconfirmed"');
		expect(html).toContain('value="ava@acme.example"');
	});

	it.each([
		["cross origin", { Origin: "https://attacker.example" }, 403],
		["cross site", { "Sec-Fetch-Site": "cross-site" }, 403],
		["compressed", { "Content-Encoding": "gzip" }, 415],
		["unsupported", { "Content-Type": "text/plain" }, 415],
		["bad length", { "Content-Length": "not-a-number" }, 400],
		["oversize", { "Content-Length": "20481" }, 413],
	] as const)("rejects %s requests before delivery", async (_name, headers, expectedStatus) => {
		const deliver = vi.fn(async () => undefined);
		const response = await handler({ deliver })(jsonRequest(lead, headers));
		expect(response.status).toBe(expectedStatus);
		expect(deliver).not.toHaveBeenCalled();
	});

	it("rejects unknown fields, filled honeypots, duplicate native keys, and streamed bodies over 20,480 bytes", async () => {
		const handle = handler();
		expect((await handle(jsonRequest({ ...lead, unexpected: "no" }))).status).toBe(422);
		expect((await handle(jsonRequest({ ...lead, botField: "https://bot.example" }))).status).toBe(422);
		const duplicate = new Request("https://www.yonaris.com/api/contact", {
			method: "POST",
			headers: { Origin: "https://www.yonaris.com", "Sec-Fetch-Site": "same-origin", "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "duplicate-test" },
			body: "locale=en&workEmail=a%40example.com&workEmail=b%40example.com&requestType=conversation&botField=",
		});
		expect((await handle(duplicate)).status).toBe(400);
		expect((await handle(jsonRequest({ ...lead, curiosity: "x".repeat(21_000) }, { "Content-Length": "" }))).status).toBe(413);
	});

	it("ignores the custom client-IP header, uses trusted Vercel forwarding, and gives distinct fallback clients distinct buckets", async () => {
		const sameFallback = handler();
		for (let index = 0; index < 5; index += 1) {
			expect((await sameFallback(jsonRequest(lead, { "X-Yonaris-Client-IP": `203.0.113.${index}` }, index % 2 ? secondSubmissionId : submissionId))).status).not.toBe(429);
		}
		expect((await sameFallback(jsonRequest(lead, { "X-Yonaris-Client-IP": "198.51.100.44" }, secondSubmissionId))).status).toBe(429);

		const trusted = handler();
		for (let index = 0; index < 5; index += 1) {
			expect((await trusted(jsonRequest(lead, { "X-Vercel-ID": "iad1::test", "X-Vercel-Forwarded-For": "203.0.113.8" }, index % 2 ? secondSubmissionId : submissionId))).status).not.toBe(429);
		}
		expect((await trusted(jsonRequest(lead, { "X-Vercel-ID": "iad1::test", "X-Vercel-Forwarded-For": "203.0.113.8" }, secondSubmissionId))).status).toBe(429);
		expect((await trusted(jsonRequest(lead, { "User-Agent": "different-fallback-client" }, secondSubmissionId))).status).not.toBe(429);
	});
});

describe("process-local submission identity", () => {
	it("shares concurrent identical work, replays confirmation, rejects conflicts, and retries unconfirmed work", async () => {
		let release: (() => void) | undefined;
		const firstDelivery = new Promise<void>((resolve) => { release = resolve; });
		const deliver = vi.fn(async () => firstDelivery);
		const handle = handler({ deliver });
		const first = handle(jsonRequest(lead));
		const concurrent = handle(jsonRequest(lead));
		release?.();
		expect((await first).status).toBe(202);
		expect((await concurrent).status).toBe(202);
		expect(deliver).toHaveBeenCalledTimes(1);
		expect((await handle(jsonRequest(lead))).status).toBe(202);
		expect(deliver).toHaveBeenCalledTimes(1);
		expect((await handle(jsonRequest({ ...lead, curiosity: "Different payload" }))).status).toBe(409);
		expect(deliver).toHaveBeenCalledTimes(1);

		const retryDeliver = vi.fn()
			.mockRejectedValueOnce(new ContactDeliveryError("delivery_unconfirmed"))
			.mockResolvedValueOnce(undefined);
		const retryHandle = handler({ deliver: retryDeliver });
		expect((await retryHandle(jsonRequest(lead))).status).toBe(503);
		expect((await retryHandle(jsonRequest(lead))).status).toBe(202);
		expect(retryDeliver).toHaveBeenCalledTimes(2);
	});

	it("documents its honest cross-instance boundary through behavior", async () => {
		const deliver = vi.fn(async () => undefined);
		await handler({ deliver })(jsonRequest(lead));
		await handler({ deliver })(jsonRequest(lead));
		expect(deliver).toHaveBeenCalledTimes(2);
	});
});

describe("Cloudflare contact delivery", () => {
	it("uses the existing REST endpoint and confirms every configured Gmail destination across delivered and queued", async () => {
		let endpoint = "";
		let payload: Record<string, unknown> = {};
		const fetchImpl: typeof fetch = async (input, init) => {
			endpoint = String(input);
			payload = JSON.parse(String(init?.body));
			return Response.json({
				success: true,
				errors: [],
				messages: [],
				result: { delivered: ["owner@gmail.com"], queued: ["partner@gmail.com"], permanent_bounces: [] },
			});
		};
		await sendContactWithCloudflare({ lead, env, submissionId }, fetchImpl);
		expect(endpoint).toBe("https://api.cloudflare.com/client/v4/accounts/account_test/email/sending/send");
		expect(payload).toMatchObject({
			from: { address: "leads@yonaris.com", name: "Yonaris" },
			to: ["owner@gmail.com", "partner@gmail.com"],
			reply_to: "ava@acme.example",
			headers: { "X-Yonaris-Submission-ID": submissionId },
		});
		for (const value of [submissionId, "Locale: en", "Request type: conversation", "Work email: ava@acme.example", "Name: Ava Chen", "Company or website: acme.example", "Curiosity: Could Yonaris help?", "Market question: Which evidence changes the decision?", "Market or language: France / French", "Buyer or commercial context: A buying team is comparing approaches."]) {
			expect(String(payload.text)).toContain(value);
		}
	});

	it.each([
		[403, { success: false, errors: [{ code: 10105, message: "not_entitled" }] }],
		[403, { success: false, errors: [{ code: 10102, message: "forbidden" }] }],
		[503, { success: false, errors: [{ code: 10203, message: "sending_disabled" }] }],
		[200, { success: true, errors: [], messages: [], result: { delivered: ["owner@gmail.com"], queued: [], permanent_bounces: [] } }],
		[200, { success: true, errors: [], messages: [], result: { delivered: ["owner@gmail.com"], queued: ["partner@gmail.com"], permanent_bounces: ["partner@gmail.com"] } }],
	] as const)("treats a %s or incomplete provider result as unconfirmed", async (status, body) => {
		await expect(sendContactWithCloudflare({ lead, env, submissionId }, async () => Response.json(body, { status }))).rejects.toMatchObject({ code: "delivery_unconfirmed" });
	});

	it("rejects routing aliases/unsafe configuration before network access", async () => {
		const fetchImpl = vi.fn<typeof fetch>();
		await expect(sendContactWithCloudflare({ lead, env: { ...env, MARKETING_LEAD_RECIPIENT: "leads@yonaris.com" }, submissionId }, fetchImpl)).rejects.toMatchObject({ code: "service_unavailable" });
		await expect(sendContactWithCloudflare({ lead, env: { ...env, CLOUDFLARE_EMAIL_FROM: "outside@example.com" }, submissionId }, fetchImpl)).rejects.toMatchObject({ code: "service_unavailable" });
		expect(fetchImpl).not.toHaveBeenCalled();
	});
});
