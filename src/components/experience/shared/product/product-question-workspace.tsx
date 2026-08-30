"use client";

import { useEffect, useReducer, useState, type KeyboardEvent } from "react";
import type { ProductPageCopy } from "@/content/public-site/contracts/pages/product";
import { useBuyerQuestionRecord } from "../buyer-question/buyer-question-provider";
import { RepresentativeDisclosure } from "../buyer-question/representative-disclosure";
import { useMotionPreference } from "../motion/use-motion-preference";
import { useRovingTabs } from "../use-roving-tabs";
import { WorkspaceStage } from "./workspace-stage";
import { initialWorkspaceState, workspaceStateReducer, WORKSPACE_VIEW_IDS, type WorkspaceViewId } from "./workspace-state";

export function ProductQuestionWorkspace({ copy }: { readonly copy: ProductPageCopy }) {
	const record = useBuyerQuestionRecord();
	const [state, dispatch] = useReducer(workspaceStateReducer, initialWorkspaceState);
	const [enhanced, setEnhanced] = useState(false);
	const motionPreference = useMotionPreference();
	const orientation = "horizontal" as const;
	useEffect(() => setEnhanced(true), []);
	const select = (view: WorkspaceViewId) => dispatch({ type: "select", view });
	const tabs = useRovingTabs({ items: WORKSPACE_VIEW_IDS, active: state.activeView, onChange: select, idPrefix: "product-workspace", orientation });

	function activationKey(event: KeyboardEvent<HTMLButtonElement>, view: WorkspaceViewId) {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			select(view);
		}
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
				<span>{record.id}</span>
				<p>{record.question}</p>
				<small>{record.market} · {record.language}</small>
			</header>
			<div className="site-v1-product-workspace__controls" role="tablist" aria-label={copy.hero.headline} aria-orientation={orientation}>
				{WORKSPACE_VIEW_IDS.map((view, index) => {
					const props = tabs.getTabProps(view, index);
					return (
						<button
							key={view}
							type="button"
							{...props}
							onPointerUp={(event) => { if (event.pointerType !== "touch") select(view); }}
							onTouchEnd={() => select(view)}
							onKeyDown={(event) => { activationKey(event, view); props.onKeyDown?.(event); }}
						>
							<span>{String(index + 1).padStart(2, "0")}</span>{copy.theatre.workingViews[index]}
						</button>
					);
				})}
			</div>
			<WorkspaceStage activeView={state.activeView} enhanced={enhanced} record={record} copy={copy} panelProps={tabs.getPanelProps} />
			<RepresentativeDisclosure>{record.disclosure.boundary}</RepresentativeDisclosure>
		</section>
	);
}
