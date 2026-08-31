"use client";

import { useEffect, useRef, type RefCallback } from "react";

export function useActiveControlRail<T extends string>({ items, active }: {
	readonly items: readonly T[];
	readonly active: T;
}) {
	const railRef = useRef<HTMLDivElement>(null);
	const controls = useRef(new Map<T, HTMLButtonElement>());
	const activeIndex = Math.max(0, items.indexOf(active));

	useEffect(() => {
		const rail = railRef.current;
		const control = controls.current.get(active);
		if (!rail || !control || typeof rail.scrollTo !== "function") return;
		const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
		const railRect = rail.getBoundingClientRect();
		const controlRect = control.getBoundingClientRect();
		const left = Math.max(0, rail.scrollLeft + controlRect.left - railRect.left - (rail.clientWidth - controlRect.width) / 2);
		rail.scrollTo({ left, behavior: reduced ? "auto" : "smooth" });
	}, [active]);

	function getControlRef(item: T): RefCallback<HTMLButtonElement> {
		return (node) => {
			if (node) controls.current.set(item, node);
			else controls.current.delete(item);
		};
	}

	return {
		railRef,
		getControlRef,
		position: activeIndex + 1,
		total: items.length,
		hasPrevious: activeIndex > 0,
		hasNext: activeIndex < items.length - 1,
	} as const;
}
