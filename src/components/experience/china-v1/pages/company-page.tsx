import { getSiteV1Asset } from "@/content/public-site/assets";
import { COMPANY_FACTS } from "@/content/public-site/canonical/company-facts";
import { PRODUCT_FACTS } from "@/content/public-site/canonical/product-facts";
import { ZH_CN_COMPANY_PAGE } from "@/content/public-site/zh-cn/pages/company";
import { getPublicPagePath, resolveNavigationTarget } from "@/site/route-selectors";
import { CompanyAperture } from "../../shared/company/company-aperture";
import { ChineseSiteShell } from "../chinese-site-shell";

const copy = ZH_CN_COMPANY_PAGE;
const labels = copy.siteV1!;
const asset = getSiteV1Asset("company-light-corridor");

const facts = [
	{ id: PRODUCT_FACTS.category.id, label: labels.verifiedFacts.labels[0], value: PRODUCT_FACTS.category.value["zh-cn"] },
	{ id: COMPANY_FACTS.publicName.id, label: labels.verifiedFacts.labels[1], value: COMPANY_FACTS.publicName.value },
	{ id: COMPANY_FACTS.officialDomain.id, label: labels.verifiedFacts.labels[2], value: COMPANY_FACTS.officialDomain.value, href: COMPANY_FACTS.officialDomain.value },
	{ id: COMPANY_FACTS.contactLabel.id, label: labels.verifiedFacts.labels[3], value: COMPANY_FACTS.contactLabel.value["zh-cn"], href: getPublicPagePath("zh-cn", "contact") },
	{ id: COMPANY_FACTS.privacyLabel.id, label: labels.verifiedFacts.labels[4], value: COMPANY_FACTS.privacyLabel.value["zh-cn"], href: getPublicPagePath("zh-cn", "privacy") },
] as const;

export function ChineseCompanyPage() {
	return <ChineseSiteShell pageKey="company"><div className="site-v1-company">
		<CompanyAperture copy={copy} labels={labels} asset={asset} edition="zh-cn" imageAlt="一道光穿过深色空间，形成可以改变方向和开口的光廊" />
		<section className="site-v1-company-facts" data-company-module="verified-facts"><header><h2>{labels.verifiedFacts.heading}</h2><p>不靠口号认识一家公司，先从可以直接核对的事实开始。</p></header><dl>{facts.map((fact) => <div key={fact.id} data-company-fact-id={fact.id}><dt>{fact.label}</dt><dd>{"href" in fact ? <a href={fact.href}>{fact.value}</a> : <strong>{fact.value}</strong>}<code>{fact.id}</code></dd></div>)}</dl></section>
		<nav className="site-v1-company-closing" aria-label={labels.closingLabel}>{copy.actions.map((action) => <a key={action.label} href={resolveNavigationTarget("zh-cn", action.target)}>{action.label}</a>)}</nav>
	</div></ChineseSiteShell>;
}
