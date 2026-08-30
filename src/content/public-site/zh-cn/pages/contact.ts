import type { ContactPageCopy } from "../../contracts/pages/contact";

export const ZH_CN_CONTACT_PAGE = {
	edition: "zh-cn",
	page: "contact",
	metadata: {
		title: "联系 Yonaris",
		description: "不用准备方案，也不用先把问题想完整。留下工作邮箱，先聊聊你关心的事情。",
	},
	hero: {
		headline: "想知道 Yonaris 能不能帮上忙？",
		body: "不用准备方案，也不用先把问题想完整。留下工作邮箱，我们从你最关心的事情开始。",
	},
	form: {
		workEmailLabel: "工作邮箱 *",
		workEmailPlaceholder: "you@company.com",
		nameLabel: "怎么称呼你",
		companyLabel: "公司或官网",
		curiosityLabel: "你想了解什么？",
		submitLabel: "开始聊聊",
		expansionLabel: "我已经有一个市场问题",
		expandedFields: ["市场问题", "市场或语言", "购买决策或商业背景"],
	},
	success: "收到。Yonaris 会有专人回复你。",
	boundary: "表单不承诺即时审计、自动评分、生成报告、会议时段或回复时限。",
} as const satisfies ContactPageCopy;
