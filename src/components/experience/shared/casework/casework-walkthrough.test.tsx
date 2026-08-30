// @vitest-environment happy-dom

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GLOBAL_EN_BUYER_QUESTION } from "@/content/public-site/global-en/buyer-question";
import { GLOBAL_EN_CASEWORK_PAGE } from "@/content/public-site/global-en/pages/casework";
import { BuyerQuestionProvider } from "../buyer-question/buyer-question-provider";
import { CaseworkWalkthrough } from "./casework-walkthrough";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const record = GLOBAL_EN_BUYER_QUESTION;
const copy = GLOBAL_EN_CASEWORK_PAGE;
let activeRoot: Root | undefined;
let activeHost: HTMLDivElement | undefined;

function tree() {
	return (
		<BuyerQuestionProvider record={record}>
			<CaseworkWalkthrough copy={copy} />
		</BuyerQuestionProvider>
	);
}

async function mountReducedMotion(reduced = false) {
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
	await act(async () => activeRoot?.render(tree()));
	return activeHost;
}

function walkthrough(host: HTMLElement) {
	const node = host.querySelector<HTMLElement>("[data-casework-walkthrough]");
	if (!node) throw new Error("Casework walkthrough not mounted");
	return node;
}

function activeStep(host: HTMLElement) {
	const node = host.querySelector<HTMLElement>("[data-casework-step]:not([hidden])");
	if (!node) throw new Error("Active Casework step not found");
	return node;
}

function stepButton(host: HTMLElement, index: number) {
	const node = host.querySelector<HTMLButtonElement>(`button[data-casework-select-step="${index}"]`);
	if (!node) throw new Error(`Casework step control ${index} not found`);
	return node;
}

async function press(button: HTMLButtonElement, key: string) {
	button.focus();
	await act(async () => button.dispatchEvent(new KeyboardEvent("keydown", { key, code: key === " " ? "Space" : key, bubbles: true })));
}

afterEach(async () => {
	vi.useRealTimers();
	if (activeRoot) await act(async () => activeRoot?.unmount());
	activeHost?.remove();
	activeRoot = undefined;
	activeHost = undefined;
	vi.restoreAllMocks();
});

describe("English Casework reversible evidence timeline", () => {
	it("keeps all eight approved steps readable, ordered and unhidden in SSR", () => {
		const html = renderToStaticMarkup(tree());
		const document = new DOMParser().parseFromString(html, "text/html");
		const steps = [...document.querySelectorAll<HTMLElement>("[data-casework-step]")];

		expect(steps).toHaveLength(8);
		expect(steps.every((step) => !step.hasAttribute("hidden"))).toBe(true);
		expect(steps.map((step) => step.querySelector("h3")?.textContent)).toEqual(copy.walkthrough.map((step) => step.heading));
		for (const [index, step] of steps.entries()) expect(step.textContent).toContain(copy.walkthrough[index]?.body);
		expect(document.querySelector("[role='tablist'], [aria-roledescription='carousel']")).toBeNull();
		expect(document.querySelector("[data-casework-walkthrough]")?.getAttribute("data-record-id")).toBe(record.id);
	});

	it("selects an evidence state from pointer input in a fresh experience", async () => {
		const host = await mountReducedMotion();
		await act(async () => stepButton(host, 3).dispatchEvent(new PointerEvent("pointerup", { bubbles: true, pointerType: "mouse" })));

		const visible = activeStep(host);
		expect(visible.dataset.caseworkStep).toBe("3");
		expect(visible.textContent).toContain(record.comparisonReasons[0]?.id);
		expect(visible.textContent).toContain(record.evidence[0]?.id);
		expect(visible.textContent).toContain(record.evidence[0]?.sourceId);
	});

	it("selects an evidence state from touch input in a fresh experience", async () => {
		const host = await mountReducedMotion();
		await act(async () => stepButton(host, 4).dispatchEvent(new TouchEvent("touchend", { bubbles: true })));

		const visible = activeStep(host);
		expect(visible.dataset.caseworkStep).toBe("4");
		expect(visible.textContent).toContain(record.gaps[0]?.id);
		expect(visible.textContent).toContain(record.gaps[0]?.affectedReasonIds[0]);
	});

	it("selects the human-review gate with Enter in a fresh experience", async () => {
		const host = await mountReducedMotion();
		await press(stepButton(host, 5), "Enter");

		const visible = activeStep(host);
		expect(visible.dataset.caseworkStep).toBe("5");
		expect(visible.textContent).toContain(record.proposedActions[0]?.id);
		expect(visible.textContent).toContain(record.proposedActions[0]?.reviewedBy);
		expect(visible.querySelector("[data-human-review-gate]")).not.toBeNull();
	});

	it("selects the later-observation overlay with Space in a fresh experience", async () => {
		const host = await mountReducedMotion();
		await press(stepButton(host, 6), " ");

		const visible = activeStep(host);
		expect(visible.dataset.caseworkStep).toBe("6");
		expect(visible.textContent).toContain(record.review.changed[0]?.statement);
		expect(visible.textContent).toContain(record.review.unchanged[0]?.statement);
		expect(visible.textContent).toContain(record.review.attribution.boundary);
		expect(visible.querySelector("[data-review-result='changed']")).not.toBeNull();
		expect(visible.querySelector("[data-review-result='unchanged']")).not.toBeNull();
		expect(visible.querySelector("[data-review-result='cannot-attribute']")).not.toBeNull();
	});

	it("moves in both directions with directional keys and supports explicit reverse navigation", async () => {
		const host = await mountReducedMotion();
		const first = stepButton(host, 0);

		await press(first, "ArrowRight");
		expect(activeStep(host).dataset.caseworkStep).toBe("1");
		expect(document.activeElement).toBe(stepButton(host, 1));
		await press(stepButton(host, 1), "ArrowDown");
		expect(activeStep(host).dataset.caseworkStep).toBe("2");
		await press(stepButton(host, 2), "ArrowLeft");
		expect(activeStep(host).dataset.caseworkStep).toBe("1");
		await press(stepButton(host, 1), "ArrowUp");
		expect(activeStep(host).dataset.caseworkStep).toBe("0");

		await act(async () => stepButton(host, 7).click());
		expect(activeStep(host).dataset.caseworkStep).toBe("7");
		const previous = host.querySelector<HTMLButtonElement>("button[data-casework-previous]");
		if (!previous) throw new Error("Previous step control not found");
		await act(async () => previous.click());
		expect(activeStep(host).dataset.caseworkStep).toBe("6");
	});

	it("projects canonical relationships from the current visible step instead of a hidden aggregate", async () => {
		const host = await mountReducedMotion();
		const expected = [
			[["answer", record.channelAnswers[0]?.id], ["reason", record.comparisonReasons[1]?.id], ["source", record.evidence[1]?.sourceId]],
			[["record", record.id]],
			[["answer", record.channelAnswers[0]?.id], ["reason", record.comparisonReasons[0]?.id], ["source", record.evidence[0]?.sourceId]],
			[["reason", record.comparisonReasons[0]?.id], ["evidence", record.evidence[0]?.id], ["source", record.evidence[0]?.sourceId]],
			[["gap", record.gaps[0]?.id], ["reason", record.gaps[0]?.affectedReasonIds[0]], ["evidence", record.evidence[1]?.id]],
			[["action", record.proposedActions[0]?.id], ["gap", record.proposedActions[0]?.evidenceGapIds[0]], ["reviewer", record.proposedActions[0]?.reviewedBy]],
			[["evidence", record.review.changed[0]?.evidenceIds[0]], ["evidence", record.review.unchanged[0]?.evidenceIds[0]], ["limit", record.review.attribution.status]],
			[["limit", record.review.attribution.status], ["limit", record.disclosure.sourceId]],
		] as const;

		for (const [index, relationships] of expected.entries()) {
			await act(async () => stepButton(host, index).click());
			const visible = activeStep(host);
			expect(host.querySelectorAll("[data-casework-step]:not([hidden])")).toHaveLength(1);
			expect(visible.dataset.recordId).toBe(record.id);
			for (const [kind, identifier] of relationships) {
				expect(
					visible.querySelector(`[data-canonical-kind="${kind}"][data-canonical-id="${identifier}"]`),
					`step ${index + 1}: ${kind} ${identifier}`,
				).not.toBeNull();
			}
			expect(walkthrough(host).dataset.recordId).toBe(record.id);
		}
	});

	it("never advances on a timer", async () => {
		vi.useFakeTimers();
		const host = await mountReducedMotion();
		const before = activeStep(host).dataset.caseworkStep;
		await act(async () => vi.advanceTimersByTime(180_000));
		expect(activeStep(host).dataset.caseworkStep).toBe(before);
	});

	it("keeps every state directly accessible with reduced motion", async () => {
		const host = await mountReducedMotion(true);
		expect(walkthrough(host).dataset.motionPreference).toBe("reduced");

		for (let index = 0; index < copy.walkthrough.length; index += 1) {
			await act(async () => stepButton(host, index).click());
			expect(activeStep(host).dataset.caseworkStep).toBe(String(index));
		}
	});

	it("keeps the representative disclosure and honest outcome limits adjacent to the active timeline", async () => {
		const host = await mountReducedMotion();
		const experience = walkthrough(host);
		expect(experience.querySelector(":scope > .site-v1-representative-disclosure")?.textContent).toContain(copy.hero.disclosure);

		await act(async () => stepButton(host, 7).click());
		const text = activeStep(host).textContent ?? "";
		expect(text).toContain(record.review.attribution.boundary);
		expect(text).toContain(record.disclosure.boundary);
		expect(text).not.toMatch(/autonomously executed|guaranteed? (?:uplift|ranking|citation|result)|\b\d+(?:\.\d+)?%\b|customer revenue|live score/i);
	});
});
