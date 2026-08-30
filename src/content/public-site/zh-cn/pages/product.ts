import type { ProductPageCopy } from "../../contracts/pages/product";

export const ZH_CN_PRODUCT_PAGE = {
	edition: "zh-cn",
	page: "product",
	metadata: {
		title: "Yonaris 产品｜从客户问题到下一步行动",
		description: "把客户问题、AI 答案、公开证据、待审阅行动和后续复核放进同一条工作记录。",
	},
	hero: {
		eyebrow: "产品",
		headline: "把客户听到的答案，变成团队下一步能做的事。",
		body: "Yonaris 观察 AI 和数字渠道如何回答客户问题，追溯比较理由对应的证据与缺口，交给团队审阅下一步行动，并记录同条件复核后的变化与未变化。",
		actions: [
			{ label: "看一次完整过程", target: { kind: "page", page: "product", hash: "product-theatre" } },
			{ label: "先聊聊", target: { kind: "page", page: "contact" } },
		],
	},
	input: {
		headline: "先把问题和判断条件放进来。",
		labels: ["市场与目标人群", "客户问题", "已批准的公司与产品事实", "内容、渠道、来源与语境", "语言", "客户会比较的对象"],
	},
	systemWork: {
		headline: "沿着答案，找到真正该处理的地方。",
		sequence: ["看见客户听到了什么", "看见谁进入或退出备选，以及原因", "把比较理由追溯到证据与缺口", "由团队审阅下一步行动", "记录已经批准的工作", "在相同条件下复核变化"],
	},
	teamOutput: {
		headline: "团队最终拿到什么。",
		items: ["客户正在听到什么", "哪些证据正在影响比较", "一份由团队审阅优先级的行动方案", "一份记录变化、未变化和下一步复核的工作档案"],
	},
	theatre: {
		workingViews: ["客户问题", "当前答案", "来源与证据缺口", "待团队审阅", "结果复核"],
		stateLabels: ["已观测", "已关联来源", "证据不完整", "待团队审阅", "团队已批准", "复核条件已固定", "已变化", "未变化", "无法归因", "获授权的商业或客户信号（如有）"],
	},
	markets: {
		headline: "换一个市场，判断条件也要跟着换。",
		body: "每个客户问题都保留市场、语言、当地品类用语、比较对象、来源和观测条件。全球化不是简单翻译，而是在每个市场保留正确的判断背景。",
	},
	humanAgent: {
		headline: "表达方式会变，事实本身不变。",
		body: "面向人的结论与面向 Agent 的记录，共用同一个事实标识、来源、范围和边界。",
		action: { label: "了解 Human / Agent", target: { kind: "page", page: "human-agent" } },
	},
	closing: {
		headline: "从一个真实问题开始，就够了。",
		actions: [
			{ label: "看看 Yonaris 怎么工作", target: { kind: "page", page: "casework" } },
			{ label: "先聊聊", target: { kind: "page", page: "contact" } },
		],
	},
} as const satisfies ProductPageCopy;
