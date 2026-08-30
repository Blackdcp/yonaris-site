import type { NavigationTarget, PublicPageKey, SiteEdition } from "./route-types";
import type { HumanPageKey } from "@/content/experience/types";
import { getPublicPage } from "./public-page-manifest";

export function getPublicPagePath(edition: SiteEdition, page: PublicPageKey): `/${string}` {
	return getPublicPage(page).paths[edition];
}

export function getAgentPath(edition: SiteEdition, page: PublicPageKey): `/${string}` {
	return getPublicPage(page).agentPaths[edition];
}

export function getLocaleSwitchPath(edition: SiteEdition, page: PublicPageKey): `/${string}` {
	return getPublicPagePath(edition === "global-en" ? "zh-cn" : "global-en", page);
}

/** @deprecated Current-handler adapter retained until the Human route migration. */
export function getLegacyHumanPagePath(edition: SiteEdition, page: HumanPageKey): `/${string}` {
	if (page === "home") return edition === "global-en" ? "/" : "/zh";
	return `${edition === "global-en" ? "" : "/zh"}/${page}` as `/${string}`;
}

/** @deprecated Current-handler adapter retained until the Human route migration. */
export function getLegacyLocaleSwitchPath(edition: SiteEdition, page: HumanPageKey): `/${string}` {
	return getLegacyHumanPagePath(edition === "global-en" ? "zh-cn" : "global-en", page);
}

export function getMarkdownPath(edition: SiteEdition, page: PublicPageKey): `/${string}` {
	const prefix = edition === "global-en" ? "/llms.mdx/agent" : "/llms.mdx/zh-agent";
	return `${prefix}/${page === "home" ? "index" : page}`;
}

export function resolveNavigationTarget(edition: SiteEdition, target: NavigationTarget): string {
	if (target.kind === "machine") return getAgentPath(edition, "home");
	const path = getPublicPagePath(edition, target.page);
	return target.hash ? `${path}#${target.hash}` : path;
}
