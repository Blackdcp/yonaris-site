import type { PrivacyPageCopy } from "../../contracts/pages/privacy";

export const ZH_CN_PRIVACY_PAGE = {
	edition: "zh-cn",
	page: "privacy",
	metadata: {
		title: "隐私说明｜Yonaris",
		description: "了解 Yonaris 如何接收、使用、保存并处理通过联系表单提交的信息。",
	},
	hero: {
		headline: "我们怎样处理你的咨询信息。",
		body: "我们使用你提交的信息来理解并回复这次咨询，并仅在后续沟通与合理记录所需的时间内保存。请求通过 Cloudflare 处理，只发送到 Yonaris 已验证的收件邮箱。",
	},
	submitted: "工作邮箱为必填项。称呼、公司或官网、想了解的事情，以及展开后的市场背景均为选填项。",
	delivered: "请求通过 Cloudflare Email Service 处理，并只发送到 Yonaris 已验证的收件邮箱。",
	used: "Yonaris 使用这些信息来理解、回复并继续你申请的沟通。表单内容不会显示在公开页面。",
	retention: "信息仅在后续沟通和合理记录所需的时间内保存。隐私请求通过同一联系入口提交，由 Yonaris 人工处理；表单不会自动删除记录。",
	sectionLabels: {
		submitted: "你提交了什么",
		delivered: "信息如何送达",
		used: "信息怎么使用",
		retention: "保存与删除",
	},
	action: { label: "提交隐私请求", target: { kind: "page", page: "contact" } },
} as const satisfies PrivacyPageCopy;
