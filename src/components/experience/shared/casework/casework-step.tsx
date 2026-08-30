import type { BuyerQuestionRecord, ComparisonReason, EvidenceGap, EvidenceItem, ReviewedAction } from "@/content/public-site/contracts/buyer-question";
import type { CaseworkStep as CaseworkStepCopy, CaseworkTimelineCopy } from "@/content/public-site/contracts/pages/casework";

interface Projection {
	readonly answerIds: readonly string[];
	readonly reasonIds: readonly string[];
	readonly evidenceIds: readonly string[];
	readonly sourceIds: readonly string[];
	readonly gapIds: readonly string[];
	readonly actionIds: readonly string[];
	readonly recordIds: readonly string[];
	readonly reviewerIds: readonly string[];
	readonly limitIds: readonly string[];
}

function unique(values: readonly (string | undefined)[]) {
	return [...new Set(values.filter((value): value is string => Boolean(value)))];
}

function reasonsByIds(record: BuyerQuestionRecord, ids: readonly string[]): ComparisonReason[] {
	return ids.flatMap((id) => record.comparisonReasons.find((reason) => reason.id === id) ?? []);
}

function evidenceByIds(record: BuyerQuestionRecord, ids: readonly string[]): EvidenceItem[] {
	return ids.flatMap((id) => record.evidence.find((evidence) => evidence.id === id) ?? []);
}

function gapsByIds(record: BuyerQuestionRecord, ids: readonly string[]): EvidenceGap[] {
	return ids.flatMap((id) => record.gaps.find((gap) => gap.id === id) ?? []);
}

function projectionForStep(index: number, record: BuyerQuestionRecord): Projection {
	const firstAnswer = record.channelAnswers[0];
	const firstAnswerReasons = reasonsByIds(record, firstAnswer?.reasonIds ?? []);
	const excludedReason = firstAnswerReasons.find((reason) => reason.disposition === "excluded") ?? firstAnswerReasons[0];
	const firstGap = record.gaps[0];
	const gapReasons = reasonsByIds(record, firstGap?.affectedReasonIds ?? []);
	const firstAction = record.proposedActions[0];
	const actionGaps = gapsByIds(record, firstAction?.evidenceGapIds ?? []);
	const actionReasonIds = unique(actionGaps.flatMap((gap) => gap.affectedReasonIds));
	const actionReasons = reasonsByIds(record, actionReasonIds);
	const changedEvidenceIds = unique(record.review.changed.flatMap((item) => item.evidenceIds));
	const unchangedEvidenceIds = unique(record.review.unchanged.flatMap((item) => item.evidenceIds));
	let answerIds: readonly string[] = [];
	let reasonIds: readonly string[] = [];
	let evidenceIds: readonly string[] = [];
	let gapIds: readonly string[] = [];
	let actionIds: readonly string[] = [];
	let recordIds: readonly string[] = [];
	let reviewerIds: readonly string[] = [];
	let limitIds: readonly string[] = [];

	if (index === 0) {
		answerIds = unique([firstAnswer?.id]);
		reasonIds = unique([excludedReason?.id]);
		evidenceIds = unique(excludedReason?.evidenceIds ?? []);
	} else if (index === 1) {
		recordIds = [record.id];
	} else if (index === 2 || index === 3) {
		answerIds = unique([firstAnswer?.id]);
		reasonIds = unique(firstAnswerReasons.map((reason) => reason.id));
		evidenceIds = unique(firstAnswerReasons.flatMap((reason) => reason.evidenceIds));
	} else if (index === 4) {
		gapIds = unique([firstGap?.id]);
		reasonIds = unique(firstGap?.affectedReasonIds ?? []);
		evidenceIds = unique(gapReasons.flatMap((reason) => reason.evidenceIds));
	} else if (index === 5) {
		actionIds = unique([firstAction?.id]);
		gapIds = unique(firstAction?.evidenceGapIds ?? []);
		reviewerIds = unique([firstAction?.reviewedBy]);
		reasonIds = actionReasonIds;
		evidenceIds = unique(actionReasons.flatMap((reason) => reason.evidenceIds));
	} else if (index === 6 || index === 7) {
		evidenceIds = unique([...changedEvidenceIds, ...unchangedEvidenceIds]);
		limitIds = index === 6 ? [record.review.attribution.status] : [record.review.attribution.status, record.disclosure.sourceId];
	}

	return {
		answerIds,
		reasonIds,
		evidenceIds,
		sourceIds: unique(evidenceByIds(record, evidenceIds).map((evidence) => evidence.sourceId)),
		gapIds,
		actionIds,
		recordIds,
		reviewerIds,
		limitIds,
	};
}

function ProjectionRow({ label, values, dataName }: { readonly label: string; readonly values: readonly string[]; readonly dataName: string }) {
	if (values.length === 0) return null;
	return (
		<div data-casework-projection={dataName}>
			<dt>{label}</dt>
			<dd>{values.map((value) => (
				<code key={value} data-canonical-kind={dataName} data-canonical-id={value} {...{ [`data-${dataName}-id`]: value }}>{value}</code>
			))}</dd>
		</div>
	);
}

function LaterObservation({ copy, record }: { readonly copy: CaseworkTimelineCopy; readonly record: BuyerQuestionRecord }) {
	return (
		<div className="site-v1-casework-step__observation" data-later-observation-overlay>
			<div className="site-v1-casework-step__conditions">
				<span>{copy.conditionsLabel}</span>
				<p>{record.review.reviewedAt} · {record.review.reviewConditionsFrozen ? record.observationConditions.boundary : ""}</p>
			</div>
			<section data-review-result="changed"><span>{copy.changedLabel}</span><p>{record.review.changed[0]?.statement}</p><code>{record.review.changed[0]?.evidenceIds.join(" · ")}</code></section>
			<section data-review-result="unchanged"><span>{copy.unchangedLabel}</span><p>{record.review.unchanged[0]?.statement}</p><code>{record.review.unchanged[0]?.evidenceIds.join(" · ")}</code></section>
			<footer data-review-result="cannot-attribute"><span>{copy.cannotAttributeLabel}</span><p>{record.review.attribution.boundary}</p><code>{record.review.attribution.status}</code><small>{copy.noCommercialOutcomeLabel}</small></footer>
		</div>
	);
}

function HumanReviewGate({ copy, action }: { readonly copy: CaseworkTimelineCopy; readonly action: ReviewedAction | undefined }) {
	if (!action) return null;
	return <aside className="site-v1-casework-step__review-gate" data-human-review-gate><span>{copy.reviewLabel}</span><strong>{action.reviewedBy}</strong><p>{action.description}</p><code>{action.id} · {action.evidenceGapIds.join(" · ")}</code></aside>;
}

export function CaseworkStep({ copy, step, index, record, hidden }: {
	readonly copy: CaseworkTimelineCopy;
	readonly step: CaseworkStepCopy;
	readonly index: number;
	readonly record: BuyerQuestionRecord;
	readonly hidden: boolean;
}) {
	const projection = projectionForStep(index, record);
	return (
		<article className="site-v1-casework-step" data-casework-step={index} data-record-id={record.id} data-step-phase={index < 6 ? "baseline" : "later-review"} hidden={hidden || undefined}>
			<header className="site-v1-casework-step__copy">
				<div><span>{index < 6 ? copy.baselineLabel : copy.laterReviewLabel}</span><strong>{String(index + 1).padStart(2, "0")}</strong></div>
				<h3>{step.heading}</h3><p>{step.body}</p>
			</header>
			{index === 1 ? <blockquote>{record.question}</blockquote> : null}
			{index === 5 ? <HumanReviewGate copy={copy} action={record.proposedActions[0]} /> : null}
			{index >= 6 ? <LaterObservation copy={copy} record={record} /> : null}
			{index === 7 ? <p className="site-v1-casework-step__boundary">{record.disclosure.boundary}</p> : null}
			<dl className="site-v1-casework-step__projection" aria-label={step.heading}>
				<ProjectionRow label={copy.recordLabel} values={projection.recordIds} dataName="record" />
				<ProjectionRow label={copy.answersLabel} values={projection.answerIds} dataName="answer" />
				<ProjectionRow label={copy.reasonsLabel} values={projection.reasonIds} dataName="reason" />
				<ProjectionRow label={copy.evidenceLabel} values={projection.evidenceIds} dataName="evidence" />
				<ProjectionRow label={copy.sourcesLabel} values={projection.sourceIds} dataName="source" />
				<ProjectionRow label={copy.gapsLabel} values={projection.gapIds} dataName="gap" />
				<ProjectionRow label={copy.actionsLabel} values={projection.actionIds} dataName="action" />
				<ProjectionRow label={copy.reviewLabel} values={projection.reviewerIds} dataName="reviewer" />
				<ProjectionRow label={copy.cannotAttributeLabel} values={projection.limitIds} dataName="limit" />
			</dl>
		</article>
	);
}
