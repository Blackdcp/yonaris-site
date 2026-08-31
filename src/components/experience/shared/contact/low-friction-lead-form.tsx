"use client";

import { useEffect, useRef, useState } from "react";
import type { ContactFormUiCopy } from "@/content/public-site/contracts/contact-form-ui";
import type { ContactPageCopy } from "@/content/public-site/contracts/pages/contact";
import type { ContactFormResult, ContactLocale, ContactRequestType } from "@/lib/contact-schema";
import { useMotionPreference } from "../motion/use-motion-preference";
import { ContactFields, firstContactInvalidField, type ContactFieldName, type ContactFieldRefs } from "./contact-fields";
import { HighIntentFields } from "./high-intent-fields";
import { useContactForm, type ContactApertureState } from "./use-contact-form";

const geometry: Record<ContactApertureState, { shape: string; signal: string; depth: string }> = {
	idle: { shape: "closed-line", signal: "quiet", depth: "surface" },
	focused: { shape: "open-channel", signal: "listening", depth: "near" },
	expanded: { shape: "wide-channel", signal: "context", depth: "deep" },
	invalid: { shape: "interrupted-channel", signal: "check", depth: "near" },
	unconfirmed: { shape: "suspended-channel", signal: "retry", depth: "near" },
	confirmed: { shape: "human-handoff", signal: "received", depth: "settled" },
};

interface LowFrictionLeadFormProps {
	readonly copy: ContactPageCopy;
	readonly uiCopy: ContactFormUiCopy;
	readonly locale: ContactLocale;
	readonly privacyHref: string;
	readonly requestType: ContactRequestType;
	readonly initialResult?: ContactFormResult;
	readonly initialSubmissionId?: string;
}

export function LowFrictionLeadForm({ copy, uiCopy, locale, privacyHref, requestType, initialResult, initialSubmissionId }: LowFrictionLeadFormProps) {
	const fieldRefs = useRef<Record<ContactFieldName, HTMLInputElement | HTMLTextAreaElement | null>>({
		workEmail: null,
		name: null,
		companyOrWebsite: null,
		curiosity: null,
		marketQuestion: null,
		marketOrLanguage: null,
		buyerOrCommercialContext: null,
	}) as ContactFieldRefs;
	const statusRef = useRef<HTMLElement>(null);
	const form = useContactForm({ locale, requestType, initialResult, initialSubmissionId, fieldRefs, statusRef, validationCopy: uiCopy.validation });
	const motionPreference = useMotionPreference();
	const [enhanced, setEnhanced] = useState(false);
	useEffect(() => setEnhanced(true), []);
	const signature = geometry[form.state];
	const privacy = requestType === "privacy";
	const initialInvalidField = initialResult?.status === "invalid" ? firstContactInvalidField(initialResult.fieldErrors) : null;
	const initialFormErrorFocus = initialResult?.status === "invalid" && !initialInvalidField && Boolean(initialResult.fieldErrors.form);

	return (
		<section
			className="site-v1-contact-aperture"
			data-contact-aperture="true"
			data-v1-state={form.state}
			data-contact-geometry={signature.shape}
			data-contact-signal={signature.signal}
			data-contact-depth={signature.depth}
			data-motion-preference={motionPreference}
			data-enhanced={enhanced ? "true" : undefined}
		>
			<div className="site-v1-contact-aperture__signal" data-visual-atmosphere="true" aria-hidden="true">
				<i /><i /><i />
			</div>
			{form.state === "confirmed" ? (
				<div
					ref={statusRef as React.RefObject<HTMLDivElement>}
					className="site-v1-contact-aperture__confirmation"
					data-contact-status="confirmed"
					role="status"
					aria-live="polite"
					tabIndex={-1}
					autoFocus={initialResult?.status === "confirmed"}
				>
					<p>{copy.success}</p>
				</div>
			) : null}
			<form
				className="site-v1-contact-form"
				method="post"
				action="/api/contact"
				acceptCharset="UTF-8"
				noValidate
				hidden={form.state === "confirmed"}
				aria-hidden={form.state === "confirmed" ? true : undefined}
				data-contact-submitting={form.submitting ? "true" : undefined}
				onFocusCapture={(event) => {
					if (!(event.target instanceof HTMLElement) || !event.target.matches("input, textarea, select, [contenteditable='true']")) return;
					form.focusAperture();
				}}
				onSubmit={form.submit}
			>
				<input type="hidden" name="locale" value={locale} />
				<input type="hidden" name="requestType" value={requestType} />
				<input type="hidden" name="submissionId" value={form.submissionId} />
				<div className="site-v1-contact-form__honeypot" aria-hidden="true">
					<label htmlFor="contact-company-url">{uiCopy.botFieldLabel}</label>
					<input id="contact-company-url" name="botField" defaultValue="" tabIndex={-1} autoComplete="off" />
				</div>
				<ContactFields
					copy={copy.form}
					fieldsetLegend={uiCopy.fieldsetLegend}
					values={form.values}
					errors={form.errors}
					refs={fieldRefs}
					autoFocusField={initialInvalidField}
					onUpdate={form.update}
				/>
				<HighIntentFields
					copy={copy.form}
					values={form.values}
					errors={form.errors}
					refs={fieldRefs}
					expanded={form.expanded}
					autoFocusField={initialInvalidField}
					onExpandedChange={form.setHighIntentExpanded}
					onUpdate={form.update}
				/>
				{privacy ? (
					<p className="site-v1-contact-form__privacy-boundary">
						{uiCopy.privacyBoundary}
					</p>
				) : null}
				{form.errors.form ? (
					<p
						ref={statusRef as React.RefObject<HTMLParagraphElement>}
						className="site-v1-contact-form__message"
						data-contact-status="invalid"
						role="alert"
						tabIndex={-1}
						autoFocus={initialFormErrorFocus}
					>
						{form.errors.form}
					</p>
				) : null}
				{form.state === "unconfirmed" ? (
					<p
						ref={statusRef as React.RefObject<HTMLParagraphElement>}
						className="site-v1-contact-form__message"
						data-contact-status="unconfirmed"
						role="alert"
						tabIndex={-1}
						autoFocus={initialResult?.status === "unconfirmed"}
					>
						{uiCopy.unconfirmedMessage}
					</p>
				) : null}
				<button className="site-v1-contact-form__submit" type="submit" disabled={form.submitting}>
					{form.submitting ? uiCopy.sendingLabel : form.state === "unconfirmed" ? uiCopy.retryLabel : privacy ? uiCopy.privacySubmitLabel : copy.form.submitLabel}
				</button>
				<p className="site-v1-contact-form__disclosure">{uiCopy.disclosure} <a href={privacyHref}>{uiCopy.privacyLinkLabel}</a></p>
			</form>
		</section>
	);
}
