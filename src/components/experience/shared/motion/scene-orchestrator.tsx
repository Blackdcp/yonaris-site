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
}

export function SceneOrchestrator({
	children,
	ariaLabel,
	pauseLabel,
	resumeLabel,
	preference,
}: SceneOrchestratorProps) {
	const control = useInteractionControl(preference);
	const content = typeof children === "function" ? children(control) : children;
	const canControl = Boolean(pauseLabel && resumeLabel && control.mode !== "reduced");

	return (
		<div
			className="site-v1-scene-orchestrator"
			data-motion-state={control.mode}
			data-motion-paused={control.paused ? "true" : "false"}
			aria-label={ariaLabel}
		>
			{content}
			{canControl ? (
				<button
					type="button"
					className="site-v1-scene-orchestrator__control"
					data-site-v1-motion-control="true"
					onClick={control.paused ? control.resume : control.pause}
				>
					{control.paused ? resumeLabel : pauseLabel}
				</button>
			) : null}
		</div>
	);
}
