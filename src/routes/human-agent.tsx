import { createFileRoute } from "@tanstack/react-router";
import { HumanAgentPage } from "@/components/experience/global/pages/human-agent-page";
import { GLOBAL_EN_HUMAN_AGENT_PAGE } from "@/content/public-site/global-en/pages/human-agent";
import { buildPageHead } from "@/editions/page-head";

export const Route = createFileRoute("/human-agent")({
	head: () => buildPageHead("global-en", "human-agent", undefined, GLOBAL_EN_HUMAN_AGENT_PAGE.metadata),
	component: HumanAgentPage,
});
