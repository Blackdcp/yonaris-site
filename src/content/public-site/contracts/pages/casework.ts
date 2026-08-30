import type { PageAction, PublicPageCopy } from "../common";

export interface CaseworkStep {
	readonly heading: string;
	readonly body: string;
}

export interface CaseworkTimelineCopy {
	readonly ariaLabel: string;
	readonly stepLabel: string;
	readonly previousLabel: string;
	readonly nextLabel: string;
	readonly recordLabel: string;
	readonly questionLabel: string;
	readonly baselineLabel: string;
	readonly laterReviewLabel: string;
	readonly answersLabel: string;
	readonly reasonsLabel: string;
	readonly evidenceLabel: string;
	readonly sourcesLabel: string;
	readonly gapsLabel: string;
	readonly actionsLabel: string;
	readonly reviewLabel: string;
	readonly changedLabel: string;
	readonly unchangedLabel: string;
	readonly cannotAttributeLabel: string;
	readonly conditionsLabel: string;
	readonly noCommercialOutcomeLabel: string;
}

export interface CaseworkPageCopy extends PublicPageCopy {
	readonly page: "casework";
	readonly hero: { readonly eyebrow: string; readonly headline: string; readonly body: string; readonly disclosure: string };
	readonly representativeLabels: readonly string[];
	readonly timeline: CaseworkTimelineCopy;
	readonly walkthrough: readonly [CaseworkStep, CaseworkStep, CaseworkStep, CaseworkStep, CaseworkStep, CaseworkStep, CaseworkStep, CaseworkStep];
	readonly closing: { readonly headline: string; readonly body: string; readonly action: PageAction };
}
