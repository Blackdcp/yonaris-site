import type { ProductPageCopy } from "../../contracts/pages/product";

export const GLOBAL_EN_PRODUCT_PAGE = {
	edition: "global-en",
	page: "product",
	metadata: {
		title: "Yonaris Product — From buyer question to next move",
		description: "Connect buyer questions, observed answers, evidence, reviewed actions and outcome review in one working record.",
	},
	hero: {
		eyebrow: "Product",
		headline: "From a buyer question to a clear next move.",
		body: "Yonaris observes what selected AI and digital channels tell buyers, traces comparison reasons to evidence and gaps, gives teams a human-reviewed action programme, and records what changed when the same question is reviewed again.",
		actions: [
			{ label: "Explore the product", target: { kind: "page", page: "product", hash: "product-theatre" } },
			{ label: "Talk to Yonaris", target: { kind: "page", page: "contact" } },
		],
	},
	input: {
		headline: "Start with the question—and the conditions around it.",
		labels: ["Market & audience", "Buyer question", "Approved company and product facts", "Content, channels, sources & context", "Language", "Alternatives"],
	},
	systemWork: {
		headline: "Follow the answer to a human-reviewed next action.",
		sequence: ["Observe what buyers are told", "Compare who enters or leaves consideration—and why", "Trace reasons to evidence and gaps", "Put the next action under human review", "Record approved work", "Review the same question again"],
	},
	teamOutput: {
		headline: "What the team gets.",
		items: ["A clear view of what buyers are being told", "The evidence shaping the comparison", "A prioritised action programme for human review", "A record of what changed, what did not, and what comes next"],
	},
	theatre: {
		workingViews: ["Buyer questions", "Current answers", "Sources and gaps", "Actions under review", "Outcome review"],
		stateLabels: ["Observed", "Source attached", "Evidence incomplete", "Needs human review", "Approved by the team", "Review conditions frozen", "Changed", "Unchanged", "Cannot attribute", "Authorised commercial or customer signal, when available"],
	},
	markets: {
		headline: "One company fact. Different market conditions.",
		body: "Market, language, category terms, alternatives, sources and observation conditions stay attached to every buyer question.",
	},
	humanAgent: {
		headline: "The record changes shape—not meaning.",
		body: "The customer-facing conclusion and the machine-readable record keep the same fact identity, source, scope and boundary.",
		action: { label: "See Human / Agent", target: { kind: "page", page: "human-agent" } },
	},
	closing: {
		headline: "See what one buyer question can reveal.",
		actions: [
			{ label: "See Yonaris in action", target: { kind: "page", page: "casework" } },
			{ label: "Talk to Yonaris", target: { kind: "page", page: "contact" } },
		],
	},
} as const satisfies ProductPageCopy;
