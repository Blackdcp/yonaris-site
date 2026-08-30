import type { BilingualPublicFact } from "../contracts/public-fact";

const COMPANY_STATEMENT_SOURCE = {
	id: "yonaris.source.company-statement.2026-08-30",
	label: "Yonaris approved public company statement",
	kind: "company-authored",
} as const;

export const PRODUCT_FACTS = {
	category: {
		id: "yonaris.category.ai-native-martech-infrastructure",
		value: {
			"global-en": "AI-Native MarTech Infrastructure",
			"zh-cn": "AI 原生营销科技基础设施",
		},
		source: COMPANY_STATEMENT_SOURCE,
		scope: "Yonaris public product category in English and Simplified Chinese.",
		lastReviewed: "2026-08-30",
		boundary: "This category does not promise exhaustive coverage, autonomous execution, guaranteed ranking, guaranteed citation, causal proof or a commercial result.",
	},
	capability: {
		id: "yonaris.product.buyer-question-to-outcome-review",
		value: {
			"global-en": "Yonaris connects buyer questions, observed answers, evidence, reviewed actions and outcome review in one working record.",
			"zh-cn": "Yonaris 把客户问题、观测答案、证据、经团队审阅的行动和结果复核放进同一条工作记录。",
		},
		source: COMPANY_STATEMENT_SOURCE,
		scope: "Selected buyer questions with explicit market, audience, language and observation conditions.",
		lastReviewed: "2026-08-30",
		boundary: "Observed changes remain separate from authorised commercial or customer signals.",
	},
} as const satisfies Readonly<Record<string, BilingualPublicFact>>;

export const EN_CATEGORY = PRODUCT_FACTS.category.value["global-en"];
export const ZH_CATEGORY = PRODUCT_FACTS.category.value["zh-cn"];
