import type { ContactPageCopy } from "@/content/public-site/contracts/pages/contact";
import type { ContactFieldErrors, ContactLeadDraft } from "@/lib/contact-schema";
import type { ContactFieldName, ContactFieldRefs } from "./contact-fields";

interface HighIntentFieldsProps {
	readonly copy: ContactPageCopy["form"];
	readonly values: ContactLeadDraft;
	readonly errors: ContactFieldErrors;
	readonly refs: ContactFieldRefs;
	readonly expanded: boolean;
	readonly onExpandedChange: (expanded: boolean) => void;
	readonly onUpdate: (field: ContactFieldName, value: string) => void;
}

export function HighIntentFields({ copy, values, errors, refs, expanded, onExpandedChange, onUpdate }: HighIntentFieldsProps) {
	return (
		<details
			className="site-v1-contact-form__high-intent"
			data-contact-high-intent="true"
			open={expanded}
			onToggle={(event) => onExpandedChange(event.currentTarget.open)}
		>
			<summary>{copy.expansionLabel}</summary>
			<div className="site-v1-contact-form__high-intent-fields">
				<div className="site-v1-contact-field" data-contact-field="marketQuestion">
					<label htmlFor="contact-market-question">{copy.expandedFields[0]}</label>
					<textarea
						ref={(node) => { refs.current.marketQuestion = node; }}
						id="contact-market-question"
						name="marketQuestion"
						rows={4}
						value={values.marketQuestion}
						maxLength={1_500}
						aria-invalid={errors.marketQuestion ? true : undefined}
						aria-describedby={errors.marketQuestion ? "contact-market-question-error" : undefined}
						onChange={(event) => onUpdate("marketQuestion", event.currentTarget.value)}
					/>
					{errors.marketQuestion ? <p id="contact-market-question-error" className="site-v1-contact-field__error">{errors.marketQuestion}</p> : null}
				</div>
				<div className="site-v1-contact-field" data-contact-field="marketOrLanguage">
					<label htmlFor="contact-market-language">{copy.expandedFields[1]}</label>
					<input
						ref={(node) => { refs.current.marketOrLanguage = node; }}
						id="contact-market-language"
						name="marketOrLanguage"
						value={values.marketOrLanguage}
						maxLength={240}
						aria-invalid={errors.marketOrLanguage ? true : undefined}
						aria-describedby={errors.marketOrLanguage ? "contact-market-language-error" : undefined}
						onChange={(event) => onUpdate("marketOrLanguage", event.currentTarget.value)}
					/>
					{errors.marketOrLanguage ? <p id="contact-market-language-error" className="site-v1-contact-field__error">{errors.marketOrLanguage}</p> : null}
				</div>
				<div className="site-v1-contact-field" data-contact-field="buyerOrCommercialContext">
					<label htmlFor="contact-buyer-context">{copy.expandedFields[2]}</label>
					<textarea
						ref={(node) => { refs.current.buyerOrCommercialContext = node; }}
						id="contact-buyer-context"
						name="buyerOrCommercialContext"
						rows={4}
						value={values.buyerOrCommercialContext}
						maxLength={1_500}
						aria-invalid={errors.buyerOrCommercialContext ? true : undefined}
						aria-describedby={errors.buyerOrCommercialContext ? "contact-buyer-context-error" : undefined}
						onChange={(event) => onUpdate("buyerOrCommercialContext", event.currentTarget.value)}
					/>
					{errors.buyerOrCommercialContext ? <p id="contact-buyer-context-error" className="site-v1-contact-field__error">{errors.buyerOrCommercialContext}</p> : null}
				</div>
			</div>
		</details>
	);
}
