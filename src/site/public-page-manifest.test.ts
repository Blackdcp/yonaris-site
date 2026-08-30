import { describe, expect, test } from "vitest";
import { PUBLIC_PAGE_KEYS, PUBLIC_PAGE_MANIFEST } from "./public-page-manifest";
import { getLocaleSwitchPath, getPublicPagePath, resolveNavigationTarget } from "./route-selectors";
import { PUBLIC_REDIRECTS } from "./redirects";
import { HUMAN_PAGE_TO_PUBLIC_PAGE } from "@/content/experience/types";

const paths = {
	home: { "global-en": "/", "zh-cn": "/zh" },
	product: { "global-en": "/product", "zh-cn": "/zh/product" },
	casework: { "global-en": "/casework", "zh-cn": "/zh/casework" },
	company: { "global-en": "/company", "zh-cn": "/zh/company" },
	"human-agent": { "global-en": "/human-agent", "zh-cn": "/zh/human-agent" },
	contact: { "global-en": "/contact", "zh-cn": "/zh/contact" },
	privacy: { "global-en": "/privacy", "zh-cn": "/zh/privacy" },
} as const;

describe("public page manifest", () => {
	test("owns the exact seven semantic keys and bilingual canonical paths", () => {
		expect(PUBLIC_PAGE_KEYS).toEqual(["home", "product", "casework", "company", "human-agent", "contact", "privacy"]);
		for (const page of PUBLIC_PAGE_MANIFEST) {
			expect(page.paths).toEqual(paths[page.key]);
			expect(page.agentPaths["global-en"]).toBe(page.key === "home" ? "/agent" : `/agent/${page.key}`);
			expect(page.agentPaths["zh-cn"]).toBe(page.key === "home" ? "/zh/agent" : `/zh/agent/${page.key}`);
		}
	});

	test("switches locales by semantic key rather than replacing a path prefix", () => {
		for (const key of PUBLIC_PAGE_KEYS) {
			expect(getLocaleSwitchPath("global-en", key)).toBe(paths[key]["zh-cn"]);
			expect(getLocaleSwitchPath("zh-cn", key)).toBe(paths[key]["global-en"]);
		}
	});

	test("resolves product anchors and machine routes through selectors", () => {
		expect(resolveNavigationTarget("global-en", { kind: "page", page: "product", hash: "markets-languages" })).toBe(
			"/product#markets-languages",
		);
		expect(resolveNavigationTarget("zh-cn", { kind: "machine", route: "agent-index" })).toBe("/zh/agent");
		expect(getPublicPagePath("global-en", "casework")).toBe("/casework");
	});

	test("redirects are direct and retain queries before fragments", () => {
		const approach = PUBLIC_REDIRECTS.find((redirect) => redirect.from === "/approach");
		expect(approach?.to).toBe("/product#how-it-works");
		expect(approach?.resolve("?utm=x")).toBe("/product?utm=x#how-it-works");
		for (const redirect of PUBLIC_REDIRECTS) {
			expect(PUBLIC_REDIRECTS.some((candidate) => candidate.from === redirect.to)).toBe(false);
		}
	});

	test("keeps legacy semantic adapters aligned with Product and Company", () => {
		expect(HUMAN_PAGE_TO_PUBLIC_PAGE.approach).toBe("product");
		expect(HUMAN_PAGE_TO_PUBLIC_PAGE.company).toBe("company");
	});

	test("declares every approved alias for human, Agent, Chinese Agent, and Markdown surfaces", () => {
		const aliases = ["platform", "features", "approach", "methodology", "results", "geo", "off-site-aeo", "diagnostic", "pricing", "vision"];
		const paths = new Set(PUBLIC_REDIRECTS.map((redirect) => redirect.from));
		for (const alias of aliases) {
			expect(paths).toContain(`/${alias}`);
			expect(paths).toContain(`/zh/${alias}`);
			expect(paths).toContain(`/agent/${alias}`);
			expect(paths).toContain(`/zh/agent/${alias}`);
			expect(paths).toContain(`/llms.mdx/agent/${alias}`);
			expect(paths).toContain(`/llms.mdx/zh-agent/${alias}`);
		}
	});
});
