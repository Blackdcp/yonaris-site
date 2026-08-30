import { GLOBAL_EN_NAVIGATION } from "@/content/public-site/global-en/navigation";
import { ZH_CN_NAVIGATION } from "@/content/public-site/zh-cn/navigation";
import { PUBLIC_PAGE_MANIFEST } from "@/site/public-page-manifest";
import type { PublicPageKey } from "@/site/route-types";
import type { EditionDefinition, EditionPage, EditionPageRef, SiteEdition } from "./types";

function ref(edition: SiteEdition, page: PublicPageKey): EditionPageRef {
	return `${edition}:${page}`;
}

function pagesFor(edition: SiteEdition): readonly EditionPage[] {
	const record = edition === "global-en" ? GLOBAL_EN_NAVIGATION : ZH_CN_NAVIGATION;
	const primaryPages = new Set<PublicPageKey>(record.header.filter((target) => target.kind === "page").map((target) => target.page));
	const utilityPages = new Set<PublicPageKey>(record.contactCta.kind === "page" ? [record.contactCta.page] : []);
	const footerPages = new Set<PublicPageKey>(record.footer.filter((target) => target.kind === "page").map((target) => target.page));
	return PUBLIC_PAGE_MANIFEST.map((page) => ({
		ref: ref(edition, page.key),
		editionId: edition,
		locale: edition === "global-en" ? "en" : "zh-CN",
		pathname: page.paths[edition],
		intentId: page.key,
		publication: "published",
		navigation: [
			...(primaryPages.has(page.key) ? ["primary" as const] : []),
			...(utilityPages.has(page.key) ? ["utility" as const] : []),
			...(footerPages.has(page.key) ? ["footer" as const] : []),
		],
		seo: { indexable: true, ...(edition === "global-en" ? { xDefault: true } : {}) },
	}));
}

function navigationPages(edition: SiteEdition, area: "header" | "footer"): readonly EditionPageRef[] {
	const record = edition === "global-en" ? GLOBAL_EN_NAVIGATION : ZH_CN_NAVIGATION;
	const targets = area === "header" ? [...record.header, record.contactCta] : record.footer;
	return targets.flatMap((target) => (target.kind === "page" ? [ref(edition, target.page)] : []));
}

const editions: Record<SiteEdition, EditionDefinition> = {
	"global-en": {
		id: "global-en", home: ref("global-en", "home"), pages: pagesFor("global-en"), primaryNavigation: navigationPages("global-en", "header"), footerNavigation: navigationPages("global-en", "footer"), localeFallbackHome: ref("global-en", "home"), analyticsPolicy: "disabled", diagnosticPolicy: "global-v2",
	},
	"zh-cn": {
		id: "zh-cn", home: ref("zh-cn", "home"), pages: pagesFor("zh-cn"), primaryNavigation: navigationPages("zh-cn", "header"), footerNavigation: navigationPages("zh-cn", "footer"), localeFallbackHome: ref("zh-cn", "home"), analyticsPolicy: "disabled", diagnosticPolicy: "regional-v2",
	},
};

export function getEdition(id: SiteEdition): EditionDefinition {
	return editions[id];
}

export function getEditionPage(ref: EditionPageRef): EditionPage {
	const page = Object.values(editions).flatMap((edition) => edition.pages).find((candidate) => candidate.ref === ref);
	if (!page) throw new Error(`Unknown edition page: ${ref}`);
	return page;
}

export function findPublishedEditionPage(pathname: string): EditionPage | undefined {
	return Object.values(editions).flatMap((edition) => edition.pages).find((page) => page.pathname === pathname && page.publication === "published");
}
