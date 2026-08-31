import { createFileRoute } from "@tanstack/react-router";
import { AgentPage } from "@/components/experience/agent/agent-pages";
import { agentPageHead } from "@/lib/seo";
export const Route = createFileRoute("/agent/casework")({ head: () => agentPageHead("en", "casework"), component: () => <AgentPage locale="en" pageKey="casework" /> });
