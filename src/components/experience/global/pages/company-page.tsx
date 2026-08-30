import { getSiteV1Asset } from "@/content/public-site/assets";
import { COMPANY_FACTS } from "@/content/public-site/canonical/company-facts";
import { PRODUCT_FACTS } from "@/content/public-site/canonical/product-facts";
import { GLOBAL_EN_COMPANY_PAGE } from "@/content/public-site/global-en/pages/company";
import { resolveNavigationTarget, getPublicPagePath } from "@/site/route-selectors";
import { CompanyAperture } from "../../shared/company/company-aperture";
import { EnglishSiteShell } from "../english-site-shell";

const copy = GLOBAL_EN_COMPANY_PAGE;
const labels = copy.siteV1;
const asset = getSiteV1Asset("company-light-corridor");

type FactProjection = {
	readonly id: string;
	readonly label: string;
	readonly value: string;
	readonly href?: string;
	readonly source: string;
	readonly scope: string;
	readonly reviewed: string;
	readonly boundary: string;
};

function verifiedFacts(): readonly FactProjection[] {
	const category = PRODUCT_FACTS.category;
	return [
		{
			id: category.id,
			label: labels.verifiedFacts.labels[0],
			value: category.value["global-en"],
			source: category.source.label["global-en"],
			scope: category.scope["global-en"],
			reviewed: category.lastReviewed,
			boundary: category.boundary["global-en"],
		},
		{
			id: COMPANY_FACTS.publicName.id,
			label: labels.verifiedFacts.labels[1],
			value: COMPANY_FACTS.publicName.value,
			source: COMPANY_FACTS.publicName.source.label,
			scope: COMPANY_FACTS.publicName.scope,
			reviewed: COMPANY_FACTS.publicName.lastReviewed,
			boundary: COMPANY_FACTS.publicName.boundary,
		},
		{
			id: COMPANY_FACTS.officialDomain.id,
			label: labels.verifiedFacts.labels[2],
			value: COMPANY_FACTS.officialDomain.value,
			href: COMPANY_FACTS.officialDomain.value,
			source: COMPANY_FACTS.officialDomain.source.label,
			scope: COMPANY_FACTS.officialDomain.scope,
			reviewed: COMPANY_FACTS.officialDomain.lastReviewed,
			boundary: COMPANY_FACTS.officialDomain.boundary,
		},
		{
			id: COMPANY_FACTS.contactLabel.id,
			label: labels.verifiedFacts.labels[3],
			value: COMPANY_FACTS.contactLabel.value["global-en"],
			href: getPublicPagePath("global-en", "contact"),
			source: COMPANY_FACTS.contactLabel.source.label,
			scope: COMPANY_FACTS.contactLabel.scope,
			reviewed: COMPANY_FACTS.contactLabel.lastReviewed,
			boundary: COMPANY_FACTS.contactLabel.boundary,
		},
		{
			id: COMPANY_FACTS.privacyLabel.id,
			label: labels.verifiedFacts.labels[4],
			value: COMPANY_FACTS.privacyLabel.value["global-en"],
			href: getPublicPagePath("global-en", "privacy"),
			source: COMPANY_FACTS.privacyLabel.source.label,
			scope: COMPANY_FACTS.privacyLabel.scope,
			reviewed: COMPANY_FACTS.privacyLabel.lastReviewed,
			boundary: COMPANY_FACTS.privacyLabel.boundary,
		},
	];
}

function VerifiedFacts() {
	return (
		<section className="site-v1-company-facts" data-company-module="verified-facts">
			<header><h2>{labels.verifiedFacts.heading}</h2></header>
			<dl>
				{verifiedFacts().map((fact) => (
					<div key={fact.id} data-company-fact-id={fact.id}>
						<dt>{fact.label}</dt>
						<dd>
							{fact.href ? <a href={fact.href}>{fact.value}</a> : <strong>{fact.value}</strong>}
							<dl>
								<div><dt>{labels.verifiedFacts.sourceLabel}</dt><dd>{fact.source}</dd></div>
								<div><dt>{labels.verifiedFacts.scopeLabel}</dt><dd>{fact.scope}</dd></div>
								<div><dt>{labels.verifiedFacts.reviewedLabel}</dt><dd>{fact.reviewed}</dd></div>
								<div><dt>{labels.verifiedFacts.boundaryLabel}</dt><dd>{fact.boundary}</dd></div>
							</dl>
						</dd>
					</div>
				))}
			</dl>
		</section>
	);
}

export function CompanyPage() {
	return (
		<EnglishSiteShell pageKey="company">
			<div className="site-v1-company">
				<CompanyAperture copy={copy} labels={labels} asset={asset} />
				<VerifiedFacts />
				<nav className="site-v1-company-closing" data-company-closing="true" aria-label={labels.closingLabel}>
					{copy.actions.map((action) => <a key={action.label} href={resolveNavigationTarget("global-en", action.target)}>{action.label}</a>)}
				</nav>
			</div>
		</EnglishSiteShell>
	);
}
