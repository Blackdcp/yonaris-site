"use client";

import type { ReactNode } from "react";
import { useInteractionControl, type InteractionControl } from "./use-interaction-control";
import type { MotionPreference } from "./use-motion-preference";

export interface SceneOrchestratorProps {
	readonly children: ReactNode | ((control: InteractionControl) => ReactNode);
	readonly ariaLabel?: string;
	readonly pauseLabel?: string;
	readonly resumeLabel?: string;
	readonly preference?: MotionPreference;
	readonly controlPlacement?: "overlay" | "flow";
}

export function SceneOrchestrator({
	children,
	ariaLabel,
	pauseLabel,
	resumeLabel,
	preference,
	controlPlacement = "overlay",
}: SceneOrchestratorProps) {
	const control = useInteractionControl(preference);
	const content = typeof children === "function" ? children(control) : children;
	const canControl = Boolean(pauseLabel && resumeLabel && control.mode !== "reduced");
	const controlButton = canControl ? (
		<button
			type="button"
			className="site-v1-scene-orchestrator__control"
			data-site-v1-motion-control="true"
			onClick={control.paused ? control.resume : control.pause}
		>
			{control.paused ? resumeLabel : pauseLabel}
		</button>
	) : null;

	return (
		<div
			className="site-v1-scene-orchestrator"
			data-motion-state={control.mode}
			data-motion-paused={control.paused ? "true" : "false"}
			data-control-placement={controlPlacement}
			aria-label={ariaLabel}
		>
			{content}
			{controlPlacement === "flow" && controlButton ? <div className="site-v1-scene-orchestrator__flow-control">{controlButton}</div> : controlButton}
		</div>
	);
}
