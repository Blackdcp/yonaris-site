// @vitest-environment happy-dom

import type { ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { GLOBAL_EN_BUYER_QUESTION } from "@/content/public-site/global-en/buyer-question";
import { GLOBAL_EN_PRODUCT_PAGE } from "@/content/public-site/global-en/pages/product";
import { buildPageHead } from "@/editions/page-head";
import { Route } from "@/routes/product";

const ProductRouteComponent = Route.options.component as ComponentType;

describe("English Site 1.0 Product route", () => {
	it("uses the approved Product shell, copy record and central route metadata", () => {
		const html = renderToStaticMarkup(<ProductRouteComponent />);
		const document = new DOMParser().parseFromString(html, "text/html");
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

	it("answers input, system work, team use and later review before interaction", () => {
		const html = renderToStaticMarkup(<ProductRouteComponent />);
		const document = new DOMParser().parseFromString(html, "text/html");
		const firstViewport = document.querySelector<HTMLElement>("[data-product-first-viewport]");
		expect(firstViewport).not.toBeNull();
		expect(firstViewport?.textContent).toContain(GLOBAL_EN_PRODUCT_PAGE.input.headline);
		expect(firstViewport?.textContent).toContain(GLOBAL_EN_PRODUCT_PAGE.systemWork.sequence[0]);
		expect(firstViewport?.textContent).toContain(GLOBAL_EN_PRODUCT_PAGE.systemWork.sequence[3]);
		expect(firstViewport?.textContent).toContain(GLOBAL_EN_PRODUCT_PAGE.teamOutput.headline);
		expect(firstViewport?.textContent).toContain(GLOBAL_EN_PRODUCT_PAGE.systemWork.sequence[5]);
		expect(firstViewport?.textContent).toContain(GLOBAL_EN_BUYER_QUESTION.review.unchanged[0]?.statement);
	});

	it("keeps every typed system phrase in an editorial field instead of a numbered six-cell flow", () => {
		const html = renderToStaticMarkup(<ProductRouteComponent />);
		const document = new DOMParser().parseFromString(html, "text/html");
		const method = document.querySelector<HTMLElement>("#how-it-works");
		expect(method).not.toBeNull();
		expect(method?.querySelector("ol, li, [role='list']")).toBeNull();
		const phrases = [...(method?.querySelectorAll(".site-v1-product-method__field > p") ?? [])].map((node) => node.textContent);
		expect(phrases).toEqual([...GLOBAL_EN_PRODUCT_PAGE.systemWork.sequence]);
		for (const inputLabel of GLOBAL_EN_PRODUCT_PAGE.input.labels) expect(method?.textContent).toContain(inputLabel);
		expect(method?.textContent).not.toMatch(/01\s*Observe|02\s*Compare|03\s*Trace|04\s*Put|05\s*Record|06\s*Review/);
	});

	it("uses the original responsive Product image and exposes the three canonical anchors", () => {
		const html = renderToStaticMarkup(<ProductRouteComponent />);
		expect(html).toContain("/assets/site-v1/product-observation-room-640.avif");
		expect(html).toContain("/assets/site-v1/product-observation-room-1600.webp");
		expect(html).toMatch(/src="\/assets\/site-v1\/product-observation-room\.png"[^>]+width="1672" height="941"/);
		for (const anchor of ["product-theatre", "how-it-works", "markets-languages"]) expect(html).toContain(`id="${anchor}"`);
	});

	it("treats markets and language as attributes of the same record and closes with concise bridges", () => {
		const html = renderToStaticMarkup(<ProductRouteComponent />);
		const document = new DOMParser().parseFromString(html, "text/html");
		const markets = document.querySelector<HTMLElement>("#markets-languages");
		expect(markets?.dataset.recordId).toBe(GLOBAL_EN_BUYER_QUESTION.id);
		for (const value of [GLOBAL_EN_BUYER_QUESTION.market, GLOBAL_EN_BUYER_QUESTION.language, ...GLOBAL_EN_BUYER_QUESTION.observationConditions.channels]) {
			expect(markets?.textContent).toContain(value);
		}
		const bridge = document.querySelector<HTMLElement>("[data-human-agent-bridge='product']");
		expect(bridge?.textContent).toContain(GLOBAL_EN_PRODUCT_PAGE.humanAgent.headline);
		expect(bridge?.dataset.factId).toBe("yonaris.category.ai-native-martech");
		expect(bridge?.querySelectorAll("[data-bridge-layer]")).toHaveLength(3);
		expect(bridge?.querySelector('a[href="/human-agent"]')).not.toBeNull();
		expect(bridge?.querySelector('a[href="/agent#yonaris.category.ai-native-martech"]')).not.toBeNull();
		expect(bridge?.querySelector("[data-human-agent-lens], button")).toBeNull();
		expect(document.querySelector('[data-product-closing] a[href="/casework"]')).not.toBeNull();
		expect(document.querySelector('[data-product-closing] a[href="/contact"]')).not.toBeNull();
	});

	it("places a readable representative disclosure next to the workspace in SSR", () => {
		const html = renderToStaticMarkup(<ProductRouteComponent />);
		const document = new DOMParser().parseFromString(html, "text/html");
		const theatre = document.querySelector<HTMLElement>("#product-theatre");
		expect(theatre?.textContent).toContain(GLOBAL_EN_BUYER_QUESTION.disclosure.boundary);
		expect(theatre?.querySelector(".site-v1-representative-disclosure")).not.toBeNull();
	});
});
