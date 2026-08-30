// @vitest-environment happy-dom

import type { ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PRODUCT_FACTS } from "@/content/public-site/canonical/product-facts";
import { GLOBAL_EN_HOME_PAGE } from "@/content/public-site/global-en/pages/home";
import { GLOBAL_EN_HUMAN_AGENT_PAGE } from "@/content/public-site/global-en/pages/human-agent";
import { buildPageHead } from "@/editions/page-head";
import { Route } from "@/routes/human-agent";
import { HumanAgentPage } from "./human-agent-page";

const HumanAgentRouteComponent = Route.options.component as ComponentType;
const fact = PRODUCT_FACTS.category;

function staticDocument() {
	return new DOMParser().parseFromString(renderToStaticMarkup(<HumanAgentRouteComponent />), "text/html");
}

describe("English Site 1.0 Human / Agent route", () => {
	it("uses the dedicated Site 1.0 shell, page assembler and exact typed copy", () => {
		const document = staticDocument();
		expect(Route.options.component).toBe(HumanAgentPage);
		expect(document.querySelector('[data-generation="site-v1"][data-page="human-agent"]')).not.toBeNull();
		expect(document.querySelector('a[href="/human-agent"][aria-current="page"]')).not.toBeNull();
		expect(document.querySelector("h1")?.textContent).toBe(GLOBAL_EN_HUMAN_AGENT_PAGE.hero.headline);
		expect(document.body.textContent).toContain(GLOBAL_EN_HUMAN_AGENT_PAGE.hero.body);
		expect(document.body.textContent).toContain(GLOBAL_EN_HUMAN_AGENT_PAGE.sharedRecordRule);
		for (const text of [
			...GLOBAL_EN_HUMAN_AGENT_PAGE.transformationLabels,
			...GLOBAL_EN_HUMAN_AGENT_PAGE.humanViewLabels,
			...GLOBAL_EN_HUMAN_AGENT_PAGE.evidenceViewLabels,
			...GLOBAL_EN_HUMAN_AGENT_PAGE.agentViewLabels,
			...GLOBAL_EN_HOME_PAGE.humanAgent.layers,
			GLOBAL_EN_HUMAN_AGENT_PAGE.boundary,
		]) expect(document.body.textContent).toContain(text);
	});

	it("places the directly operable lens in the first viewport and keeps all layers in no-JS HTML", () => {
		const document = staticDocument();
		const firstViewport = document.querySelector<HTMLElement>("[data-human-agent-first-viewport]");
		const lens = firstViewport?.querySelector<HTMLElement>("[data-human-agent-lens]");
		expect(firstViewport).not.toBeNull();
		expect(lens).not.toBeNull();
		expect(firstViewport?.querySelector("h1")).not.toBeNull();
		expect(lens?.dataset.factId).toBe(fact.id);
		expect(lens?.querySelectorAll("button[data-lens-ring-control]")).toHaveLength(3);
		expect(lens?.querySelectorAll("[data-human-agent-projection]")).toHaveLength(3);
		expect([...lens?.querySelectorAll<HTMLElement>("[data-human-agent-projection]") ?? []].every((node) => !node.hidden)).toBe(true);
		expect(document.querySelectorAll("main")).toHaveLength(1);
	});

	it("links the canonical category fact to the live Agent anchor and low-friction contact route", () => {
		const document = staticDocument();
		const actions = document.querySelector<HTMLElement>("[data-human-agent-actions]");
		expect(actions?.querySelector(`a[href="/agent#${fact.id}"]`)?.textContent).toBe(GLOBAL_EN_HUMAN_AGENT_PAGE.actions[0].label);
		expect(actions?.querySelector('a[href="/contact"]')?.textContent).toBe(GLOBAL_EN_HUMAN_AGENT_PAGE.actions[1].label);
		expect(document.querySelector('a[href="/agent/human-agent"]')).toBeNull();
	});

	it("emits exact route metadata and Human / Agent WebPage structured data", () => {
		const head = (Route.options.head as () => ReturnType<typeof buildPageHead>)();
		expect(head.meta).toContainEqual({ title: GLOBAL_EN_HUMAN_AGENT_PAGE.metadata.title });
		expect(head.meta).toContainEqual({ name: "description", content: GLOBAL_EN_HUMAN_AGENT_PAGE.metadata.description });
		expect(head.links).toContainEqual({ rel: "canonical", href: "https://yonaris.com/human-agent" });
		const graph = JSON.parse(head.scripts[0].children)["@graph"] as Array<Record<string, unknown>>;
		const webPage = graph.find((node) => node["@type"] === "WebPage");
		expect(webPage?.["@id"]).toBe("https://yonaris.com/human-agent#webpage");
		expect(webPage?.url).toBe("https://yonaris.com/human-agent");
		expect(webPage?.name).toBe(GLOBAL_EN_HUMAN_AGENT_PAGE.metadata.title);
		expect(webPage?.description).toBe(GLOBAL_EN_HUMAN_AGENT_PAGE.metadata.description);
	});

	it("renders only canonical fact fields and the explicit unsupported-claim guardrail", () => {
		const document = staticDocument();
		const unqualifiedClaims = (document.body.textContent ?? "")
			.split(fact.boundary["global-en"]).join("")
			.split(GLOBAL_EN_HUMAN_AGENT_PAGE.boundary).join("");
		expect(document.body.textContent).toContain(fact.value["global-en"]);
		expect(document.body.textContent).toContain(fact.id);
		expect(document.body.textContent).toContain(fact.source.id);
		expect(document.body.textContent).toContain(fact.source.label["global-en"]);
		expect(document.body.textContent).toContain(fact.scope["global-en"]);
		expect(document.body.textContent).toContain(fact.lastReviewed);
		expect(document.body.textContent).toContain(fact.boundary["global-en"]);
		expect(document.body.textContent).toContain(GLOBAL_EN_HUMAN_AGENT_PAGE.boundary);
		expect(unqualifiedClaims).not.toMatch(/guaranteed (?:crawl|retrieval|ranking|recommendation|citation)|will (?:crawl|retrieve|rank|recommend|cite)/i);
	});
});
