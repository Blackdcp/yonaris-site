import { defineBuyerQuestionRecord } from "../contracts/buyer-question";

export const ZH_CN_BUYER_QUESTION = defineBuyerQuestionRecord({
	id: "yonaris.buyer-question.zh-cn.competitor-shortlist-reason.v1",
	edition: "zh-cn",
	question: "为什么竞品先进入了客户的备选，而我们的优势没有成为选择理由？",
	audience: "营销与商业团队",
	market: "代表性市场条件",
	language: "简体中文",
	observationConditions: {
		market: "代表性市场条件",
		audience: "营销与商业团队",
		language: "简体中文",
		channels: ["AI 答案", "搜索结果", "行业内容与评测", "品牌公开信息"],
		observedAt: "代表性案例初始观测",
		boundary: "案例只呈现选定渠道与明确条件下的观测，不代表穷尽市场中的所有答案。",
	},
	channelAnswers: [
		{ id: "answer.ai", environment: "AI 答案", answer: "竞品因清楚说明适用场景并附有公开依据而进入备选；你的公司虽被提到，却只有宽泛介绍。" },
	],
	comparisonReasons: [
		{ id: "reason.alternative-a.included", subject: "竞品 A", disposition: "included", reason: "竞品的能力、适用场景和公开依据连在一起。", evidenceIds: ["evidence.alternative-a.relationship"] },
		{ id: "reason.your-company.excluded", subject: "你的公司", disposition: "excluded", reason: "我们的优势缺少条件、范围和可核对来源。", evidenceIds: ["evidence.your-company.capability"] },
	],
	evidence: [
		{ id: "evidence.alternative-a.relationship", sourceId: "yonaris.local.representative.zh-cn.alternative-a", sourceLabel: "Yonaris 代表性案例来源——竞品 A", trace: "代表性能力→适用场景→公开依据关系。", scope: "仅适用于本案例中的竞品 A。", boundary: "竞品 A 是代表性标签，不是真实客户或竞品名称。" },
		{ id: "evidence.your-company.capability", sourceId: "yonaris.local.representative.zh-cn.your-company", sourceLabel: "Yonaris 代表性案例来源——你的公司", trace: "代表性公开能力尚未说明与本问题相关的适用条件。", scope: "仅适用于本案例中的你的公司。", boundary: "你的公司是代表性标签，不是真实客户名称。" },
	],
	gaps: [
		{ id: "gap.selection-criterion-relationship", description: "问题不是没被提到，而是客户找不到继续比较我们的理由。", affectedReasonIds: ["reason.your-company.excluded"] },
	],
	proposedActions: [
		{ id: "action.review-evidence-relationship", description: "审阅并补齐一项关键证据关系：明确适用范围和支持市场，并关联潜在客户可以核对的公开来源。", status: "approved", reviewedBy: "human-team", evidenceGapIds: ["gap.selection-criterion-relationship"] },
	],
	review: {
		reviewConditionsFrozen: true,
		reviewedAt: "代表性案例后续复核",
		changed: [{ kind: "changed-observation", statement: "复核时，品牌的选择理由已经出现。", evidenceIds: ["evidence.your-company.capability"] }],
		unchanged: [{ kind: "unchanged-observation", statement: "推荐顺序没有变化。", evidenceIds: ["evidence.alternative-a.relationship"] }],
		attribution: { status: "cannot-attribute", boundary: "单次复核不能证明变化由某一项内容造成。" },
		commercialOutcome: null,
	},
	disclosure: {
		sourceId: "yonaris.local.representative.zh-cn.casework.v1",
		sourceLabel: "Yonaris 代表性案例记录",
		representation: "representative",
		boundary: "代表性案例演示，不构成客户效果声明，也不声称已经带来商业结果。",
	},
});
