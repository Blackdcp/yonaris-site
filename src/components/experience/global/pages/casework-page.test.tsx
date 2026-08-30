// @vitest-environment happy-dom

import type { ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { GLOBAL_EN_BUYER_QUESTION } from "@/content/public-site/global-en/buyer-question";
import { GLOBAL_EN_CASEWORK_PAGE } from "@/content/public-site/global-en/pages/casework";
import { buildPageHead } from "@/editions/page-head";
import { Route } from "@/routes/casework";
import { CaseworkPage } from "./casework-page";

const CaseworkRouteComponent = Route.options.component as ComponentType;

describe("English Site 1.0 Casework route", () => {
	it("uses the Casework shell, dedicated page assembler and central metadata/JSON-LD", () => {
		const html = renderToStaticMarkup(<CaseworkRouteComponent />);
		const document = new DOMParser().parseFromString(html, "text/html");

		expect(Route.options.component).toBe(CaseworkPage);
		expect(document.querySelector('[data-generation="site-v1"][data-page="casework"]')).not.toBeNull();
		expect(document.querySelectorAll("main")).toHaveLength(1);
		expect(document.querySelector('a[href="/casework"][aria-current="page"]')).not.toBeNull();
		expect(document.querySelector("h1")?.textContent).toBe(GLOBAL_EN_CASEWORK_PAGE.hero.headline);
		const head = (Route.options.head as () => ReturnType<typeof buildPageHead>)();
		expect(head.meta).toContainEqual({ title: GLOBAL_EN_CASEWORK_PAGE.metadata.title });
		expect(head.meta).toContainEqual({ name: "description", content: GLOBAL_EN_CASEWORK_PAGE.metadata.description });
		const graph = JSON.parse(head.scripts[0].children)["@graph"] as Array<Record<string, unknown>>;
		const webPage = graph.find((node) => node["@type"] === "WebPage");
		expect(webPage?.name).toBe(GLOBAL_EN_CASEWORK_PAGE.metadata.title);
		expect(webPage?.description).toBe(GLOBAL_EN_CASEWORK_PAGE.metadata.description);
	});

	it("establishes the situation, exact question and representative boundary in the first viewport", () => {
		const html = renderToStaticMarkup(<CaseworkRouteComponent />);
		const document = new DOMParser().parseFromString(html, "text/html");
		const viewport = document.querySelector<HTMLElement>("[data-casework-first-viewport]");

		expect(viewport).not.toBeNull();
		expect(viewport?.textContent).toContain(GLOBAL_EN_CASEWORK_PAGE.walkthrough[0].body);
		expect(viewport?.textContent).toContain(GLOBAL_EN_BUYER_QUESTION.question);
		expect(viewport?.textContent).toContain(GLOBAL_EN_CASEWORK_PAGE.hero.disclosure);
		expect(viewport?.dataset.recordId).toBe(GLOBAL_EN_BUYER_QUESTION.id);
	});

	it("renders the one continuous timeline and concise typed closing without Product or Home interaction signatures", () => {
		const html = renderToStaticMarkup(<CaseworkRouteComponent />);
		const document = new DOMParser().parseFromString(html, "text/html");

		expect(document.querySelectorAll("[data-casework-walkthrough]")).toHaveLength(1);
		expect(document.querySelector("[data-product-question-workspace], [data-home-answer-field], [role='tablist']")).toBeNull();
		const closing = document.querySelector<HTMLElement>("[data-casework-closing]");
		expect(closing?.textContent).toContain(GLOBAL_EN_CASEWORK_PAGE.closing.headline);
		expect(closing?.textContent).toContain(GLOBAL_EN_CASEWORK_PAGE.closing.body);
		expect(closing?.querySelector('a[href="/contact"]')?.textContent).toBe(GLOBAL_EN_CASEWORK_PAGE.closing.action.label);
	});
});
