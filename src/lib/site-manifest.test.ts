import { describe, expect, test } from "vitest";
import { PUBLIC_PAGE_KEYS } from "@/site/public-page-manifest";
import * as audit from "../../scripts/audit-site-manifest";
import * as subject from "./site-manifest";

describe("site manifest", () => {
	test("derives every public canonical from the public page manifest", () => {
		for (const key of PUBLIC_PAGE_KEYS) {
			expect(subject.getCorePath(key, "en")).toBeDefined();
			expect(subject.getCorePath(key, "zh")).toBeDefined();
			expect(subject.getCoreLastVerified(key)).toBe("2026-08-30");
		}
	});
	test("keeps canonicals unique and route keys complete", () => {
		const canonicals = subject.SITE_MANIFEST.flatMap((route) => Object.values(route.canonicals));
		expect(new Set(canonicals).size).toBe(canonicals.length);
		expect(subject.SITE_MANIFEST.map((route) => route.key).sort()).toEqual([...subject.SITE_ROUTE_KEYS].sort());
	});

});

	test("classifies all current filesystem routes through one direct redirect or manifest route", async () => {
		const patterns = await audit.discoverRoutePatterns();
		expect(patterns.filter((pattern) => !subject.findSiteRoute(pattern))).toEqual([]);
		for (const redirect of subject.SITE_REDIRECTS) {
			expect(subject.getRedirect(redirect.to)).toBeUndefined();
			expect(subject.findSiteRoute(redirect.to)).toBeDefined();
		}
	});
