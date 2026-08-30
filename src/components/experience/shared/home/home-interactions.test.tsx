// @vitest-environment happy-dom

import { act, type ComponentType, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GLOBAL_EN_BUYER_QUESTION } from "@/content/public-site/global-en/buyer-question";
import { GLOBAL_EN_HOME_PAGE } from "@/content/public-site/global-en/pages/home";
import { Route } from "@/routes/index";
import { BuyerQuestionProvider } from "../buyer-question/buyer-question-provider";
import { HomeAnswerField } from "./home-answer-field";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const HomeRouteComponent = Route.options.component as ComponentType;
const RECORD_ID = "yonaris.buyer-question.global-en.enterprise-analytics-markets.v1";

let host: HTMLDivElement;
let root: Root;

beforeEach(async () => {
	host = document.createElement("div");
	document.body.append(host);
	root = createRoot(host);
	await act(async () => root.render(<HomeRouteComponent />));
});

afterEach(async () => {
	vi.useRealTimers();
	await act(async () => root.unmount());
	host.remove();
	vi.restoreAllMocks();
});

function button(label: string): HTMLButtonElement {
	const match = [...host.querySelectorAll<HTMLButtonElement>("button")].find((candidate) =>
		(candidate.getAttribute("aria-label") ?? candidate.textContent?.trim()) === label,
	);
	if (!match) throw new Error(`Button not found: ${label}`);
	return match;
}

async function remount(node: ReactNode) {
	await act(async () => root.unmount());
	root = createRoot(host);
	await act(async () => root.render(node));
}

describe("mounted Home answer field", () => {
	it("renders pause and resume controls from injected typed Home copy", async () => {
		await remount(
			<BuyerQuestionProvider record={GLOBAL_EN_BUYER_QUESTION}>
				<HomeAnswerField
					copy={GLOBAL_EN_HOME_PAGE.heroEvent}
					disclosure={GLOBAL_EN_HOME_PAGE.casework.disclosure}
					motionLabels={{ pauseScene: "Freeze field sentinel", resumeScene: "Continue field sentinel" }}
				/>
			</BuyerQuestionProvider>,
		);

		const pause = button("Freeze field sentinel");
		await act(async () => pause.click());
		expect(button("Continue field sentinel")).toBeTruthy();
	});

	it("keeps the motion control in flow after the disclosure", () => {
		const field = host.querySelector<HTMLElement>("[data-home-answer-field]");
		const disclosure = field?.querySelector<HTMLElement>(".site-v1-representative-disclosure");
		const orchestrator = field?.closest<HTMLElement>(".site-v1-scene-orchestrator");
		const control = orchestrator?.querySelector<HTMLButtonElement>("[data-site-v1-motion-control]");
		const flow = control?.parentElement;
		if (!field || !disclosure || !orchestrator || !control || !flow) throw new Error("Answer-field motion controls not mounted");

		expect(orchestrator.dataset.controlPlacement).toBe("flow");
		expect(flow.classList.contains("site-v1-scene-orchestrator__flow-control")).toBe(true);
		expect(disclosure.compareDocumentPosition(flow) & Node.DOCUMENT_POSITION_FOLLOWING).not.toBe(0);
	});

	it.each([
		{ input: "touch", createEvent: () => new TouchEvent("touchstart", { bubbles: true }) },
		{ input: "pointer", createEvent: () => new PointerEvent("pointerdown", { bubbles: true }) },
		{ input: "Enter", createEvent: () => new KeyboardEvent("keydown", { key: "Enter", bubbles: true }) },
		{ input: "Space", createEvent: () => new KeyboardEvent("keydown", { key: " ", code: "Space", bubbles: true }) },
	])("lets $input input independently take control of a playing scene", async ({ createEvent }) => {
		const field = host.querySelector<HTMLElement>("[data-home-answer-field]");
		const orchestrator = field?.closest<HTMLElement>(".site-v1-scene-orchestrator");
		if (!field || !orchestrator) throw new Error("Home answer field not mounted");
		expect(orchestrator.dataset.motionState).toBe("playing");
		expect(orchestrator.dataset.motionPaused).toBe("false");
		expect(field.dataset.v1State).toBe("answer.ai");

		const search = button("Search");
		await act(async () => search.dispatchEvent(createEvent()));

		expect(field.dataset.v1State).toBe("answer.ai");
		expect(orchestrator.dataset.motionState).toBe("controlled");
		expect(orchestrator.dataset.motionPaused).toBe("true");
	});

	it("honors reduced motion while keeping direct channel controls usable", async () => {
		await act(async () => root.unmount());
		vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
			matches: query === "(prefers-reduced-motion: reduce)",
			media: query,
			onchange: null,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			addListener: vi.fn(),
			removeListener: vi.fn(),
			dispatchEvent: vi.fn(() => true),
		}) as MediaQueryList);
		root = createRoot(host);
		await act(async () => root.render(<HomeRouteComponent />));

		const field = host.querySelector<HTMLElement>("[data-home-answer-field]");
		const orchestrator = field?.closest<HTMLElement>(".site-v1-scene-orchestrator");
		if (!field || !orchestrator) throw new Error("Reduced-motion answer field not mounted");
		expect(orchestrator.dataset.motionState).toBe("reduced");
		expect(orchestrator.dataset.motionPaused).toBe("true");
		expect(orchestrator.querySelector("[data-site-v1-motion-control]")).toBeNull();

		await act(async () => button("Search").click());
		expect(field.dataset.v1State).toBe("answer.search");
	});

	it("projects a distinct canonical reason and evidence trace for every channel", async () => {
		const field = host.querySelector<HTMLElement>("[data-home-answer-field]");
		if (!field) throw new Error("Home answer field not mounted");
		const cases = [
			{
				label: "AI answers",
				state: "answer.ai",
				reasons: ["reason.alternative-a.included", "reason.your-company.excluded"],
				evidence: ["evidence.alternative-a.relationship", "evidence.your-company.capability"],
			},
			{
				label: "Search",
				state: "answer.search",
				reasons: ["reason.search.alternative-a.source", "reason.search.your-company.context-missing"],
				evidence: ["evidence.search.alternative-a.source", "evidence.search.your-company.result"],
			},
			{
				label: "Editorial & reviews",
				state: "answer.editorial",
				reasons: ["reason.editorial.alternative-a.context", "reason.editorial.your-company.broad"],
				evidence: ["evidence.editorial.alternative-a.context", "evidence.editorial.your-company.description"],
			},
			{
				label: "Company-owned content",
				state: "answer.company-owned",
				reasons: ["reason.company-owned.your-company.context-missing"],
				evidence: ["evidence.company-owned.your-company.capability"],
			},
		] as const;

		for (const scenario of cases) {
			await act(async () => button(scenario.label).click());
			expect(field.dataset.v1State).toBe(scenario.state);
			expect(field.querySelectorAll("[data-comparison-reason]")).toHaveLength(scenario.reasons.length);
			expect([...field.querySelectorAll<HTMLElement>('[data-comparison-reason][data-active="true"]')].map((node) => node.dataset.comparisonReason)).toEqual(scenario.reasons);
			await act(async () => button("Trace the reason").click());
			expect([...field.querySelectorAll<HTMLElement>("[data-evidence-trace] [data-evidence-id]")].map((node) => node.dataset.evidenceId)).toEqual(scenario.evidence);
		}
	});

	it("changes the real channel answer and attached reason while preserving the buyer question", async () => {
		const field = host.querySelector<HTMLElement>("[data-home-answer-field]");
		if (!field) throw new Error("Home answer field not mounted");
		const question = field.querySelector<HTMLElement>("[data-buyer-question]")?.textContent;
		expect(field.dataset.recordId).toBe(RECORD_ID);
		expect(field.dataset.v1State).toBe("answer.ai");
		expect(field.textContent).toContain("Alternative A was recommended for documented local-market support");

		await act(async () => button("Company-owned content").click());

		expect(field.dataset.recordId).toBe(RECORD_ID);
		expect(field.dataset.v1State).toBe("answer.company-owned");
		expect(field.querySelector<HTMLElement>("[data-buyer-question]")?.textContent).toBe(question);
		expect(field.querySelector<HTMLElement>("[data-active-answer]")?.textContent).toContain(
			"stated the capability, but did not state the conditions",
		);
		expect(field.querySelectorAll('[data-comparison-reason][data-active="true"]')).toHaveLength(1);
		expect(field.querySelector<HTMLElement>('[data-comparison-reason][data-active="true"]')?.textContent).toContain("Your company");
	});

	it("activates the next channel from a real ArrowRight keyboard event", async () => {
		const first = button("AI answers");
		first.focus();
		await act(async () => first.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })));
		const search = button("Search");
		expect(document.activeElement).toBe(search);
		expect(search.getAttribute("aria-selected")).toBe("true");
		expect(host.querySelector<HTMLElement>("[data-home-answer-field]")?.dataset.v1State).toBe("answer.search");
	});

	it("opens the evidence trace attached to the selected answer", async () => {
		await act(async () => button("Search").click());
		const trace = button("Trace the reason");
		expect(trace.getAttribute("aria-expanded")).toBe("false");
		await act(async () => trace.click());
		expect(trace.getAttribute("aria-expanded")).toBe("true");
		const evidence = host.querySelector<HTMLElement>("[data-evidence-trace]");
		expect(evidence?.hidden).toBe(false);
		expect(evidence?.textContent).toContain("Source attached");
		expect(evidence?.textContent).toContain("Yonaris representative search walkthrough");
	});
});

describe("mounted five-view stable record", () => {
	it("transforms central record geometry through keyboard input without changing identity", async () => {
		const preview = host.querySelector<HTMLElement>("[data-product-record-preview]");
		if (!preview) throw new Error("Product record preview not mounted");
		expect(preview.dataset.recordId).toBe(RECORD_ID);
		expect(preview.dataset.v1State).toBe("buyer-question");
		expect(preview.querySelector("[data-active-record-view] blockquote")).not.toBeNull();

		const first = button("What buyers ask");
		first.focus();
		await act(async () => first.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true })));

		const last = button("What changed afterwards");
		expect(document.activeElement).toBe(last);
		expect(last.getAttribute("aria-selected")).toBe("true");
		expect(preview.dataset.recordId).toBe(RECORD_ID);
		expect(preview.dataset.v1State).toBe("later-review");
		expect(preview.querySelector('[data-active-record-view] [data-review-result="changed"]')).not.toBeNull();
		expect(preview.querySelector('[data-active-record-view] [data-review-result="unchanged"]')).not.toBeNull();
		expect(preview.querySelector<HTMLElement>("[data-active-record-view]")?.textContent).toContain("recommendation order did not change");
	});

	it("never advances the product preview on a timer", async () => {
		vi.useFakeTimers();
		const preview = host.querySelector<HTMLElement>("[data-product-record-preview]");
		if (!preview) throw new Error("Product record preview not mounted");
		const initialState = preview.dataset.v1State;
		await act(async () => vi.advanceTimersByTime(120_000));
		expect(preview.dataset.v1State).toBe(initialState);
	});
});
