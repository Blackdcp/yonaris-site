import type { PageAction, PageHero, PublicPageCopy } from "../common";

export interface CompanyPageCopy extends PublicPageCopy {
	readonly page: "company";
	readonly hero: PageHero;
	readonly why: string;
	readonly audience: string;
	readonly markets: string;
	readonly humanJudgement: string;
	readonly nonPromises: string;
	readonly verifiedFactLabels: readonly string[];
	readonly actions: readonly [PageAction, PageAction];
}
