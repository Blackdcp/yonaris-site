import type { SiteEdition } from "@/site/route-types";

export interface ObservationConditions {
	readonly market: string;
	readonly audience: string;
	readonly language: string;
	readonly channels: readonly string[];
	readonly observedAt: string;
	readonly boundary: string;
}

export interface ChannelAnswer {
	readonly id: string;
	readonly environment: string;
	readonly answer: string;
	readonly reasonIds: readonly string[];
	readonly evidenceIds: readonly string[];
}

export interface ComparisonReason {
	readonly id: string;
	readonly subject: string;
	readonly disposition: "included" | "excluded";
	readonly reason: string;
	readonly evidenceIds: readonly string[];
}

export interface EvidenceItem {
	readonly id: string;
	readonly phase: "baseline" | "later-review";
	readonly sourceId: string;
	readonly sourceLabel: string;
	readonly trace: string;
	readonly scope: string;
	readonly boundary: string;
}

export interface EvidenceGap {
	readonly id: string;
	readonly description: string;
	readonly affectedReasonIds: readonly string[];
}

export interface ReviewedAction {
	readonly id: string;
	readonly description: string;
	readonly status: "proposed" | "approved";
	readonly reviewedBy: "human-team";
	readonly evidenceGapIds: readonly string[];
}

export interface ChangedObservation {
	readonly kind: "changed-observation";
	readonly statement: string;
	readonly evidenceIds: readonly string[];
}

export interface UnchangedObservation {
	readonly kind: "unchanged-observation";
	readonly statement: string;
	readonly evidenceIds: readonly string[];
}

export interface CommercialOutcome {
	readonly kind: "commercial-outcome";
	readonly authorization: "authorised-for-publication";
	readonly statement: string;
	readonly sourceId: string;
}

export interface OutcomeReview {
	readonly reviewConditionsFrozen: true;
	readonly reviewedAt: string;
	readonly changed: readonly ChangedObservation[];
	readonly unchanged: readonly UnchangedObservation[];
	readonly attribution: {
		readonly status: "cannot-attribute";
		readonly boundary: string;
	};
	readonly commercialOutcome: CommercialOutcome | null;
}

export interface RepresentativeDisclosure {
	readonly sourceId: string;
	readonly sourceLabel: string;
	readonly representation: "representative";
	readonly boundary: string;
}

export interface BuyerQuestionRecord {
	readonly id: string;
	readonly edition: SiteEdition;
	readonly question: string;
	readonly audience: string;
	readonly market: string;
	readonly language: string;
	readonly observationConditions: ObservationConditions;
	readonly channelAnswers: readonly ChannelAnswer[];
	readonly comparisonReasons: readonly ComparisonReason[];
	readonly evidence: readonly EvidenceItem[];
	readonly gaps: readonly EvidenceGap[];
	readonly proposedActions: readonly ReviewedAction[];
	readonly review: OutcomeReview;
	readonly disclosure: RepresentativeDisclosure;
}

function deepFreeze<T>(value: T): T {
	if (value && typeof value === "object" && !Object.isFrozen(value)) {
		Object.freeze(value);
		for (const child of Object.values(value)) deepFreeze(child);
	}
	return value;
}

export function defineBuyerQuestionRecord<const T extends BuyerQuestionRecord>(record: T): Readonly<T> {
	return deepFreeze(record);
}
