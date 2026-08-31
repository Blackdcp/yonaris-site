import type { PublicPageKey } from "@/site/route-types";

export type AgentTopicKey = PublicPageKey;

/** @deprecated Legacy Human-page contract. Remove only after Task 11. */
export const HUMAN_PAGE_KEYS = ["home", "product", "approach", "geo", "company", "diagnostic", "privacy"] as const;

/** @deprecated Legacy Human-page contract. Remove only after Task 11. */
export type HumanPageKey = (typeof HUMAN_PAGE_KEYS)[number];
export type ExperienceLocale = "en" | "zh";

export const HUMAN_PAGE_TO_PUBLIC_PAGE = {
	home: "home",
	product: "product",
	approach: "product",
	geo: "product",
	company: "company",
	diagnostic: "contact",
	privacy: "privacy",
} as const satisfies Readonly<Record<HumanPageKey, PublicPageKey>>;

export const PUBLIC_PAGE_TO_HUMAN_PAGE = {
	home: "home",
	product: "product",
	casework: "approach",
	company: "company",
	"human-agent": "company",
	contact: "diagnostic",
	privacy: "privacy",
} as const satisfies Readonly<Record<PublicPageKey, HumanPageKey>>;

export interface HumanPageCopy {
	readonly navLabel: string;
	readonly metaTitle: string;
	readonly metaDescription: string;
	readonly eyebrow: string;
	readonly title: string;
	readonly lead: string;
}

export interface AgentFact {
	readonly id: string;
	readonly value: string;
	readonly evidenceUrl: string;
	readonly source: string;
	readonly boundary: string;
	readonly sourceId?: string;
	readonly scope?: string;
	readonly lastReviewed?: string;
}

export interface AgentFactGroup {
	readonly id: string;
	readonly title: string;
	readonly facts: readonly AgentFact[];
}

export interface AgentQuestion {
	readonly id: string;
	readonly title: string;
	readonly factIds: readonly string[];
}

export interface AgentTopic {
	readonly id: string;
	readonly locale: ExperienceLocale;
	readonly language: "en" | "zh-CN";
	readonly title: string;
	readonly summary: string;
	readonly humanPath: string;
	readonly agentPath: string;
	readonly markdownPath: string;
	readonly lastReviewed: string;
	readonly reviewedBy: "Yonaris";
	readonly scope: string;
	readonly limitations: readonly string[];
	readonly questions: readonly AgentQuestion[];
	readonly groups: readonly AgentFactGroup[];
}
