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
	const reviewIds = [
		...record.review.changed.flatMap((item) => item.evidenceIds),
		...record.review.unchanged.flatMap((item) => item.evidenceIds),
		record.review.attribution.status,
	];
	return (
		<div className="site-v1-workspace-stage" aria-live="polite">
			<div className="site-v1-workspace-stage__trace" aria-hidden="true"><i /><i /><i /><i /><i /></div>
			<div className="site-v1-workspace-stage__record-anchors" data-persistent-record-anchors>
				<article>
					<span>{copy.input.labels[1]}</span><p>{record.question}</p><code>{record.id}</code>
				</article>
				<div className="site-v1-workspace-stage__evidence-line" aria-label={copy.systemWork.sequence[2]}>
					<span>{copy.theatre.stateLabels[1]}</span>
					{record.evidence.map((evidence) => <code data-persistent-evidence-id={evidence.id} key={evidence.id}>{evidence.id}<small>{evidence.sourceId}</small></code>)}
				</div>
				<article>
					<span>{copy.systemWork.sequence[3]}</span>
					{record.proposedActions.map((action) => <code key={action.id}>{action.id} · {action.reviewedBy} · {action.status} · {action.evidenceGapIds.join(" · ")}</code>)}
					<span>{copy.systemWork.sequence[5]}</span>
					{reviewIds.map((id) => <code key={id}>{id}</code>)}
				</article>
			</div>
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
