"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { ContactRequestType } from "./contact-schema";

export interface ContactRouteSearch {
	readonly intent?: "privacy";
}

export const CONTACT_INTENT_STATE_KEY = "__yonarisContactIntent";
export const CONTACT_HYDRATION_INTENT_STATE_KEY = "__yonarisContactHydrationIntent";

export function validateContactRouteSearch(search: Record<string, unknown>): ContactRouteSearch {
	return search.intent === "privacy" ? { intent: "privacy" } : {};
}

export function contactRequestTypeFromRoute(search: Record<string, unknown>, state: unknown): ContactRequestType {
	const stateIntent = typeof state === "object" && state !== null
		? (state as Record<string, unknown>)[CONTACT_INTENT_STATE_KEY]
		: undefined;
	return search.intent === "privacy" || stateIntent === "privacy" ? "privacy" : "conversation";
}

function contactRequestTypeFromHydration(search: Record<string, unknown>, state: unknown): ContactRequestType {
	const hydrationIntent = typeof state === "object" && state !== null
		? (state as Record<string, unknown>)[CONTACT_HYDRATION_INTENT_STATE_KEY]
		: undefined;
	return search.intent === "privacy" || hydrationIntent === "privacy" ? "privacy" : "conversation";
}

const subscribe = () => () => undefined;

export function useContactRequestType(search: Record<string, unknown>): ContactRequestType {
	const requestType = useSyncExternalStore(
		subscribe,
		() => contactRequestTypeFromRoute(search, window.history.state),
		() => contactRequestTypeFromHydration(search, typeof window === "undefined" ? null : window.history.state),
	);
	useEffect(() => {
		const state = window.history.state;
		if (state?.[CONTACT_HYDRATION_INTENT_STATE_KEY] !== "privacy") return;
		const nextState = { ...state };
		delete nextState[CONTACT_HYDRATION_INTENT_STATE_KEY];
		window.history.replaceState(nextState, "");
	}, []);
	return requestType;
}
