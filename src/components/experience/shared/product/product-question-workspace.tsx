"use client";

import { useEffect, useReducer, useRef, useState, type KeyboardEvent } from "react";
import type { ProductPageCopy } from "@/content/public-site/contracts/pages/product";
import { useBuyerQuestionRecord } from "../buyer-question/buyer-question-provider";
import { RepresentativeDisclosure } from "../buyer-question/representative-disclosure";
import { useMotionPreference } from "../motion/use-motion-preference";
import { useActiveControlRail } from "../use-active-control-rail";
import { WorkspaceStage } from "./workspace-stage";
import type { ProductEvidenceLensConfig, ProductWorkspaceLabels } from "./workspace-record-inspector";
import { initialWorkspaceState, workspaceStateReducer, WORKSPACE_VIEW_IDS, type WorkspaceViewId } from "./workspace-state";

function nextControl(index: number, key: string) {
	if (key === "Home") return 0;
	if (key === "End") return WORKSPACE_VIEW_IDS.length - 1;
	if (key === "ArrowRight" || key === "ArrowDown") return (index + 1) % WORKSPACE_VIEW_IDS.length;
	if (key === "ArrowLeft" || key === "ArrowUp") return (index - 1 + WORKSPACE_VIEW_IDS.length) % WORKSPACE_VIEW_IDS.length;
	return undefined;
}

export function ProductQuestionWorkspace({ copy, evidenceLens, labels }: {
	readonly copy: ProductPageCopy;
	readonly evidenceLens: ProductEvidenceLensConfig;
	readonly labels: ProductWorkspaceLabels;
}) {
	const record = useBuyerQuestionRecord();
	const [state, dispatch] = useReducer(workspaceStateReducer, initialWorkspaceState);
	const [enhanced, setEnhanced] = useState(false);
	const motionPreference = useMotionPreference();
	const controls = useRef<Array<HTMLButtonElement | null>>([]);
	const activeRail = useActiveControlRail({ items: WORKSPACE_VIEW_IDS, active: state.activeView });

	useEffect(() => setEnhanced(true), []);

	function select(view: WorkspaceViewId, moveFocus = false) {
		dispatch({ type: "select", view });
		if (moveFocus) controls.current[WORKSPACE_VIEW_IDS.indexOf(view)]?.focus();
	}

	function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, view: WorkspaceViewId, index: number) {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			select(view);
			return;
		}
		const destination = nextControl(index, event.key);
		if (destination === undefined) return;
		event.preventDefault();
		const next = WORKSPACE_VIEW_IDS[destination];
		if (next) select(next, true);
	}

	return (
		<section
			className="site-v1-product-workspace"
			data-product-question-workspace="true"
			data-record-id={record.id}
			data-v1-state={state.activeView}
			data-motion-preference={motionPreference}
			data-enhanced={enhanced ? "true" : undefined}
			data-representative-record="product-workspace"
		>
			<header className="site-v1-product-workspace__identity">
				<span>{labels.workingRecord}</span>
				<p>{record.question}</p>
				<small>{record.market} / {record.language}</small>
			</header>
			<div ref={activeRail.railRef} className="site-v1-product-workspace__controls" role="group" aria-label={copy.hero.headline} data-workspace-view-controls data-rail-position={activeRail.position} data-rail-total={activeRail.total}>
				<svg aria-hidden="true" viewBox="0 0 1000 24" preserveAspectRatio="none"><path d="M12 16 C190 3 320 22 490 11 S790 4 988 15" /></svg>
				{WORKSPACE_VIEW_IDS.map((view, index) => (
					<button
						ref={(node) => { controls.current[index] = node; activeRail.getControlRef(view)(node); }}
						key={view}
						type="button"
						data-workspace-view-control={view}
						aria-controls="product-workspace-record-inspector"
						aria-pressed={state.activeView === view}
						tabIndex={state.activeView === view ? 0 : -1}
						onClick={() => select(view)}
						onPointerUp={(event) => { if (event.pointerType !== "touch") select(view); }}
						onTouchEnd={() => select(view)}
						onKeyDown={(event) => onKeyDown(event, view, index)}
					>
						<span>{String(index + 1).padStart(2, "0")}</span>{copy.theatre.workingViews[index]}
					</button>
				))}
			</div>
			<div id="product-workspace-record-inspector">
				<WorkspaceStage activeView={state.activeView} enhanced={enhanced} record={record} copy={copy} evidenceLens={evidenceLens} labels={labels} />
			</div>
			<RepresentativeDisclosure>{record.disclosure.boundary}</RepresentativeDisclosure>
		</section>
	);
}
