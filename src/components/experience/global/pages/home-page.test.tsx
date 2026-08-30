// @vitest-environment happy-dom

import type { ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { GLOBAL_EN_BUYER_QUESTION } from "@/content/public-site/global-en/buyer-question";
import { GLOBAL_EN_HOME_PAGE } from "@/content/public-site/global-en/pages/home";
import { Route } from "@/routes/index";
import { BuyerQuestionProvider } from "../../shared/buyer-question/buyer-question-provider";
import { ProductRecordPreview } from "../../shared/home/product-record-preview";
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

	it("renders five materially different record geometries from the same SSR record", () => {
		const html = renderToStaticMarkup(<HomeRouteComponent />);
		const document = new DOMParser().parseFromString(html, "text/html");
		const views = [...document.querySelectorAll<HTMLElement>("[data-record-view]")];

		expect(views).toHaveLength(5);
		expect(new Set(views.map((view) => view.dataset.recordId))).toEqual(new Set([RECORD_ID]));
		expect(document.querySelector('[data-record-view="buyer-question"] blockquote')).not.toBeNull();
		expect(document.querySelectorAll('[data-record-view="buyer-question"] dl > div')).toHaveLength(3);
		expect(document.querySelectorAll('[data-record-view="current-answer"] [data-answer-environment]')).toHaveLength(4);
		expect(document.querySelectorAll('[data-record-view="comparison-evidence"] [data-comparison-node]')).toHaveLength(2);
		expect(document.querySelector('[data-record-view="comparison-evidence"] [data-evidence-gap]')).not.toBeNull();
		expect(document.querySelector('[data-record-view="reviewed-action"] [data-reviewed-action]')).not.toBeNull();
		expect(document.querySelector('[data-record-view="reviewed-action"] [data-human-reviewer="human-team"]')).not.toBeNull();
		expect(document.querySelector('[data-record-view="later-review"] [data-review-result="changed"]')).not.toBeNull();
		expect(document.querySelector('[data-record-view="later-review"] [data-review-result="unchanged"]')).not.toBeNull();
		expect(document.querySelector('[data-record-view="later-review"] [data-review-result="cannot-attribute"]')).not.toBeNull();
	});

	it("renders every shared record label from injected typed Home copy", () => {
		const recordLabels = {
			audience: "Audience copy sentinel",
			market: "Market copy sentinel",
			language: "Language copy sentinel",
			humanReviewed: "Human review copy sentinel",
		};
		const stateLabels = {
			initialAnswer: "Initial copy sentinel",
			evidenceGap: "Gap copy sentinel",
			reviewedAction: "Action copy sentinel",
			changed: "Changed copy sentinel",
			unchanged: "Unchanged copy sentinel",
			cannotAttribute: "Attribution copy sentinel",
		};
		const html = renderToStaticMarkup(
			<BuyerQuestionProvider record={GLOBAL_EN_BUYER_QUESTION}>
				<ProductRecordPreview
					copy={GLOBAL_EN_HOME_PAGE.productPreview}
					disclosure={GLOBAL_EN_HOME_PAGE.casework.disclosure}
					recordLabels={recordLabels}
					stateLabels={stateLabels}
				/>
			</BuyerQuestionProvider>,
		);

		for (const label of [
			...Object.values(recordLabels),
			stateLabels.evidenceGap,
			stateLabels.reviewedAction,
			stateLabels.changed,
			stateLabels.unchanged,
			stateLabels.cannotAttribute,
		]) {
			expect(html).toContain(label);
		}
	});

	it("uses the local responsive hero asset and canonical Human / Agent fact routes", () => {
		const html = renderToStaticMarkup(<HomeRouteComponent />);
		const document = new DOMParser().parseFromString(html, "text/html");
		const bridge = document.querySelector<HTMLElement>("[data-human-agent-bridge='home']");
		expect(html).toContain("/assets/site-v1/hero-evidence-field-640.avif");
		expect(html).toContain("/assets/site-v1/hero-evidence-field-1600.webp");
		expect(html).toMatch(/src="\/assets\/site-v1\/hero-evidence-field\.png"[^>]+width="1672" height="941"/);
		expect(html).toContain("--hero-focal:76% 48%");
		expect(html).toContain("--hero-mobile-crop:center right");
		expect(html).toContain("AI-Native MarTech Infrastructure");
		expect(bridge?.dataset.factId).toBe("yonaris.category.ai-native-martech");
		expect(bridge?.querySelectorAll("[data-bridge-layer]")).toHaveLength(3);
		expect(bridge?.querySelector('a[href="/human-agent"]')).not.toBeNull();
		expect(bridge?.querySelector('a[href="/agent#yonaris.category.ai-native-martech"]')).not.toBeNull();
		expect(bridge?.querySelector("[data-human-agent-lens], button")).toBeNull();
	});
});
