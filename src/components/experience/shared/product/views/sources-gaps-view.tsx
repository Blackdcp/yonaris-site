import type { BuyerQuestionRecord } from "@/content/public-site/contracts/buyer-question";
import type { ProductPageCopy } from "@/content/public-site/contracts/pages/product";

export function SourcesGapsView({ record, copy }: { readonly record: BuyerQuestionRecord; readonly copy: ProductPageCopy }) {
	const featuredEvidenceIds = new Set([
		...(record.channelAnswers[0]?.evidenceIds ?? []),
		...(record.channelAnswers[record.channelAnswers.length - 1]?.evidenceIds ?? []),
	]);
	const baselineEvidence = record.evidence.filter((item) => item.phase === "baseline" && featuredEvidenceIds.has(item.id));
	return (
		<div className="site-v1-workspace-evidence-map">
			<header><span>{copy.theatre.stateLabels[1]}</span><h3>{copy.systemWork.sequence[2]}</h3></header>
			<ol data-evidence-spine>
				{baselineEvidence.map((evidence, index) => (
					<li data-evidence-id={evidence.id} key={evidence.id}>
						<i aria-hidden="true">{String(index + 1).padStart(2, "0")}</i>
						<div><strong>{evidence.sourceLabel}</strong><p>{evidence.trace}</p><small>{evidence.scope}</small></div>
					</li>
				))}
			</ol>
			<aside data-evidence-gap={record.gaps[0]?.id}>
				<span>{copy.theatre.stateLabels[2]}</span>
				<p>{record.gaps[0]?.description}</p>
				<small>{record.evidence[1]?.boundary}</small>
			</aside>
		</div>
	);
}
