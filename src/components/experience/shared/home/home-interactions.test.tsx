// @vitest-environment happy-dom

import { act, type ComponentType } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Route } from "@/routes/index";

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
});

function button(label: string): HTMLButtonElement {
	const match = [...host.querySelectorAll<HTMLButtonElement>("button")].find((candidate) =>
		(candidate.getAttribute("aria-label") ?? candidate.textContent?.trim()) === label,
	);
	if (!match) throw new Error(`Button not found: ${label}`);
	return match;
}

describe("mounted Home answer field", () => {
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

	it("uses roving channel focus and opens the evidence trace attached to the selected answer", async () => {
		const first = button("AI answers");
		first.focus();
		await act(async () => first.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })));
		const search = button("Search");
		expect(document.activeElement).toBe(search);
		expect(search.getAttribute("aria-selected")).toBe("true");

		const trace = button("Trace the reason");
		expect(trace.getAttribute("aria-expanded")).toBe("false");
		await act(async () => trace.click());
		expect(trace.getAttribute("aria-expanded")).toBe("true");
		const evidence = host.querySelector<HTMLElement>("[data-evidence-trace]");
		expect(evidence?.hidden).toBe(false);
		expect(evidence?.textContent).toContain("Source attached");
		expect(evidence?.textContent).toContain("Yonaris representative walkthrough source");
	});
});

describe("mounted five-view stable record", () => {
	it("transforms central record geometry through keyboard input without changing identity", async () => {
		const preview = host.querySelector<HTMLElement>("[data-product-record-preview]");
		if (!preview) throw new Error("Product record preview not mounted");
		expect(preview.dataset.recordId).toBe(RECORD_ID);
		expect(preview.dataset.v1State).toBe("buyer-question");
		expect(preview.querySelector<HTMLElement>("[data-active-record-view]")?.dataset.geometry).toBe("question-plane");

		const first = button("What buyers ask");
		first.focus();
		await act(async () => first.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true })));

		const last = button("What changed afterwards");
		expect(document.activeElement).toBe(last);
		expect(last.getAttribute("aria-selected")).toBe("true");
		expect(preview.dataset.recordId).toBe(RECORD_ID);
		expect(preview.dataset.v1State).toBe("later-review");
		expect(preview.querySelector<HTMLElement>("[data-active-record-view]")?.dataset.geometry).toBe("review-overlay");
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
