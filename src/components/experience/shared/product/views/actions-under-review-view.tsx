import type { BuyerQuestionRecord } from "@/content/public-site/contracts/buyer-question";
import type { ProductPageCopy } from "@/content/public-site/contracts/pages/product";

export function ActionsUnderReviewView({ record, copy }: { readonly record: BuyerQuestionRecord; readonly copy: ProductPageCopy }) {
	return (
		<div className="site-v1-workspace-review-queue">
			<header><span>{copy.input.labels[1]}</span><h3>{copy.systemWork.sequence[3]}</h3></header>
			<div className="site-v1-workspace-review-queue__gate" aria-hidden="true"><i /><i /><i /></div>
			<div data-human-review-queue>
				{record.proposedActions.map((action) => (
					<article data-reviewed-action={action.id} key={action.id}>
						<header><span>{action.status === "approved" ? copy.theatre.stateLabels[4] : copy.theatre.stateLabels[3]}</span><code>{action.id}</code></header>
						<p>{action.description}</p>
						<footer><code>{action.status}</code><code>{action.reviewedBy}</code><span>{copy.systemWork.sequence[4]}</span></footer>
						<div className="site-v1-workspace-review-queue__gaps">{action.evidenceGapIds.map((id) => <code key={id}>{id}</code>)}</div>
					</article>
				))}
			</div>
			<aside><span>{copy.theatre.stateLabels[2]}</span><p>{record.gaps[0]?.description}</p></aside>
		</div>
	);
}
