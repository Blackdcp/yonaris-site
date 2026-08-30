import { describe, expect, it } from "vitest";
import {
	CONTACT_INTENT_STATE_KEY,
	contactRequestTypeFromRoute,
	validateContactRouteSearch,
} from "./contact-request-intent";

describe("typed Contact request intent", () => {
	it("preserves only the exact typed privacy selector", () => {
		expect(validateContactRouteSearch({ intent: "privacy" })).toEqual({ intent: "privacy" });
		for (const search of [{}, { intent: "deletion" }, { intent: "PRIVACY" }, { intent: ["privacy"] }, { intent: "privacy", email: "ava@example.com" }]) {
			expect(validateContactRouteSearch(search)).toEqual(search.intent === "privacy" ? { intent: "privacy" } : {});
		}
	});

	it("recovers privacy from validated SSR search or queryless browser history and defaults to conversation", () => {
		expect(contactRequestTypeFromRoute({ intent: "privacy" }, null)).toBe("privacy");
		expect(contactRequestTypeFromRoute({}, { [CONTACT_INTENT_STATE_KEY]: "privacy" })).toBe("privacy");
		expect(contactRequestTypeFromRoute({}, null)).toBe("conversation");
		expect(contactRequestTypeFromRoute({ intent: "deletion" }, { [CONTACT_INTENT_STATE_KEY]: "deletion" })).toBe("conversation");
	});
});
