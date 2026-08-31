import type { ReactNode } from "react";
import type { PublicPageKey } from "@/site/route-types";
import { getLocaleSwitchPath, getPublicPagePath } from "@/site/route-selectors";
import { SiteFooter } from "../shared/shell/site-footer";
import type { SiteShellCopy } from "../shared/shell/site-shell";

export const ZH_CN_SITE_SHELL_COPY = {
	brandLabel: "Yonaris 首页",
	skipLabel: "跳到正文",
	primaryNavigationLabel: "主要导航",
	mobileNavigationLabel: "移动端导航",
	footerNavigationLabel: "页脚导航",
	menuLabel: "菜单",
	closeMenuLabel: "关闭菜单",
	contactCtaLabel: "先聊聊",
	localeLabel: "English",
	localeAccessibleLabel: "切换到英文页面",
	readingControlDescription: "同一份事实，两种清晰读法",
	labels: {
		home: "首页",
		product: "产品",
		casework: "案例过程",
		company: "公司",
		"human-agent": "Human / Agent",
		contact: "聊聊",
		privacy: "隐私说明",
		"agent-index": "Agent 文档",
		"markets-languages": "市场与语言",
	},
} as const satisfies SiteShellCopy;

const PRIMARY = ["product", "casework", "company", "contact"] as const;

export function ChineseSiteShell({ pageKey, children }: { readonly pageKey: PublicPageKey; readonly children: ReactNode }) {
	const copy = ZH_CN_SITE_SHELL_COPY;
	return (
		<div className="site-v1-root" lang="zh-CN" data-generation="site-v1" data-edition="zh-cn" data-page={pageKey}>
			<a className="site-v1-skip-link" href="#site-v1-main">{copy.skipLabel}</a>
			<header className="site-v1-header">
				<div className="site-v1-header__inner">
					<a className="site-v1-header__brand" href={getPublicPagePath("zh-cn", "home")} aria-label={copy.brandLabel}>Yonaris</a>
					<nav className="site-v1-header__primary" aria-label={copy.primaryNavigationLabel}>
						{PRIMARY.map((key) => <a key={key} href={getPublicPagePath("zh-cn", key)} aria-current={pageKey === key ? "page" : undefined}>{copy.labels[key]}</a>)}
					</nav>
					<div className="site-v1-header__utilities">
						<a href={getLocaleSwitchPath("zh-cn", pageKey)} aria-label={copy.localeAccessibleLabel}>{copy.localeLabel}</a>
					</div>
					<details className="site-v1-header__mobile-panel">
						<summary>{copy.menuLabel}</summary>
						<nav aria-label={copy.mobileNavigationLabel}>
							{PRIMARY.map((key) => <a key={key} href={getPublicPagePath("zh-cn", key)}>{copy.labels[key]}</a>)}
							<a href={getLocaleSwitchPath("zh-cn", pageKey)}>{copy.localeLabel}</a>
						</nav>
					</details>
				</div>
			</header>
			<main id="site-v1-main" tabIndex={-1}>{children}</main>
			<SiteFooter edition="zh-cn" pageKey={pageKey} copy={copy} />
		</div>
	);
}
