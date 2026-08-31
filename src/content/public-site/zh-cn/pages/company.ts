import type { CompanyPageCopy } from "../../contracts/pages/company";

export const ZH_CN_COMPANY_PAGE = {
	edition: "zh-cn",
	page: "company",
	siteV1: {
		aperture: {
			ariaLabel: "Yonaris 五项工作原则",
			instruction: "选择一项原则，看看它如何改变判断口径，以及需要附带什么证据和边界。",
			evidenceLabel: "对应的公开依据",
			boundaryLabel: "不能越过的边界",
			principles: [
				{ id: "why", label: "为什么要做 Yonaris" },
				{ id: "audience", label: "谁最需要它" },
				{ id: "markets", label: "面对不同市场" },
				{ id: "human-judgement", label: "哪些必须由人判断" },
				{ id: "non-promises", label: "我们明确不承诺什么" },
			],
		},
		verifiedFacts: {
			heading: "可核对的公开事实",
			labels: ["产品品类", "公开名称", "官方网站", "联系入口", "隐私说明"],
			sourceLabel: "来源",
			scopeLabel: "适用范围",
			reviewedLabel: "最近复核",
			boundaryLabel: "边界",
		},
		closingLabel: "继续了解 Yonaris",
	},
	metadata: {
		title: "关于 Yonaris",
		description: "了解 Yonaris 为何构建 AI 原生营销科技基础设施，帮助团队应对由人作出、同时受 Agent 影响的市场决策。",
	},
	hero: {
		eyebrow: "关于 Yonaris",
		headline: "客户开口之前，很多判断已经发生了。",
		body: "Yonaris 为营销和商业团队提供 AI 原生营销科技基础设施，帮助团队看清 AI 与数字渠道如何呈现和比较一家公司，并找到下一步该审阅的行动和复核条件。",
	},
	why: "很多营销系统擅长统计点击后的行为；但销售介入前，第一轮比较可能已经在 AI、搜索和公开来源中形成。Yonaris 让影响这轮比较的信息变得可见、可复核。",
	audience: "当潜在客户得到的答案不一致、相关证据不清楚，或下一步营销行动难以排序时，Yonaris 帮助营销与商业团队看清问题。",
	markets: "公司事实可以不变，市场、语言、品类用语、比较对象与证据条件却会变化。Yonaris 同时保留事实与条件，而不是把全球化等同于翻译。",
	humanJudgement: "Yonaris 可以呈现观测到的答案、相关证据与缺口，以及供团队审阅的下一步。事实是否准确、行动是否合适、是否批准执行，仍由团队判断。",
	nonPromises: "Yonaris 不承诺覆盖所有答案，也不保证排名、引用或商业结果；系统不会绕过团队自动执行，单次变化也不能被当作因果证明。",
	verifiedFactLabels: ["AI 原生营销科技基础设施", "Yonaris", "https://yonaris.com", "联系 Yonaris", "隐私说明"],
	actions: [
		{ label: "看看产品", target: { kind: "page", page: "product" } },
		{ label: "先聊聊", target: { kind: "page", page: "contact" } },
	],
} as const satisfies CompanyPageCopy;
