import type { CSSProperties, HTMLAttributes } from "react";
import type { ChannelAnswer } from "@/content/public-site/contracts/buyer-question";

export function AnswerEnvironment({ answer, active, position, panelProps }: { readonly answer: ChannelAnswer; readonly active: boolean; readonly position: number; readonly panelProps: HTMLAttributes<HTMLElement> }) {
	return (
		<article
			{...panelProps}
			className="site-v1-answer-environment"
			data-answer-environment={answer.id}
			data-active={active ? "true" : "false"}
			hidden={false}
			style={{ "--answer-layer": position } as CSSProperties}
		>
			<p className="site-v1-answer-environment__label">{answer.environment}</p>
			<p className="site-v1-answer-environment__answer" data-active-answer={active ? "true" : undefined}>{answer.answer}</p>
		</article>
	);
}
