import { describe, expect, it } from "vitest";
import { findPublishedEditionPage, getEdition } from "./registry";

const globalPaths = ["/", "/product", "/casework", "/company", "/human-agent", "/contact", "/privacy"];
const chinaPaths = ["/zh", "/zh/product", "/zh/casework", "/zh/company", "/zh/human-agent", "/zh/contact", "/zh/privacy"];

describe("regional edition registry", () => {
	it("owns the complete global route set without the retired section", () => {
		const edition = getEdition("global-en");
		expect(edition.pages.map((page) => page.pathname)).toEqual(globalPaths);
		expect(edition.primaryNavigation.map((ref) => ref.split(":")[1])).toEqual(["product", "casework", "company", "contact"]);
		expect(edition.diagnosticPolicy).toBe("global-v2");
		for (const pathname of globalPaths) expect(findPublishedEditionPage(pathname)?.editionId).toBe("global-en");
		expect(findPublishedEditionPage("/research")).toBeUndefined();
	});

	it("owns a separate complete China route set", () => {
		const edition = getEdition("zh-cn");
		expect(edition.pages.map((page) => page.pathname)).toEqual(chinaPaths);
		expect(edition.primaryNavigation.map((ref) => ref.split(":")[1])).toEqual(["product", "casework", "company", "contact"]);
		expect(edition.diagnosticPolicy).toBe("regional-v2");
		for (const pathname of chinaPaths) expect(findPublishedEditionPage(pathname)?.editionId).toBe("zh-cn");
		expect(findPublishedEditionPage("/zh/research")).toBeUndefined();
	});

	it("derives page navigation membership from typed edition navigation targets", () => {
		for (const editionId of ["global-en", "zh-cn"] as const) {
			const pages = getEdition(editionId).pages;
			const navigationFor = (key: string) => pages.find((page) => page.ref === `${editionId}:${key}`)?.navigation;
			expect(navigationFor("human-agent")).toEqual(["footer"]);
			expect(navigationFor("contact")).toEqual(["utility", "footer"]);
			expect(navigationFor("contact")).not.toContain("primary");
		}
	});
});
