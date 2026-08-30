import type { PageAction, PageHero, PublicPageCopy } from "../common";

export interface HomeSiteV1Copy {
	readonly motionControls: {
		readonly pauseScene: string;
		readonly resumeScene: string;
	};
	readonly productRecord: {
		readonly audience: string;
		readonly market: string;
		readonly language: string;
		readonly humanReviewed: string;
	};
}

export interface HomeCaseworkStateLabels {
	readonly initialAnswer: string;
	readonly evidenceGap: string;
	readonly reviewedAction: string;
	readonly changed: string;
	readonly unchanged: string;
	readonly cannotAttribute: string;
}

export interface HomePageCopy extends PublicPageCopy {
	readonly page: "home";
	readonly siteV1: HomeSiteV1Copy | null;
	readonly hero: PageHero & { readonly actions: readonly [PageAction, PageAction] };
	readonly heroEvent: {
		readonly question: string;
		readonly answerEnvironments: readonly string[];
		readonly inspectionLabels: readonly string[];
		readonly resolvingStatement: string;
	};
	readonly productPreview: { readonly headline: string; readonly workingViews: readonly string[] };
	readonly humanAgent: {
		readonly headline: string;
		readonly body: string;
		readonly layers: readonly string[];
		readonly actions: readonly [PageAction, PageAction];
	};
	readonly casework: { readonly headline: string; readonly stateLabels: HomeCaseworkStateLabels; readonly disclosure: string };
	readonly closing: { readonly headline: string; readonly body: string; readonly action: PageAction };
}
