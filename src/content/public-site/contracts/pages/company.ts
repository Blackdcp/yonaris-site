import type { PageAction, PageHero, PublicPageCopy } from "../common";

export type CompanyPrincipleKey = "why" | "audience" | "markets" | "human-judgement" | "non-promises";

export interface CompanySiteV1Copy {
	readonly aperture: {
		readonly ariaLabel: string;
		readonly instruction: string;
		readonly evidenceLabel: string;
		readonly boundaryLabel: string;
		readonly principles: readonly [
			{ readonly id: "why"; readonly label: string },
			{ readonly id: "audience"; readonly label: string },
			{ readonly id: "markets"; readonly label: string },
			{ readonly id: "human-judgement"; readonly label: string },
			{ readonly id: "non-promises"; readonly label: string },
		];
	};
	readonly verifiedFacts: {
		readonly heading: string;
		readonly labels: readonly [string, string, string, string, string];
		readonly sourceLabel: string;
		readonly scopeLabel: string;
		readonly reviewedLabel: string;
		readonly boundaryLabel: string;
	};
	readonly closingLabel: string;
}

export interface CompanyPageCopy extends PublicPageCopy {
	readonly page: "company";
	readonly siteV1: CompanySiteV1Copy | null;
	readonly hero: PageHero;
	readonly why: string;
	readonly audience: string;
	readonly markets: string;
	readonly humanJudgement: string;
	readonly nonPromises: string;
	readonly verifiedFactLabels: readonly string[];
	readonly actions: readonly [PageAction, PageAction];
}
