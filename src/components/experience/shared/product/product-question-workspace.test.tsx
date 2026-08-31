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
const VIEW_LABELS = GLOBAL_EN_PRODUCT_PAGE.theatre.workingViews;
const OBJECT_KINDS = ["question", "answers", "reasons", "evidence", "gap", "action", "review", "conditions"];

let host: HTMLDivElement;
let root: Root;

function findButton(label: string): HTMLButtonElement {
	const match = [...host.querySelectorAll<HTMLButtonElement>("[data-workspace-view-control]")].find((candidate) => candidate.textContent?.includes(label));
	if (!match) throw new Error(`Button not found: ${label}`);
	return match;
}

function inspector() {
	const node = host.querySelector<HTMLElement>("[data-workspace-record-inspector]");
	if (!node) throw new Error("Workspace record inspector not found");
	return node;
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

describe("ProductQuestionWorkspace continuous record theatre", () => {
	it("renders one record inspector with one persistent object for each part of the decision", () => {
		const html = renderToStaticMarkup(<ProductRouteComponent />);
		const document = new DOMParser().parseFromString(html, "text/html");
		const workspace = document.querySelector<HTMLElement>("[data-product-question-workspace]");
		expect(workspace?.dataset.recordId).toBe(GLOBAL_EN_BUYER_QUESTION.id);
		expect(workspace?.querySelectorAll("[data-workspace-record-inspector]")).toHaveLength(1);
		for (const kind of OBJECT_KINDS) expect(workspace?.querySelectorAll(`[data-workspace-object="${kind}"]`), kind).toHaveLength(1);
		expect(workspace?.querySelector("[role='tablist'], [role='tab'], [role='tabpanel']")).toBeNull();
		expect(workspace?.querySelector("[hidden]")).toBeNull();
	});

	it("moves the same DOM objects through five states instead of swapping five panels", async () => {
		const workspace = host.querySelector<HTMLElement>("[data-product-question-workspace]");
		if (!workspace) throw new Error("Workspace not mounted");
		const objects = new Map(OBJECT_KINDS.map((kind) => [kind, inspector().querySelector(`[data-workspace-object="${kind}"]`)]));
		expect(workspace.dataset.v1State).toBe("buyer-questions");
		expect(inspector().querySelector('[data-workspace-object="question"]')?.getAttribute("data-emphasis")).toBe("primary");

		await act(async () => findButton("Sources and gaps").dispatchEvent(new PointerEvent("pointerup", { bubbles: true, pointerType: "mouse" })));

		expect(workspace.dataset.v1State).toBe("sources-gaps");
		expect(inspector().querySelector('[data-workspace-object="evidence"]')?.getAttribute("data-emphasis")).toBe("primary");
		for (const [kind, node] of objects) expect(inspector().querySelector(`[data-workspace-object="${kind}"]`)).toBe(node);
	});

	it("uses an aria-pressed roving control group and actively recentres the selected control", async () => {
		const controls = host.querySelector<HTMLElement>('[role="group"][data-workspace-view-controls]');
		expect(controls?.querySelectorAll(":scope > button[data-workspace-view-control]")).toHaveLength(5);
		expect(controls?.querySelectorAll(':scope > button[aria-pressed="true"][tabindex="0"]')).toHaveLength(1);
		expect(controls?.querySelectorAll(':scope > button[aria-pressed="false"][tabindex="-1"]')).toHaveLength(4);
		const actions = findButton("Actions under review");
		const scrollIntoView = vi.fn();
		Object.defineProperty(actions, "scrollIntoView", { configurable: true, value: scrollIntoView });
		await act(async () => actions.click());
		expect(actions.getAttribute("aria-pressed")).toBe("true");
		expect(scrollIntoView).toHaveBeenCalled();
	});

	it("keeps human-readable relationships on stage and raw identities in a closed native inspector", () => {
		const stage = inspector();
		const details = stage.querySelector<HTMLDetailsElement>("details[data-inspect-record]");
		expect(details?.hasAttribute("open")).toBe(false);
		expect(details?.textContent).toContain(GLOBAL_EN_BUYER_QUESTION.id);
		for (const evidence of GLOBAL_EN_BUYER_QUESTION.evidence) expect(details?.textContent).toContain(evidence.id);
		for (const action of GLOBAL_EN_BUYER_QUESTION.proposedActions) expect(details?.textContent).toContain(action.id);

		const visibleHumanText = [...stage.children]
			.filter((node) => node !== details && !(node instanceof HTMLElement && node.matches("[data-machine-projection]")))
			.map((node) => node.textContent ?? "")
			.join(" ");
		expect(visibleHumanText).not.toContain(GLOBAL_EN_BUYER_QUESTION.id);
		for (const evidence of GLOBAL_EN_BUYER_QUESTION.evidence) expect(visibleHumanText).not.toContain(evidence.id);
		for (const answer of GLOBAL_EN_BUYER_QUESTION.channelAnswers) {
			const answerNode = stage.querySelector<HTMLElement>(`[data-answer-id="${answer.id}"]`);
			expect(answerNode?.textContent).toContain(answer.environment);
			expect(answerNode?.textContent).toContain(answer.answer);
		}
	});

	it("keeps source, gap, human approval and honest later-review boundaries attached", () => {
		const stage = inspector();
		for (const reason of GLOBAL_EN_BUYER_QUESTION.comparisonReasons.slice(0, 2)) {
			const node = stage.querySelector<HTMLElement>(`[data-reason-id="${reason.id}"]`);
			expect(node?.textContent).toContain(reason.reason);
		}
		for (const evidence of GLOBAL_EN_BUYER_QUESTION.evidence.filter((item) => item.phase === "baseline").slice(0, 2)) {
			const node = stage.querySelector<HTMLElement>(`[data-evidence-id="${evidence.id}"]`);
			expect(node?.textContent).toContain(evidence.sourceLabel);
			expect(node?.textContent).toContain(evidence.trace);
		}
		expect(stage.querySelector('[data-workspace-object="gap"]')?.textContent).toContain(GLOBAL_EN_BUYER_QUESTION.gaps[0]?.description);
		expect(stage.querySelector('[data-workspace-object="action"]')?.textContent).toContain(GLOBAL_EN_BUYER_QUESTION.proposedActions[0]?.description);
		expect(stage.querySelector('[data-workspace-object="action"]')?.textContent).toContain("Approved by the team");
		expect(stage.querySelector('[data-workspace-object="review"]')?.textContent).toContain(GLOBAL_EN_BUYER_QUESTION.review.changed[0]?.statement);
		expect(stage.querySelector('[data-workspace-object="review"]')?.textContent).toContain(GLOBAL_EN_BUYER_QUESTION.review.unchanged[0]?.statement);
		expect(stage.querySelector('[data-workspace-object="review"]')?.textContent).toContain(GLOBAL_EN_BUYER_QUESTION.review.attribution.boundary);
	});

	it("accepts touch, Enter, Space and arrow input without auto-advancing", async () => {
		vi.useFakeTimers();
		await act(async () => vi.advanceTimersByTime(120_000));
		expect(host.querySelector<HTMLElement>("[data-product-question-workspace]")?.dataset.v1State).toBe("buyer-questions");

		await act(async () => findButton("Current answers").dispatchEvent(new TouchEvent("touchend", { bubbles: true })));
		expect(inspector().dataset.activeView).toBe("current-answers");
		const actions = findButton("Actions under review");
		actions.focus();
		await act(async () => actions.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true })));
		expect(inspector().dataset.activeView).toBe("actions-under-review");
		const outcome = findButton("Outcome review");
		outcome.focus();
		await act(async () => outcome.dispatchEvent(new KeyboardEvent("keydown", { key: " ", code: "Space", bubbles: true })));
		expect(inspector().dataset.activeView).toBe("outcome-review");
		const first = findButton("Buyer questions");
		first.focus();
		await act(async () => first.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })));
		expect(document.activeElement).toBe(findButton("Current answers"));
		expect(inspector().dataset.activeView).toBe("current-answers");
	});

	it("mounts a real evidence lens in the working surface without inventing performance proof", () => {
		const workspace = host.querySelector<HTMLElement>("[data-product-question-workspace]");
		expect(workspace?.querySelector("[data-product-evidence-lens] [data-human-agent-lens]")).not.toBeNull();
		expect(workspace?.textContent).not.toMatch(/autonomously executed|we guarantee|guarantees (?:an? )?(?:uplift|improvement|result)|\b\d+(?:\.\d+)?%\b|customer revenue|live score/i);
		const labels = [...host.querySelectorAll<HTMLButtonElement>("[data-workspace-view-control]")].map((button) => button.textContent?.replace(/^\d+/, "").trim());
		expect(labels).toEqual([...VIEW_LABELS]);
	});
});
