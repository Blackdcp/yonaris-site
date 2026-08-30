import type { BilingualPublicFact } from "../contracts/public-fact";

const COMPANY_STATEMENT_SOURCE = {
	id: "yonaris.source.company-statement.2026-08-30",
	label: {
		"global-en": "Yonaris approved public company statement",
		"zh-cn": "Yonaris 已批准的公司公开声明",
	},
	kind: "company-authored",
} as const;

export const PRODUCT_FACTS = {
	category: {
		id: "yonaris.category.ai-native-martech",
		value: {
			"global-en": "AI-Native MarTech Infrastructure",
			"zh-cn": "AI 原生营销科技基础设施",
		},
		source: COMPANY_STATEMENT_SOURCE,
		scope: {
			"global-en": "Yonaris public product category in English and Simplified Chinese.",
			"zh-cn": "Yonaris 面向英文与简体中文公开发布的产品品类。",
		},
		lastReviewed: "2026-08-30",
		boundary: {
			"global-en": "This category does not promise exhaustive coverage, autonomous execution, guaranteed ranking, guaranteed citation, causal proof or a commercial result.",
			"zh-cn": "Yonaris 不承诺覆盖所有答案，也不保证排名、引用或商业结果；系统不会绕过团队自动执行，单次变化也不能被当作因果证明。",
		},
	},
	capability: {
		id: "yonaris.product.buyer-question-to-outcome-review",
		value: {
			"global-en": "Yonaris connects buyer questions, observed answers, evidence, reviewed actions and outcome review in one working record.",
			"zh-cn": "Yonaris 把客户问题、观测答案、证据、经团队审阅的行动和结果复核放进同一条工作记录。",
		},
		source: COMPANY_STATEMENT_SOURCE,
		scope: {
			"global-en": "Selected buyer questions with explicit market, audience, language and observation conditions.",
			"zh-cn": "适用于明确市场、目标人群、语言和观测条件的选定客户问题。",
		},
		lastReviewed: "2026-08-30",
		boundary: {
			"global-en": "Observed changes remain separate from authorised commercial or customer signals.",
			"zh-cn": "观测变化与获授权的商业或客户信号保持分开。",
		},
	},
} as const satisfies Readonly<Record<string, BilingualPublicFact>>;

export const EN_CATEGORY = PRODUCT_FACTS.category.value["global-en"];
export const ZH_CATEGORY = PRODUCT_FACTS.category.value["zh-cn"];
