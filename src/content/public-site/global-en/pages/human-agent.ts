import type { HumanAgentPageCopy } from "../../contracts/pages/human-agent";

export const GLOBAL_EN_HUMAN_AGENT_PAGE = {
	edition: "global-en",
	page: "human-agent",
	metadata: {
		title: "Human / Agent — Yonaris",
		description: "See how one public fact becomes a useful human conclusion and a stable machine-readable record without changing meaning.",
	},
	hero: {
		eyebrow: "Human / Agent",
		headline: "One fact should stay clear—whoever reads it.",
		body: "People need context, judgement and a useful next move. Agents need a stable claim, source, scope, timestamp and boundary. Yonaris keeps both views attached to the same record.",
	},
	sharedRecordRule: "Displayed fact: the canonical public category record, `AI-Native MarTech Infrastructure`. Human, Evidence and Agent views reuse the same stable ID, source, scope, timestamp and boundary.",
	transformationLabels: ["Human view", "Evidence lens", "Agent view"],
	humanViewLabels: ["What happened", "Why it matters", "What to review next"],
	evidenceViewLabels: ["Source", "Scope", "Market & language", "Observed at", "Boundary"],
	agentViewLabels: ["Claim", "Stable ID", "Source", "Scope", "Timestamp", "Boundary"],
	boundary: "A structured public record can help a fact be found and checked. It does not guarantee crawling, retrieval, ranking, recommendation or citation.",
	actions: [
		{ label: "Open Agent documents", target: { kind: "machine", route: "agent-index" } },
		{ label: "Talk to Yonaris", target: { kind: "page", page: "contact" } },
	],
} as const satisfies HumanAgentPageCopy;
