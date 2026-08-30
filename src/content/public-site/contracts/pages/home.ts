import type { PageAction, PageHero, PublicPageCopy } from "../common";

export interface HomePageCopy extends PublicPageCopy {
	readonly page: "home";
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
	readonly casework: { readonly headline: string; readonly stateLabels: readonly string[]; readonly disclosure: string };
	readonly closing: { readonly headline: string; readonly body: string; readonly action: PageAction };
}
