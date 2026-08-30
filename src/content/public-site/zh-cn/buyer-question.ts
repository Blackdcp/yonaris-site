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
		{
			id: "answer.ai",
			environment: "AI 答案",
			answer: "竞品因清楚说明适用场景并附有公开依据而进入备选；你的公司虽被提到，却只有宽泛介绍。",
			reasonIds: ["reason.alternative-a.included", "reason.your-company.excluded"],
			evidenceIds: ["evidence.alternative-a.relationship", "evidence.your-company.capability"],
		},
		{
			id: "answer.search",
			environment: "搜索结果",
			answer: "在这份代表性记录里，搜索结果把竞品的能力、适用市场和可核对依据放在一起；你的公司只有能力介绍。",
			reasonIds: ["reason.alternative-a.included", "reason.your-company.excluded"],
			evidenceIds: ["evidence.alternative-a.relationship", "evidence.your-company.capability"],
		},
		{
			id: "answer.editorial",
			environment: "行业内容与评测",
			answer: "代表性行业内容与评测给出了继续比较竞品的理由，但没有为你的公司补上同样的证据关系。",
			reasonIds: ["reason.alternative-a.included", "reason.your-company.excluded"],
			evidenceIds: ["evidence.alternative-a.relationship", "evidence.your-company.capability"],
		},
		{
			id: "answer.company-owned",
			environment: "品牌公开信息",
			answer: "品牌公开信息写到了我们的优势，却没有说明它适用于哪些市场、为何与这个客户问题有关。",
			reasonIds: ["reason.your-company.excluded"],
			evidenceIds: ["evidence.your-company.capability"],
		},
	],
	comparisonReasons: [
		{ id: "reason.alternative-a.included", subject: "竞品 A", disposition: "included", reason: "竞品的能力、适用场景和公开依据连在一起。", evidenceIds: ["evidence.alternative-a.relationship"] },
		{ id: "reason.your-company.excluded", subject: "你的公司", disposition: "excluded", reason: "我们的优势缺少条件、范围和可核对来源。", evidenceIds: ["evidence.your-company.capability"] },
	],
	evidence: [
		{ id: "evidence.alternative-a.relationship", phase: "baseline", sourceId: "yonaris.local.representative.zh-cn.alternative-a", sourceLabel: "Yonaris 代表性案例来源——竞品 A", trace: "代表性能力→适用场景→公开依据关系。", scope: "仅适用于本案例中的竞品 A。", boundary: "竞品 A 是代表性标签，不是真实客户或竞品名称。" },
		{ id: "evidence.your-company.capability", phase: "baseline", sourceId: "yonaris.local.representative.zh-cn.your-company", sourceLabel: "Yonaris 代表性案例来源——你的公司", trace: "代表性公开能力尚未说明与本问题相关的适用条件。", scope: "仅适用于本案例中的你的公司。", boundary: "你的公司是代表性标签，不是真实客户名称。" },
		{ id: "evidence.review.consideration-reason", phase: "later-review", sourceId: "yonaris.local.representative.zh-cn.review.consideration-reason", sourceLabel: "Yonaris 代表性后续复核证据——选择理由", trace: "复核时，品牌的选择理由已经出现。", scope: "在复核条件固定后，对同一代表性客户问题进行后续复核。", boundary: "仅支持选择理由在本次复核中出现，不能据此证明原因或商业结果。" },
		{ id: "evidence.review.recommendation-order", phase: "later-review", sourceId: "yonaris.local.representative.zh-cn.review.recommendation-order", sourceLabel: "Yonaris 代表性后续复核证据——推荐顺序", trace: "推荐顺序没有变化。", scope: "在复核条件固定后，对同一代表性客户问题进行后续复核。", boundary: "仅支持本次代表性复核中的推荐顺序未变化。" },
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
		changed: [{ kind: "changed-observation", statement: "复核时，品牌的选择理由已经出现。", evidenceIds: ["evidence.review.consideration-reason"] }],
		unchanged: [{ kind: "unchanged-observation", statement: "推荐顺序没有变化。", evidenceIds: ["evidence.review.recommendation-order"] }],
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
