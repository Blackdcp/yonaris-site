import type { PrivacyPageCopy } from "../../contracts/pages/privacy";

export const GLOBAL_EN_PRIVACY_PAGE = {
	edition: "global-en",
	page: "privacy",
	metadata: {
		title: "Privacy — Yonaris",
		description: "How Yonaris receives, uses, retains and responds to information submitted through the contact form.",
	},
	hero: {
		headline: "Your contact details follow one short route.",
		body: "We use the details you submit to understand and respond to your request. We retain them only as reasonably needed for follow-up and applicable record-keeping duties. The request is processed through Cloudflare and delivered only to verified Yonaris recipient mailboxes.",
	},
	submitted: "Work email is required. Name, company or website, what you are curious about, and any expanded market context are optional.",
	delivered: "The request is processed through Cloudflare Email Service and delivered only to verified Yonaris recipient mailboxes.",
	used: "Yonaris uses the information to understand the request, reply, and continue the follow-up you asked for. Form contents are not displayed on public pages.",
	retention: "Information is retained only as reasonably needed for follow-up and applicable record-keeping duties. Privacy requests use the same contact path and are reviewed manually; the form does not delete records automatically.",
	action: { label: "Submit a privacy request", target: { kind: "page", page: "contact" } },
} as const satisfies PrivacyPageCopy;
