import { createFileRoute } from "@tanstack/react-router";
import { AgentPage } from "@/components/experience/agent/agent-pages";
import { agentPageHead } from "@/lib/seo";
export const Route = createFileRoute("/zh/agent/human-agent")({ head: () => agentPageHead("zh", "human-agent"), component: () => <AgentPage locale="zh" pageKey="human-agent" /> });
