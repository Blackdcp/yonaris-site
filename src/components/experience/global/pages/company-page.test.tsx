// @vitest-environment happy-dom

import { act } from "react";
import type { ComponentType } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { COMPANY_FACTS } from "@/content/public-site/canonical/company-facts";
import { PRODUCT_FACTS } from "@/content/public-site/canonical/product-facts";
import { GLOBAL_EN_COMPANY_PAGE } from "@/content/public-site/global-en/pages/company";
import { buildPageHead } from "@/editions/page-head";
import { Route } from "@/routes/company";
import { getPublicPagePath } from "@/site/route-selectors";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const CompanyRouteComponent = Route.options.component as ComponentType;
const principleLabels = [
	"Why Yonaris exists",
	"Who it is for",
	"Across markets",
	"Human judgement",
	"What Yonaris does not promise",
] as const;
const principleBodies = [
	GLOBAL_EN_COMPANY_PAGE.why,
	GLOBAL_EN_COMPANY_PAGE.audience,
	GLOBAL_EN_COMPANY_PAGE.markets,
	GLOBAL_EN_COMPANY_PAGE.humanJudgement,
	GLOBAL_EN_COMPANY_PAGE.nonPromises,
] as const;

let activeRoot: Root | undefined;
let activeHost: HTMLDivElement | undefined;

function staticDocument() {
	return new DOMParser().parseFromString(renderToStaticMarkup(<CompanyRouteComponent />), "text/html");
}

async function mount(reduced = false) {
	vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
		matches: reduced && query === "(prefers-reduced-motion: reduce)",
		media: query,
		onchange: null,
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		addListener: vi.fn(),
		removeListener: vi.fn(),
		dispatchEvent: vi.fn(() => true),
	}) as MediaQueryList);
	activeHost = document.createElement("div");
	document.body.append(activeHost);
	activeRoot = createRoot(activeHost);
	await act(async () => activeRoot?.render(<CompanyRouteComponent />));
	return activeHost;
}

function aperture(host: ParentNode) {
	const node = host.querySelector<HTMLElement>("[data-company-aperture]");
	if (!node) throw new Error("Company aperture not mounted");
	return node;
}

function principleButton(host: ParentNode, index: number) {
	const node = host.querySelector<HTMLButtonElement>(`button[data-company-select-principle="${index}"]`);
	if (!node) throw new Error(`Company principle control ${index} not found`);
	return node;
}

function activePrinciple(host: ParentNode) {
	const node = host.querySelector<HTMLElement>("[data-company-principle]:not([hidden])");
	if (!node) throw new Error("Active Company principle not found");
	return node;
}

function geometry(host: ParentNode) {
	const mask = host.querySelector<HTMLElement>("[data-company-aperture-mask]");
	const light = host.querySelector<HTMLElement>("[data-company-aperture-light]");
	if (!mask || !light) throw new Error("Company aperture geometry not found");
	return [mask.style.clipPath, light.style.left, light.style.width, light.style.transform].join("|");
}

async function key(button: HTMLButtonElement, value: string) {
	button.focus();
	await act(async () => button.dispatchEvent(new KeyboardEvent("keydown", { key: value, code: value === " " ? "Space" : value, bubbles: true })));
}

afterEach(async () => {
	vi.useRealTimers();
	if (activeRoot) await act(async () => activeRoot?.unmount());
	activeHost?.remove();
	activeRoot = undefined;
	activeHost = undefined;
	vi.restoreAllMocks();
});

describe("English Site 1.0 Company route", () => {
	it("uses the Company shell and exact typed metadata/JSON-LD", () => {
		const document = staticDocument();
		expect(document.querySelector('[data-generation="site-v1"][data-page="company"]')).not.toBeNull();
		expect(document.querySelector('a[href="/company"][aria-current="page"]')).not.toBeNull();
		expect(document.querySelector("h1")?.textContent).toBe(GLOBAL_EN_COMPANY_PAGE.hero.headline);

		const head = (Route.options.head as () => ReturnType<typeof buildPageHead>)();
		expect(head.meta).toContainEqual({ title: GLOBAL_EN_COMPANY_PAGE.metadata.title });
		expect(head.meta).toContainEqual({ name: "description", content: GLOBAL_EN_COMPANY_PAGE.metadata.description });
		const graph = JSON.parse(head.scripts[0].children)["@graph"] as Array<Record<string, unknown>>;
		const webPage = graph.find((node) => node["@type"] === "WebPage");
		expect(webPage?.name).toBe(GLOBAL_EN_COMPANY_PAGE.metadata.title);
		expect(webPage?.description).toBe(GLOBAL_EN_COMPANY_PAGE.metadata.description);
	});

	it("keeps all six approved factual modules readable in SSR without Product, Casework or Agent interaction signatures", () => {
		const document = staticDocument();
		const modules = [...document.querySelectorAll<HTMLElement>("[data-company-module]")];
		expect(modules.map((module) => module.dataset.companyModule)).toEqual([
			"why",
			"audience",
			"markets",
			"human-judgement",
			"non-promises",
			"verified-facts",
		]);
		for (const text of [
			GLOBAL_EN_COMPANY_PAGE.why,
			GLOBAL_EN_COMPANY_PAGE.audience,
			GLOBAL_EN_COMPANY_PAGE.markets,
			GLOBAL_EN_COMPANY_PAGE.humanJudgement,
			GLOBAL_EN_COMPANY_PAGE.nonPromises,
		]) expect(document.body.textContent).toContain(text);
		expect([...document.querySelectorAll("[data-company-principle]")].every((node) => !node.hasAttribute("hidden"))).toBe(true);
		expect(document.querySelector("[data-product-question-workspace], [data-casework-walkthrough], [data-human-agent-lens], [role='tablist']")).toBeNull();
	});

	it("uses only the original responsive Company image and typed principle labels", () => {
		const html = renderToStaticMarkup(<CompanyRouteComponent />);
		const document = new DOMParser().parseFromString(html, "text/html");
		expect(html).toContain("/assets/site-v1/company-light-corridor-640.avif");
		expect(html).toContain("/assets/site-v1/company-light-corridor-1600.webp");
		expect(html).toMatch(/src="\/assets\/site-v1\/company-light-corridor\.png"[^>]+width="1672" height="941"/);
		expect(html).toContain("--company-focal:58% 50%");
		expect(html).toContain("--company-mobile-crop:center");
		expect(html).not.toMatch(/hero-evidence-field|product-observation-room|brand\/site-06|https?:\/\/(?!yonaris\.com)/);
		expect([...document.querySelectorAll("[data-company-principle-controls] button")].map((node) => node.lastChild?.textContent)).toEqual(principleLabels);
		expect((GLOBAL_EN_COMPANY_PAGE as typeof GLOBAL_EN_COMPANY_PAGE & { siteV1?: { aperture?: unknown } }).siteV1?.aperture).toBeDefined();
	});

	it("projects the canonical category, name, domain, contact and privacy facts with manifest-backed routes", () => {
		const document = staticDocument();
		const facts = [...document.querySelectorAll<HTMLElement>("[data-company-fact-id]")];
		expect(facts.map((fact) => fact.dataset.companyFactId)).toEqual([
			PRODUCT_FACTS.category.id,
			COMPANY_FACTS.publicName.id,
			COMPANY_FACTS.officialDomain.id,
			COMPANY_FACTS.contactLabel.id,
			COMPANY_FACTS.privacyLabel.id,
		]);
		expect(facts[0]?.textContent).toContain(PRODUCT_FACTS.category.value["global-en"]);
		expect(facts[1]?.textContent).toContain(COMPANY_FACTS.publicName.value);
		expect(facts[2]?.querySelector(`a[href="${COMPANY_FACTS.officialDomain.value}"]`)).not.toBeNull();
		expect(facts[3]?.querySelector(`a[href="${getPublicPagePath("global-en", "contact")}"]`)).not.toBeNull();
		expect(facts[4]?.querySelector(`a[href="${getPublicPagePath("global-en", "privacy")}"]`)).not.toBeNull();
		for (const fact of facts) {
			expect(fact.textContent).toMatch(/Source/);
			expect(fact.textContent).toMatch(/Scope/);
			expect(fact.textContent).toMatch(/Boundary/);
		}
	});

	it("changes real aperture, mask, light and attached evidence geometry for every principle", async () => {
		const host = await mount();
		const geometries = new Set<string>();
		const evidence = new Set<string>();

		for (let index = 0; index < principleLabels.length; index += 1) {
			await act(async () => principleButton(host, index).click());
			geometries.add(geometry(host));
			const visible = activePrinciple(host);
			const attachedEvidence = visible.querySelector<HTMLElement>("[data-company-attached-evidence]");
			const attachedBoundary = visible.querySelector<HTMLElement>("[data-company-attached-boundary]");
			evidence.add(`${attachedEvidence?.textContent ?? ""}|${attachedBoundary?.textContent ?? ""}`);
			expect(visible.dataset.companyPrinciple).toBe(String(index));
			expect(attachedEvidence?.textContent).toContain(principleBodies[index]);
			expect(attachedBoundary?.textContent?.trim()).not.toBe("");
			expect(visible.querySelector("header")?.textContent).not.toContain(principleBodies[index]);
			expect(host.querySelectorAll("[data-company-principle]:not([hidden])")).toHaveLength(1);
		}

		expect(geometries.size).toBe(5);
		expect(evidence.size).toBe(5);
	});

	it("selects principles independently from pointer, touch, Enter and Space input", async () => {
		const host = await mount();
		await act(async () => principleButton(host, 1).dispatchEvent(new PointerEvent("pointerup", { bubbles: true, pointerType: "mouse" })));
		expect(activePrinciple(host).dataset.companyPrinciple).toBe("1");

		await act(async () => principleButton(host, 2).dispatchEvent(new TouchEvent("touchend", { bubbles: true })));
		expect(activePrinciple(host).dataset.companyPrinciple).toBe("2");

		await key(principleButton(host, 3), "Enter");
		expect(activePrinciple(host).dataset.companyPrinciple).toBe("3");

		await key(principleButton(host, 4), " ");
		expect(activePrinciple(host).dataset.companyPrinciple).toBe("4");
	});

	it("moves focus and selection in both directions with directional keys", async () => {
		const host = await mount();
		await key(principleButton(host, 0), "ArrowRight");
		expect(activePrinciple(host).dataset.companyPrinciple).toBe("1");
		expect(document.activeElement).toBe(principleButton(host, 1));
		await key(principleButton(host, 1), "ArrowDown");
		expect(activePrinciple(host).dataset.companyPrinciple).toBe("2");
		await key(principleButton(host, 2), "ArrowLeft");
		expect(activePrinciple(host).dataset.companyPrinciple).toBe("1");
		await key(principleButton(host, 1), "ArrowUp");
		expect(activePrinciple(host).dataset.companyPrinciple).toBe("0");
	});

	it("has no autoplay and keeps all five direct controls usable with reduced motion", async () => {
		vi.useFakeTimers();
		const host = await mount(true);
		expect(aperture(host).dataset.motionPreference).toBe("reduced");
		const initial = activePrinciple(host).dataset.companyPrinciple;
		await act(async () => vi.advanceTimersByTime(180_000));
		expect(activePrinciple(host).dataset.companyPrinciple).toBe(initial);
		for (let index = 0; index < principleLabels.length; index += 1) {
			await act(async () => principleButton(host, index).click());
			expect(activePrinciple(host).dataset.companyPrinciple).toBe(String(index));
		}
	});

	it("closes with low-friction Product and Contact paths and makes no unsupported organisation claims", () => {
		const document = staticDocument();
		const closing = document.querySelector<HTMLElement>("[data-company-closing]");
		expect(closing?.querySelector(`a[href="${getPublicPagePath("global-en", "product")}"]`)?.textContent).toBe(GLOBAL_EN_COMPANY_PAGE.actions[0].label);
		expect(closing?.querySelector(`a[href="${getPublicPagePath("global-en", "contact")}"]`)?.textContent).toBe(GLOBAL_EN_COMPANY_PAGE.actions[1].label);
		expect(document.body.textContent).toContain(GLOBAL_EN_COMPANY_PAGE.nonPromises);
		expect(document.body.textContent).not.toMatch(/founder|leadership team|headquarters|street address|legal entity|award|certification|investor|funding|guarantees? (?:ranking|citation|result)|will autonomously|autonomously executes/i);
	});
});
