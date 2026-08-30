import type { BuyerQuestionRecord } from "@/content/public-site/contracts/buyer-question";
import type { ProductPageCopy } from "@/content/public-site/contracts/pages/product";

export function OutcomeReviewView({ record, copy }: { readonly record: BuyerQuestionRecord; readonly copy: ProductPageCopy }) {
	return (
		<div className="site-v1-workspace-outcome-overlay">
			<header><span>{copy.theatre.stateLabels[5]}</span><h3>{copy.systemWork.sequence[5]}</h3><p>{record.review.reviewedAt}</p></header>
			<div className="site-v1-workspace-outcome-overlay__conditions">
				<span>{copy.theatre.stateLabels[5]}</span><p>{record.observationConditions.market} · {record.observationConditions.language} · {record.observationConditions.observedAt}</p>
			</div>
			<section data-review-comparison="changed"><span>{copy.theatre.stateLabels[6]}</span><p>{record.review.changed[0]?.statement}</p><code>{record.review.changed[0]?.evidenceIds.join(" · ")}</code></section>
			<section data-review-comparison="unchanged"><span>{copy.theatre.stateLabels[7]}</span><p>{record.review.unchanged[0]?.statement}</p><code>{record.review.unchanged[0]?.evidenceIds.join(" · ")}</code></section>
			<footer data-review-comparison="cannot-attribute"><span>{copy.theatre.stateLabels[8]}</span><p>{record.review.attribution.boundary}</p></footer>
		</div>
	);
}
