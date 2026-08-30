// @vitest-environment happy-dom

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PRODUCT_FACTS } from "@/content/public-site/canonical/product-facts";
import { GLOBAL_EN_HOME_PAGE } from "@/content/public-site/global-en/pages/home";
import { GLOBAL_EN_HUMAN_AGENT_PAGE } from "@/content/public-site/global-en/pages/human-agent";
import { EvidenceLens, type HumanAgentLayer } from "./evidence-lens";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const fact = PRODUCT_FACTS.category;
const agentHref = `/agent#${fact.id}`;
let activeRoot: Root | undefined;
let activeHost: HTMLDivElement | undefined;

function lens() {
	return (
		<EvidenceLens
			copy={GLOBAL_EN_HUMAN_AGENT_PAGE}
			edition="global-en"
			fact={fact}
			ringLabels={GLOBAL_EN_HOME_PAGE.humanAgent.layers}
			agentHref={agentHref}
		/>
	);
}

function staticDocument() {
	return new DOMParser().parseFromString(renderToStaticMarkup(lens()), "text/html");
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
	await act(async () => activeRoot?.render(lens()));
	return activeHost;
}

function root(host: ParentNode) {
	const node = host.querySelector<HTMLElement>("[data-human-agent-lens]");
	if (!node) throw new Error("Evidence lens not mounted");
	return node;
}

function control(host: ParentNode, layer: HumanAgentLayer) {
	const node = host.querySelector<HTMLButtonElement>(`button[data-lens-select-layer="${layer}"]`);
	if (!node) throw new Error(`Missing ${layer} ring control`);
	return node;
}

function stateSignature(host: ParentNode) {
	const stage = root(host);
	const optics = host.querySelector<HTMLElement>("[data-lens-optics]");
	if (!optics) throw new Error("Missing optical geometry");
	return [
		stage.dataset.v1State,
		stage.dataset.lensGeometry,
		stage.dataset.lensDepth,
		stage.dataset.lensFocalMask,
		stage.dataset.lensDensity,
		optics.style.getPropertyValue("--lens-outer-scale"),
		optics.style.getPropertyValue("--lens-middle-scale"),
		optics.style.getPropertyValue("--lens-inner-scale"),
		optics.style.getPropertyValue("--lens-focal-x"),
		optics.style.getPropertyValue("--lens-focal-y"),
	].join("|");
}

async function key(button: HTMLButtonElement, value: string) {
	button.focus();
	await act(async () => button.dispatchEvent(new KeyboardEvent("keydown", {
		key: value,
		code: value === " " ? "Space" : value,
		bubbles: true,
	})));
}

afterEach(async () => {
	vi.useRealTimers();
	if (activeRoot) await act(async () => activeRoot?.unmount());
	activeHost?.remove();
	activeRoot = undefined;
	activeHost = undefined;
	vi.restoreAllMocks();
});

describe("Human / Agent evidence lens", () => {
	it("renders three directly operable spatial rings and every projection in SSR", () => {
		const document = staticDocument();
		const controls = [...document.querySelectorAll<HTMLButtonElement>("[data-lens-ring-control]")];
		const projections = [...document.querySelectorAll<HTMLElement>("[data-human-agent-projection]")];

		expect(controls).toHaveLength(3);
		expect(controls.map((button) => button.tagName)).toEqual(["BUTTON", "BUTTON", "BUTTON"]);
		expect(controls.map((button) => button.querySelector("strong")?.textContent)).toEqual([...GLOBAL_EN_HOME_PAGE.humanAgent.layers]);
		expect(controls.map((button) => button.dataset.lensRing)).toEqual(["outer", "middle", "inner"]);
		expect(projections.map((projection) => projection.dataset.humanAgentProjection)).toEqual(["human", "evidence", "agent"]);
		expect(projections.every((projection) => !projection.hasAttribute("hidden"))).toBe(true);
		expect(document.querySelector("[role='tablist'], [role='tab'], [role='application']")).toBeNull();
	});

	it("keeps the identical canonical claim and attachment fields on every representation", () => {
		const document = staticDocument();
		const projections = [...document.querySelectorAll<HTMLElement>("[data-human-agent-projection]")];
		for (const projection of projections) {
			expect(projection.dataset.factId).toBe(fact.id);
			expect(projection.textContent).toContain(fact.value["global-en"]);
			expect(projection.textContent).toContain(fact.source.id);
			expect(projection.textContent).toContain(fact.source.label["global-en"]);
			expect(projection.textContent).toContain(fact.scope["global-en"]);
			expect(projection.textContent).toContain(fact.lastReviewed);
			expect(projection.textContent).toContain(fact.boundary["global-en"]);
		}
		expect(new Set(projections.map((projection) => projection.dataset.factId))).toEqual(new Set([fact.id]));
	});

	it("uses distinct Human, Evidence and Agent information structures from typed copy", () => {
		const document = staticDocument();
		const human = document.querySelector<HTMLElement>("[data-human-agent-projection='human']");
		const evidence = document.querySelector<HTMLElement>("[data-human-agent-projection='evidence']");
		const agent = document.querySelector<HTMLElement>("[data-human-agent-projection='agent']");

		expect([...human?.querySelectorAll("[data-human-field]") ?? []].map((node) => node.querySelector("h3")?.textContent)).toEqual([...GLOBAL_EN_HUMAN_AGENT_PAGE.humanViewLabels]);
		expect([...evidence?.querySelectorAll("[data-evidence-field]") ?? []].map((node) => node.querySelector("dt")?.textContent)).toEqual([...GLOBAL_EN_HUMAN_AGENT_PAGE.evidenceViewLabels]);
		expect([...agent?.querySelectorAll("[data-agent-field]") ?? []].map((node) => node.querySelector("dt")?.textContent)).toEqual([...GLOBAL_EN_HUMAN_AGENT_PAGE.agentViewLabels]);
		expect(human?.querySelectorAll("[data-human-field]")).toHaveLength(3);
		expect(evidence?.querySelectorAll("[data-evidence-field]")).toHaveLength(5);
		expect(agent?.querySelectorAll("[data-agent-field]")).toHaveLength(6);
		expect(agent?.querySelector("code")?.textContent).toContain(fact.id);
	});

	it("changes geometry, depth, focal mask, attachment and density for every selected layer", async () => {
		const host = await mount();
		const signatures = new Set<string>();
		for (const layer of ["human", "evidence", "agent"] as const) {
			await act(async () => control(host, layer).click());
			signatures.add(stateSignature(host));
			expect(root(host).dataset.v1State).toBe(layer);
			expect(control(host, layer).getAttribute("aria-pressed")).toBe("true");
			expect(host.querySelector(`[data-human-agent-projection="${layer}"]`)?.getAttribute("data-active")).toBe("true");
			expect(host.querySelector(`[data-lens-attachment="${layer}"]`)?.getAttribute("data-active")).toBe("true");
		}
		expect(signatures.size).toBe(3);
	});

	it("uses the existing particles to reveal the selected layer rather than as a fixed decoration", async () => {
		const host = await mount();
		const optics = host.querySelector<HTMLElement>("[data-lens-optics]");
		expect(host.querySelectorAll(".site-v1-evidence-lens__particles i")).toHaveLength(12);
		const particleSignatures = new Set<string>();
		for (const layer of ["human", "evidence", "agent"] as const) {
			await act(async () => control(host, layer).click());
			particleSignatures.add([
				optics?.style.getPropertyValue("--lens-particle-radius"),
				optics?.style.getPropertyValue("--lens-particle-opacity"),
			].join("|"));
		}
		expect(particleSignatures.size).toBe(3);
	});

	it("selects layers independently from pointer, touch, Enter and Space input", async () => {
		const host = await mount();
		await act(async () => control(host, "evidence").dispatchEvent(new PointerEvent("pointerup", { bubbles: true, pointerType: "mouse" })));
		expect(root(host).dataset.v1State).toBe("evidence");
		await act(async () => control(host, "agent").dispatchEvent(new TouchEvent("touchend", { bubbles: true })));
		expect(root(host).dataset.v1State).toBe("agent");
		await key(control(host, "human"), "Enter");
		expect(root(host).dataset.v1State).toBe("human");
		await key(control(host, "agent"), " ");
		expect(root(host).dataset.v1State).toBe("agent");
	});

	it("moves focus and selection forward, backward and across wrap boundaries", async () => {
		const host = await mount();
		await key(control(host, "human"), "ArrowRight");
		expect(root(host).dataset.v1State).toBe("evidence");
		expect(document.activeElement).toBe(control(host, "evidence"));
		await key(control(host, "evidence"), "ArrowDown");
		expect(root(host).dataset.v1State).toBe("agent");
		await key(control(host, "agent"), "ArrowLeft");
		expect(root(host).dataset.v1State).toBe("evidence");
		await key(control(host, "evidence"), "ArrowUp");
		expect(root(host).dataset.v1State).toBe("human");
		await key(control(host, "human"), "ArrowLeft");
		expect(root(host).dataset.v1State).toBe("agent");
		await key(control(host, "agent"), "ArrowRight");
		expect(root(host).dataset.v1State).toBe("human");
	});

	it("has no autoplay and preserves every direct state under reduced motion", async () => {
		vi.useFakeTimers();
		const host = await mount(true);
		expect(root(host).dataset.motionPreference).toBe("reduced");
		const initial = root(host).dataset.v1State;
		await act(async () => vi.advanceTimersByTime(180_000));
		expect(root(host).dataset.v1State).toBe(initial);
		for (const layer of ["human", "evidence", "agent"] as const) {
			await act(async () => control(host, layer).click());
			expect(root(host).dataset.v1State).toBe(layer);
		}
	});

	it("keeps the explicit discovery boundary and only live direct record links", () => {
		const document = staticDocument();
		const unqualifiedClaims = (document.body.textContent ?? "")
			.split(fact.boundary["global-en"]).join("")
			.split(GLOBAL_EN_HUMAN_AGENT_PAGE.boundary).join("");
		expect(document.body.textContent).toContain(GLOBAL_EN_HUMAN_AGENT_PAGE.boundary);
		expect(document.querySelector(`a[href="${agentHref}"]`)).not.toBeNull();
		expect(document.querySelector('a[href="/agent/human-agent"]')).toBeNull();
		expect(unqualifiedClaims).not.toMatch(/(?:guarantees|will guarantee) (?:crawling|retrieval|ranking|recommendation|citation)/i);
	});
});
