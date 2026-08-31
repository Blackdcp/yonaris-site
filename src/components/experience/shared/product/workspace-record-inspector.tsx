import type { BilingualPublicFact } from "@/content/public-site/contracts/public-fact";
import type { BuyerQuestionRecord } from "@/content/public-site/contracts/buyer-question";
import type { HumanAgentPageCopy } from "@/content/public-site/contracts/pages/human-agent";
import type { ProductPageCopy } from "@/content/public-site/contracts/pages/product";
import type { SiteEdition } from "@/site/route-types";
import { EvidenceLens } from "../human-agent/evidence-lens";
import {
	getWorkspaceObjectEmphasis,
	type WorkspaceObjectKind,
	type WorkspaceViewId,
} from "./workspace-state";

export interface ProductEvidenceLensConfig {
	readonly copy: HumanAgentPageCopy;
	readonly edition: SiteEdition;
	readonly fact: BilingualPublicFact;
	readonly ringLabels: readonly [string, string, string];
	readonly agentHref: string;
}

export interface ProductWorkspaceLabels {
	readonly workingRecord: string;
	readonly inspectRecord: string;
	readonly machineFields: {
		readonly record: string;
		readonly answers: string;
		readonly reasons: string;
		readonly evidence: string;
		readonly gaps: string;
		readonly actions: string;
		readonly review: string;
	};
}

interface WorkspaceRecordInspectorProps {
	readonly activeView: WorkspaceViewId;
	readonly enhanced: boolean;
	readonly record: BuyerQuestionRecord;
	readonly copy: ProductPageCopy;
	readonly evidenceLens: ProductEvidenceLensConfig;
	readonly labels: ProductWorkspaceLabels;
}

function emphasis(activeView: WorkspaceViewId, object: WorkspaceObjectKind) {
	return getWorkspaceObjectEmphasis(activeView, object);
}

function RecordDetails({ record, labels }: { readonly record: BuyerQuestionRecord; readonly labels: ProductWorkspaceLabels }) {
	return (
		<details className="site-v1-workspace-inspector__record" data-inspect-record>
			<summary>{labels.inspectRecord}</summary>
			<div>
				<dl>
					<div><dt>{labels.machineFields.record}</dt><dd><code>{record.id}</code></dd></div>
					<div><dt>{labels.machineFields.answers}</dt><dd>{record.channelAnswers.map((answer) => <code key={answer.id}>{answer.id}</code>)}</dd></div>
					<div><dt>{labels.machineFields.reasons}</dt><dd>{record.comparisonReasons.map((reason) => <code key={reason.id}>{reason.id}</code>)}</dd></div>
					<div><dt>{labels.machineFields.evidence}</dt><dd>{record.evidence.map((item) => <code key={item.id}>{item.id}<small>{item.sourceId}</small></code>)}</dd></div>
					<div><dt>{labels.machineFields.gaps}</dt><dd>{record.gaps.map((gap) => <code key={gap.id}>{gap.id}</code>)}</dd></div>
					<div><dt>{labels.machineFields.actions}</dt><dd>{record.proposedActions.map((action) => <code key={action.id}>{action.id} / {action.reviewedBy} / {action.status} / {action.evidenceGapIds.join(" / ")}</code>)}</dd></div>
					<div><dt>{labels.machineFields.review}</dt><dd><code>{record.review.changed.flatMap((item) => item.evidenceIds).join(" / ")}</code><code>{record.review.unchanged.flatMap((item) => item.evidenceIds).join(" / ")}</code><code>{record.review.attribution.status}</code></dd></div>
				</dl>
			</div>
		</details>
	);
}

export function WorkspaceRecordInspector({ activeView, enhanced, record, copy, evidenceLens, labels }: WorkspaceRecordInspectorProps) {
	const featuredReasons = record.comparisonReasons.slice(0, 2);
	const featuredEvidence = record.evidence.filter((item) => item.phase === "baseline").slice(0, 2);
	const action = record.proposedActions[0];
	const gap = record.gaps[0];
	const alternatives = [...new Set(record.comparisonReasons.map((reason) => reason.subject))];

	return (
		<div
			className="site-v1-workspace-inspector"
			data-workspace-record-inspector
			data-record-id={record.id}
			data-active-view={activeView}
			data-enhanced={enhanced ? "true" : undefined}
		>
			<svg className="site-v1-workspace-inspector__connections" viewBox="0 0 1200 760" preserveAspectRatio="none" aria-hidden="true">
				<path data-record-connection="question-answer" d="M230 160 C410 84 500 84 610 190" />
				<path data-record-connection="answer-reason" d="M610 190 C790 230 850 280 930 350" />
				<path data-record-connection="reason-evidence" d="M930 350 C800 450 700 470 570 510" />
				<path data-record-connection="evidence-action" d="M570 510 C420 570 390 600 260 650" />
				<path data-record-connection="action-review" d="M260 650 C560 710 800 690 1010 610" />
			</svg>

			<article id="how-it-works" className="site-v1-workspace-object site-v1-workspace-object--question" data-workspace-object="question" data-emphasis={emphasis(activeView, "question")}>
				<header><span>{copy.input.labels[1]}</span><small>{copy.input.headline}</small></header>
				<blockquote>{record.question}</blockquote>
			</article>

			<section className="site-v1-workspace-object site-v1-workspace-object--answers" data-workspace-object="answers" data-emphasis={emphasis(activeView, "answers")}>
				<header><span>{copy.theatre.stateLabels[0]}</span><h3>{copy.systemWork.sequence[0]}</h3></header>
				<p data-team-output>{copy.teamOutput.items[0]}</p>
				<div>
					{record.channelAnswers.map((answer) => (
						<article key={answer.id} data-answer-id={answer.id}>
							<strong>{answer.environment}</strong>
							<p>{answer.answer}</p>
						</article>
					))}
				</div>
			</section>

			<section className="site-v1-workspace-object site-v1-workspace-object--reasons" data-workspace-object="reasons" data-emphasis={emphasis(activeView, "reasons")}>
				<header><span>{copy.systemWork.sequence[1]}</span></header>
				<div>
					{featuredReasons.map((reason) => (
						<article key={reason.id} data-reason-id={reason.id} data-disposition={reason.disposition}>
							<strong>{reason.subject}</strong><p>{reason.reason}</p>
						</article>
					))}
				</div>
			</section>

			<section className="site-v1-workspace-object site-v1-workspace-object--evidence" data-workspace-object="evidence" data-emphasis={emphasis(activeView, "evidence")}>
				<header><span>{copy.theatre.stateLabels[1]}</span><h3>{copy.systemWork.sequence[2]}</h3></header>
				<p data-team-output>{copy.teamOutput.items[1]}</p>
				<div>
					{featuredEvidence.map((item) => (
						<article key={item.id} data-evidence-id={item.id}>
							<strong>{item.sourceLabel}</strong><p>{item.trace}</p><small>{item.scope}</small>
						</article>
					))}
				</div>
			</section>

			<aside className="site-v1-workspace-object site-v1-workspace-object--gap" data-workspace-object="gap" data-emphasis={emphasis(activeView, "gap")} data-gap-id={gap?.id}>
				<span>{copy.theatre.stateLabels[2]}</span>
				<p>{gap?.description}</p>
			</aside>

			<section className="site-v1-workspace-object site-v1-workspace-object--action" data-workspace-object="action" data-emphasis={emphasis(activeView, "action")} data-action-id={action?.id} data-reviewed-by={action?.reviewedBy}>
				<header><span>{action?.status === "approved" ? copy.theatre.stateLabels[4] : copy.theatre.stateLabels[3]}</span><h3>{copy.systemWork.sequence[3]}</h3></header>
				<p>{action?.description}</p>
				<footer><strong>{copy.systemWork.sequence[4]}</strong><small data-team-output>{copy.teamOutput.items[2]}</small></footer>
			</section>

			<section className="site-v1-workspace-object site-v1-workspace-object--review" data-workspace-object="review" data-emphasis={emphasis(activeView, "review")}>
				<header><span>{copy.theatre.stateLabels[5]}</span><h3>{copy.systemWork.sequence[5]}</h3><small>{record.review.reviewedAt}</small></header>
				<div data-review-comparison="changed"><strong>{copy.theatre.stateLabels[6]}</strong><p>{record.review.changed[0]?.statement}</p></div>
				<div data-review-comparison="unchanged"><strong>{copy.theatre.stateLabels[7]}</strong><p>{record.review.unchanged[0]?.statement}</p></div>
				<footer data-review-comparison="cannot-attribute"><strong>{copy.theatre.stateLabels[8]}</strong><p>{record.review.attribution.boundary}</p><small data-team-output>{copy.teamOutput.items[3]}</small></footer>
			</section>

			<aside id="markets-languages" className="site-v1-workspace-object site-v1-workspace-object--conditions" data-workspace-object="conditions" data-emphasis={emphasis(activeView, "conditions")}>
				<header><span>{copy.markets.headline}</span><p>{copy.markets.body}</p></header>
				<dl>
					<div><dt>{copy.input.labels[0]}</dt><dd>{record.market}<br />{record.audience}</dd></div>
					<div><dt>{copy.input.labels[4]}</dt><dd>{record.language}</dd></div>
					<div><dt>{copy.input.labels[3]}</dt><dd>{record.observationConditions.channels.join(" / ")}</dd></div>
					<div><dt>{copy.input.labels[5]}</dt><dd>{alternatives.join(" / ")}</dd></div>
				</dl>
				<p>{record.observationConditions.boundary}</p>
			</aside>

			<section className="site-v1-workspace-inspector__lens" data-product-evidence-lens data-machine-projection>
				<header><span>{copy.humanAgent.headline}</span><p>{copy.humanAgent.body}</p></header>
				<EvidenceLens {...evidenceLens} presentation="signature" />
			</section>

			<RecordDetails record={record} labels={labels} />
		</div>
	);
}
