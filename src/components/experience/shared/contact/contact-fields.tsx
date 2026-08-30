import type { MutableRefObject } from "react";
import type { ContactPageCopy } from "@/content/public-site/contracts/pages/contact";
import type { ContactFieldErrors, ContactLeadDraft } from "@/lib/contact-schema";

export type ContactFieldName =
	| "workEmail"
	| "name"
	| "companyOrWebsite"
	| "curiosity"
	| "marketQuestion"
	| "marketOrLanguage"
	| "buyerOrCommercialContext";

export type ContactFieldElement = HTMLInputElement | HTMLTextAreaElement;
export type ContactFieldRefs = MutableRefObject<Record<ContactFieldName, ContactFieldElement | null>>;

export const contactFieldOrder: readonly ContactFieldName[] = [
	"workEmail",
	"name",
	"companyOrWebsite",
	"curiosity",
	"marketQuestion",
	"marketOrLanguage",
	"buyerOrCommercialContext",
];

export function firstContactInvalidField(errors: ContactFieldErrors): ContactFieldName | null {
	return contactFieldOrder.find((field) => Boolean(errors[field])) ?? null;
}

interface ContactFieldsProps {
	readonly copy: ContactPageCopy["form"];
	readonly fieldsetLegend: string;
	readonly values: ContactLeadDraft;
	readonly errors: ContactFieldErrors;
	readonly refs: ContactFieldRefs;
	readonly autoFocusField: ContactFieldName | null;
	readonly onUpdate: (field: ContactFieldName, value: string) => void;
}

function errorId(field: ContactFieldName): string {
	return `contact-${field}-error`;
}

export function ContactFields({ copy, fieldsetLegend, values, errors, refs, autoFocusField, onUpdate }: ContactFieldsProps) {
	return (
		<fieldset className="site-v1-contact-form__base-fields">
			<legend className="sr-only">{fieldsetLegend}</legend>
			<div className="site-v1-contact-field site-v1-contact-field--email" data-contact-field="workEmail">
				<label htmlFor="contact-work-email">{copy.workEmailLabel}</label>
				<input
					ref={(node) => { refs.current.workEmail = node; }}
					id="contact-work-email"
					name="workEmail"
					type="email"
					inputMode="email"
					autoComplete="email"
					placeholder={copy.workEmailPlaceholder}
					value={values.workEmail}
					maxLength={254}
					required
					autoFocus={autoFocusField === "workEmail"}
					aria-invalid={errors.workEmail ? true : undefined}
					aria-describedby={errors.workEmail ? errorId("workEmail") : undefined}
					onChange={(event) => onUpdate("workEmail", event.currentTarget.value)}
				/>
				{errors.workEmail ? <p id={errorId("workEmail")} className="site-v1-contact-field__error">{errors.workEmail}</p> : null}
			</div>

			<div className="site-v1-contact-field site-v1-contact-field--curiosity" data-contact-field="curiosity">
				<label htmlFor="contact-curiosity">{copy.curiosityLabel}</label>
				<textarea
					ref={(node) => { refs.current.curiosity = node; }}
					id="contact-curiosity"
					name="curiosity"
					rows={3}
					value={values.curiosity}
					maxLength={500}
					autoFocus={autoFocusField === "curiosity"}
					aria-invalid={errors.curiosity ? true : undefined}
					aria-describedby={errors.curiosity ? errorId("curiosity") : undefined}
					onChange={(event) => onUpdate("curiosity", event.currentTarget.value)}
				/>
				{errors.curiosity ? <p id={errorId("curiosity")} className="site-v1-contact-field__error">{errors.curiosity}</p> : null}
			</div>

			<div className="site-v1-contact-form__focus-fields" data-contact-focus-fields="true">
				<div className="site-v1-contact-field" data-contact-field="name">
					<label htmlFor="contact-name">{copy.nameLabel}</label>
					<input
						ref={(node) => { refs.current.name = node; }}
						id="contact-name"
						name="name"
						autoComplete="name"
						value={values.name}
						maxLength={120}
						autoFocus={autoFocusField === "name"}
						aria-invalid={errors.name ? true : undefined}
						aria-describedby={errors.name ? errorId("name") : undefined}
						onChange={(event) => onUpdate("name", event.currentTarget.value)}
					/>
					{errors.name ? <p id={errorId("name")} className="site-v1-contact-field__error">{errors.name}</p> : null}
				</div>
				<div className="site-v1-contact-field" data-contact-field="companyOrWebsite">
					<label htmlFor="contact-company">{copy.companyLabel}</label>
					<input
						ref={(node) => { refs.current.companyOrWebsite = node; }}
						id="contact-company"
						name="companyOrWebsite"
						autoComplete="organization"
						value={values.companyOrWebsite}
						maxLength={240}
						autoFocus={autoFocusField === "companyOrWebsite"}
						aria-invalid={errors.companyOrWebsite ? true : undefined}
						aria-describedby={errors.companyOrWebsite ? errorId("companyOrWebsite") : undefined}
						onChange={(event) => onUpdate("companyOrWebsite", event.currentTarget.value)}
					/>
					{errors.companyOrWebsite ? <p id={errorId("companyOrWebsite")} className="site-v1-contact-field__error">{errors.companyOrWebsite}</p> : null}
				</div>
			</div>
		</fieldset>
	);
}
