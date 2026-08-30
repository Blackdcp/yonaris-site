"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { GLOBAL_EN_NAVIGATION } from "@/content/public-site/global-en/navigation";
import { ZH_CN_NAVIGATION } from "@/content/public-site/zh-cn/navigation";
import { getPublicPagePath, resolveNavigationTarget } from "@/site/route-selectors";
import type { NavigationTarget, PublicPageKey, SiteEdition } from "@/site/route-types";
import { EditionLink } from "./edition-link";
import type { SiteShellCopy } from "./site-shell";

export type MenuAction = "toggle" | "escape" | "route-select";

export function nextMenuState(open: boolean, action: MenuAction): boolean {
	return action === "toggle" ? !open : false;
}

function navigationFor(edition: SiteEdition) {
	return edition === "global-en" ? GLOBAL_EN_NAVIGATION : ZH_CN_NAVIGATION;
}

function itemLabel(copy: SiteShellCopy, target: NavigationTarget): string {
	if (target.kind === "machine") return copy.labels["agent-index"];
	if (target.hash === "markets-languages") return copy.labels["markets-languages"];
	return copy.labels[target.page];
}

function PrimaryNavigation({
	edition,
	pageKey,
	copy,
	mobile = false,
	onNavigate,
}: {
	readonly edition: SiteEdition;
	readonly pageKey: PublicPageKey;
	readonly copy: SiteShellCopy;
	readonly mobile?: boolean;
	readonly onNavigate?: () => void;
}) {
	const navigation = navigationFor(edition);
	return (
		<nav
			className={mobile ? "site-v1-header__mobile-navigation" : "site-v1-header__primary"}
			aria-label={mobile ? copy.mobileNavigationLabel : copy.primaryNavigationLabel}
			data-site-v1-primary-navigation={mobile ? undefined : "true"}
		>
			{navigation.header.map((target) => (
				<a
					key={target.page}
					href={resolveNavigationTarget(edition, target)}
					aria-current={target.page === pageKey ? "page" : undefined}
					onClick={onNavigate}
				>
					{itemLabel(copy, target)}
				</a>
			))}
			<a
				className="site-v1-header__contact"
				href={resolveNavigationTarget(edition, navigation.contactCta)}
				aria-current={pageKey === "contact" ? "page" : undefined}
				onClick={onNavigate}
			>
				{copy.contactCtaLabel}
			</a>
		</nav>
	);
}

export function SiteHeader({ edition, pageKey, copy }: { edition: SiteEdition; pageKey: PublicPageKey; copy: SiteShellCopy }) {
	const [menuOpen, setMenuOpen] = useState(false);
	const [enhanced, setEnhanced] = useState(false);
	const menuButtonRef = useRef<HTMLButtonElement>(null);
	useEffect(() => setEnhanced(true), []);
	const closeMenu = () => setMenuOpen(false);
	const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
		if (event.key !== "Escape" || !menuOpen) return;
		event.preventDefault();
		setMenuOpen(nextMenuState(menuOpen, "escape"));
		if (event.target instanceof Element && event.target.closest("#site-v1-mobile-navigation")) {
			menuButtonRef.current?.focus();
		}
	};

	return (
		<header
			className="site-v1-header"
			data-site-v1-enhanced={enhanced ? "true" : undefined}
			onKeyDown={handleKeyDown}
		>
			<div className="site-v1-header__inner">
				<a
					className="site-v1-header__brand"
					href={getPublicPagePath(edition, "home")}
					aria-label={copy.brandLabel}
					aria-current={pageKey === "home" ? "page" : undefined}
				>
					Yonaris
				</a>
				<PrimaryNavigation edition={edition} pageKey={pageKey} copy={copy} />
				<div className="site-v1-header__utilities">
					<a
						className="site-v1-header__reading-control"
						data-site-v1-reading-control="human-agent"
						href={getPublicPagePath(edition, "human-agent")}
						aria-current={pageKey === "human-agent" ? "page" : undefined}
					>
						{copy.labels["human-agent"]}
					</a>
					<EditionLink
						edition={edition}
						pageKey={pageKey}
						className="site-v1-header__locale"
						aria-label={copy.localeAccessibleLabel}
					>
						{copy.localeLabel}
					</EditionLink>
				</div>
				<button
					ref={menuButtonRef}
					type="button"
					aria-expanded={menuOpen}
					aria-controls="site-v1-mobile-navigation"
					className="site-v1-header__menu-button"
					onClick={() => setMenuOpen(nextMenuState(menuOpen, "toggle"))}
				>
					{menuOpen ? copy.closeMenuLabel : copy.menuLabel}
				</button>
			</div>
			<div id="site-v1-mobile-navigation" className="site-v1-header__mobile-panel" hidden={!menuOpen}>
				<PrimaryNavigation edition={edition} pageKey={pageKey} copy={copy} mobile onNavigate={closeMenu} />
				<EditionLink
					edition={edition}
					pageKey={pageKey}
					className="site-v1-header__mobile-locale"
					aria-label={copy.localeAccessibleLabel}
					onClick={closeMenu}
				>
					{copy.localeLabel}
				</EditionLink>
			</div>
		</header>
	);
}
