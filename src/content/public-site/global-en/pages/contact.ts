import type { ContactPageCopy } from "../../contracts/pages/contact";

export const GLOBAL_EN_CONTACT_PAGE = {
	edition: "global-en",
	page: "contact",
	metadata: {
		title: "Talk to Yonaris",
		description: "Start with a work email. You do not need a brief or a fully defined problem.",
	},
	hero: {
		headline: "Curious where Yonaris could fit?",
		body: "You don’t need a brief. Leave a work email and we’ll start with what you’re curious about.",
	},
	form: {
		workEmailLabel: "Work email *",
		workEmailPlaceholder: "you@company.com",
		nameLabel: "Name",
		companyLabel: "Company or website",
		curiosityLabel: "What are you curious about?",
		submitLabel: "Start a conversation",
		expansionLabel: "I already have a market question",
		expandedFields: ["Market question", "Market or language", "Buyer or commercial context"],
	},
	success: "Thanks. Someone from Yonaris will reply personally.",
	boundary: "The form does not promise an instant audit, automated score, generated report, meeting slot, or response SLA.",
} as const satisfies ContactPageCopy;
