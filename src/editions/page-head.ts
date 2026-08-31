import { CHINA_COPY, GLOBAL_COPY } from "@/content/experience";
import { PUBLIC_PAGE_TO_HUMAN_PAGE, type HumanPageKey } from "@/content/experience/types";
import { machineDiscoveryLinks, pageSocialMeta, publicEntityGraph, siteHref } from "@/lib/seo";
import { publicFactDiscoveryLinks } from "@/lib/seo";
import { getLegacyHumanPagePath, getLegacyLocaleSwitchPath, getLocaleSwitchPath, getPublicPagePath } from "@/site/route-selectors";
import type { PublicPageKey, SiteEdition } from "@/site/route-types";
import type { PageMetadata } from "@/content/public-site/contracts/common";
import { PRODUCT_FACTS } from "@/content/public-site/canonical/product-facts";

export function buildPageHead(edition: SiteEdition, page: PublicPageKey, legacyContentPage?: HumanPageKey, publicMetadata?: PageMetadata) {
	const isCanonicalHumanAgent = page === "human-agent" && legacyContentPage === undefined;
	const humanPage = isCanonicalHumanAgent ? "home" : (legacyContentPage ?? PUBLIC_PAGE_TO_HUMAN_PAGE[page]);
	const machinePage = page;
	const copy = edition === "global-en" ? GLOBAL_COPY[humanPage] : CHINA_COPY[humanPage];
	const title = publicMetadata?.title ?? copy.metaTitle;
	const description = publicMetadata?.description ?? copy.metaDescription;
	const canonicalPath = legacyContentPage ? getLegacyHumanPagePath(edition, legacyContentPage) : getPublicPagePath(edition, page);
	const alternatePath = legacyContentPage ? getLegacyLocaleSwitchPath(edition, legacyContentPage) : getLocaleSwitchPath(edition, page);
	const isGlobal = edition === "global-en";
	return {
		meta: [
			{ title },
			{ name: "description", content: description },
			{ name: "theme-color", content: "#f2ede3" },
			...pageSocialMeta({ title, description, canonicalPath, locale: isGlobal ? "en_US" : "zh_CN" }),
		],
		links: [
			{ rel: "canonical", href: siteHref(canonicalPath) },
			{ rel: "alternate", hrefLang: isGlobal ? "en" : "zh-CN", href: siteHref(canonicalPath) },
			{ rel: "alternate", hrefLang: isGlobal ? "zh-CN" : "en", href: siteHref(alternatePath) },
			{ rel: "alternate", hrefLang: "x-default", href: siteHref(isGlobal ? canonicalPath : alternatePath) },
			...(isCanonicalHumanAgent
				? publicFactDiscoveryLinks(isGlobal ? "en" : "zh", PRODUCT_FACTS.category.id)
				: machineDiscoveryLinks(isGlobal ? "en" : "zh", machinePage)),
		],
		scripts: [publicEntityGraph({
			locale: isGlobal ? "en" : "zh",
			pageKey: machinePage,
			publicMetadata,
			canonicalPath: publicMetadata || isCanonicalHumanAgent ? canonicalPath : undefined,
			factIds: isCanonicalHumanAgent ? [PRODUCT_FACTS.category.id] : undefined,
		})],
	};
}
