import { describe, expect, it, vi } from "vitest";
import {
	CONTACT_API_PATH,
	CONTACT_SUBMISSION_HEADER,
	contactLeadFingerprint,
	resolveContactRequestIdentity,
	submitContactRequest,
} from "./contact-client";
import type { ContactLead } from "./contact-schema";

const lead: ContactLead = {
	locale: "en",
	workEmail: "ava@acme.example",
	name: "Ava Chen",
	curiosity: "Could Yonaris fit this market?",
	requestType: "conversation",
};
const submissionId = "0198ef3d-34e1-7f14-a74d-e09b66d14b11";

describe("contact client", () => {
	it("posts normalized JSON to the canonical endpoint and confirms only the confirmed result", async () => {
		let capturedUrl = "";
		let captured: RequestInit | undefined;
		const fetchImpl: typeof fetch = async (input, init) => {
			capturedUrl = String(input);
			captured = init;
			return Response.json({ status: "confirmed" }, { status: 202 });
		};
		await expect(submitContactRequest(lead, submissionId, { fetchImpl })).resolves.toEqual({ status: "confirmed" });
		expect(capturedUrl).toBe(CONTACT_API_PATH);
		expect(new Headers(captured?.headers).get(CONTACT_SUBMISSION_HEADER)).toBe(submissionId);
		expect(JSON.parse(String(captured?.body))).toEqual(lead);
	});

	it.each([
		new Response(JSON.stringify({ status: "confirmed" }), { status: 200 }),
		new Response(JSON.stringify({ status: "unconfirmed" }), { status: 503 }),
		new Response("not json", { status: 202 }),
	])("keeps any response without an explicit accepted confirmation unconfirmed", async (response) => {
		await expect(submitContactRequest(lead, submissionId, { fetchImpl: async () => response.clone() })).resolves.toEqual({ status: "unconfirmed" });
	});

	it("times out through the injected network path without throwing or sending another request", async () => {
		const fetchImpl = vi.fn<typeof fetch>(async (_input, init) => {
			await new Promise((_resolve, reject) => init?.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), { once: true }));
			throw new Error("unreachable");
		});
		await expect(submitContactRequest(lead, submissionId, { fetchImpl, timeoutMs: 1 })).resolves.toEqual({ status: "unconfirmed" });
		expect(fetchImpl).toHaveBeenCalledTimes(1);
	});

	it("fingerprints normalized payloads and keeps one stable ID only for the same payload", () => {
		const fingerprint = contactLeadFingerprint(lead);
		expect(fingerprint).toBe('{"locale":"en","workEmail":"ava@acme.example","name":"Ava Chen","curiosity":"Could Yonaris fit this market?","requestType":"conversation"}');
		expect(contactLeadFingerprint({ ...lead, name: " Ava Chen " })).toBe(fingerprint);
		const first = resolveContactRequestIdentity(null, lead, () => submissionId);
		expect(resolveContactRequestIdentity(first, { ...lead, name: " Ava Chen " }, () => "unexpected")).toEqual(first);
		expect(resolveContactRequestIdentity(first, { ...lead, curiosity: "Different" }, () => "0198ef3d-34e1-7f14-a74d-e09b66d14b12")?.submissionId).toBe("0198ef3d-34e1-7f14-a74d-e09b66d14b12");
	});
});
