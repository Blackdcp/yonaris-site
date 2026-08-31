import { createFileRoute } from "@tanstack/react-router";
import { AgentPage } from "@/components/experience/agent/agent-pages";
import { agentPageHead } from "@/lib/seo";
export const Route = createFileRoute("/zh/agent/casework")({ head: () => agentPageHead("zh", "casework"), component: () => <AgentPage locale="zh" pageKey="casework" /> });
