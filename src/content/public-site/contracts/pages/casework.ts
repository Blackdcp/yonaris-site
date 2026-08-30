import type { PageAction, PublicPageCopy } from "../common";

export interface CaseworkStep {
	readonly heading: string;
	readonly body: string;
}

export interface CaseworkPageCopy extends PublicPageCopy {
	readonly page: "casework";
	readonly hero: { readonly eyebrow: string; readonly headline: string; readonly body: string; readonly disclosure: string };
	readonly representativeLabels: readonly string[];
	readonly walkthrough: readonly [CaseworkStep, CaseworkStep, CaseworkStep, CaseworkStep, CaseworkStep, CaseworkStep, CaseworkStep, CaseworkStep];
	readonly closing: { readonly headline: string; readonly body: string; readonly action: PageAction };
}
