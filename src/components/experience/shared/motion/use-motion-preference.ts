"use client";

import { useSyncExternalStore } from "react";

export type MotionPreference = "full" | "reduced";

const query = "(prefers-reduced-motion: reduce)";

function subscribe(listener: () => void): () => void {
	if (typeof window === "undefined") return () => undefined;
	const media = window.matchMedia(query);
	media.addEventListener("change", listener);
	return () => media.removeEventListener("change", listener);
}

function getSnapshot(): MotionPreference {
	return typeof window !== "undefined" && window.matchMedia(query).matches ? "reduced" : "full";
}

export function useMotionPreference(): MotionPreference {
	return useSyncExternalStore(subscribe, getSnapshot, () => "full");
}
