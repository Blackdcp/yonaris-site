"use client";

import { useEffect, useState } from "react";
import type { HomePageCopy, HomeSiteV1Copy } from "@/content/public-site/contracts/pages/home";
import { useBuyerQuestionRecord } from "../buyer-question/buyer-question-provider";
import { RepresentativeDisclosure } from "../buyer-question/representative-disclosure";
import { SceneOrchestrator } from "../motion/scene-orchestrator";
import { useActiveControlRail } from "../use-active-control-rail";
import { useRovingTabs } from "../use-roving-tabs";
import { CausalAnswerScene } from "./causal-answer-scene";

type HeroEventCopy = HomePageCopy["heroEvent"];

interface HomeAnswerFieldProps {
	readonly copy: HeroEventCopy;
	readonly disclosure: string;
	readonly motionLabels: HomeSiteV1Copy["motionControls"];
}

export function HomeAnswerField({ copy, disclosure, motionLabels }: HomeAnswerFieldProps) {
	const record = useBuyerQuestionRecord();
	const channelIds = record.channelAnswers.map((answer) => answer.id);
	const [activeId, setActiveId] = useState(channelIds[0] ?? "");
	const [activeReasonId, setActiveReasonId] = useState(record.channelAnswers[0]?.reasonIds[0] ?? "");
	const [traceOpen, setTraceOpen] = useState(false);
	const [enhanced, setEnhanced] = useState(false);
	useEffect(() => setEnhanced(true), []);
	const activeAnswer = record.channelAnswers.find((answer) => answer.id === activeId) ?? record.channelAnswers[0];
	if (!activeAnswer) return null;
	const changeAnswer = (next: string) => {
		setActiveId(next);
		setActiveReasonId(record.channelAnswers.find((answer) => answer.id === next)?.reasonIds[0] ?? "");
		setTraceOpen(false);
	};
	const tabs = useRovingTabs({
		items: channelIds,
		active: activeId,
		onChange: changeAnswer,
		idPrefix: "home-answer-environment",
	});
	const rail = useActiveControlRail({ items: channelIds, active: activeId });
	const activeIndex = channelIds.indexOf(activeId);
	const previousId = activeIndex > 0 ? channelIds[activeIndex - 1] : undefined;
	const nextId = activeIndex < channelIds.length - 1 ? channelIds[activeIndex + 1] : undefined;
	const previousLabel = record.channelAnswers.find((answer) => answer.id === previousId)?.environment ?? activeAnswer.environment;
	const nextLabel = record.channelAnswers.find((answer) => answer.id === nextId)?.environment ?? activeAnswer.environment;

	return (
		<SceneOrchestrator ariaLabel={copy.question} pauseLabel={motionLabels.pauseScene} resumeLabel={motionLabels.resumeScene} controlPlacement="flow">
			<section
				className="site-v1-answer-field"
				data-home-answer-field="true"
				data-record-id={record.id}
				data-v1-state={activeAnswer.id}
				data-enhanced={enhanced ? "true" : undefined}
				data-representative-record="answer-field"
			>
				<div className="site-v1-answer-field__atmosphere" aria-hidden="true"><i /><i /><i /></div>
				<header className="site-v1-answer-field__question" data-buyer-question>
					<span>{record.market}</span>
					<h2>{copy.question}</h2>
				</header>
				<div ref={rail.railRef} className="site-v1-answer-field__channel-tabs" role="tablist" aria-label={copy.question} aria-orientation="horizontal">
					{record.channelAnswers.map((answer, index) => (
						<button ref={rail.getControlRef(answer.id)} key={answer.id} type="button" aria-label={answer.environment} {...tabs.getTabProps(answer.id, index)}>
							<span>{String(index + 1).padStart(2, "0")}</span>{answer.environment}
						</button>
					))}
				</div>
				<div className="site-v1-answer-field__rail-status" aria-live="polite">
					<button type="button" disabled={!previousId} aria-label={previousLabel} onClick={() => previousId && changeAnswer(previousId)}>{"<"}</button>
					<output data-channel-progress>{rail.position} / {rail.total}</output>
					<button type="button" disabled={!nextId} aria-label={nextLabel} data-channel-continuation onClick={() => nextId && changeAnswer(nextId)}>{">"}</button>
				</div>
				<CausalAnswerScene
					record={record}
					activeAnswerId={activeId}
					activeReasonId={activeReasonId}
					enhanced={enhanced}
					traceOpen={traceOpen}
					inspectionLabels={copy.inspectionLabels}
					getPanelProps={tabs.getPanelProps}
					onReasonSelect={setActiveReasonId}
					onTraceToggle={() => setTraceOpen((open) => !open)}
				/>
				<p className="site-v1-answer-field__resolution">{copy.resolvingStatement}</p>
				<RepresentativeDisclosure>{disclosure}</RepresentativeDisclosure>
			</section>
		</SceneOrchestrator>
	);
}
