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
		{ id: "answer.ai", environment: "AI answers", answer: "Alternative A was recommended for documented local-market support; Your company was mentioned without the same evidence attached to the reason." },
	],
	comparisonReasons: [
		{ id: "reason.alternative-a.included", subject: "Alternative A", disposition: "included", reason: "Alternative A connected its capability, market conditions and public evidence.", evidenceIds: ["evidence.alternative-a.relationship"] },
		{ id: "reason.your-company.excluded", subject: "Your company", disposition: "excluded", reason: "Your company published the capability, but not the conditions that made it relevant to this question.", evidenceIds: ["evidence.your-company.capability"] },
	],
	evidence: [
		{ id: "evidence.alternative-a.relationship", sourceId: "yonaris.local.representative.global-en.alternative-a", sourceLabel: "Yonaris representative walkthrough source — Alternative A", trace: "Representative capability → market conditions → public evidence relationship.", scope: "Alternative A in this walkthrough only.", boundary: "Alternative A is a representative label, not a real customer or competitor." },
		{ id: "evidence.your-company.capability", sourceId: "yonaris.local.representative.global-en.your-company", sourceLabel: "Yonaris representative walkthrough source — Your company", trace: "Representative published capability without the conditions needed for this buyer question.", scope: "Your company in this walkthrough only.", boundary: "Your company is a representative label, not a real customer." },
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
		changed: [{ kind: "changed-observation", statement: "The reason for considering the company became visible in the later observation.", evidenceIds: ["evidence.your-company.capability"] }],
		unchanged: [{ kind: "unchanged-observation", statement: "The recommendation order did not change.", evidenceIds: ["evidence.alternative-a.relationship"] }],
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
