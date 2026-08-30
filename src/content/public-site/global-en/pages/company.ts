import type { CompanyPageCopy } from "../../contracts/pages/company";

export const GLOBAL_EN_COMPANY_PAGE = {
	edition: "global-en",
	page: "company",
	metadata: {
		title: "Company — Yonaris",
		description: "Why Yonaris builds AI-Native MarTech Infrastructure to show teams what buyers are being told and what to change.",
	},
	hero: {
		eyebrow: "Company",
		headline: "We build for the moment before the sales conversation.",
		body: "Yonaris builds AI-Native MarTech Infrastructure for marketing and commercial teams that need to understand what AI and digital channels are telling buyers, which evidence shapes comparison, and what to change next.",
	},
	why: "Buyers can form a first comparison across AI answers, search, public evidence and third-party sources before sales begins. Yonaris makes the information shaping that comparison visible and reviewable.",
	audience: "Marketing and commercial teams use Yonaris when a consequential buyer question is answered inconsistently, related evidence is unclear, or the next marketing action is difficult to prioritise.",
	markets: "The company fact can stay stable while market, language, category terms, alternatives and evidence conditions change. Yonaris keeps both visible.",
	humanJudgement: "Yonaris can surface an observed answer, related evidence and gaps, and a possible next action for review. People decide what is accurate, appropriate and approved, and what the business does next.",
	nonPromises: "Yonaris does not promise exhaustive coverage, guaranteed ranking, guaranteed citation, autonomous execution, causal proof, or a commercial result from a single change.",
	verifiedFactLabels: ["AI-Native MarTech Infrastructure", "Yonaris", "https://yonaris.com", "Talk to Yonaris", "Privacy"],
	actions: [
		{ label: "See the product", target: { kind: "page", page: "product" } },
		{ label: "Talk to Yonaris", target: { kind: "page", page: "contact" } },
	],
} as const satisfies CompanyPageCopy;
