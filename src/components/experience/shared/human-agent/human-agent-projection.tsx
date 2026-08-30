import type { BilingualPublicFact } from "@/content/public-site/contracts/public-fact";
import type { HumanAgentPageCopy } from "@/content/public-site/contracts/pages/human-agent";
import type { SiteEdition } from "@/site/route-types";
import type { HumanAgentLayer } from "./evidence-lens";

function FactAttachment({ copy, edition, fact }: {
	readonly copy: HumanAgentPageCopy;
	readonly edition: SiteEdition;
	readonly fact: BilingualPublicFact;
}) {
	return (
		<dl className="site-v1-human-agent-projection__attachment" data-fact-attachment={fact.id}>
			<div><dt>{copy.agentViewLabels[0]}</dt><dd>{fact.value[edition]}</dd></div>
			<div><dt>{copy.agentViewLabels[1]}</dt><dd><code>{fact.id}</code></dd></div>
			<div><dt>{copy.agentViewLabels[2]}</dt><dd><code>{fact.source.id}</code><span>{fact.source.label[edition]}</span></dd></div>
			<div><dt>{copy.agentViewLabels[3]}</dt><dd>{fact.scope[edition]}</dd></div>
			<div><dt>{copy.agentViewLabels[4]}</dt><dd><time dateTime={fact.lastReviewed}>{fact.lastReviewed}</time></dd></div>
			<div><dt>{copy.agentViewLabels[5]}</dt><dd>{fact.boundary[edition]}</dd></div>
		</dl>
	);
}

function HumanFields({ copy, edition, fact }: {
	readonly copy: HumanAgentPageCopy;
	readonly edition: SiteEdition;
	readonly fact: BilingualPublicFact;
}) {
	const fields = [
		fact.value[edition],
		copy.sharedRecordRule,
		`${fact.scope[edition]} ${fact.boundary[edition]}`,
	] as const;
	return (
		<div className="site-v1-human-agent-projection__human">
			{copy.humanViewLabels.map((label, index) => (
				<section key={label} data-human-field={index}>
					<h3>{label}</h3>
					<p>{fields[index]}</p>
				</section>
			))}
		</div>
	);
}

function EvidenceFields({ copy, edition, fact }: {
	readonly copy: HumanAgentPageCopy;
	readonly edition: SiteEdition;
	readonly fact: BilingualPublicFact;
}) {
	const fields = [
		<><code key="source-id">{fact.source.id}</code><span>{fact.source.label[edition]}</span></>,
		fact.scope[edition],
		fact.scope[edition],
		<time key="reviewed" dateTime={fact.lastReviewed}>{fact.lastReviewed}</time>,
		fact.boundary[edition],
	] as const;
	return (
		<dl className="site-v1-human-agent-projection__evidence">
			{copy.evidenceViewLabels.map((label, index) => (
				<div key={label} data-evidence-field={index}><dt>{label}</dt><dd>{fields[index]}</dd></div>
			))}
		</dl>
	);
}

function AgentFields({ copy, edition, fact }: {
	readonly copy: HumanAgentPageCopy;
	readonly edition: SiteEdition;
	readonly fact: BilingualPublicFact;
}) {
	const fields = [
		fact.value[edition],
		<code key="fact-id">{fact.id}</code>,
		<><code key="source-id">{fact.source.id}</code><span>{fact.source.label[edition]}</span></>,
		fact.scope[edition],
		<time key="reviewed" dateTime={fact.lastReviewed}>{fact.lastReviewed}</time>,
		fact.boundary[edition],
	] as const;
	return (
		<dl className="site-v1-human-agent-projection__agent">
			{copy.agentViewLabels.map((label, index) => (
				<div key={label} data-agent-field={index}><dt>{label}</dt><dd>{fields[index]}</dd></div>
			))}
		</dl>
	);
}

export function HumanAgentProjection({
	layer,
	active,
	copy,
	edition,
	fact,
	agentHref,
}: {
	readonly layer: HumanAgentLayer;
	readonly active: boolean;
	readonly copy: HumanAgentPageCopy;
	readonly edition: SiteEdition;
	readonly fact: BilingualPublicFact;
	readonly agentHref: string;
}) {
	const index = layer === "human" ? 0 : layer === "evidence" ? 1 : 2;
	return (
		<article
			id={`human-agent-${layer}-projection`}
			className="site-v1-human-agent-projection"
			data-human-agent-projection={layer}
			data-fact-id={fact.id}
			data-active={active ? "true" : "false"}
		>
			<header>
				<span>{String(index + 1).padStart(2, "0")}</span>
				<h2>{copy.transformationLabels[index]}</h2>
				<code>{fact.id}</code>
			</header>
			{layer === "human" ? <HumanFields copy={copy} edition={edition} fact={fact} /> : null}
			{layer === "evidence" ? <EvidenceFields copy={copy} edition={edition} fact={fact} /> : null}
			{layer === "agent" ? <AgentFields copy={copy} edition={edition} fact={fact} /> : null}
			<FactAttachment copy={copy} edition={edition} fact={fact} />
			{layer === "agent" ? <a className="site-v1-human-agent-projection__record-link" href={agentHref}>{copy.actions[0].label}</a> : null}
		</article>
	);
}
