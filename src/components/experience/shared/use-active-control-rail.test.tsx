// @vitest-environment happy-dom

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useActiveControlRail } from "./use-active-control-rail";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const items = ["answer", "reason", "evidence"] as const;

function Fixture({ active }: { readonly active: (typeof items)[number] }) {
	const rail = useActiveControlRail({ items, active });
	return (
		<div ref={rail.railRef} data-testid="rail">
			{items.map((item) => <button key={item} ref={rail.getControlRef(item)}>{item}</button>)}
			<output data-testid="progress">{rail.position} / {rail.total}</output>
			<span data-testid="continuation">{rail.hasPrevious ? "previous" : "start"}/{rail.hasNext ? "next" : "end"}</span>
		</div>
	);
}

let root: Root | undefined;
let host: HTMLDivElement | undefined;

afterEach(async () => {
	if (root) await act(async () => root?.unmount());
	host?.remove();
	root = undefined;
	host = undefined;
	vi.restoreAllMocks();
});

describe("active horizontal control rail", () => {
	it("centres the newly active real control and exposes independent progress", async () => {
		const scrollTo = vi.fn();
		Object.defineProperty(HTMLElement.prototype, "scrollTo", { configurable: true, value: scrollTo });
		host = document.createElement("div");
		document.body.append(host);
		root = createRoot(host);

		await act(async () => root?.render(<Fixture active="answer" />));
		scrollTo.mockClear();
		await act(async () => root?.render(<Fixture active="evidence" />));

		expect(scrollTo).toHaveBeenCalledWith({ left: 0, behavior: "smooth" });
		expect(host.querySelector("[data-testid='progress']")?.textContent).toBe("3 / 3");
		expect(host.querySelector("[data-testid='continuation']")?.textContent).toBe("previous/end");
	});
});
