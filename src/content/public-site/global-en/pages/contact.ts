import type { ContactPageCopy } from "../../contracts/pages/contact";
import type { ContactFormUiCopy } from "../../contracts/contact-form-ui";

export const GLOBAL_EN_CONTACT_FORM_UI = {
	fieldsetLegend: "Start a conversation",
	botFieldLabel: "Leave this field empty",
	sendingLabel: "Sending…",
	retryLabel: "Try again",
	privacySubmitLabel: "Submit privacy request",
	unconfirmedMessage: "We could not confirm delivery. Your details are still here—please try again.",
	conflictMessage: "This form changed before delivery could be confirmed. Please submit again.",
	privacyBoundary: "This starts a manual privacy review. It does not automatically delete records.",
	disclosure: "We use these details only to respond to this request.",
	privacyLinkLabel: "Privacy",
	validation: {
		workEmailRequired: "Enter your work email.",
		workEmailInvalid: "Enter a valid work email.",
		fieldTooLong: "Shorten this field and try again.",
		formInvalid: "Check the form and try again.",
	},
} as const satisfies ContactFormUiCopy;

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
