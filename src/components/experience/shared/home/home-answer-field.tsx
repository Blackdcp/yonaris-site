"use client";

import { useState } from "react";
import type { HomePageCopy } from "@/content/public-site/contracts/pages/home";
import { useBuyerQuestionRecord } from "../buyer-question/buyer-question-provider";
import { RepresentativeDisclosure } from "../buyer-question/representative-disclosure";
import { SceneOrchestrator } from "../motion/scene-orchestrator";
import { useRovingTabs } from "../use-roving-tabs";
import { AnswerEnvironment } from "./answer-environment";

type HeroEventCopy = HomePageCopy["heroEvent"];

export function HomeAnswerField({ copy, disclosure }: { readonly copy: HeroEventCopy; readonly disclosure: string }) {
	const record = useBuyerQuestionRecord();
	const channelIds = record.channelAnswers.map((answer) => answer.id);
	const [activeId, setActiveId] = useState(channelIds[0] ?? "");
	const [traceOpen, setTraceOpen] = useState(false);
	const activeAnswer = record.channelAnswers.find((answer) => answer.id === activeId) ?? record.channelAnswers[0];
	if (!activeAnswer) return null;
	const activeReasonIds = new Set(activeAnswer.reasonIds);
	const activeEvidence = record.evidence.filter((item) => activeAnswer.evidenceIds.includes(item.id));
	const tabs = useRovingTabs({
		items: channelIds,
		active: activeId,
		onChange: (next) => {
			setActiveId(next);
			setTraceOpen(false);
		},
		idPrefix: "home-answer-environment",
	});
	const traceLabel = copy.inspectionLabels[2] ?? "";
	const sourceLabel = copy.inspectionLabels[3] ?? "";

	return (
		<SceneOrchestrator ariaLabel={copy.question} pauseLabel="Pause scene" resumeLabel="Resume scene">
			<section
				className="site-v1-answer-field"
				data-home-answer-field="true"
				data-record-id={record.id}
				data-v1-state={activeAnswer.id}
				data-representative-record="answer-field"
			>
				<div className="site-v1-answer-field__atmosphere" aria-hidden="true"><i /><i /><i /></div>
				<header className="site-v1-answer-field__question" data-buyer-question>
					<span>{record.market}</span>
					<h2>{copy.question}</h2>
				</header>
				<div className="site-v1-answer-field__channel-tabs" role="tablist" aria-label={copy.question} aria-orientation="horizontal">
					{record.channelAnswers.map((answer, index) => (
						<button key={answer.id} type="button" aria-label={answer.environment} {...tabs.getTabProps(answer.id, index)}>
							<span>{String(index + 1).padStart(2, "0")}</span>{answer.environment}
						</button>
					))}
				</div>
				<div className="site-v1-answer-field__environments" aria-live="polite">
					{record.channelAnswers.map((answer, index) => (
						<AnswerEnvironment key={answer.id} answer={answer} active={answer.id === activeId} position={index} panelProps={tabs.getPanelProps(answer.id)} />
					))}
				</div>
				<div className="site-v1-answer-field__reasons">
					{record.comparisonReasons.map((reason, index) => {
						const active = activeReasonIds.has(reason.id);
						return (
							<article
								key={reason.id}
								data-comparison-reason={reason.id}
								data-active={active ? "true" : "false"}
								style={{ order: active ? index : index + record.comparisonReasons.length }}
							>
								<span>{reason.disposition === "included" ? copy.inspectionLabels[0] : copy.inspectionLabels[1]}</span>
								<h3>{reason.subject}</h3>
								<p>{reason.reason}</p>
							</article>
						);
					})}
				</div>
				<div className="site-v1-answer-field__trace-control">
					<button type="button" aria-expanded={traceOpen} aria-controls="home-evidence-trace" onClick={() => setTraceOpen((open) => !open)}>
						{traceLabel}
					</button>
					<div id="home-evidence-trace" className="site-v1-answer-field__trace" data-evidence-trace hidden={!traceOpen}>
						{activeEvidence.map((evidence) => (
							<article key={evidence.id} data-evidence-id={evidence.id}>
								<span>{sourceLabel}</span>
								<h3>{evidence.sourceLabel}</h3>
								<p>{evidence.trace}</p>
								<small>{evidence.boundary}</small>
							</article>
						))}
					</div>
				</div>
				<p className="site-v1-answer-field__resolution">{copy.resolvingStatement}</p>
				<RepresentativeDisclosure>{disclosure}</RepresentativeDisclosure>
			</section>
		</SceneOrchestrator>
	);
}
