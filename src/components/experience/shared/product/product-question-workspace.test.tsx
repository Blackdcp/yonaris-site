// @vitest-environment happy-dom

import { act, type ComponentType } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GLOBAL_EN_BUYER_QUESTION } from "@/content/public-site/global-en/buyer-question";
import { GLOBAL_EN_PRODUCT_PAGE } from "@/content/public-site/global-en/pages/product";
import { Route } from "@/routes/product";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const ProductRouteComponent = Route.options.component as ComponentType;
const RECORD_ID = "yonaris.buyer-question.global-en.enterprise-analytics-markets.v1";
const VIEW_LABELS = GLOBAL_EN_PRODUCT_PAGE.theatre.workingViews;

let host: HTMLDivElement;
let root: Root;

function findButton(label: string): HTMLButtonElement {
	const match = [...host.querySelectorAll<HTMLButtonElement>("button")].find((candidate) => candidate.textContent?.trim().includes(label));
	if (!match) throw new Error(`Button not found: ${label}`);
	return match;
}

function activePanel(): HTMLElement {
	const panel = host.querySelector<HTMLElement>('[role="tabpanel"]:not([hidden])');
	if (!panel) throw new Error("Active product workspace panel not found");
	return panel;
}

beforeEach(async () => {
	host = document.createElement("div");
	document.body.append(host);
	root = createRoot(host);
	await act(async () => root.render(<ProductRouteComponent />));
});

afterEach(async () => {
	vi.useRealTimers();
	await act(async () => root.unmount());
	host.remove();
	vi.restoreAllMocks();
});

describe("ProductQuestionWorkspace progressive record", () => {
	it("keeps all five views readable in SSR with genuinely different semantic compositions", () => {
		const html = renderToStaticMarkup(<ProductRouteComponent />);
		const document = new DOMParser().parseFromString(html, "text/html");
		const workspace = document.querySelector<HTMLElement>("[data-product-question-workspace]");
		expect(workspace?.dataset.recordId).toBe(RECORD_ID);
		const panels = [...document.querySelectorAll<HTMLElement>('[data-workspace-view]')];
		expect(panels).toHaveLength(5);
		expect(panels.every((panel) => !panel.hasAttribute("hidden"))).toBe(true);
		expect(document.querySelector('[data-workspace-view="buyer-questions"] blockquote')).not.toBeNull();
		expect(document.querySelectorAll('[data-workspace-view="buyer-questions"] dl > div').length).toBeGreaterThanOrEqual(3);
		expect(document.querySelectorAll('[data-workspace-view="current-answers"] [data-answer-sheet]').length).toBe(4);
		expect(document.querySelector('[data-workspace-view="sources-gaps"] ol[data-evidence-spine]')).not.toBeNull();
		expect(document.querySelector('[data-workspace-view="sources-gaps"] [data-evidence-gap]')).not.toBeNull();
		expect(document.querySelector('[data-workspace-view="actions-under-review"] [data-human-review-queue]')).not.toBeNull();
		expect(document.querySelector('[data-workspace-view="outcome-review"] [data-review-comparison="changed"]')).not.toBeNull();
		expect(document.querySelector('[data-workspace-view="outcome-review"] [data-review-comparison="unchanged"]')).not.toBeNull();
		expect(document.querySelector('[data-workspace-view="outcome-review"] [data-review-comparison="cannot-attribute"]')).not.toBeNull();
	});

	it("changes real view geometry from pointer input while preserving record and evidence identities", async () => {
		const workspace = host.querySelector<HTMLElement>("[data-product-question-workspace]");
		if (!workspace) throw new Error("Workspace not mounted");
		const persistentEvidence = () => [...workspace.querySelectorAll<HTMLElement>("[data-persistent-evidence-id]")].map((node) => node.dataset.persistentEvidenceId);
		const initialEvidence = persistentEvidence();
		expect(workspace.dataset.recordId).toBe(RECORD_ID);
		expect(activePanel().querySelector("blockquote")).not.toBeNull();

		await act(async () => findButton("Sources and gaps").dispatchEvent(new PointerEvent("pointerup", { bubbles: true })));

		expect(workspace.dataset.recordId).toBe(RECORD_ID);
		expect(activePanel().querySelector("ol[data-evidence-spine]")).not.toBeNull();
		expect(activePanel().querySelector("blockquote")).toBeNull();
		expect(persistentEvidence()).toEqual(initialEvidence);
	});

	it("accepts touch, Enter, Space and roving arrow input as independent direct controls", async () => {
		await act(async () => findButton("Current answers").dispatchEvent(new TouchEvent("touchend", { bubbles: true })));
		expect(activePanel().querySelectorAll("[data-answer-sheet]")).toHaveLength(4);

		const actions = findButton("Actions under review");
		actions.focus();
		await act(async () => actions.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true })));
		expect(activePanel().querySelector("[data-human-review-queue]")).not.toBeNull();
		expect(activePanel().textContent).toContain("human review");

		const outcome = findButton("Outcome review");
		outcome.focus();
		await act(async () => outcome.dispatchEvent(new KeyboardEvent("keydown", { key: " ", code: "Space", bubbles: true })));
		expect(activePanel().querySelector('[data-review-comparison="cannot-attribute"]')).not.toBeNull();

		const first = findButton("Buyer questions");
		first.focus();
		await act(async () => first.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })));
		expect(document.activeElement).toBe(findButton("Current answers"));
		expect(activePanel().querySelectorAll("[data-answer-sheet]")).toHaveLength(4);
	});

	it("never advances on a timer and keeps reduced-motion users in direct control of every view", async () => {
		vi.useFakeTimers();
		const workspace = host.querySelector<HTMLElement>("[data-product-question-workspace]");
		if (!workspace) throw new Error("Workspace not mounted");
		const initialText = activePanel().textContent;
		await act(async () => vi.advanceTimersByTime(120_000));
		expect(activePanel().textContent).toBe(initialText);

		await act(async () => root.unmount());
		vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
			matches: query === "(prefers-reduced-motion: reduce)", media: query, onchange: null,
			addEventListener: vi.fn(), removeEventListener: vi.fn(), addListener: vi.fn(), removeListener: vi.fn(), dispatchEvent: vi.fn(() => true),
		}) as MediaQueryList);
		root = createRoot(host);
		await act(async () => root.render(<ProductRouteComponent />));
		const reducedWorkspace = host.querySelector<HTMLElement>("[data-product-question-workspace]");
		expect(reducedWorkspace?.dataset.motionPreference).toBe("reduced");
		for (const label of VIEW_LABELS) {
			await act(async () => findButton(label).click());
			expect(activePanel().getAttribute("aria-labelledby")).toContain(encodeURIComponent({
				"Buyer questions": "buyer-questions",
				"Current answers": "current-answers",
				"Sources and gaps": "sources-gaps",
				"Actions under review": "actions-under-review",
				"Outcome review": "outcome-review",
			}[label]));
		}
	});

	it("keeps proposed work behind a human approval boundary and preserves honest review limits", () => {
		const text = host.textContent ?? "";
		expect(text).toContain(GLOBAL_EN_BUYER_QUESTION.proposedActions[0]?.description);
		expect(text).toContain("Needs human review");
		expect(text).toContain("Approved by the team");
		expect(text).toContain(GLOBAL_EN_BUYER_QUESTION.review.changed[0]?.statement);
		expect(text).toContain(GLOBAL_EN_BUYER_QUESTION.review.unchanged[0]?.statement);
		expect(text).toContain(GLOBAL_EN_BUYER_QUESTION.review.attribution.boundary);
		expect(text).toContain("does not promise exhaustive coverage");
		expect(text).not.toMatch(/autonomously executed|we guarantee|guarantees (?:an? )?(?:uplift|improvement|result)|\b\d+(?:\.\d+)?%\b|customer revenue|live score/i);
	});
});
