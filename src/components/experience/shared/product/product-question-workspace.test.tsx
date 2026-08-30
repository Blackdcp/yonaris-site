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

	it("keeps its horizontal state rail semantically aligned at narrow widths", () => {
		const controls = host.querySelector<HTMLElement>('[role="tablist"]');
		expect(controls?.getAttribute("aria-orientation")).toBe("horizontal");
		expect(controls?.querySelectorAll(':scope > button[role="tab"]')).toHaveLength(5);
		expect(controls?.querySelector("svg[aria-hidden='true'] path")).not.toBeNull();
		expect(controls?.querySelector("article, section, ol, ul")).toBeNull();
	});

	it("projects answer reasons and their evidence relationships inside the visible answer panel", async () => {
		await act(async () => findButton("Current answers").click());
		const panel = activePanel();
		for (const answer of GLOBAL_EN_BUYER_QUESTION.channelAnswers) {
			const sheet = panel.querySelector<HTMLElement>(`[data-answer-sheet="${answer.id}"]`);
			expect(sheet, answer.id).not.toBeNull();
			for (const reasonId of answer.reasonIds) {
				const reason = GLOBAL_EN_BUYER_QUESTION.comparisonReasons.find((candidate) => candidate.id === reasonId);
				expect(sheet?.textContent).toContain(reasonId);
				expect(sheet?.textContent).toContain(reason?.reason);
				for (const evidenceId of reason?.evidenceIds ?? []) expect(sheet?.textContent).toContain(evidenceId);
			}
		}
	});

	it("projects source identity and evidence identity inside the visible sources panel", async () => {
		await act(async () => findButton("Sources and gaps").click());
		const panel = activePanel();
		const projected = [...panel.querySelectorAll<HTMLElement>("ol > li")];
		expect(projected.length).toBeGreaterThan(0);
		for (const item of projected) {
			const evidence = GLOBAL_EN_BUYER_QUESTION.evidence.find((candidate) => candidate.id === item.dataset.evidenceId);
			expect(evidence).toBeDefined();
			expect(item.textContent).toContain(evidence?.id);
			expect(item.textContent).toContain(evidence?.sourceId);
			expect(item.textContent).toContain(evidence?.sourceLabel);
		}
	});

	it("shows the approved action status, reviewer and evidence gaps without a conflicting pending label", async () => {
		await act(async () => findButton("Actions under review").click());
		const panel = activePanel();
		const action = GLOBAL_EN_BUYER_QUESTION.proposedActions[0];
		const actionNode = panel.querySelector<HTMLElement>(`[data-reviewed-action="${action?.id}"]`);
		expect(actionNode?.textContent).toContain("Approved by the team");
		expect(actionNode?.textContent).toContain(action?.reviewedBy);
		for (const gapId of action?.evidenceGapIds ?? []) expect(actionNode?.textContent).toContain(gapId);
		expect(actionNode?.textContent).not.toContain("Needs human review");
		expect(panel.textContent).toContain(GLOBAL_EN_PRODUCT_PAGE.systemWork.sequence[3]);
	});

	it("keeps a few persistent record anchors without recreating the six-step system sequence", () => {
		expect(host.querySelector("[data-persistent-record-spine]")).toBeNull();
		const anchors = host.querySelector<HTMLElement>("[data-persistent-record-anchors]");
		expect(anchors).not.toBeNull();
		expect(anchors?.querySelector("ol, [role='list']")).toBeNull();
		expect(anchors?.querySelectorAll(":scope > article, :scope > div")).toHaveLength(3);
		const text = anchors?.textContent ?? "";
		expect(text).toContain(GLOBAL_EN_BUYER_QUESTION.id);
		expect(text).toContain(GLOBAL_EN_BUYER_QUESTION.question);
		for (const evidence of GLOBAL_EN_BUYER_QUESTION.evidence) expect(text).toContain(evidence.id);
		for (const action of GLOBAL_EN_BUYER_QUESTION.proposedActions) {
			expect(text).toContain(action.id);
			expect(text).toContain(action.reviewedBy);
			for (const gapId of action.evidenceGapIds) expect(text).toContain(gapId);
		}
		expect(text).toContain(GLOBAL_EN_BUYER_QUESTION.review.changed[0]?.evidenceIds[0]);
		expect(text).toContain(GLOBAL_EN_BUYER_QUESTION.review.unchanged[0]?.evidenceIds[0]);
		expect(text).toContain(GLOBAL_EN_BUYER_QUESTION.review.attribution.status);
		const repeatedSystemSequence = GLOBAL_EN_PRODUCT_PAGE.systemWork.sequence.filter((phrase) => text.includes(phrase));
		expect(repeatedSystemSequence.length).toBeLessThan(3);
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

	it("keeps proposed work behind a human approval boundary and preserves honest review limits", async () => {
		await act(async () => findButton("Actions under review").click());
		let panelText = activePanel().textContent ?? "";
		expect(panelText).toContain(GLOBAL_EN_BUYER_QUESTION.proposedActions[0]?.description);
		expect(panelText).toContain(GLOBAL_EN_PRODUCT_PAGE.systemWork.sequence[3]);
		expect(panelText).toContain("Approved by the team");
		expect(panelText).not.toMatch(/autonomously executed|we guarantee|guarantees (?:an? )?(?:uplift|improvement|result)|\b\d+(?:\.\d+)?%\b|customer revenue|live score/i);

		await act(async () => findButton("Outcome review").click());
		panelText = activePanel().textContent ?? "";
		expect(panelText).toContain(GLOBAL_EN_BUYER_QUESTION.review.changed[0]?.statement);
		expect(panelText).toContain(GLOBAL_EN_BUYER_QUESTION.review.unchanged[0]?.statement);
		expect(panelText).toContain(GLOBAL_EN_BUYER_QUESTION.review.attribution.boundary);
		expect(panelText).not.toMatch(/autonomously executed|we guarantee|guarantees (?:an? )?(?:uplift|improvement|result)|\b\d+(?:\.\d+)?%\b|customer revenue|live score/i);
		const disclosure = host.querySelector<HTMLElement>(".site-v1-representative-disclosure");
		expect(disclosure?.textContent).toContain(GLOBAL_EN_BUYER_QUESTION.disclosure.boundary);
	});
});
