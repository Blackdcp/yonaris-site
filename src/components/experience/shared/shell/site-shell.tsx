import type { ReactNode } from "react";
import type { PublicPageKey, SiteEdition } from "@/site/route-types";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export type SiteShellLabelKey = PublicPageKey | "agent-index" | "markets-languages";

export interface SiteShellCopy {
	readonly brandLabel: string;
	readonly skipLabel: string;
	readonly primaryNavigationLabel: string;
	readonly mobileNavigationLabel: string;
	readonly footerNavigationLabel: string;
	readonly menuLabel: string;
	readonly closeMenuLabel: string;
	readonly contactCtaLabel: string;
	readonly localeLabel: string;
	readonly localeAccessibleLabel: string;
	readonly labels: Readonly<Record<SiteShellLabelKey, string>>;
}

export interface SiteShellProps {
	readonly edition: SiteEdition;
	readonly pageKey: PublicPageKey;
	readonly copy: SiteShellCopy;
	readonly children: ReactNode;
}

export function SiteShell({ edition, pageKey, copy, children }: SiteShellProps) {
	return (
		<div
			className="site-v1-root"
			lang={edition === "global-en" ? "en" : "zh-CN"}
			data-generation="site-v1"
			data-edition={edition}
			data-page={pageKey}
		>
			<a className="site-v1-skip-link" href="#site-v1-main">
				{copy.skipLabel}
			</a>
			<SiteHeader edition={edition} pageKey={pageKey} copy={copy} />
			<main id="site-v1-main" tabIndex={-1}>
				{children}
			</main>
			<SiteFooter edition={edition} pageKey={pageKey} copy={copy} />
		</div>
	);
}
