import type { PublicPageKey, PublicPageRoute } from "./route-types";

export const PUBLIC_PAGE_KEYS = [
	"home",
	"product",
	"casework",
	"company",
	"human-agent",
	"contact",
	"privacy",
] as const satisfies readonly PublicPageKey[];

const LAST_VERIFIED = "2026-08-30" as const;

export const PUBLIC_PAGE_MANIFEST = [
	{ key: "home", paths: { "global-en": "/", "zh-cn": "/zh" }, agentPaths: { "global-en": "/agent", "zh-cn": "/zh/agent" }, sitemap: { priority: 1, lastVerified: LAST_VERIFIED } },
	{ key: "product", paths: { "global-en": "/product", "zh-cn": "/zh/product" }, agentPaths: { "global-en": "/agent/product", "zh-cn": "/zh/agent/product" }, sitemap: { priority: 0.9, lastVerified: LAST_VERIFIED } },
	{ key: "casework", paths: { "global-en": "/casework", "zh-cn": "/zh/casework" }, agentPaths: { "global-en": "/agent/casework", "zh-cn": "/zh/agent/casework" }, sitemap: { priority: 0.8, lastVerified: LAST_VERIFIED } },
	{ key: "company", paths: { "global-en": "/company", "zh-cn": "/zh/company" }, agentPaths: { "global-en": "/agent/company", "zh-cn": "/zh/agent/company" }, sitemap: { priority: 0.7, lastVerified: LAST_VERIFIED } },
	{ key: "human-agent", paths: { "global-en": "/human-agent", "zh-cn": "/zh/human-agent" }, agentPaths: { "global-en": "/agent/human-agent", "zh-cn": "/zh/agent/human-agent" }, sitemap: { priority: 0.7, lastVerified: LAST_VERIFIED } },
	{ key: "contact", paths: { "global-en": "/contact", "zh-cn": "/zh/contact" }, agentPaths: { "global-en": "/agent/contact", "zh-cn": "/zh/agent/contact" }, sitemap: { priority: 0.9, lastVerified: LAST_VERIFIED } },
	{ key: "privacy", paths: { "global-en": "/privacy", "zh-cn": "/zh/privacy" }, agentPaths: { "global-en": "/agent/privacy", "zh-cn": "/zh/agent/privacy" }, sitemap: { priority: 0.3, lastVerified: LAST_VERIFIED } },
] as const satisfies readonly PublicPageRoute[];

export function getPublicPage(page: PublicPageKey): PublicPageRoute {
	const route = PUBLIC_PAGE_MANIFEST.find((candidate) => candidate.key === page);
	if (!route) throw new Error(`Unknown public page: ${page}`);
	return route;
}
