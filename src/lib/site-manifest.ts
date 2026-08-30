import type { CorePageKey, Locale, RedirectRule, SiteRouteDefinition, SiteRouteKey } from "@/content/site/types";
import { PUBLIC_PAGE_MANIFEST } from "@/site/public-page-manifest";
import { PUBLIC_REDIRECTS } from "@/site/redirects";

export { SITE_ROUTE_KEYS } from "@/content/site/types";

export const SITE_MANIFEST = [
	...PUBLIC_PAGE_MANIFEST.map((page) => ({
		key: page.key,
		routeClass: (page.key === "privacy" ? "utility" : "core") as "core" | "utility",
		canonicals: { en: page.paths["global-en"], zh: page.paths["zh-cn"] },
		navigation: [] as const,
		indexPolicy: "index,follow" as const,
		agentPath: page.agentPaths["global-en"],
		sitemap: page.sitemap,
	})),
	{ key: "agent", routeClass: "machine" as const, canonicals: { en: "/agent", zh: "/zh/agent" }, patterns: ["/agent/*", "/zh/agent/*"], navigation: [], indexPolicy: "noindex,follow", sitemap: false },
	{ key: "llms", routeClass: "machine" as const, canonicals: { en: "/llms.txt" }, patterns: ["/llms-full.txt"], navigation: [], indexPolicy: "noindex,follow", sitemap: false },
	{ key: "sitemap", routeClass: "machine" as const, canonicals: { en: "/sitemap.xml" }, navigation: [], indexPolicy: "noindex,follow", sitemap: false },
	{ key: "robots", routeClass: "machine" as const, canonicals: { en: "/robots.txt" }, navigation: [], indexPolicy: "noindex,follow", sitemap: false },
	{ key: "api", routeClass: "machine" as const, canonicals: { en: "/api" }, patterns: ["/api/*"], navigation: [], indexPolicy: "noindex,follow", sitemap: false },
	{ key: "og", routeClass: "machine" as const, canonicals: { en: "/og.png" }, navigation: [], indexPolicy: "noindex,follow", sitemap: false },
	{ key: "markdownInternal", routeClass: "machine" as const, canonicals: { en: "/llms.mdx/site" }, patterns: ["/llms.mdx/*"], navigation: [], indexPolicy: "noindex,follow", sitemap: false },
] as const satisfies readonly SiteRouteDefinition[];

const siteRoutes: readonly SiteRouteDefinition[] = SITE_MANIFEST;

export const SITE_REDIRECTS = PUBLIC_REDIRECTS.map(({ from, to, statusCode }) => ({ from, to, statusCode })) as readonly RedirectRule[];

function normalizePathname(pathname: string): string {
	const path = pathname.split("#", 1)[0] || "/";
	if (path === "/") return path;
	return path.replace(/\/+$/, "") || "/";
}

function matchesPattern(pathname: string, pattern: string): boolean {
	if (!pattern.endsWith("/*")) return pathname === pattern;
	const base = pattern.slice(0, -2);
	return pathname === base || pathname.startsWith(`${base}/`);
}

export function getSiteRoute(key: SiteRouteKey): SiteRouteDefinition {
	const route = siteRoutes.find((candidate) => candidate.key === key);
	if (!route) throw new Error(`Unknown site route key: ${key}`);
	return route;
}

export function findSiteRoute(pathname: string): SiteRouteDefinition | undefined {
	const normalized = normalizePathname(pathname);
	const canonical = siteRoutes.find((route) => Object.values(route.canonicals).includes(normalized as `/${string}`));
	if (canonical) return canonical;
	const patterned = siteRoutes.find((route) => route.patterns?.some((pattern) => matchesPattern(normalized, pattern)));
	if (patterned) return patterned;
	const redirect = getRedirect(normalized);
	return redirect ? findSiteRoute(redirect.to) : undefined;
}

export function getCorePath(key: CorePageKey, locale: Locale): string {
	const route = getSiteRoute(key);
	const path = route.canonicals[locale];
	if (!path) throw new Error(`Missing ${locale} canonical for core route: ${key}`);
	return path;
}

export function getRedirect(pathname: string): RedirectRule | undefined {
	const normalized = normalizePathname(pathname);
	return SITE_REDIRECTS.find((redirect) => redirect.from === normalized);
}

export function getCoreLastVerified(key: CorePageKey): `${number}-${number}-${number}` {
	const sitemap = getSiteRoute(key).sitemap;
	if (sitemap === false || !sitemap.lastVerified) throw new Error(`Missing last-verified date for core route: ${key}`);
	return sitemap.lastVerified;
}
