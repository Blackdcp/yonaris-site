import { createFileRoute } from "@tanstack/react-router";
import { AgentPage } from "@/components/experience/agent/agent-pages";
import { agentPageHead } from "@/lib/seo";
export const Route = createFileRoute("/agent/human-agent")({ head: () => agentPageHead("en", "human-agent"), component: () => <AgentPage locale="en" pageKey="human-agent" /> });
