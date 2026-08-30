import type { NavigationTarget, PublicPageKey, SiteEdition } from "@/site/route-types";

export interface PageMetadata {
	readonly title: string;
	readonly description: string;
}

export interface PageAction {
	readonly label: string;
	readonly target: NavigationTarget;
}

export interface PageHero {
	readonly eyebrow?: string;
	readonly headline: string;
	readonly body?: string;
	readonly actions?: readonly PageAction[];
}

export interface PublicPageCopy {
	readonly edition: SiteEdition;
	readonly page: PublicPageKey;
	readonly metadata: PageMetadata;
}

export interface LabelPair {
	readonly label: string;
	readonly value: string;
}
