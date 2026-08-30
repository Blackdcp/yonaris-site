import type { BuyerQuestionRecord } from "@/content/public-site/contracts/buyer-question";
import type { ProductPageCopy } from "@/content/public-site/contracts/pages/product";
import type { WorkspaceViewId } from "./workspace-state";
import { WORKSPACE_VIEW_IDS } from "./workspace-state";
import { ActionsUnderReviewView } from "./views/actions-under-review-view";
import { BuyerQuestionsView } from "./views/buyer-questions-view";
import { CurrentAnswersView } from "./views/current-answers-view";
import { OutcomeReviewView } from "./views/outcome-review-view";
import { SourcesGapsView } from "./views/sources-gaps-view";

const ViewComponents = {
	"buyer-questions": BuyerQuestionsView,
	"current-answers": CurrentAnswersView,
	"sources-gaps": SourcesGapsView,
	"actions-under-review": ActionsUnderReviewView,
	"outcome-review": OutcomeReviewView,
} as const;

interface WorkspaceStageProps {
	readonly activeView: WorkspaceViewId;
	readonly enhanced: boolean;
	readonly record: BuyerQuestionRecord;
	readonly copy: ProductPageCopy;
	readonly panelProps: (view: WorkspaceViewId) => React.HTMLAttributes<HTMLElement>;
}

export function WorkspaceStage({ activeView, enhanced, record, copy, panelProps }: WorkspaceStageProps) {
	const answerAndReasonIds = record.channelAnswers.flatMap((answer) => [answer.id, ...answer.reasonIds]);
	const evidenceIds = record.evidence.map((evidence) => evidence.id);
	const actionAndGapIds = record.proposedActions.flatMap((action) => [action.id, action.status, action.reviewedBy, ...action.evidenceGapIds]);
	const reviewIds = [
		...record.review.changed.flatMap((item) => item.evidenceIds),
		...record.review.unchanged.flatMap((item) => item.evidenceIds),
		record.review.attribution.status,
	];
	return (
		<div className="site-v1-workspace-stage" aria-live="polite">
			<div className="site-v1-workspace-stage__trace" aria-hidden="true"><i /><i /><i /><i /><i /></div>
			<ol className="site-v1-workspace-stage__record-spine" data-persistent-record-spine aria-label={copy.systemWork.headline}>
				<li><span>{copy.input.headline}</span><p>{record.question}</p><code>{record.id}</code></li>
				<li><span>{copy.systemWork.sequence[0]}</span>{answerAndReasonIds.map((id) => <code key={id}>{id}</code>)}</li>
				<li><span>{copy.systemWork.sequence[2]}</span>{evidenceIds.map((id) => <code data-persistent-evidence-id={id} key={id}>{id}</code>)}</li>
				<li><span>{copy.systemWork.sequence[3]}</span>{record.proposedActions.map((action) => <code key={action.id}>{action.reviewedBy} · {action.status}</code>)}</li>
				<li><span>{copy.systemWork.sequence[4]}</span>{actionAndGapIds.map((id) => <code key={id}>{id}</code>)}</li>
				<li><span>{copy.systemWork.sequence[5]}</span>{reviewIds.map((id) => <code key={id}>{id}</code>)}</li>
			</ol>
			{WORKSPACE_VIEW_IDS.map((view) => {
				const View = ViewComponents[view];
				return (
					<article
						key={view}
						{...panelProps(view)}
						hidden={enhanced ? activeView !== view : false}
						data-workspace-view={view}
						data-record-id={record.id}
						className={`site-v1-workspace-view site-v1-workspace-view--${view}`}
					>
						<View record={record} copy={copy} />
					</article>
				);
			})}
		</div>
	);
}
