import type { PageAction, PublicPageCopy } from "../common";

export interface PrivacyPageCopy extends PublicPageCopy {
	readonly page: "privacy";
	readonly hero: { readonly headline: string; readonly body: string };
	readonly submitted: string;
	readonly delivered: string;
	readonly used: string;
	readonly retention: string;
	readonly action: PageAction;
}
