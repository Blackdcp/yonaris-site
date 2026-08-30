import type { PageAction, PageHero, PublicPageCopy } from "../common";

export interface HumanAgentPageCopy extends PublicPageCopy {
	readonly page: "human-agent";
	readonly hero: PageHero;
	readonly sharedRecordRule: string;
	readonly transformationLabels: readonly string[];
	readonly humanViewLabels: readonly string[];
	readonly evidenceViewLabels: readonly string[];
	readonly agentViewLabels: readonly string[];
	readonly boundary: string;
	readonly actions: readonly [PageAction, PageAction];
}
