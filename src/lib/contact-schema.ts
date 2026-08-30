import { z } from "zod";
import type { ContactValidationCopy } from "@/content/public-site/contracts/contact-form-ui";

export type ContactLocale = "en" | "zh-CN";
export type ContactRequestType = "conversation" | "privacy";

export interface ContactLead {
	readonly locale: ContactLocale;
	readonly workEmail: string;
	readonly name?: string;
	readonly companyOrWebsite?: string;
	readonly curiosity?: string;
	readonly marketQuestion?: string;
	readonly marketOrLanguage?: string;
	readonly buyerOrCommercialContext?: string;
	readonly requestType: ContactRequestType;
	readonly botField?: string;
}

export interface ContactLeadDraft {
	readonly locale: ContactLocale;
	readonly workEmail: string;
	readonly name: string;
	readonly companyOrWebsite: string;
	readonly curiosity: string;
	readonly marketQuestion: string;
	readonly marketOrLanguage: string;
	readonly buyerOrCommercialContext: string;
	readonly requestType: ContactRequestType;
	readonly botField: string;
}

export type ContactFieldErrors = Partial<Record<keyof ContactLeadDraft | "form", string>>;

export type ContactFormResult =
	| { readonly status: "invalid"; readonly values: ContactLeadDraft; readonly fieldErrors: ContactFieldErrors }
	| { readonly status: "unconfirmed"; readonly values: ContactLeadDraft; readonly message: string }
	| { readonly status: "confirmed" };

const limits = {
	workEmail: 254,
	name: 120,
	companyOrWebsite: 240,
	curiosity: 500,
	marketQuestion: 1_500,
	marketOrLanguage: 240,
	buyerOrCommercialContext: 1_500,
} as const;

function optionalTrimmed(max: number) {
	return z.preprocess(
		(value) => typeof value === "string" && value.trim() === "" ? undefined : value,
		z.string().trim().max(max).optional(),
	);
}

export const contactLeadSchema = z.strictObject({
	locale: z.enum(["en", "zh-CN"]),
	workEmail: z.string().trim().min(1).max(limits.workEmail).pipe(z.email()),
	name: optionalTrimmed(limits.name),
	companyOrWebsite: optionalTrimmed(limits.companyOrWebsite),
	curiosity: optionalTrimmed(limits.curiosity),
	marketQuestion: optionalTrimmed(limits.marketQuestion),
	marketOrLanguage: optionalTrimmed(limits.marketOrLanguage),
	buyerOrCommercialContext: optionalTrimmed(limits.buyerOrCommercialContext),
	requestType: z.enum(["conversation", "privacy"]),
	botField: z.preprocess(
		(value) => value === "" || value === undefined ? undefined : value,
		z.string().max(0).optional(),
	),
});

export function parseContactLead(input: unknown): z.ZodSafeParseResult<ContactLead> {
	return contactLeadSchema.safeParse(input) as z.ZodSafeParseResult<ContactLead>;
}

function draftString(value: unknown, max: number): string {
	return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function contactLeadDraft(input: unknown): ContactLeadDraft {
	const values = typeof input === "object" && input !== null ? input as Record<string, unknown> : {};
	return {
		locale: values.locale === "zh-CN" ? "zh-CN" : "en",
		workEmail: draftString(values.workEmail, limits.workEmail),
		name: draftString(values.name, limits.name),
		companyOrWebsite: draftString(values.companyOrWebsite, limits.companyOrWebsite),
		curiosity: draftString(values.curiosity, limits.curiosity),
		marketQuestion: draftString(values.marketQuestion, limits.marketQuestion),
		marketOrLanguage: draftString(values.marketOrLanguage, limits.marketOrLanguage),
		buyerOrCommercialContext: draftString(values.buyerOrCommercialContext, limits.buyerOrCommercialContext),
		requestType: values.requestType === "privacy" ? "privacy" : "conversation",
		botField: "",
	};
}

const DEFAULT_VALIDATION_COPY: ContactValidationCopy = {
	workEmailRequired: "Enter your work email.",
	workEmailInvalid: "Enter a valid work email.",
	fieldTooLong: "Shorten this field and try again.",
	formInvalid: "Check the form and try again.",
};

export function contactFieldErrors(input: unknown, copy: ContactValidationCopy = DEFAULT_VALIDATION_COPY): ContactFieldErrors {
	const parsed = parseContactLead(input);
	if (parsed.success) return {};
	const draft = contactLeadDraft(input);
	const errors: ContactFieldErrors = {};
	for (const issue of parsed.error.issues) {
		const field = issue.path[0];
		if (field === "workEmail" && !errors.workEmail) {
			errors.workEmail = draft.workEmail ? copy.workEmailInvalid : copy.workEmailRequired;
		} else if (typeof field === "string" && field in draft && field !== "botField") {
			errors[field as keyof ContactLeadDraft] ??= copy.fieldTooLong;
		} else if (!errors.form) {
			errors.form = copy.formInvalid;
		}
	}
	return errors;
}
