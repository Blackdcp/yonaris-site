import type { NavigationTarget } from "@/site/route-types";

export const GLOBAL_EN_NAVIGATION = {
	header: [{ kind: "page", page: "product" }, { kind: "page", page: "casework" }, { kind: "page", page: "company" }] as const satisfies readonly NavigationTarget[],
	contactCta: { kind: "page", page: "contact" } as const satisfies NavigationTarget,
	footer: [
		{ kind: "page", page: "home" }, { kind: "page", page: "product" }, { kind: "page", page: "casework" }, { kind: "page", page: "company" }, { kind: "page", page: "human-agent" }, { kind: "page", page: "contact" }, { kind: "page", page: "privacy" }, { kind: "machine", route: "agent-index" }, { kind: "page", page: "product", hash: "markets-languages" },
	] as const satisfies readonly NavigationTarget[],
};

export const GLOBAL_EN_NAVIGATION_LABELS = {
	home: "Home", product: "Product", casework: "Casework", company: "Company", "human-agent": "Human + Agent", contact: "Contact", privacy: "Privacy", "agent-index": "Agent documents", "markets-languages": "Markets & Languages",
} as const;
