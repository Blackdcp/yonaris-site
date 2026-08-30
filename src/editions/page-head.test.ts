import { describe, expect, test } from "vitest";
import { buildPageHead } from "./page-head";
import { globalEnglishPageHead } from "./global-en/edition";
import { zhPageHead } from "./zh-cn/edition";

describe("edition page heads", () => {
	test("derives canonical and reciprocal locale paths from the public manifest", () => {
		const head = buildPageHead("global-en", "casework");
		expect(head.links).toContainEqual({ rel: "canonical", href: "https://yonaris.com/casework" });
		expect(head.links).toContainEqual({ rel: "alternate", hrefLang: "zh-CN", href: "https://yonaris.com/zh/casework" });
	});

	test("keeps pre-migration legacy handlers canonical to their current routes", () => {
		expect(globalEnglishPageHead("approach").links).toContainEqual({ rel: "canonical", href: "https://yonaris.com/approach" });
		expect(globalEnglishPageHead("company").links).toContainEqual({ rel: "canonical", href: "https://yonaris.com/company" });
		expect(zhPageHead("approach").links).toContainEqual({ rel: "canonical", href: "https://yonaris.com/zh/approach" });
		expect(zhPageHead("company").links).toContainEqual({ rel: "canonical", href: "https://yonaris.com/zh/company" });
	});
});
