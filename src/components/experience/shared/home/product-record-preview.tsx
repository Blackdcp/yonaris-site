"use client";

import { useEffect, useState } from "react";
import type { HomeCaseworkStateLabels, HomePageCopy, HomeSiteV1Copy } from "@/content/public-site/contracts/pages/home";
import { useBuyerQuestionRecord } from "../buyer-question/buyer-question-provider";
import { RepresentativeDisclosure } from "../buyer-question/representative-disclosure";
import { useActiveControlRail } from "../use-active-control-rail";
import { useRovingTabs } from "../use-roving-tabs";

const VIEW_IDS = ["buyer-question", "current-answer", "comparison-evidence", "reviewed-action", "later-review"] as const;
const GEOMETRIES = ["question-plane", "answer-fan", "evidence-spine", "review-gate", "review-overlay"] as const;
type ViewId = (typeof VIEW_IDS)[number];

interface ProductRecordPreviewProps {
	readonly copy: HomePageCopy["productPreview"];
	readonly disclosure: string;
	readonly recordLabels: HomeSiteV1Copy["productRecord"];
	readonly stateLabels: HomeCaseworkStateLabels;
}

export function ProductRecordPreview({ copy, disclosure, recordLabels, stateLabels }: ProductRecordPreviewProps) {
	const record = useBuyerQuestionRecord();
	const [active, setActive] = useState<ViewId>(VIEW_IDS[0]);
	const [enhanced, setEnhanced] = useState(false);
	useEffect(() => setEnhanced(true), []);
	const tabs = useRovingTabs({ items: VIEW_IDS, active, onChange: setActive, idPrefix: "home-product-record" });
	const rail = useActiveControlRail({ items: VIEW_IDS, active });
	const activeIndex = VIEW_IDS.indexOf(active);
	const previous = activeIndex > 0 ? VIEW_IDS[activeIndex - 1] : undefined;
	const next = activeIndex < VIEW_IDS.length - 1 ? VIEW_IDS[activeIndex + 1] : undefined;
	const initialAnswer = record.channelAnswers[0];
	const initialReasons = initialAnswer?.reasonIds
		.map((reasonId) => record.comparisonReasons.find((reason) => reason.id === reasonId))
		.filter((reason) => reason !== undefined) ?? [];
	const views = [
		<div className="site-v1-record-geometry site-v1-record-geometry--question" key="question">
			<blockquote>{record.question}</blockquote>
			<dl>
				<div><dt>{recordLabels.audience}</dt><dd>{record.audience}</dd></div>
				<div><dt>{recordLabels.market}</dt><dd>{record.market}</dd></div>
				<div><dt>{recordLabels.language}</dt><dd>{record.language}</dd></div>
			</dl>
		</div>,
		<div className="site-v1-record-geometry site-v1-record-geometry--answers" key="answers">
			<p className="site-v1-record-geometry__active-answer">{initialAnswer?.answer}</p>
			<ol>
				{record.channelAnswers.map((answer, answerIndex) => (
					<li data-answer-environment={answer.id} key={answer.id}>
						<span>{String(answerIndex + 1).padStart(2, "0")}</span>
						<strong>{answer.environment}</strong>
					</li>
				))}
			</ol>
		</div>,
		<div className="site-v1-record-geometry site-v1-record-geometry--evidence" key="evidence">
			<ol>
				{initialReasons.map((reason) => (
					<li data-comparison-node={reason.id} key={reason.id}>
						<span>{reason.disposition}</span>
						<strong>{reason.subject}</strong>
						<p>{reason.reason}</p>
					</li>
				))}
			</ol>
			<aside data-evidence-gap={record.gaps[0]?.id}>
				<span>{stateLabels.evidenceGap}</span>
				<p>{record.gaps[0]?.description}</p>
			</aside>
		</div>,
		<div className="site-v1-record-geometry site-v1-record-geometry--action" key="action">
			<div className="site-v1-record-geometry__review-gate" aria-hidden="true"><i /><i /><i /></div>
			<section data-reviewed-action={record.proposedActions[0]?.id}>
				<span>{stateLabels.reviewedAction}</span>
				<p>{record.proposedActions[0]?.description}</p>
				<strong data-human-reviewer={record.proposedActions[0]?.reviewedBy}>{recordLabels.humanReviewed} · {record.proposedActions[0]?.status}</strong>
			</section>
		</div>,
		<div className="site-v1-record-geometry site-v1-record-geometry--review" key="review">
			<section data-review-result="changed"><span>{stateLabels.changed}</span><p>{record.review.changed[0]?.statement}</p></section>
			<section data-review-result="unchanged"><span>{stateLabels.unchanged}</span><p>{record.review.unchanged[0]?.statement}</p></section>
			<footer data-review-result="cannot-attribute"><span>{stateLabels.cannotAttribute}</span><p>{record.review.attribution.boundary}</p></footer>
		</div>,
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
				<h2>{copy.headline}</h2>
				<p data-buyer-question>{record.question}</p>
			</header>
			<div ref={rail.railRef} className="site-v1-product-preview__tabs" role="tablist" aria-label={copy.headline} aria-orientation="horizontal">
				{VIEW_IDS.map((id, index) => <button ref={rail.getControlRef(id)} key={id} type="button" {...tabs.getTabProps(id, index)}>{copy.workingViews[index]}</button>)}
			</div>
			<div className="site-v1-product-preview__rail-status" aria-live="polite">
				<button type="button" disabled={!previous} aria-label={copy.workingViews[Math.max(0, activeIndex - 1)]} onClick={() => previous && setActive(previous)}>{"<"}</button>
				<output data-record-progress>{rail.position} / {rail.total}</output>
				<button type="button" disabled={!next} aria-label={copy.workingViews[Math.min(VIEW_IDS.length - 1, activeIndex + 1)]} data-record-continuation onClick={() => next && setActive(next)}>{">"}</button>
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
							<header>
								<span>{String(index + 1).padStart(2, "0")}</span>
								<h3>{copy.workingViews[index]}</h3>
							</header>
							{views[index]}
						</article>
					);
				})}
			</div>
			<RepresentativeDisclosure>{disclosure}</RepresentativeDisclosure>
		</section>
	);
}
