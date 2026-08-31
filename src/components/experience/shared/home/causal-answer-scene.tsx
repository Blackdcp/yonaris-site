import type { HTMLAttributes } from "react";
import type { BuyerQuestionRecord } from "@/content/public-site/contracts/buyer-question";
import { AnswerEnvironment } from "./answer-environment";

interface CausalAnswerSceneProps {
	readonly record: BuyerQuestionRecord;
	readonly activeAnswerId: string;
	readonly activeReasonId: string;
	readonly enhanced: boolean;
	readonly traceOpen: boolean;
	readonly inspectionLabels: readonly string[];
	readonly getPanelProps: (answerId: string) => HTMLAttributes<HTMLElement>;
	readonly onReasonSelect: (reasonId: string) => void;
	readonly onTraceToggle: () => void;
}

export function CausalAnswerScene({
	record,
	activeAnswerId,
	activeReasonId,
	enhanced,
	traceOpen,
	inspectionLabels,
	getPanelProps,
	onReasonSelect,
	onTraceToggle,
}: CausalAnswerSceneProps) {
	const activeAnswer = record.channelAnswers.find((answer) => answer.id === activeAnswerId) ?? record.channelAnswers[0];
	if (!activeAnswer) return null;
	const activeReasons = activeAnswer.reasonIds
		.map((reasonId) => record.comparisonReasons.find((reason) => reason.id === reasonId))
		.filter((reason) => reason !== undefined);
	const selectedReason = activeReasons.find((reason) => reason.id === activeReasonId) ?? activeReasons[0];
	const selectedEvidence = record.evidence.filter((item) => selectedReason?.evidenceIds.includes(item.id));
	const selectedReasonIndex = Math.max(0, activeReasons.findIndex((reason) => reason.id === selectedReason?.id));
	const reasonY = activeReasons.length > 1 ? 290 + selectedReasonIndex * 96 : 338;
	const includedLabel = inspectionLabels[0] ?? "";
	const excludedLabel = inspectionLabels[1] ?? "";
	const traceLabel = inspectionLabels[2] ?? "";
	const sourceLabel = inspectionLabels[3] ?? "";

	return (
		<section
			className="site-v1-causal-answer-scene"
			data-causal-answer-scene="true"
			data-enhanced={enhanced ? "true" : undefined}
			data-trace={traceOpen ? "open" : "closed"}
		>
			<div className="site-v1-causal-answer-scene__linear" data-causal-linear="true">
				{record.channelAnswers.map((answer) => {
					const reasons = answer.reasonIds
						.map((reasonId) => record.comparisonReasons.find((reason) => reason.id === reasonId))
						.filter((reason) => reason !== undefined);
					return (
						<article key={answer.id} data-linear-answer={answer.id}>
							<h3>{answer.environment}</h3>
							<p>{answer.answer}</p>
							{reasons.map((reason) => (
								<section key={reason.id}>
									<strong>{reason.disposition === "included" ? includedLabel : excludedLabel}: {reason.subject}</strong>
									<p>{reason.reason}</p>
									{record.evidence.filter((item) => reason.evidenceIds.includes(item.id)).map((item) => (
										<div key={item.id}><span>{sourceLabel}</span><h4>{item.sourceLabel}</h4><p>{item.trace}</p><small>{item.boundary}</small></div>
									))}
								</section>
							))}
						</article>
					);
				})}
			</div>

			<div className="site-v1-causal-answer-scene__interactive" data-causal-interactive="true">
				<div className="site-v1-answer-field__environments" aria-live="polite">
					{record.channelAnswers.map((answer, index) => (
						<AnswerEnvironment key={answer.id} answer={answer} active={answer.id === activeAnswerId} position={index} panelProps={getPanelProps(answer.id)} />
					))}
				</div>
				<svg className="site-v1-causal-answer-scene__connectors" data-causal-connectors="true" viewBox="0 0 900 520" preserveAspectRatio="none" aria-hidden="true">
					<path data-causal-connection="answer-reason" data-reason-id={selectedReason?.id} data-active="true" d={`M82 154 C238 154 278 ${reasonY} 438 ${reasonY}`} />
					<path data-causal-connection="reason-evidence" data-reason-id={selectedReason?.id} data-active={traceOpen ? "true" : "false"} d={`M438 ${reasonY} C606 ${reasonY} 636 188 820 188`} />
				</svg>
				<div className="site-v1-answer-field__reasons" aria-label={traceLabel}>
					{activeReasons.map((reason) => (
						<button
							key={reason.id}
							type="button"
							data-comparison-reason={reason.id}
							data-active={reason.id === selectedReason?.id ? "true" : "false"}
							aria-pressed={reason.id === selectedReason?.id}
							onClick={() => onReasonSelect(reason.id)}
						>
							<span>{reason.disposition === "included" ? includedLabel : excludedLabel}</span>
							<strong>{reason.subject}</strong>
							<small>{reason.reason}</small>
						</button>
					))}
				</div>
				<div className="site-v1-answer-field__trace-control">
					<button type="button" aria-expanded={traceOpen} aria-controls="home-evidence-trace" onClick={onTraceToggle}>{traceLabel}</button>
				</div>
				<div id="home-evidence-trace" className="site-v1-answer-field__trace" data-evidence-trace hidden={!traceOpen}>
					{selectedEvidence.map((evidence) => (
						<article key={evidence.id} data-causal-evidence data-evidence-id={evidence.id} data-active="true">
							<span>{sourceLabel}</span>
							<h3>{evidence.sourceLabel}</h3>
							<p>{evidence.trace}</p>
							<small>{evidence.boundary}</small>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
