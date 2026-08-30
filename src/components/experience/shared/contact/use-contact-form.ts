"use client";

import { useEffect, useRef, useState } from "react";
import type { ContactValidationCopy } from "@/content/public-site/contracts/contact-form-ui";
import {
	contactLeadFingerprint,
	type ContactRequestIdentity,
	resolveContactRequestIdentity,
	submitContactRequest,
} from "@/lib/contact-client";
import {
	contactFieldErrors,
	contactLeadDraft,
	type ContactFieldErrors,
	type ContactFormResult,
	type ContactLeadDraft,
	type ContactLocale,
	type ContactRequestType,
	parseContactLead,
} from "@/lib/contact-schema";
import type { ContactFieldName, ContactFieldRefs } from "./contact-fields";

export type ContactApertureState = "idle" | "focused" | "expanded" | "invalid" | "unconfirmed" | "confirmed";

const fieldOrder: readonly ContactFieldName[] = [
	"workEmail",
	"name",
	"companyOrWebsite",
	"curiosity",
	"marketQuestion",
	"marketOrLanguage",
	"buyerOrCommercialContext",
];

function initialValues(locale: ContactLocale, requestType: ContactRequestType, result?: ContactFormResult): ContactLeadDraft {
	if (result && result.status !== "confirmed") return result.values;
	return contactLeadDraft({ locale, requestType });
}

function hasHighIntent(values: ContactLeadDraft): boolean {
	return Boolean(values.marketQuestion || values.marketOrLanguage || values.buyerOrCommercialContext);
}

function firstInvalidField(errors: ContactFieldErrors): ContactFieldName | null {
	return fieldOrder.find((field) => Boolean(errors[field])) ?? null;
}

interface UseContactFormOptions {
	readonly locale: ContactLocale;
	readonly requestType: ContactRequestType;
	readonly initialResult?: ContactFormResult;
	readonly initialSubmissionId?: string;
	readonly fieldRefs: ContactFieldRefs;
	readonly statusRef: React.RefObject<HTMLElement | null>;
	readonly validationCopy: ContactValidationCopy;
}

export function useContactForm({ locale, requestType, initialResult, initialSubmissionId, fieldRefs, statusRef, validationCopy }: UseContactFormOptions) {
	const [values, setValues] = useState(() => initialValues(locale, requestType, initialResult));
	const [state, setState] = useState<ContactApertureState>(() => initialResult?.status ?? "idle");
	const [errors, setErrors] = useState<ContactFieldErrors>(() => initialResult?.status === "invalid" ? initialResult.fieldErrors : {});
	const [expanded, setExpanded] = useState(() => hasHighIntent(initialValues(locale, requestType, initialResult)));
	const [submitting, setSubmitting] = useState(false);
	const valuesRef = useRef(values);
	const initialIdentity = (() => {
		if (!initialSubmissionId || !initialResult || initialResult.status === "invalid" || initialResult.status === "confirmed") return null;
		const normalizedLeadFingerprint = contactLeadFingerprint(initialResult.values);
		return normalizedLeadFingerprint ? { normalizedLeadFingerprint, submissionId: initialSubmissionId } : null;
	})();
	const identityRef = useRef<ContactRequestIdentity | null>(initialIdentity);
	const seedSubmissionIdRef = useRef(initialSubmissionId);
	const controllerRef = useRef<AbortController | null>(null);

	useEffect(() => () => controllerRef.current?.abort(), []);
	useEffect(() => {
		if (state === "confirmed" || state === "unconfirmed") statusRef.current?.focus();
	}, [state, statusRef]);

	function update(field: ContactFieldName, value: string): void {
		const next = { ...valuesRef.current, [field]: value };
		valuesRef.current = next;
		setValues(next);
		setErrors((current) => {
			if (!current[field] && !current.form) return current;
			const remaining = { ...current };
			delete remaining[field];
			delete remaining.form;
			return remaining;
		});
		if (state === "invalid" || state === "unconfirmed") setState(expanded ? "expanded" : "focused");
	}

	function focusAperture(): void {
		if (state === "idle") setState(expanded ? "expanded" : "focused");
	}

	function setHighIntentExpanded(next: boolean): void {
		setExpanded(next);
		if (state === "confirmed" || state === "invalid" || state === "unconfirmed") return;
		setState(next ? "expanded" : "focused");
	}

	async function submit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
		event.preventDefault();
		if (submitting || state === "confirmed") return;
		const candidate = { ...valuesRef.current, locale, requestType, botField: valuesRef.current.botField };
		const parsed = parseContactLead(candidate);
		if (!parsed.success) {
			const nextErrors = contactFieldErrors(candidate, validationCopy);
			const first = firstInvalidField(nextErrors);
			setErrors(nextErrors);
			first && fieldRefs.current[first]?.focus();
			setState("invalid");
			return;
		}

		const createId = seedSubmissionIdRef.current
			? () => {
					const id = seedSubmissionIdRef.current as string;
					seedSubmissionIdRef.current = undefined;
					return id;
				}
			: undefined;
		const identity = resolveContactRequestIdentity(identityRef.current, parsed.data, createId);
		if (!identity) return;
		identityRef.current = identity;
		const controller = new AbortController();
		controllerRef.current?.abort();
		controllerRef.current = controller;
		setErrors({});
		setSubmitting(true);
		const result = await submitContactRequest(parsed.data, identity.submissionId, { signal: controller.signal });
		if (controllerRef.current !== controller) return;
		controllerRef.current = null;
		setSubmitting(false);
		if (result.status === "confirmed") {
			setState("confirmed");
			return;
		}
		setState("unconfirmed");
	}

	return {
		values,
		state,
		errors,
		expanded,
		submitting,
		submissionId: identityRef.current?.submissionId ?? seedSubmissionIdRef.current ?? "",
		update,
		focusAperture,
		setHighIntentExpanded,
		submit,
	};
}
