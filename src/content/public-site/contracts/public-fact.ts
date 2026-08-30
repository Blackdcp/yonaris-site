import type { SiteEdition } from "@/site/route-types";

export interface PublicFactSource {
	readonly id: string;
	readonly label: string;
	readonly kind: "company-authored" | "official-domain";
}

export interface BilingualPublicFactSource {
	readonly id: string;
	readonly label: Readonly<Record<SiteEdition, string>>;
	readonly kind: "company-authored" | "official-domain";
}

export interface BilingualPublicFact {
	readonly id: string;
	readonly value: Readonly<Record<SiteEdition, string>>;
	readonly source: BilingualPublicFactSource;
	readonly scope: Readonly<Record<SiteEdition, string>>;
	readonly lastReviewed: `${number}-${number}-${number}`;
	readonly boundary: Readonly<Record<SiteEdition, string>>;
}

export interface SharedMetadataBilingualPublicFact {
	readonly id: string;
	readonly value: Readonly<Record<SiteEdition, string>>;
	readonly source: PublicFactSource;
	readonly scope: string;
	readonly lastReviewed: `${number}-${number}-${number}`;
	readonly boundary: string;
}

export interface SharedPublicFact {
	readonly id: string;
	readonly value: string;
	readonly source: PublicFactSource;
	readonly scope: string;
	readonly lastReviewed: `${number}-${number}-${number}`;
	readonly boundary: string;
}
