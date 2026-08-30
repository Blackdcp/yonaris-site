import type { BuyerQuestionRecord } from "@/content/public-site/contracts/buyer-question";
import type { ProductPageCopy } from "@/content/public-site/contracts/pages/product";

export function BuyerQuestionsView({ record, copy }: { readonly record: BuyerQuestionRecord; readonly copy: ProductPageCopy }) {
	const alternatives = [...new Set(record.comparisonReasons.map((reason) => reason.subject))];
	return (
		<div className="site-v1-workspace-question-plane">
			<header><span>{copy.input.labels[1]}</span><h3>{copy.input.headline}</h3></header>
			<blockquote>{record.question}</blockquote>
			<dl>
				<div><dt>{copy.input.labels[0]}</dt><dd>{record.market}<br />{record.audience}</dd></div>
				<div><dt>{copy.input.labels[4]}</dt><dd>{record.language}</dd></div>
				<div><dt>{copy.input.labels[3]}</dt><dd>{record.observationConditions.channels.join(" · ")}</dd></div>
				<div><dt>{copy.input.labels[5]}</dt><dd>{alternatives.join(" · ")}</dd></div>
			</dl>
			<p>{record.observationConditions.boundary}</p>
		</div>
	);
}
