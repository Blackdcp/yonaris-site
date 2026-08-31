"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import type { BilingualPublicFact } from "@/content/public-site/contracts/public-fact";
import type { HumanAgentPageCopy } from "@/content/public-site/contracts/pages/human-agent";
import type { SiteEdition } from "@/site/route-types";
import { useMotionPreference } from "../motion/use-motion-preference";
import { HumanAgentProjection } from "./human-agent-projection";

export type HumanAgentLayer = "human" | "evidence" | "agent";

const layers = ["human", "evidence", "agent"] as const satisfies readonly HumanAgentLayer[];
const ringNames = ["outer", "middle", "inner"] as const;
const geometry = {
	human: {
		name: "answer-orbit-expanded",
		depth: "outer-forward",
		mask: "answer-wide",
		density: "narrative",
		outerScale: "1.08",
		middleScale: "0.82",
		innerScale: "0.58",
		focalX: "31%",
		focalY: "38%",
		particleRadius: "14.5rem",
		particleOpacity: "0.58",
	},
	evidence: {
		name: "evidence-orbit-offset",
		depth: "middle-forward",
		mask: "evidence-cross-section",
		density: "contextual",
		outerScale: "0.9",
		middleScale: "1.08",
		innerScale: "0.64",
		focalX: "52%",
		focalY: "52%",
		particleRadius: "11.5rem",
		particleOpacity: "0.78",
	},
	agent: {
		name: "record-core-compressed",
		depth: "inner-forward",
		mask: "record-core",
		density: "structured",
		outerScale: "0.76",
		middleScale: "0.86",
		innerScale: "1.14",
		focalX: "69%",
		focalY: "64%",
		particleRadius: "8.75rem",
		particleOpacity: "0.48",
	},
} as const;

function destination(index: number, key: string) {
	if (key === "Home") return 0;
	if (key === "End") return layers.length - 1;
	if (key === "ArrowRight" || key === "ArrowDown") return (index + 1) % layers.length;
	if (key === "ArrowLeft" || key === "ArrowUp") return (index - 1 + layers.length) % layers.length;
	return undefined;
}

export function EvidenceLens({ copy, edition, fact, ringLabels, agentHref, presentation = "full" }: {
	readonly copy: HumanAgentPageCopy;
	readonly edition: SiteEdition;
	readonly fact: BilingualPublicFact;
	readonly ringLabels: readonly [string, string, string];
	readonly agentHref: string;
	readonly presentation?: "full" | "signature";
}) {
	const [activeLayer, setActiveLayer] = useState<HumanAgentLayer>("human");
	const [enhanced, setEnhanced] = useState(false);
	const controls = useRef<Array<HTMLButtonElement | null>>([]);
	const motionPreference = useMotionPreference();
	const activeIndex = layers.indexOf(activeLayer);
	const activeGeometry = geometry[activeLayer];

	useEffect(() => setEnhanced(true), []);

	function select(index: number, moveFocus = false) {
		const next = layers[index];
		if (!next) return;
		setActiveLayer(next);
		if (moveFocus) controls.current[index]?.focus();
	}

	function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			select(index);
			return;
		}
		const next = destination(index, event.key);
		if (next === undefined) return;
		event.preventDefault();
		select(next, true);
	}

	return (
		<section
			className="site-v1-evidence-lens"
			data-human-agent-lens="true"
			data-presentation={presentation}
			data-fact-id={fact.id}
			data-v1-state={activeLayer}
			data-lens-geometry={activeGeometry.name}
			data-lens-depth={activeGeometry.depth}
			data-lens-focal-mask={activeGeometry.mask}
			data-lens-density={activeGeometry.density}
			data-motion-preference={motionPreference}
			data-enhanced={enhanced ? "true" : undefined}
			aria-label={copy.hero.headline}
		>
			<div
				className="site-v1-evidence-lens__optics"
				data-lens-optics="true"
				style={{
					"--lens-outer-scale": activeGeometry.outerScale,
					"--lens-middle-scale": activeGeometry.middleScale,
					"--lens-inner-scale": activeGeometry.innerScale,
					"--lens-focal-x": activeGeometry.focalX,
					"--lens-focal-y": activeGeometry.focalY,
					"--lens-particle-radius": activeGeometry.particleRadius,
					"--lens-particle-opacity": activeGeometry.particleOpacity,
				} as CSSProperties}
			>
				<div className="site-v1-evidence-lens__focal-mask" aria-hidden="true" />
				<div className="site-v1-evidence-lens__particles" data-visual-atmosphere="true" aria-hidden="true">
					{Array.from({ length: 12 }, (_, index) => <i key={index} style={{ "--particle-index": index } as CSSProperties} />)}
				</div>
				{layers.map((layer, index) => (
					<div key={layer} className={`site-v1-evidence-lens__ring site-v1-evidence-lens__ring--${ringNames[index]}`} data-lens-ring={ringNames[index]}>
						<button
							ref={(node) => { controls.current[index] = node; }}
							type="button"
							data-lens-ring-control="true"
							data-lens-ring={ringNames[index]}
							data-lens-select-layer={layer}
							aria-controls={`human-agent-${layer}-projection`}
							aria-label={`${copy.transformationLabels[index]}: ${ringLabels[index]}`}
							aria-pressed={activeLayer === layer}
							onClick={() => select(index)}
							onPointerUp={(event) => { if (event.pointerType !== "touch") select(index); }}
							onTouchEnd={() => select(index)}
							onKeyDown={(event) => onKeyDown(event, index)}
						>
							<span>{String(index + 1).padStart(2, "0")}</span>
							<strong>{ringLabels[index]}</strong>
						</button>
					</div>
				))}
				<svg className="site-v1-evidence-lens__attachments" viewBox="0 0 600 600" aria-hidden="true">
					<path data-lens-attachment="human" data-active={activeLayer === "human"} d="M92 166 C172 116 224 92 300 74" />
					<path data-lens-attachment="evidence" data-active={activeLayer === "evidence"} d="M126 316 C230 300 370 300 474 280" />
					<path data-lens-attachment="agent" data-active={activeLayer === "agent"} d="M300 526 C348 456 396 410 482 384" />
				</svg>
				<div className="site-v1-evidence-lens__core" aria-hidden="true"><code>{fact.id}</code></div>
			</div>

			<div className="site-v1-evidence-lens__projections" aria-live="polite">
				{layers.map((layer) => (
					<HumanAgentProjection
						key={layer}
						layer={layer}
						active={activeLayer === layer}
						copy={copy}
						edition={edition}
						fact={fact}
						agentHref={agentHref}
					/>
				))}
			</div>
			<p className="site-v1-evidence-lens__discovery-boundary" data-lens-discovery-boundary="true">{copy.boundary}</p>
		</section>
	);
}
