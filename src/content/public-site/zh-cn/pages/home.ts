import { ZH_CATEGORY } from "../../canonical/product-facts";
import type { HomePageCopy } from "../../contracts/pages/home";
import { ZH_CN_BUYER_QUESTION } from "../buyer-question";

export const ZH_CN_HOME_PAGE = {
	edition: "zh-cn",
	page: "home",
	metadata: {
		title: "Yonaris｜看清客户听到了什么",
		description: "看清 AI 和数字渠道如何呈现与比较品牌，找到影响客户选择的证据与下一步行动。",
	},
	hero: {
		eyebrow: ZH_CATEGORY,
		headline: "看清客户听到了什么，再决定哪里值得改。",
		body: "Yonaris 把 AI 和数字渠道的回答、比较理由与证据连在一起。营销团队可以看清品牌为何进入或退出备选、下一步先处理什么，以及复核后哪些发生了变化。",
		actions: [
			{ label: "看看 Yonaris 怎么工作", target: { kind: "page", page: "product" } },
			{ label: "先聊聊", target: { kind: "page", page: "contact" } },
		],
	},
	heroEvent: {
		question: ZH_CN_BUYER_QUESTION.question,
		answerEnvironments: ["AI 答案", "搜索结果", "行业内容与评测", "品牌公开信息"],
		inspectionLabels: ["进入备选，因为", "没有进入，因为", "查看判断从哪里来", "已关联来源", "缺少关键语境", "发现信息矛盾"],
		resolvingStatement: "这就是客户联系销售之前，已经形成的第一轮判断。",
	},
	productPreview: {
		headline: "从一个市场问题，到团队下一步该做什么。",
		workingViews: ["客户在问什么", "他们听到了什么", "为什么会得到这个答案", "团队先改哪里", "复核后变了什么"],
	},
	humanAgent: {
		headline: "同一个事实，让人看得懂，也让 Agent 读得准。",
		body: "两种读法来自同一份公开记录。",
		layers: ["结论", "证据", "Agent 可读事实"],
		actions: [
			{ label: "看看两种读法", target: { kind: "page", page: "human-agent" } },
			{ label: "查看 Agent 记录", target: { kind: "machine", route: "agent-index" } },
		],
	},
	casework: {
		headline: "看一个市场问题如何被完整拆解。",
		stateLabels: ["最初的答案", "证据缺口", "经团队审阅的行动", "已变化", "未变化", "无法归因"],
		disclosure: "代表性案例演示，不构成客户效果声明。",
	},
	closing: {
		headline: "不确定 Yonaris 能帮上什么？",
		body: "不用准备方案，也不用先把问题想完整。先聊聊就行。",
		action: { label: "先聊聊", target: { kind: "page", page: "contact" } },
	},
} as const satisfies HomePageCopy;
