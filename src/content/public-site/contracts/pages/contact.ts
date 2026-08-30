import type { PublicPageCopy } from "../common";

export interface ContactPageCopy extends PublicPageCopy {
	readonly page: "contact";
	readonly hero: { readonly headline: string; readonly body: string };
	readonly form: {
		readonly workEmailLabel: string;
		readonly workEmailPlaceholder: string;
		readonly nameLabel: string;
		readonly companyLabel: string;
		readonly curiosityLabel: string;
		readonly submitLabel: string;
		readonly expansionLabel: string;
		readonly expandedFields: readonly string[];
	};
	readonly success: string;
	readonly boundary: string;
}
