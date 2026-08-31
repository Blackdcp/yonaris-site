import { createFileRoute } from "@tanstack/react-router";
import { ChineseHumanAgentPage } from "@/components/experience/china-v1/pages/human-agent-page";
import { ZH_CN_HUMAN_AGENT_PAGE } from "@/content/public-site/zh-cn/pages/human-agent";
import { buildPageHead } from "@/editions/page-head";

export const Route = createFileRoute("/zh/human-agent")({ head: () => buildPageHead("zh-cn", "human-agent", undefined, ZH_CN_HUMAN_AGENT_PAGE.metadata), component: ChineseHumanAgentPage });
