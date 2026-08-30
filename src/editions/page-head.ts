import { CHINA_COPY, GLOBAL_COPY } from "@/content/experience";
import { PUBLIC_PAGE_TO_HUMAN_PAGE, type HumanPageKey } from "@/content/experience/types";
import { machineDiscoveryLinks, pageSocialMeta, publicEntityGraph, siteHref } from "@/lib/seo";
import { getLegacyHumanPagePath, getLegacyLocaleSwitchPath, getLocaleSwitchPath, getPublicPagePath } from "@/site/route-selectors";
import type { PublicPageKey, SiteEdition } from "@/site/route-types";

export function buildPageHead(edition: SiteEdition, page: PublicPageKey, legacyContentPage?: HumanPageKey) {
	const humanPage = legacyContentPage ?? PUBLIC_PAGE_TO_HUMAN_PAGE[page];
	const copy = edition === "global-en" ? GLOBAL_COPY[humanPage] : CHINA_COPY[humanPage];
	const canonicalPath = legacyContentPage ? getLegacyHumanPagePath(edition, legacyContentPage) : getPublicPagePath(edition, page);
	const alternatePath = legacyContentPage ? getLegacyLocaleSwitchPath(edition, legacyContentPage) : getLocaleSwitchPath(edition, page);
	const isGlobal = edition === "global-en";
	return {
		meta: [
			{ title: copy.metaTitle },
			{ name: "description", content: copy.metaDescription },
			{ name: "theme-color", content: "#f2ede3" },
			...pageSocialMeta({ title: copy.metaTitle, description: copy.metaDescription, canonicalPath, locale: isGlobal ? "en_US" : "zh_CN" }),
		],
		links: [
			{ rel: "canonical", href: siteHref(canonicalPath) },
			{ rel: "alternate", hrefLang: isGlobal ? "en" : "zh-CN", href: siteHref(canonicalPath) },
			{ rel: "alternate", hrefLang: isGlobal ? "zh-CN" : "en", href: siteHref(alternatePath) },
			{ rel: "alternate", hrefLang: "x-default", href: siteHref(isGlobal ? canonicalPath : alternatePath) },
			...machineDiscoveryLinks(isGlobal ? "en" : "zh", humanPage),
		],
		scripts: [publicEntityGraph({ locale: isGlobal ? "en" : "zh", pageKey: humanPage })],
	};
}
