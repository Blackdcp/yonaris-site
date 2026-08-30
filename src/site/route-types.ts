export type PublicPageKey =
	| "home"
	| "product"
	| "casework"
	| "company"
	| "human-agent"
	| "contact"
	| "privacy";

export type SiteEdition = "global-en" | "zh-cn";

export interface PublicPageRoute {
	readonly key: PublicPageKey;
	readonly paths: Readonly<Record<SiteEdition, `/${string}`>>;
	readonly agentPaths: Readonly<Record<SiteEdition, `/${string}`>>;
	readonly sitemap: Readonly<{
		priority: number;
		lastVerified: `${number}-${number}-${number}`;
	}>;
}

export type NavigationTarget =
	| { readonly kind: "page"; readonly page: PublicPageKey; readonly hash?: string }
	| { readonly kind: "machine"; readonly route: "agent-index" };
