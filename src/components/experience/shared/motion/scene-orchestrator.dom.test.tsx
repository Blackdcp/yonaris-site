// @vitest-environment happy-dom

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { SceneOrchestrator } from "./scene-orchestrator";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let host: HTMLDivElement;
let root: Root;

beforeEach(async () => {
	host = document.createElement("div");
	document.body.append(host);
	root = createRoot(host);
	await act(async () => {
		root.render(
			<SceneOrchestrator pauseLabel="Pause scene" resumeLabel="Resume scene">
				<div data-scene-content>Stable scene content</div>
			</SceneOrchestrator>,
		);
	});
});

afterEach(async () => {
	await act(async () => root.unmount());
	host.remove();
});

function scene(): HTMLElement {
	const element = host.querySelector<HTMLElement>(".site-v1-scene-orchestrator");
	if (!element) throw new Error("Scene orchestrator not mounted");
	return element;
}

function control(): HTMLButtonElement {
	const element = host.querySelector<HTMLButtonElement>(".site-v1-scene-orchestrator__control");
	if (!element) throw new Error("Scene control not mounted");
	return element;
}

async function activateControl(input: "pointer" | "keyboard" | "touch") {
	const button = control();
	await act(async () => {
		if (input === "pointer") button.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
		if (input === "keyboard") button.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
		if (input === "touch") button.dispatchEvent(new TouchEvent("touchstart", { bubbles: true }));
	});
	await act(async () => button.dispatchEvent(new MouseEvent("click", { bubbles: true })));
}

describe("mounted scene interaction ownership", () => {
	it.each(["pointer", "keyboard", "touch"] as const)("pauses then resumes through the %s activation sequence", async (input) => {
		expect(scene().dataset.motionState).toBe("playing");
		expect(control().textContent).toBe("Pause scene");

		await activateControl(input);
		expect(scene().dataset.motionState).toBe("controlled");
		expect(scene().dataset.motionPaused).toBe("true");
		expect(control().textContent).toBe("Resume scene");

		await activateControl(input);
		expect(scene().dataset.motionState).toBe("playing");
		expect(scene().dataset.motionPaused).toBe("false");
		expect(control().textContent).toBe("Pause scene");
	});

	it("uses changing action-button labels without toggle-button aria-pressed semantics", () => {
		expect(control().hasAttribute("aria-pressed")).toBe(false);
		expect(control().hasAttribute("data-site-v1-motion-control")).toBe(true);
	});

	it.each([
		["pointer", () => new PointerEvent("pointerdown", { bubbles: true })],
		["keyboard", () => new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })],
		["touch", () => new TouchEvent("touchstart", { bubbles: true })],
	] as const)("relinquishes automatic playback for direct %s input outside the motion control", async (_name, event) => {
		const content = host.querySelector<HTMLElement>("[data-scene-content]");
		if (!content) throw new Error("Scene content not mounted");
		await act(async () => content.dispatchEvent(event()));
		expect(scene().dataset.motionState).toBe("controlled");
		expect(scene().dataset.motionPaused).toBe("true");
	});

	it("renders stable reduced content and cannot resume", async () => {
		await act(async () => {
			root.render(
				<SceneOrchestrator preference="reduced" pauseLabel="Pause scene" resumeLabel="Resume scene">
					{(state) => (
						<>
							<div data-scene-content>Stable reduced scene</div>
							<button type="button" data-force-resume onClick={state.resume}>Force resume</button>
						</>
					)}
				</SceneOrchestrator>,
			);
		});
		expect(scene().dataset.motionState).toBe("reduced");
		expect(scene().dataset.motionPaused).toBe("true");
		expect(host.textContent).toContain("Stable reduced scene");
		expect(host.querySelector(".site-v1-scene-orchestrator__control")).toBeNull();
		const resume = host.querySelector<HTMLButtonElement>("[data-force-resume]");
		if (!resume) throw new Error("Reduced-state probe not mounted");
		await act(async () => resume.click());
		expect(scene().dataset.motionState).toBe("reduced");
		expect(scene().dataset.motionPaused).toBe("true");
	});
});
