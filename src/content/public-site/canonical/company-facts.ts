import type { SharedMetadataBilingualPublicFact, SharedPublicFact } from "../contracts/public-fact";

const COMPANY_STATEMENT_SOURCE = {
	id: "yonaris.source.company-statement.2026-08-30",
	label: "Yonaris approved public company statement",
	kind: "company-authored",
} as const;

export const COMPANY_FACTS = {
	publicName: {
		id: "yonaris.company.public-name",
		value: "Yonaris",
		source: COMPANY_STATEMENT_SOURCE,
		scope: "Public company name.",
		lastReviewed: "2026-08-30",
		boundary: "The name alone does not identify a product capability or outcome.",
	},
	officialDomain: {
		id: "yonaris.company.official-domain",
		value: "https://yonaris.com",
		source: { id: "yonaris.source.official-domain", label: "Yonaris official domain", kind: "official-domain" },
		scope: "Canonical public website domain.",
		lastReviewed: "2026-08-30",
		boundary: "This identifies the official domain only.",
	},
	contactLabel: {
		id: "yonaris.company.contact-label",
		value: { "global-en": "Talk to Yonaris", "zh-cn": "联系 Yonaris" },
		source: COMPANY_STATEMENT_SOURCE,
		scope: "Public navigation contact label.",
		lastReviewed: "2026-08-30",
		boundary: "Starting contact does not promise an audit, report, meeting slot or response SLA.",
	},
	privacyLabel: {
		id: "yonaris.company.privacy-label",
		value: { "global-en": "Privacy", "zh-cn": "隐私说明" },
		source: COMPANY_STATEMENT_SOURCE,
		scope: "Public privacy-page label.",
		lastReviewed: "2026-08-30",
		boundary: "The detailed handling statement lives in the approved privacy-page record.",
	},
} as const satisfies {
	readonly publicName: SharedPublicFact;
	readonly officialDomain: SharedPublicFact;
	readonly contactLabel: SharedMetadataBilingualPublicFact;
	readonly privacyLabel: SharedMetadataBilingualPublicFact;
};
