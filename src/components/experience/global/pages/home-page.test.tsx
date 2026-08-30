// @vitest-environment happy-dom

import type { ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Route } from "@/routes/index";
import { HomePage } from "./home-page";

const HomeRouteComponent = Route.options.component as ComponentType;
const RECORD_ID = "yonaris.buyer-question.global-en.enterprise-analytics-markets.v1";
const DISCLOSURE = "Representative casework — not a customer performance claim.";

describe("English Site 1.0 Home route", () => {
	it("renders the approved fixed sequence through the dedicated Site 1.0 assembler", () => {
		const html = renderToStaticMarkup(<HomeRouteComponent />);
		const sequence = [
			'data-home-section="hero-answer"',
			'id="product-preview"',
			'data-home-section="human-agent"',
			'data-home-section="casework"',
			'data-home-section="closing"',
		].map((signature) => html.indexOf(signature));

		expect(html).toContain('data-generation="site-v1"');
		expect(sequence.every((index) => index >= 0)).toBe(true);
		expect(sequence).toEqual([...sequence].sort((left, right) => left - right));
		expect(html).toContain("Know what buyers are being told—and what to change.");
		expect(html).not.toContain("The shortlist now forms before the click.");

		expect(Route.options.component).toBe(HomePage);
	});

	it("keeps the primary Home CTA ungated and targets the typed product-preview anchor", () => {
		const html = renderToStaticMarkup(<HomeRouteComponent />);
		const document = new DOMParser().parseFromString(html, "text/html");
		const cta = [...document.querySelectorAll<HTMLAnchorElement>("a")].find((link) => link.textContent === "See Yonaris in action");
		expect(cta?.getAttribute("href")).toBe("/#product-preview");
		expect(cta?.getAttribute("href")).not.toMatch(/contact|diagnostic|form/i);
		expect(document.querySelector("#product-preview")).not.toBeNull();
	});

	it("retains all five labelled states, disclosures and the stable record in SSR", () => {
		const html = renderToStaticMarkup(<HomeRouteComponent />);
		const document = new DOMParser().parseFromString(html, "text/html");
		for (const label of [
			"What buyers ask",
			"What they hear",
			"Why they hear it",
			"What your team can change",
			"What changed afterwards",
		]) {
			expect(document.body.textContent).toContain(label);
		}
		expect(document.querySelectorAll(`[data-record-id="${RECORD_ID}"]`).length).toBeGreaterThanOrEqual(3);
		const appearances = [...document.querySelectorAll<HTMLElement>("[data-representative-record]")];
		expect(appearances.length).toBeGreaterThanOrEqual(3);
		for (const appearance of appearances) {
			expect(appearance.textContent).toContain(DISCLOSURE);
			expect(appearance.querySelector(".site-v1-representative-disclosure")).not.toBeNull();
		}
		expect(html).toContain("Initial answer");
		expect(html).toContain("Evidence gap");
		expect(html).toContain("Reviewed action");
		expect(html).toContain("Changed");
		expect(html).toContain("Unchanged");
		expect(html).toContain("Cannot attribute");
	});

	it("uses the local responsive hero asset and canonical Human / Agent fact routes", () => {
		const html = renderToStaticMarkup(<HomeRouteComponent />);
		expect(html).toContain("/assets/site-v1/hero-evidence-field-640.avif");
		expect(html).toContain("/assets/site-v1/hero-evidence-field-1600.webp");
		expect(html).toMatch(/src="\/assets\/site-v1\/hero-evidence-field\.png"[^>]+width="1672" height="941"/);
		expect(html).toContain("--hero-focal:76% 48%");
		expect(html).toContain("--hero-mobile-crop:center right");
		expect(html).toContain("AI-Native MarTech Infrastructure");
		expect(html).toContain('href="/human-agent"');
		expect(html).toContain('href="/agent"');
	});
});
