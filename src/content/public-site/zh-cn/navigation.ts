import type { NavigationTarget } from "@/site/route-types";

export const ZH_CN_NAVIGATION = {
	header: [{ kind: "page", page: "product" }, { kind: "page", page: "casework" }, { kind: "page", page: "company" }] as const satisfies readonly NavigationTarget[],
	contactCta: { kind: "page", page: "contact" } as const satisfies NavigationTarget,
	footer: [
		{ kind: "page", page: "home" }, { kind: "page", page: "product" }, { kind: "page", page: "casework" }, { kind: "page", page: "company" }, { kind: "page", page: "human-agent" }, { kind: "page", page: "contact" }, { kind: "page", page: "privacy" }, { kind: "machine", route: "agent-index" }, { kind: "page", page: "product", hash: "markets-languages" },
	] as const satisfies readonly NavigationTarget[],
};

export const ZH_CN_NAVIGATION_LABELS = {
	home: "首页", product: "产品", casework: "案例", company: "公司", "human-agent": "人类与 Agent", contact: "联系", privacy: "隐私", "agent-index": "Agent 文档", "markets-languages": "市场与语言",
} as const;
