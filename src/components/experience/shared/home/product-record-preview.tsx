"use client";

import { useEffect, useState } from "react";
import type { HomePageCopy } from "@/content/public-site/contracts/pages/home";
import { useBuyerQuestionRecord } from "../buyer-question/buyer-question-provider";
import { RepresentativeDisclosure } from "../buyer-question/representative-disclosure";
import { useRovingTabs } from "../use-roving-tabs";

const VIEW_IDS = ["buyer-question", "current-answer", "comparison-evidence", "reviewed-action", "later-review"] as const;
const GEOMETRIES = ["question-plane", "answer-fan", "evidence-spine", "review-gate", "review-overlay"] as const;
type ViewId = (typeof VIEW_IDS)[number];

export function ProductRecordPreview({ copy, disclosure }: { readonly copy: HomePageCopy["productPreview"]; readonly disclosure: string }) {
	const record = useBuyerQuestionRecord();
	const [active, setActive] = useState<ViewId>(VIEW_IDS[0]);
	const [enhanced, setEnhanced] = useState(false);
	useEffect(() => setEnhanced(true), []);
	const tabs = useRovingTabs({ items: VIEW_IDS, active, onChange: setActive, idPrefix: "home-product-record" });
	const content = [
		[record.question],
		[record.channelAnswers[0]?.answer ?? ""],
		[record.comparisonReasons[0]?.reason ?? "", record.gaps[0]?.description ?? ""],
		[record.proposedActions[0]?.description ?? ""],
		[
			record.review.changed[0]?.statement ?? "",
			record.review.unchanged[0]?.statement ?? "",
			record.review.attribution.boundary,
		],
	] as const;

	return (
		<section
			className="site-v1-product-preview"
			data-product-record-preview="true"
			data-record-id={record.id}
			data-v1-state={active}
			data-enhanced={enhanced ? "true" : undefined}
			data-representative-record="product-preview"
		>
			<header>
				<span>{record.id}</span>
				<h2>{copy.headline}</h2>
				<p data-buyer-question>{record.question}</p>
			</header>
			<div className="site-v1-product-preview__tabs" role="tablist" aria-label={copy.headline} aria-orientation="horizontal">
				{VIEW_IDS.map((id, index) => <button key={id} type="button" {...tabs.getTabProps(id, index)}>{copy.workingViews[index]}</button>)}
			</div>
			<div className="site-v1-product-preview__stage" aria-live="polite">
				<div className="site-v1-product-preview__identity" aria-hidden="true"><i /><i /><i /><i /></div>
				{VIEW_IDS.map((id, index) => {
					const selected = active === id;
					return (
						<article
							key={id}
							{...tabs.getPanelProps(id)}
							hidden={enhanced ? !selected : false}
							data-record-id={record.id}
							data-record-view={id}
							data-active-record-view={selected ? "true" : undefined}
							data-geometry={GEOMETRIES[index]}
						>
							<span>{String(index + 1).padStart(2, "0")}</span>
							<h3>{copy.workingViews[index]}</h3>
							{content[index]?.map((line) => <p key={line}>{line}</p>)}
						</article>
					);
				})}
			</div>
			<RepresentativeDisclosure>{disclosure}</RepresentativeDisclosure>
		</section>
	);
}
