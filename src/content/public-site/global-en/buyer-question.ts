import { defineBuyerQuestionRecord } from "../contracts/buyer-question";

export const GLOBAL_EN_BUYER_QUESTION = defineBuyerQuestionRecord({
	id: "yonaris.buyer-question.global-en.enterprise-analytics-markets.v1",
	edition: "global-en",
	question: "Which analytics partner can support an enterprise marketing team across several markets without losing local context or evidence?",
	audience: "Enterprise marketing team",
	market: "Several markets; representative conditions",
	language: "English",
	observationConditions: {
		market: "Several markets; representative conditions",
		audience: "Enterprise marketing team",
		language: "English",
		channels: ["AI answers", "Search", "Editorial & reviews", "Company-owned content"],
		observedAt: "Representative walkthrough baseline",
		boundary: "The walkthrough represents selected channels and stated conditions; it is not exhaustive market observation.",
	},
	channelAnswers: [
		{
			id: "answer.ai",
			environment: "AI answers",
			answer: "Alternative A was recommended for documented local-market support; Your company was mentioned without the same evidence attached to the reason.",
			reasonIds: ["reason.alternative-a.included", "reason.your-company.excluded"],
			evidenceIds: ["evidence.alternative-a.relationship", "evidence.your-company.capability"],
		},
		{
			id: "answer.search",
			environment: "Search",
			answer: "In the representative walkthrough, search results connected Alternative A’s local-market support to an inspectable source. Your company appeared without the same connection to the selection criterion.",
			reasonIds: ["reason.alternative-a.included", "reason.your-company.excluded"],
			evidenceIds: ["evidence.alternative-a.relationship", "evidence.your-company.capability"],
		},
		{
			id: "answer.editorial",
			environment: "Editorial & reviews",
			answer: "Representative editorial and review material connected Alternative A’s capability to market conditions. It described Your company more broadly.",
			reasonIds: ["reason.alternative-a.included", "reason.your-company.excluded"],
			evidenceIds: ["evidence.alternative-a.relationship", "evidence.your-company.capability"],
		},
		{
			id: "answer.company-owned",
			environment: "Company-owned content",
			answer: "Your company’s representative public content stated the capability, but did not state the conditions that made it relevant to this question.",
			reasonIds: ["reason.your-company.excluded"],
			evidenceIds: ["evidence.your-company.capability"],
		},
	],
	comparisonReasons: [
		{ id: "reason.alternative-a.included", subject: "Alternative A", disposition: "included", reason: "Alternative A connected its capability, market conditions and public evidence.", evidenceIds: ["evidence.alternative-a.relationship"] },
		{ id: "reason.your-company.excluded", subject: "Your company", disposition: "excluded", reason: "Your company published the capability, but not the conditions that made it relevant to this question.", evidenceIds: ["evidence.your-company.capability"] },
	],
	evidence: [
		{ id: "evidence.alternative-a.relationship", phase: "baseline", sourceId: "yonaris.local.representative.global-en.alternative-a", sourceLabel: "Yonaris representative walkthrough source — Alternative A", trace: "Representative capability → market conditions → public evidence relationship.", scope: "Alternative A in this walkthrough only.", boundary: "Alternative A is a representative label, not a real customer or competitor." },
		{ id: "evidence.your-company.capability", phase: "baseline", sourceId: "yonaris.local.representative.global-en.your-company", sourceLabel: "Yonaris representative walkthrough source — Your company", trace: "Representative published capability without the conditions needed for this buyer question.", scope: "Your company in this walkthrough only.", boundary: "Your company is a representative label, not a real customer." },
		{ id: "evidence.review.consideration-reason", phase: "later-review", sourceId: "yonaris.local.representative.global-en.review.consideration-reason", sourceLabel: "Yonaris representative later-review evidence — consideration reason", trace: "The reason for considering the company became visible in the later observation.", scope: "Later review of the same representative buyer question under frozen review conditions.", boundary: "Supports only the observed visibility of the consideration reason; it does not establish cause or a commercial result." },
		{ id: "evidence.review.recommendation-order", phase: "later-review", sourceId: "yonaris.local.representative.global-en.review.recommendation-order", sourceLabel: "Yonaris representative later-review evidence — recommendation order", trace: "The recommendation order did not change.", scope: "Later review of the same representative buyer question under frozen review conditions.", boundary: "Supports only the unchanged recommendation order in this representative review." },
	],
	gaps: [
		{ id: "gap.selection-criterion-relationship", description: "The capability existed. The missing piece was a public evidence relationship that connected it to the buyer’s selection criterion.", affectedReasonIds: ["reason.your-company.excluded"] },
	],
	proposedActions: [
		{ id: "action.review-evidence-relationship", description: "Review one evidence relationship, clarify its scope and supported markets, and attach a source a buyer can inspect.", status: "approved", reviewedBy: "human-team", evidenceGapIds: ["gap.selection-criterion-relationship"] },
	],
	review: {
		reviewConditionsFrozen: true,
		reviewedAt: "Representative later review",
		changed: [{ kind: "changed-observation", statement: "The reason for considering the company became visible in the later observation.", evidenceIds: ["evidence.review.consideration-reason"] }],
		unchanged: [{ kind: "unchanged-observation", statement: "The recommendation order did not change.", evidenceIds: ["evidence.review.recommendation-order"] }],
		attribution: { status: "cannot-attribute", boundary: "One review cannot prove that the content change caused the answer change." },
		commercialOutcome: null,
	},
	disclosure: {
		sourceId: "yonaris.local.representative.global-en.casework.v1",
		sourceLabel: "Yonaris representative casework record",
		representation: "representative",
		boundary: "Representative casework — not a customer performance claim. No commercial result is claimed.",
	},
});
