export type PublicPageKey =
	| "home"
	| "product"
	| "casework"
	| "company"
	| "human-agent"
	| "contact"
	| "privacy";

export type SiteEdition = "global-en" | "zh-cn";

export interface ContactPageSearch {
	readonly intent?: "privacy";
}

export interface PublicPageRoute {
	readonly key: PublicPageKey;
	readonly paths: Readonly<Record<SiteEdition, `/${string}`>>;
	readonly agentPaths: Readonly<Record<SiteEdition, `/${string}`>>;
	readonly sitemap: Readonly<{
		priority: number;
		lastVerified: `${number}-${number}-${number}`;
	}>;
}

type PageNavigationTarget =
	| { readonly kind: "page"; readonly page: Exclude<PublicPageKey, "contact">; readonly hash?: string }
	| {
		readonly kind: "page";
		readonly page: "contact";
		readonly search?: ContactPageSearch;
		readonly hash?: string;
	};

export type NavigationTarget =
	| PageNavigationTarget
	| { readonly kind: "machine"; readonly route: "agent-index" };
