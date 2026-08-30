import { EN_CATEGORY } from "@/content/experience/canonical-public-facts";
import type { ExperienceLocale, HumanPageKey } from "@/content/experience/types";
import { agentCatalogPath, agentMarkdownPath, buildAgentEntityGraph, getAgentTopic } from "./machine-documents";
import { getMarketingOgImage } from "./og";
import { canonicalUrl, SITE_URL, siteHref } from "./site-origin";
import type { PageMetadata } from "@/content/public-site/contracts/common";

export { canonicalUrl, SITE_URL, siteHref } from "./site-origin";
export const SITE_NAME = "Yonaris";
export const SITE_DESCRIPTION = EN_CATEGORY;
export const SITE_LOGO_URL = SITE_URL ? `${SITE_URL}/brand/logos/yonaris-wordmark-navy.png` : undefined;

export function pageSocialMeta(options: {
	title: string;
	description: string;
	canonicalPath: string;
	locale: "en_US" | "zh_CN";
}) {
	const pageUrl = siteHref(options.canonicalPath);
	const imageUrl = siteHref(getMarketingOgImage({ title: options.title, description: options.description }));

	return [
		{ property: "og:type", content: "website" },
		{ property: "og:site_name", content: SITE_NAME },
		{ property: "og:locale", content: options.locale },
		{ property: "og:title", content: options.title },
		{ property: "og:description", content: options.description },
		{ property: "og:url", content: pageUrl },
		{ property: "og:image", content: imageUrl },
		{ name: "twitter:card", content: "summary_large_image" },
		{ name: "twitter:title", content: options.title },
		{ name: "twitter:description", content: options.description },
		{ name: "twitter:image", content: imageUrl },
	] as const;
}

export function jsonLd(data: Record<string, unknown>): { type: string; children: string } {
	return { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", ...data }) };
}

export function websiteJsonLd(description = SITE_DESCRIPTION, inLanguage = "en") {
	return jsonLd({
		"@type": "WebSite",
		"@id": siteHref("/#website"),
		name: SITE_NAME,
		url: siteHref("/"),
		description,
		inLanguage,
		publisher: { "@id": siteHref("/#organization") },
	});
}

export function organizationJsonLd() {
	return jsonLd({
		"@type": "Organization",
		"@id": siteHref("/#organization"),
		name: SITE_NAME,
		description: SITE_DESCRIPTION,
		url: siteHref("/"),
		logo: siteHref("/brand/logos/yonaris-wordmark-navy.png"),
	});
}

export function publicEntityGraph(options: {
	locale: ExperienceLocale;
	pageKey: HumanPageKey;
	publicMetadata?: PageMetadata;
	canonicalPath?: string;
	factIds?: readonly string[];
}): {
	type: "application/ld+json";
	children: string;
} {
	const topic = getAgentTopic(options.locale, options.pageKey);
	const href = options.canonicalPath
		? (path: string) => siteHref(path === topic.humanPath ? options.canonicalPath ?? path : path)
		: siteHref;
	const graph = buildAgentEntityGraph(
		options.locale,
		[options.pageKey],
		href,
		options.publicMetadata ? { [options.pageKey]: options.publicMetadata } : undefined,
	);
	const filteredGraph = options.factIds
		? graph.map((node) => {
			if (!("itemListElement" in node)) return node;
			const itemListElement = node.itemListElement.filter((item) => options.factIds?.includes(item.identifier));
			return { ...node, numberOfItems: itemListElement.length, itemListElement };
		})
		: graph;
	return {
		type: "application/ld+json",
		children: JSON.stringify({
			"@context": "https://schema.org",
			"@graph": filteredGraph,
		}),
	};
}

export function publicFactDiscoveryLinks(locale: ExperienceLocale, factId: string) {
	const topic = getAgentTopic(locale, "home");
	return [
		{ rel: "alternate", type: "text/html", href: siteHref(`${topic.agentPath}#${factId}`) },
		...machineDiscoveryLinks(locale, "home"),
	] as const;
}

export function machineDiscoveryLinks(locale: ExperienceLocale, pageKey: HumanPageKey) {
	return [
		{ rel: "alternate", type: "text/markdown", href: siteHref(agentMarkdownPath(locale, pageKey)) },
		{ rel: "alternate", type: "application/ld+json", href: siteHref(agentCatalogPath(locale)) },
		{ rel: "describedby", type: "text/plain", href: siteHref("/llms.txt") },
	] as const;
}

export function agentPageHead(locale: ExperienceLocale, pageKey: HumanPageKey) {
	const topic = getAgentTopic(locale, pageKey);
	return {
		meta: [{ title: topic.title }, { name: "robots", content: "noindex,follow" }],
		links: [{ rel: "canonical", href: siteHref(topic.humanPath) }, ...machineDiscoveryLinks(locale, pageKey)],
		scripts: [publicEntityGraph({ locale, pageKey })],
	};
}

export function rootOgImage(): string | undefined {
	return canonicalUrl(getMarketingOgImage({ title: SITE_NAME, description: SITE_DESCRIPTION }));
}
