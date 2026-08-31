import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { SiteShellCopy } from "./site-shell";
import { SiteShell } from "./site-shell";
import { nextMenuState } from "./site-header";
import {
	initialInteractionControl,
	interactionControlReducer,
} from "../motion/use-interaction-control";

const englishCopy = {
	brandLabel: "Yonaris home",
	skipLabel: "Skip to content",
	primaryNavigationLabel: "Primary navigation",
	mobileNavigationLabel: "Mobile navigation",
	footerNavigationLabel: "Footer navigation",
	menuLabel: "Menu",
	closeMenuLabel: "Close menu",
	contactCtaLabel: "Talk to Yonaris",
	localeLabel: "中文",
	localeAccessibleLabel: "View this page in Chinese",
	readingControlDescription: "One canonical fact, two readers",
	labels: {
		home: "Home",
		product: "Product",
		casework: "Casework",
		company: "Company",
		"human-agent": "Human / Agent",
		contact: "Contact",
		privacy: "Privacy",
		"agent-index": "Agent documents",
		"markets-languages": "Markets & languages",
	},
} as const satisfies SiteShellCopy;

const chineseCopy = {
	brandLabel: "Yonaris 中文首页",
	skipLabel: "跳至主要内容",
	primaryNavigationLabel: "主导航",
	mobileNavigationLabel: "移动导航",
	footerNavigationLabel: "页脚导航",
	menuLabel: "菜单",
	closeMenuLabel: "关闭菜单",
	contactCtaLabel: "联系 Yonaris",
	localeLabel: "English",
	localeAccessibleLabel: "查看此页面的英文版本",
	readingControlDescription: "同一条规范事实，两种读法",
	labels: {
		home: "首页",
		product: "产品",
		casework: "案例拆解",
		company: "关于 Yonaris",
		"human-agent": "Human / Agent",
		contact: "联系 Yonaris",
		privacy: "隐私说明",
		"agent-index": "Agent 文档",
		"markets-languages": "市场与语言",
	},
} as const satisfies SiteShellCopy;

function renderShell(edition: "global-en" | "zh-cn", pageKey: "product" | "casework", copy: SiteShellCopy) {
	return renderToStaticMarkup(
		<SiteShell edition={edition} pageKey={pageKey} copy={copy}>
			<h1>Readable page content</h1>
		</SiteShell>,
	);
}

describe("Site 1.0 shell", () => {
	it("renders the exact edition-owned primary navigation and derives active state from the semantic page key", () => {
		const english = renderShell("global-en", "product", englishCopy);
		const chinese = renderShell("zh-cn", "casework", chineseCopy);

		const englishPrimary = english.match(/<nav[^>]+data-site-v1-primary-navigation[^>]*>([\s\S]*?)<\/nav>/)?.[1] ?? "";
		const chinesePrimary = chinese.match(/<nav[^>]+data-site-v1-primary-navigation[^>]*>([\s\S]*?)<\/nav>/)?.[1] ?? "";
		expect([...englishPrimary.matchAll(/>(Product|Casework|Company|Talk to Yonaris)</g)].map((item) => item[1])).toEqual([
			"Product",
			"Casework",
			"Company",
			"Talk to Yonaris",
		]);
		expect([...chinesePrimary.matchAll(/>(产品|案例拆解|关于 Yonaris|联系 Yonaris)</g)].map((item) => item[1])).toEqual([
			"产品",
			"案例拆解",
			"关于 Yonaris",
			"联系 Yonaris",
		]);
		expect(englishPrimary).toContain('href="/product" aria-current="page"');
		expect(chinesePrimary).toContain('href="/zh/casework" aria-current="page"');
	});

	it("keeps Human / Agent in the footer but nowhere in the header", () => {
		const markup = renderShell("global-en", "product", englishCopy);
		const header = markup.match(/<header[\s\S]*?<\/header>/)?.[0] ?? "";
		const primary = markup.match(/<nav[^>]+data-site-v1-primary-navigation[^>]*>([\s\S]*?)<\/nav>/)?.[1] ?? "";
		expect(primary).not.toContain("Human / Agent");
		expect(header).not.toContain("Human / Agent");
		expect(header).not.toContain('href="/human-agent"');
		expect(markup).not.toContain('data-site-v1-reading-control="human-agent"');
		expect(markup).toContain('href="/human-agent"');
		expect(markup).toContain("Human / Agent");
		expect(markup).toContain("One canonical fact, two readers");
	});

	it("derives the footer category from canonical product facts instead of authoring a second literal", () => {
		const source = readFileSync(new URL("./site-footer.tsx", import.meta.url), "utf8");
		expect(source).toContain("PRODUCT_FACTS.category.value[edition]");
		expect(source).not.toContain('"AI-Native MarTech Infrastructure"');
		expect(source).not.toContain('"AI 原生营销科技基础设施"');
	});

	it("renders an SSR-readable header, main and footer with semantic links and no external host or attribution", () => {
		const markup = renderShell("global-en", "product", englishCopy);
		for (const landmark of ["<header", "<main", "<footer", "<nav"]) expect(markup).toContain(landmark);
		expect(markup).toContain("Readable page content");
		expect(markup).toContain('href="/zh/product"');
		expect(markup).not.toMatch(/https?:\/\/(?!yonaris\.com)|Unsplash|Pexels|Photo:/i);
	});

	it("uses accessible menu state transitions for touch, keyboard Escape and route selection", () => {
		expect(nextMenuState(false, "toggle")).toBe(true);
		expect(nextMenuState(true, "toggle")).toBe(false);
		expect(nextMenuState(true, "escape")).toBe(false);
		expect(nextMenuState(true, "route-select")).toBe(false);
		const markup = renderShell("global-en", "product", englishCopy);
		expect(markup).toContain('type="button" aria-expanded="false"');
		expect(markup).toContain('hrefLang="zh-CN"');
	});
});

describe("interaction and reduced-motion foundation", () => {
	it.each(["pointer", "keyboard", "touch"] as const)("relinquishes automatic playback after %s input", (source) => {
		const initial = initialInteractionControl(false);
		expect(initial.mode).toBe("playing");
		const controlled = interactionControlReducer(initial, { type: "direct-input", source });
		expect(controlled).toEqual({ mode: "controlled", paused: true });
	});

	it("supports explicit pause and resume without stealing control", () => {
		const paused = interactionControlReducer(initialInteractionControl(false), { type: "pause" });
		expect(paused).toEqual({ mode: "controlled", paused: true });
		expect(interactionControlReducer(paused, { type: "resume" })).toEqual({ mode: "playing", paused: false });
	});

	it("returns a stable reduced state and never resumes nonessential travel", () => {
		const reduced = initialInteractionControl(true);
		expect(reduced).toEqual({ mode: "reduced", paused: true });
		expect(interactionControlReducer(reduced, { type: "resume" })).toEqual({ mode: "reduced", paused: true });
	});
});
