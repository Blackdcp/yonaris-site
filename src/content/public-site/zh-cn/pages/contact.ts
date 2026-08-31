import type { ContactPageCopy } from "../../contracts/pages/contact";
import type { ContactFormUiCopy } from "../../contracts/contact-form-ui";

export const ZH_CN_CONTACT_FORM_UI = {
	fieldsetLegend: "先从一件好奇的事开始",
	botFieldLabel: "请不要填写此项",
	sendingLabel: "正在提交…",
	retryLabel: "重新提交",
	privacySubmitLabel: "提交隐私请求",
	unconfirmedMessage: "暂时无法确认是否送达。你填写的内容还在，可以重新提交。",
	conflictMessage: "提交前表单内容发生了变化，请再提交一次。",
	privacyBoundary: "这会进入人工隐私处理流程，不会自动删除任何记录。",
	disclosure: "这些信息只用于回复本次咨询。",
	privacyLinkLabel: "查看隐私说明",
	validation: {
		workEmailRequired: "请填写工作邮箱。",
		workEmailInvalid: "请填写有效的工作邮箱。",
		fieldTooLong: "内容有点长，请精简后再提交。",
		formInvalid: "请检查表单后再提交。",
	},
} as const satisfies ContactFormUiCopy;

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
