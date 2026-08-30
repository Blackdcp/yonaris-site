import { describe, expect, it } from "vitest";
import { contactLeadDraft, parseContactLead } from "./contact-schema";

const minimalLead = {
	locale: "en",
	workEmail: "ava@acme.example",
	requestType: "conversation",
	botField: "",
} as const;

describe("contact lead schema", () => {
	it("requires only a valid work email for a conversation", () => {
		expect(parseContactLead(minimalLead)).toMatchObject({
			success: true,
			data: {
				locale: "en",
				workEmail: "ava@acme.example",
				requestType: "conversation",
			},
		});
		for (const workEmail of ["", "not-an-email", "ava@acme.example\nBcc:other@example.com"]) {
			expect(parseContactLead({ ...minimalLead, workEmail }).success, workEmail).toBe(false);
		}
	});

	it("trims fields and omits every empty optional value", () => {
		expect(parseContactLead({
			...minimalLead,
			workEmail: " ava@acme.example ",
			name: " Ava Chen ",
			companyOrWebsite: " ",
			curiosity: "  How could this fit?  ",
			marketQuestion: "",
			marketOrLanguage: "   ",
			buyerOrCommercialContext: "",
		})).toEqual({
			success: true,
			data: {
				locale: "en",
				workEmail: "ava@acme.example",
				name: "Ava Chen",
				curiosity: "How could this fit?",
				requestType: "conversation",
			},
		});
	});

	it("accepts every approved optional field while keeping curiosity short and low pressure", () => {
		const result = parseContactLead({
			...minimalLead,
			name: "Ava Chen",
			companyOrWebsite: "acme.example",
			curiosity: "Could Yonaris help us understand one market?",
			marketQuestion: "What evidence changes the buying decision?",
			marketOrLanguage: "France / French",
			buyerOrCommercialContext: "A team is comparing two approaches.",
		});
		expect(result.success).toBe(true);
		expect(parseContactLead({ ...minimalLead, curiosity: "x".repeat(501) }).success).toBe(false);
	});

	it("allows only fixed locale/request type values, an empty honeypot, and known fields", () => {
		expect(parseContactLead({ ...minimalLead, locale: "zh-CN", requestType: "privacy" }).success).toBe(true);
		for (const input of [
			{ ...minimalLead, locale: "zh" },
			{ ...minimalLead, requestType: "consultation" },
			{ ...minimalLead, botField: "https://bot.example" },
			{ ...minimalLead, phone: "13800138000" },
			{ ...minimalLead, workEmail: 42 },
		]) expect(parseContactLead(input).success).toBe(false);
	});

	it("builds a bounded value-preserving draft without retaining unknown fields", () => {
		expect(contactLeadDraft({
			locale: "en",
			workEmail: "ava@acme.example",
			name: "Ava Chen",
			companyOrWebsite: "acme.example",
			curiosity: "A short question",
			marketQuestion: "Which source matters?",
			marketOrLanguage: "French",
			buyerOrCommercialContext: "Commercial review",
			requestType: "privacy",
			botField: "",
			unexpected: "must not survive",
		})).toEqual({
			locale: "en",
			workEmail: "ava@acme.example",
			name: "Ava Chen",
			companyOrWebsite: "acme.example",
			curiosity: "A short question",
			marketQuestion: "Which source matters?",
			marketOrLanguage: "French",
			buyerOrCommercialContext: "Commercial review",
			requestType: "privacy",
			botField: "",
		});
	});
});
