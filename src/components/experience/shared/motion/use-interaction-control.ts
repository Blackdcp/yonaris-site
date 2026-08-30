"use client";

import { useCallback, useEffect, useReducer } from "react";
import { useMotionPreference, type MotionPreference } from "./use-motion-preference";

export type InteractionMode = "playing" | "controlled" | "reduced";
export type DirectInputSource = "pointer" | "keyboard" | "touch";

export interface InteractionControlState {
	readonly mode: InteractionMode;
	readonly paused: boolean;
}

export type InteractionControlAction =
	| { readonly type: "direct-input"; readonly source: DirectInputSource }
	| { readonly type: "pause" }
	| { readonly type: "resume" }
	| { readonly type: "preference"; readonly reduced: boolean };

export function initialInteractionControl(reduced: boolean): InteractionControlState {
	return reduced ? { mode: "reduced", paused: true } : { mode: "playing", paused: false };
}

export function interactionControlReducer(
	state: InteractionControlState,
	action: InteractionControlAction,
): InteractionControlState {
	if (action.type === "preference") return initialInteractionControl(action.reduced);
	if (state.mode === "reduced") return state;
	if (action.type === "resume") return { mode: "playing", paused: false };
	return { mode: "controlled", paused: true };
}

export interface InteractionControl extends InteractionControlState {
	readonly pause: () => void;
	readonly resume: () => void;
}

export function useInteractionControl(preferenceOverride?: MotionPreference): InteractionControl {
	const detectedPreference = useMotionPreference();
	const preference = preferenceOverride ?? detectedPreference;
	const [state, dispatch] = useReducer(interactionControlReducer, preference === "reduced", initialInteractionControl);

	useEffect(() => {
		dispatch({ type: "preference", reduced: preference === "reduced" });
	}, [preference]);

	useEffect(() => {
		if (typeof window === "undefined" || preference === "reduced") return;
		const onPointer = () => dispatch({ type: "direct-input", source: "pointer" });
		const onKeyboard = () => dispatch({ type: "direct-input", source: "keyboard" });
		const onTouch = () => dispatch({ type: "direct-input", source: "touch" });
		window.addEventListener("pointerdown", onPointer, { passive: true });
		window.addEventListener("keydown", onKeyboard);
		window.addEventListener("touchstart", onTouch, { passive: true });
		return () => {
			window.removeEventListener("pointerdown", onPointer);
			window.removeEventListener("keydown", onKeyboard);
			window.removeEventListener("touchstart", onTouch);
		};
	}, [preference]);

	const pause = useCallback(() => dispatch({ type: "pause" }), []);
	const resume = useCallback(() => dispatch({ type: "resume" }), []);
	return { ...state, pause, resume };
}
