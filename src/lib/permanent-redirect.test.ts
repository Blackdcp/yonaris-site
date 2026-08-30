import { describe, expect, test } from "vitest";
import { PUBLIC_REDIRECTS } from "@/site/redirects";

type PermanentRedirectModule = typeof import("./permanent-redirect");

async function loadSubject(): Promise<PermanentRedirectModule | undefined> {
	try {
		return (await import("./permanent-redirect")) as PermanentRedirectModule;
	} catch {
		return undefined;
	}
}

const subject = await loadSubject();

// This is an intentionally independent routing oracle. Do not derive its values
// from the redirect manifest or selectors under test.
const EXPECTED_FINAL_LOCATIONS = {
	"/platform": "/product",
	"/features": "/product",
	"/approach": "/product#how-it-works",
	"/methodology": "/product#how-it-works",
	"/results": "/casework",
	"/geo": "/product#markets-languages",
	"/off-site-aeo": "/product#markets-languages",
	"/diagnostic": "/contact",
	"/pricing": "/contact",
	"/vision": "/company",
	"/zh/platform": "/zh/product",
	"/zh/features": "/zh/product",
	"/zh/approach": "/zh/product#how-it-works",
	"/zh/methodology": "/zh/product#how-it-works",
	"/zh/results": "/zh/casework",
	"/zh/geo": "/zh/product#markets-languages",
	"/zh/off-site-aeo": "/zh/product#markets-languages",
	"/zh/diagnostic": "/zh/contact",
	"/zh/pricing": "/zh/contact",
	"/zh/vision": "/zh/company",
	"/agent/platform": "/agent/product",
	"/agent/features": "/agent/product",
	"/agent/approach": "/agent/product#how-it-works",
	"/agent/methodology": "/agent/product#how-it-works",
	"/agent/results": "/agent/casework",
	"/agent/geo": "/agent/product#markets-languages",
	"/agent/off-site-aeo": "/agent/product#markets-languages",
	"/agent/diagnostic": "/agent/contact",
	"/agent/pricing": "/agent/contact",
	"/agent/vision": "/agent/company",
	"/zh/agent/platform": "/zh/agent/product",
	"/zh/agent/features": "/zh/agent/product",
	"/zh/agent/approach": "/zh/agent/product#how-it-works",
	"/zh/agent/methodology": "/zh/agent/product#how-it-works",
	"/zh/agent/results": "/zh/agent/casework",
	"/zh/agent/geo": "/zh/agent/product#markets-languages",
	"/zh/agent/off-site-aeo": "/zh/agent/product#markets-languages",
	"/zh/agent/diagnostic": "/zh/agent/contact",
	"/zh/agent/pricing": "/zh/agent/contact",
	"/zh/agent/vision": "/zh/agent/company",
	"/llms.mdx/agent/platform": "/llms.mdx/agent/product",
	"/llms.mdx/agent/features": "/llms.mdx/agent/product",
	"/llms.mdx/agent/approach": "/llms.mdx/agent/product#how-it-works",
	"/llms.mdx/agent/methodology": "/llms.mdx/agent/product#how-it-works",
	"/llms.mdx/agent/results": "/llms.mdx/agent/casework",
	"/llms.mdx/agent/geo": "/llms.mdx/agent/product#markets-languages",
	"/llms.mdx/agent/off-site-aeo": "/llms.mdx/agent/product#markets-languages",
	"/llms.mdx/agent/diagnostic": "/llms.mdx/agent/contact",
	"/llms.mdx/agent/pricing": "/llms.mdx/agent/contact",
	"/llms.mdx/agent/vision": "/llms.mdx/agent/company",
	"/llms.mdx/zh-agent/platform": "/llms.mdx/zh-agent/product",
	"/llms.mdx/zh-agent/features": "/llms.mdx/zh-agent/product",
	"/llms.mdx/zh-agent/approach": "/llms.mdx/zh-agent/product#how-it-works",
	"/llms.mdx/zh-agent/methodology": "/llms.mdx/zh-agent/product#how-it-works",
	"/llms.mdx/zh-agent/results": "/llms.mdx/zh-agent/casework",
	"/llms.mdx/zh-agent/geo": "/llms.mdx/zh-agent/product#markets-languages",
	"/llms.mdx/zh-agent/off-site-aeo": "/llms.mdx/zh-agent/product#markets-languages",
	"/llms.mdx/zh-agent/diagnostic": "/llms.mdx/zh-agent/contact",
	"/llms.mdx/zh-agent/pricing": "/llms.mdx/zh-agent/contact",
	"/llms.mdx/zh-agent/vision": "/llms.mdx/zh-agent/company",
} as const;

function expectedLocation(finalLocation: string): string {
	const [path, fragment] = finalLocation.split("#", 2);
	return `${path}?utm=legacy${fragment ? `#${fragment}` : ""}`;
}

function requireSubject(): PermanentRedirectModule | undefined {
	expect(subject, "the permanent-redirect response helper must load").toBeDefined();
	return subject;
}

describe("permanent redirects", () => {
	test("returns a bodyless 308 and preserves the original query string", async () => {
		const redirects = requireSubject();
		if (!redirects) return;

		const response = redirects.permanentRedirectResponse(
			new Request("https://yonaris.test/agent/platform?source=old&lang=en"),
			"/agent/product",
		);
		expect(response.status).toBe(308);
		expect(response.headers.get("location")).toBe("/agent/product?source=old&lang=en");
		expect(await response.text()).toBe("");
	});

	test("does not copy a fragment or origin from the requested URL", () => {
		const redirects = requireSubject();
		if (!redirects) return;

		const response = redirects.permanentRedirectResponse(
			new Request("https://malicious.example/agent/results?ref=legacy#ignored"),
			"/agent/product",
		);
		expect(response.headers.get("location")).toBe("/agent/product?ref=legacy");
	});

	test("preserves repeated, empty, and percent-encoded query values byte for byte", async () => {
		const redirects = requireSubject();
		if (!redirects) return;

		const response = redirects.permanentRedirectResponse(
			new Request("https://yonaris.test/platform?tag=one&tag=two&encoded=a%2Fb%3Fc&empty=#ignored"),
			"/product",
		);
		expect(response.status).toBe(308);
		expect(response.headers.get("location")).toBe("/product?tag=one&tag=two&encoded=a%2Fb%3Fc&empty=");
		expect(response.headers.get("content-type")).toBeNull();
		expect(await response.text()).toBe("");
	});

	test("places a preserved query before the destination fragment", () => {
		const redirects = requireSubject();
		if (!redirects) return;

		const response = redirects.permanentRedirectResponse(
			new Request("https://yonaris.test/approach?utm=x"),
			"/product#how-it-works",
		);
		expect(response.headers.get("location")).toBe("/product?utm=x#how-it-works");
	});

	test("executes every legacy alias with GET and HEAD as one final 308", async () => {
		const redirects = requireSubject();
		if (!redirects) return;

		for (const [alias, finalLocation] of Object.entries(EXPECTED_FINAL_LOCATIONS)) {
			const redirect = PUBLIC_REDIRECTS.find((candidate) => candidate.from === alias);
			expect(redirect, `redirect declaration for ${alias}`).toBeDefined();
			if (!redirect) continue;
			for (const method of ["GET", "HEAD"] as const) {
				const response = redirects.permanentRedirectResponse(
					new Request(`https://yonaris.test${alias}?utm=legacy`, { method }),
					redirect.to,
				);
				expect(response.status, `${method} ${alias}`).toBe(308);
				expect(response.headers.get("location"), `${method} ${alias}`).toBe(expectedLocation(finalLocation));
				expect(PUBLIC_REDIRECTS.some((candidate) => candidate.from === redirect.to), `${method} ${alias}`).toBe(false);
				expect(await response.text(), `${method} ${alias}`).toBe("");
			}
		}
		expect(PUBLIC_REDIRECTS).toHaveLength(Object.keys(EXPECTED_FINAL_LOCATIONS).length);
	});
});
