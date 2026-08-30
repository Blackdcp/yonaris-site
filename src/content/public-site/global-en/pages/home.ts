import { EN_CATEGORY } from "../../canonical/product-facts";
import type { HomePageCopy } from "../../contracts/pages/home";
import { GLOBAL_EN_BUYER_QUESTION } from "../buyer-question";

export const GLOBAL_EN_HOME_PAGE = {
	edition: "global-en",
	page: "home",
	siteV1: {
		motionControls: { pauseScene: "Pause scene", resumeScene: "Resume scene" },
		productRecord: {
			audience: "Audience",
			market: "Market",
			language: "Language",
			humanReviewed: "Human reviewed",
		},
	},
	metadata: {
		title: "Yonaris — Know what buyers are being told",
		description: "See what AI and digital channels are telling buyers, which evidence shapes the shortlist, and what your team can change next.",
	},
	hero: {
		eyebrow: EN_CATEGORY,
		headline: "Know what buyers are being told—and what to change.",
		body: "Yonaris shows marketing teams what AI and digital channels are telling buyers, which evidence is shaping the shortlist, what action can change it, and what actually changed afterwards.",
		actions: [
			{ label: "See Yonaris in action", target: { kind: "page", page: "home", hash: "product-preview" } },
			{ label: "Talk to Yonaris", target: { kind: "page", page: "contact" } },
		],
	},
	heroEvent: {
		question: GLOBAL_EN_BUYER_QUESTION.question,
		answerEnvironments: ["AI answers", "Search", "Editorial & reviews", "Company-owned content"],
		inspectionLabels: ["Included because", "Excluded because", "Trace the reason", "Source attached", "Context missing", "Contradiction found"],
		resolvingStatement: "This is what the market is telling buyers before the sales conversation begins.",
	},
	productPreview: {
		headline: "From one buyer question to the next market action.",
		workingViews: ["What buyers ask", "What they hear", "Why they hear it", "What your team can change", "What changed afterwards"],
	},
	humanAgent: {
		headline: "One fact. Two readers. No conflicting versions.",
		body: "Both readings come from the same public record.",
		layers: ["Answer", "Evidence", "Machine-readable fact"],
		actions: [
			{ label: "See both readings", target: { kind: "page", page: "human-agent" } },
			{ label: "Open the Agent record", target: { kind: "machine", route: "agent-index" } },
		],
	},
	casework: {
		headline: "One question, from first answer to review.",
		stateLabels: {
			initialAnswer: "Initial answer",
			evidenceGap: "Evidence gap",
			reviewedAction: "Reviewed action",
			changed: "Changed",
			unchanged: "Unchanged",
			cannotAttribute: "Cannot attribute",
		},
		disclosure: "Representative casework — not a customer performance claim.",
	},
	closing: {
		headline: "Curious where Yonaris could fit?",
		body: "You don’t need a brief—or even a clearly defined problem.",
		action: { label: "Talk to Yonaris", target: { kind: "page", page: "contact" } },
	},
} as const satisfies HomePageCopy;
