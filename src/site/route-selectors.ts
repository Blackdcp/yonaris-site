import type { NavigationTarget, PublicPageKey, SiteEdition } from "./route-types";
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

export function resolveNavigationTarget(edition: SiteEdition, target: NavigationTarget): string {
	if (target.kind === "machine") return getAgentPath(edition, "home");
	const path = getPublicPagePath(edition, target.page);
	return target.hash ? `${path}#${target.hash}` : path;
}
