import { ZH_CN_PRIVACY_PAGE } from "@/content/public-site/zh-cn/pages/privacy";
import { getPublicPagePath } from "@/site/route-selectors";
import { ChineseSiteShell } from "../chinese-site-shell";

const SECTIONS = ["submitted", "delivered", "used", "retention"] as const;

export function ChinesePrivacyPage() {
	const copy = ZH_CN_PRIVACY_PAGE;
	return <ChineseSiteShell pageKey="privacy"><article className="site-v1-privacy" data-privacy-composition="editorial-document">
		<header className="site-v1-privacy__hero" data-privacy-first-viewport="true"><div className="site-v1-privacy__hero-copy"><p>隐私说明</p><h1>{copy.hero.headline}</h1><p>{copy.hero.body}</p></div><ol className="site-v1-privacy__route" aria-label="隐私信息目录">{SECTIONS.map((key, index) => <li key={key}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><a href={`#privacy-${key}`}>{copy.sectionLabels[key]}</a></li>)}</ol></header>
		<div className="site-v1-privacy__document"><p className="site-v1-privacy__margin-note" aria-hidden="true">一条短路径，四个清楚边界</p><div className="site-v1-privacy__sections">{SECTIONS.map((key, index) => <section id={`privacy-${key}`} key={key} className="site-v1-privacy__section" data-privacy-section={key}><span className="site-v1-privacy__section-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><div><h2>{copy.sectionLabels[key]}</h2><p>{copy[key]}</p></div></section>)}<footer className="site-v1-privacy__action"><p>隐私请求和普通咨询走同一个人工审核入口。</p><a href={`${getPublicPagePath("zh-cn", "contact")}?intent=privacy`}>{copy.action.label}</a></footer></div></div>
	</article></ChineseSiteShell>;
}
