import type { ReactNode } from "react";
import type { PublicPageKey } from "@/site/route-types";
import { SiteShell, type SiteShellCopy } from "../shared/shell/site-shell";

export const GLOBAL_EN_SITE_SHELL_COPY = {
	brandLabel: "Yonaris home",
	skipLabel: "Skip to content",
	primaryNavigationLabel: "Primary navigation",
	mobileNavigationLabel: "Mobile navigation",
	footerNavigationLabel: "Footer navigation",
	menuLabel: "Menu",
	closeMenuLabel: "Close menu",
	contactCtaLabel: "Talk to Yonaris",
	localeLabel: "中文",
	localeAccessibleLabel: "View this page in Chinese",
	readingControlDescription: "One canonical fact, two readers",
	labels: {
		home: "Home",
		product: "Product",
		casework: "Casework",
		company: "Company",
		"human-agent": "Human / Agent",
		contact: "Contact",
		privacy: "Privacy",
		"agent-index": "Agent documents",
		"markets-languages": "Markets & languages",
	},
} as const satisfies SiteShellCopy;

export function EnglishSiteShell({ pageKey = "home", children }: { readonly pageKey?: PublicPageKey; readonly children: ReactNode }) {
	return <SiteShell edition="global-en" pageKey={pageKey} copy={GLOBAL_EN_SITE_SHELL_COPY}>{children}</SiteShell>;
}
