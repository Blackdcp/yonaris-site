import type { BuyerQuestionRecord } from "@/content/public-site/contracts/buyer-question";
import type { ProductPageCopy } from "@/content/public-site/contracts/pages/product";

export function CurrentAnswersView({ record, copy }: { readonly record: BuyerQuestionRecord; readonly copy: ProductPageCopy }) {
	return (
		<div className="site-v1-workspace-answer-environments">
			<header><span>{copy.theatre.stateLabels[0]}</span><h3>{copy.systemWork.sequence[0]}</h3></header>
			<div className="site-v1-workspace-answer-environments__fan">
				{record.channelAnswers.map((answer, index) => (
					<article data-answer-sheet={answer.id} key={answer.id} style={{ "--answer-index": index } as React.CSSProperties}>
						<header><span>{String(index + 1).padStart(2, "0")}</span><h4>{answer.environment}</h4></header>
						<p>{answer.answer}</p>
						<footer>{answer.evidenceIds.map((id) => <code key={id}>{id}</code>)}</footer>
					</article>
				))}
			</div>
			<p>{record.observationConditions.boundary}</p>
		</div>
	);
}
