import type { PageAction, PageHero, PublicPageCopy } from "../common";

export interface ProductPageCopy extends PublicPageCopy {
	readonly page: "product";
	readonly hero: PageHero & { readonly actions: readonly [PageAction, PageAction] };
	readonly input: { readonly headline: string; readonly labels: readonly string[] };
	readonly systemWork: { readonly headline: string; readonly sequence: readonly string[] };
	readonly teamOutput: { readonly headline: string; readonly items: readonly string[] };
	readonly theatre: { readonly workingViews: readonly string[]; readonly stateLabels: readonly string[] };
	readonly markets: { readonly headline: string; readonly body: string };
	readonly humanAgent: { readonly headline: string; readonly body: string; readonly action: PageAction };
	readonly closing: { readonly headline: string; readonly actions: readonly [PageAction, PageAction] };
}
