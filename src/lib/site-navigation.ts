import { GLOBAL_EN_NAVIGATION, GLOBAL_EN_NAVIGATION_LABELS } from "@/content/public-site/global-en/navigation";
import { ZH_CN_NAVIGATION, ZH_CN_NAVIGATION_LABELS } from "@/content/public-site/zh-cn/navigation";
import type { NavigationTarget, PublicPageKey } from "@/site/route-types";
import { resolveNavigationTarget } from "@/site/route-selectors";

export { getLocaleSwitchPath } from "./locale-paths";

export const PORTAL_URL = "https://portal.yonaris.com";

export interface SiteNavigationItem {
	key: PublicPageKey | "agent-index";
	label: string;
	path: string;
}

export interface SiteFooterGroup {
	label: string;
	items: readonly SiteNavigationItem[];
}

const navigationByLocale = {
	en: { edition: "global-en", navigation: GLOBAL_EN_NAVIGATION, labels: GLOBAL_EN_NAVIGATION_LABELS },
	zh: { edition: "zh-cn", navigation: ZH_CN_NAVIGATION, labels: ZH_CN_NAVIGATION_LABELS },
} as const;

function keyFor(target: NavigationTarget): PublicPageKey | "agent-index" {
	return target.kind === "page" ? target.page : target.route;
}

function itemFor(locale: "en" | "zh", target: NavigationTarget): SiteNavigationItem {
	const record = navigationByLocale[locale];
	const key = target.kind === "page" && target.hash ? target.hash : keyFor(target);
	return { key: keyFor(target), label: record.labels[key as keyof typeof record.labels], path: resolveNavigationTarget(record.edition, target) };
}

export function getPrimaryNavigation(locale: "en" | "zh"): readonly SiteNavigationItem[] {
	const record = navigationByLocale[locale];
	return [...record.navigation.header, record.navigation.contactCta].map((target) => itemFor(locale, target));
}

export function getDiagnosticNavigation(locale: "en" | "zh"): SiteNavigationItem {
	return itemFor(locale, navigationByLocale[locale].navigation.contactCta);
}

export function getFooterNavigation(locale: "en" | "zh"): readonly SiteFooterGroup[] {
	return [{ label: locale === "en" ? "Explore" : "了解 Yonaris", items: navigationByLocale[locale].navigation.footer.map((target) => itemFor(locale, target)) }];
}
