"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { CaseworkPageCopy } from "@/content/public-site/contracts/pages/casework";
import { RepresentativeDisclosure } from "../buyer-question/representative-disclosure";
import { useBuyerQuestionRecord } from "../buyer-question/buyer-question-provider";
import { useMotionPreference } from "../motion/use-motion-preference";
import { CaseworkStep } from "./casework-step";

const LAST_STEP = 7;

function boundedStep(index: number) {
	return Math.max(0, Math.min(LAST_STEP, index));
}

export function CaseworkWalkthrough({ copy }: { readonly copy: CaseworkPageCopy }) {
	const record = useBuyerQuestionRecord();
	const motionPreference = useMotionPreference();
	const [activeStep, setActiveStep] = useState(0);
	const [enhanced, setEnhanced] = useState(false);
	const controls = useRef<Array<HTMLButtonElement | null>>([]);

	useEffect(() => setEnhanced(true), []);

	function select(index: number, moveFocus = false) {
		const next = boundedStep(index);
		setActiveStep(next);
		if (moveFocus) controls.current[next]?.focus();
	}

	function onStepKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			select(index);
			return;
		}
		const destination = event.key === "ArrowRight" || event.key === "ArrowDown"
			? index + 1
			: event.key === "ArrowLeft" || event.key === "ArrowUp"
				? index - 1
				: event.key === "Home"
					? 0
					: event.key === "End"
						? LAST_STEP
						: undefined;
		if (destination === undefined) return;
		event.preventDefault();
		select(destination, true);
	}

	return (
		<section
			className="site-v1-casework-timeline"
			data-casework-walkthrough="true"
			data-record-id={record.id}
			data-v1-state={`step-${activeStep + 1}`}
			data-review-phase={activeStep < 6 ? "baseline" : "later-review"}
			data-motion-preference={motionPreference}
			data-enhanced={enhanced ? "true" : undefined}
			data-representative-record="casework-timeline"
			aria-label={copy.timeline.ariaLabel}
		>
			<header className="site-v1-casework-timeline__axis">
				<div><span>{copy.timeline.recordLabel}</span><code>{record.id}</code></div>
				<p>{record.question}</p>
				<small>{record.market} · {record.language}</small>
			</header>

			<div className="site-v1-casework-timeline__scrub" role="group" aria-label={copy.timeline.ariaLabel}>
				<svg aria-hidden="true" viewBox="0 0 1000 96" preserveAspectRatio="none">
					<path d="M18 63 C130 15 220 83 346 46 S558 78 682 35 S856 18 982 52" />
					<path d="M18 64 C255 57 447 64 619 50 S852 44 982 51" />
				</svg>
				{copy.walkthrough.map((step, index) => (
					<button
						key={step.heading}
						ref={(node) => { controls.current[index] = node; }}
						type="button"
						data-casework-select-step={index}
						data-phase={index < 6 ? "baseline" : "later-review"}
						aria-label={`${copy.timeline.stepLabel} ${index + 1}: ${step.heading}`}
						aria-pressed={activeStep === index}
						onClick={() => select(index)}
						onPointerUp={(event) => { if (event.pointerType !== "touch") select(index); }}
						onTouchEnd={() => select(index)}
						onKeyDown={(event) => onStepKeyDown(event, index)}
					>
						<span>{String(index + 1).padStart(2, "0")}</span>
						<small>{step.heading}</small>
					</button>
				))}
			</div>

			<div className="site-v1-casework-timeline__stage" aria-live="polite">
				<div className="site-v1-casework-timeline__field" aria-hidden="true"><i /><i /><i /><i /><i /></div>
				{copy.walkthrough.map((step, index) => (
					<CaseworkStep key={step.heading} copy={copy.timeline} step={step} index={index} record={record} hidden={enhanced && activeStep !== index} />
				))}
			</div>

			<footer className="site-v1-casework-timeline__navigation">
				<button type="button" data-casework-previous onClick={() => select(activeStep - 1)} disabled={activeStep === 0}>{copy.timeline.previousLabel}</button>
				<p><span>{copy.timeline.stepLabel}</span> <strong>{String(activeStep + 1).padStart(2, "0")}</strong> / 08</p>
				<button type="button" data-casework-next onClick={() => select(activeStep + 1)} disabled={activeStep === LAST_STEP}>{copy.timeline.nextLabel}</button>
			</footer>
			<RepresentativeDisclosure>{copy.hero.disclosure}</RepresentativeDisclosure>
		</section>
	);
}
