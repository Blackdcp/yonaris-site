export interface ContactValidationCopy {
	readonly workEmailRequired: string;
	readonly workEmailInvalid: string;
	readonly fieldTooLong: string;
	readonly formInvalid: string;
}

export interface ContactFormUiCopy {
	readonly fieldsetLegend: string;
	readonly botFieldLabel: string;
	readonly sendingLabel: string;
	readonly retryLabel: string;
	readonly privacySubmitLabel: string;
	readonly unconfirmedMessage: string;
	readonly conflictMessage: string;
	readonly privacyBoundary: string;
	readonly disclosure: string;
	readonly privacyLinkLabel: string;
	readonly validation: ContactValidationCopy;
}
