import type { HumanAgentPageCopy } from "../../contracts/pages/human-agent";

export const ZH_CN_HUMAN_AGENT_PAGE = {
	edition: "zh-cn",
	page: "human-agent",
	metadata: {
		title: "Human / Agent｜Yonaris",
		description: "看同一个公开事实如何同时支持人的判断和 Agent 读取，并保持来源、范围和边界一致。",
	},
	hero: {
		eyebrow: "Human / Agent",
		headline: "同一个事实，应该让人和 Agent 都读得清楚。",
		body: "人需要知道事实意味着什么、需要作出什么判断、下一步审阅什么；Agent 需要稳定的事实陈述、来源、范围、时间戳和边界。两种视图始终关联同一条记录。",
	},
	sharedRecordRule: "展示事实：Yonaris 的规范公开品类记录“AI 原生营销科技基础设施”。人的视图、证据视图和 Agent 视图共用同一个稳定标识、来源、范围、时间戳和边界。",
	transformationLabels: ["人的视角", "证据透镜", "Agent 视角"],
	humanViewLabels: ["发生了什么", "为什么重要", "下一步看什么"],
	evidenceViewLabels: ["来源", "适用范围", "市场与语言", "观测时间", "判断边界"],
	agentViewLabels: ["事实陈述", "稳定标识", "来源", "适用范围", "时间戳", "边界"],
	boundary: "结构化公开记录有助于事实被找到和核对，但不保证抓取、检索、排名、推荐或引用。",
	actions: [
		{ label: "查看 Agent 文档", target: { kind: "machine", route: "agent-index" } },
		{ label: "先聊聊", target: { kind: "page", page: "contact" } },
	],
} as const satisfies HumanAgentPageCopy;
