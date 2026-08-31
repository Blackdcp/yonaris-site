// @vitest-environment happy-dom

import type { ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { GLOBAL_EN_BUYER_QUESTION } from "@/content/public-site/global-en/buyer-question";
import { GLOBAL_EN_PRODUCT_PAGE } from "@/content/public-site/global-en/pages/product";
import { buildPageHead } from "@/editions/page-head";
import { Route } from "@/routes/product";

const ProductRouteComponent = Route.options.component as ComponentType;

function renderProduct() {
	const html = renderToStaticMarkup(<ProductRouteComponent />);
	return { html, document: new DOMParser().parseFromString(html, "text/html") };
}

describe("English Site 1.0 Product route", () => {
	it("uses the approved Product shell, copy record and central route metadata", () => {
		const { html, document } = renderProduct();
		expect(document.querySelector('[data-generation="site-v1"][data-page="product"]')).not.toBeNull();
		expect(document.querySelector('a[href="/product"][aria-current="page"]')).not.toBeNull();
		expect(document.querySelector("h1")?.textContent).toBe(GLOBAL_EN_PRODUCT_PAGE.hero.headline);
		expect(html).toContain(GLOBAL_EN_PRODUCT_PAGE.hero.body);
		const head = (Route.options.head as () => ReturnType<typeof buildPageHead>)();
		expect(head.meta).toContainEqual({ title: GLOBAL_EN_PRODUCT_PAGE.metadata.title });
		expect(head.meta).toContainEqual({ name: "description", content: GLOBAL_EN_PRODUCT_PAGE.metadata.description });
		const graph = JSON.parse(head.scripts[0].children)["@graph"] as Array<Record<string, unknown>>;
		const webPage = graph.find((node) => node["@type"] === "WebPage");
		expect(webPage?.name).toBe(GLOBAL_EN_PRODUCT_PAGE.metadata.title);
		expect(webPage?.description).toBe(GLOBAL_EN_PRODUCT_PAGE.metadata.description);
	});

	it("reduces Product to one cinematic hero, one continuous working surface and one close", () => {
		const { document } = renderProduct();
		const product = document.querySelector<HTMLElement>(".site-v1-product");
		expect(product?.querySelectorAll(":scope > section")).toHaveLength(3);
		expect(product?.querySelector(":scope > [data-product-first-viewport]")).not.toBeNull();
		expect(product?.querySelector(":scope > #product-theatre")).not.toBeNull();
		expect(product?.querySelector(":scope > [data-product-closing]")).not.toBeNull();
		expect(product?.querySelector(".site-v1-product-hero__primer, .site-v1-product-method, .site-v1-product-markets, .site-v1-product-human-agent")).toBeNull();
	});

	it("keeps method, markets and Human / Agent inside the same record surface", () => {
		const { document } = renderProduct();
		const theatre = document.querySelector<HTMLElement>("#product-theatre");
		expect(theatre?.querySelector("#how-it-works")).not.toBeNull();
		expect(theatre?.querySelector("#markets-languages")).not.toBeNull();
		expect(theatre?.querySelector("[data-product-evidence-lens] [data-human-agent-lens]")).not.toBeNull();
		expect(theatre?.querySelector<HTMLElement>("[data-workspace-record-inspector]")?.dataset.recordId).toBe(GLOBAL_EN_BUYER_QUESTION.id);
		for (const phrase of GLOBAL_EN_PRODUCT_PAGE.systemWork.sequence) expect(theatre?.textContent).toContain(phrase);
		for (const output of GLOBAL_EN_PRODUCT_PAGE.teamOutput.items) expect(theatre?.textContent).toContain(output);
		for (const value of [GLOBAL_EN_BUYER_QUESTION.market, GLOBAL_EN_BUYER_QUESTION.language, ...GLOBAL_EN_BUYER_QUESTION.observationConditions.channels]) {
			expect(theatre?.textContent).toContain(value);
		}
	});

	it("uses the original responsive Product image and concise approved actions", () => {
		const { html, document } = renderProduct();
		expect(html).toContain("/assets/site-v1/product-observation-room-640.avif");
		expect(html).toContain("/assets/site-v1/product-observation-room-1600.webp");
		expect(html).toMatch(/src="\/assets\/site-v1\/product-observation-room\.png"[^>]+width="1672" height="941"/);
		expect(document.querySelector('[data-product-first-viewport] a[href="/product#product-theatre"]')).not.toBeNull();
		expect(document.querySelector('[data-product-first-viewport] a[href="/contact"]')).not.toBeNull();
		expect(document.querySelector('[data-product-closing] a[href="/casework"]')).not.toBeNull();
		expect(document.querySelector('[data-product-closing] a[href="/contact"]')).not.toBeNull();
	});

	it("places the representative boundary and raw record identities in inspectable disclosure", () => {
		const { document } = renderProduct();
		const theatre = document.querySelector<HTMLElement>("#product-theatre");
		expect(theatre?.textContent).toContain(GLOBAL_EN_BUYER_QUESTION.disclosure.boundary);
		expect(theatre?.querySelector(".site-v1-representative-disclosure")).not.toBeNull();
		const details = theatre?.querySelector<HTMLDetailsElement>("details[data-inspect-record]");
		expect(details?.hasAttribute("open")).toBe(false);
		expect(details?.textContent).toContain(GLOBAL_EN_BUYER_QUESTION.id);
		for (const evidence of GLOBAL_EN_BUYER_QUESTION.evidence) expect(details?.textContent).toContain(evidence.id);
	});
});
