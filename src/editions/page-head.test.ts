import { describe, expect, test } from "vitest";
import { buildPageHead } from "./page-head";

describe("edition page heads", () => {
	test("derives canonical and reciprocal locale paths from the public manifest", () => {
		const head = buildPageHead("global-en", "casework");
		expect(head.links).toContainEqual({ rel: "canonical", href: "https://yonaris.com/casework" });
		expect(head.links).toContainEqual({ rel: "alternate", hrefLang: "zh-CN", href: "https://yonaris.com/zh/casework" });
	});
});
