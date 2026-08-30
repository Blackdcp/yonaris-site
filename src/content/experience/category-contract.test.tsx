import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { AgentPage } from "@/components/experience/agent/agent-pages";
import { CanonicalRecordTransform } from "@/components/experience/shared/canonical-record-transform";
import { PRODUCT_FACTS } from "@/content/public-site/canonical/product-facts";
import { GLOBAL_EN_HOME_PAGE } from "@/content/public-site/global-en/pages/home";
import { ZH_CN_HOME_PAGE } from "@/content/public-site/zh-cn/pages/home";
import { AGENT_FACTS } from "./agent-facts";
import { EN_CATEGORY, EN_READING_RECORDS, ZH_CATEGORY, ZH_READING_RECORDS } from "./canonical-public-facts";
import { renderAgentCatalog, renderCoreMarkdown } from "@/lib/machine-documents";

interface CategoryProjection {
	readonly stableId?: string;
	readonly fact?: string;
	readonly sourceId?: string;
	readonly source?: string;
	readonly scope?: string;
	readonly lastReviewed?: string;
	readonly boundary?: string;
}

const CATEGORY_PRESENTATION = {
	"global-en": {
		source: "Yonaris approved public company statement",
		scope: "Yonaris public product category in English and Simplified Chinese.",
		boundary: "This category does not promise exhaustive coverage, autonomous execution, guaranteed ranking, guaranteed citation, causal proof or a commercial result.",
	},
	"zh-cn": {
		source: "Yonaris 已批准的公司公开声明",
		scope: "Yonaris 面向英文与简体中文公开发布的产品品类。",
		boundary: "Yonaris 不承诺覆盖所有答案，也不保证排名、引用或商业结果；系统不会绕过团队自动执行，单次变化也不能被当作因果证明。",
	},
} as const;

describe("canonical category contract", () => {
	it("reuses the exact approved category through the compatibility adapter and page copy", () => {
		expect(PRODUCT_FACTS.category.value).toEqual({
			"global-en": "AI-Native MarTech Infrastructure",
			"zh-cn": "AI 原生营销科技基础设施",
		});
		expect(EN_CATEGORY).toBe(PRODUCT_FACTS.category.value["global-en"]);
		expect(ZH_CATEGORY).toBe(PRODUCT_FACTS.category.value["zh-cn"]);
		expect(GLOBAL_EN_HOME_PAGE.hero.eyebrow).toBe(EN_CATEGORY);
		expect(ZH_CN_HOME_PAGE.hero.eyebrow).toBe(ZH_CATEGORY);
	});

	it("projects one canonical category identity and evidence boundary to both readings", () => {
		expect(PRODUCT_FACTS.category.id).toBe("yonaris.category.ai-native-martech");
		expect(PRODUCT_FACTS.category.source.id).toBe("yonaris.source.company-statement.2026-08-30");
		expect(PRODUCT_FACTS.category.source.label).toEqual({
			"global-en": CATEGORY_PRESENTATION["global-en"].source,
			"zh-cn": CATEGORY_PRESENTATION["zh-cn"].source,
		});
		expect(PRODUCT_FACTS.category.scope).toEqual({
			"global-en": CATEGORY_PRESENTATION["global-en"].scope,
			"zh-cn": CATEGORY_PRESENTATION["zh-cn"].scope,
		});
		expect(PRODUCT_FACTS.category.boundary).toEqual({
			"global-en": CATEGORY_PRESENTATION["global-en"].boundary,
			"zh-cn": CATEGORY_PRESENTATION["zh-cn"].boundary,
		});

		const projections = [
			EN_READING_RECORDS.find((record) => record.id === "category"),
			ZH_READING_RECORDS.find((record) => record.id === "category"),
		] as readonly (CategoryProjection | undefined)[];

		for (const [index, projection] of projections.entries()) {
			const edition = index === 0 ? "global-en" : "zh-cn";
			expect(projection).toMatchObject({
				stableId: PRODUCT_FACTS.category.id,
				fact: PRODUCT_FACTS.category.value[edition],
				sourceId: PRODUCT_FACTS.category.source.id,
				source: CATEGORY_PRESENTATION[edition].source,
				scope: CATEGORY_PRESENTATION[edition].scope,
				lastReviewed: PRODUCT_FACTS.category.lastReviewed,
				boundary: CATEGORY_PRESENTATION[edition].boundary,
			});
		}

		const humanEvidenceViews = [
			renderToStaticMarkup(<CanonicalRecordTransform locale="en" />),
			renderToStaticMarkup(<CanonicalRecordTransform locale="zh" />),
		];
		const agentProjections = [
			AGENT_FACTS.global.home.groups[0]?.facts[0],
			AGENT_FACTS.zh.home.groups[0]?.facts[0],
		];
		for (const [index, html] of humanEvidenceViews.entries()) {
			const edition = index === 0 ? "global-en" : "zh-cn";
			expect(html).toContain(PRODUCT_FACTS.category.id);
			expect(html).toContain(PRODUCT_FACTS.category.value[edition]);
			expect(html).toContain(CATEGORY_PRESENTATION[edition].source);
			expect(html).toContain(CATEGORY_PRESENTATION[edition].scope);
			expect(html).toContain(PRODUCT_FACTS.category.lastReviewed);
			expect(html).toContain(CATEGORY_PRESENTATION[edition].boundary);
			expect(html).not.toContain(index === 0 ? "27 Aug 2026" : "2026 年 8 月 27 日");
		}
		for (const [index, agentFact] of agentProjections.entries()) {
			const edition = index === 0 ? "global-en" : "zh-cn";
			expect(agentFact).toMatchObject({
				id: PRODUCT_FACTS.category.id,
				value: PRODUCT_FACTS.category.value[edition],
				boundary: CATEGORY_PRESENTATION[edition].boundary,
			});
			expect(agentFact?.source).toContain(CATEGORY_PRESENTATION[edition].source);
			expect(agentFact?.source).toContain(PRODUCT_FACTS.category.lastReviewed);
		}
	});

	it("exposes canonical category metadata in Agent HTML, Markdown and structured output", () => {
		for (const [locale, edition] of [["en", "global-en"], ["zh", "zh-cn"]] as const) {
			const expected = CATEGORY_PRESENTATION[edition];
			const topic = locale === "en" ? AGENT_FACTS.global.home : AGENT_FACTS.zh.home;
			const category = topic.groups[0]?.facts[0];
			expect(category).toMatchObject({
				id: "yonaris.category.ai-native-martech",
				sourceId: "yonaris.source.company-statement.2026-08-30",
				scope: expected.scope,
				lastReviewed: "2026-08-30",
				boundary: expected.boundary,
			});

			const html = renderToStaticMarkup(<AgentPage locale={locale} pageKey="home" />);
			const article = html.match(/<article id="yonaris\.category\.ai-native-martech"[\s\S]*?<\/article>/)?.[0] ?? "";
			const markdown = renderCoreMarkdown("home", locale);
			const categorySection = markdown.split("### yonaris.category.ai-native-martech")[1]?.split("\n### ")[0] ?? "";
			const catalogue = renderAgentCatalog(locale);
			for (const output of [article, categorySection, catalogue]) {
				expect(output).toContain("yonaris.source.company-statement.2026-08-30");
				expect(output).toContain(expected.scope);
				expect(output).toContain("2026-08-30");
				expect(output).toContain(expected.boundary);
			}
			expect(article).not.toContain("2026-08-27");
			expect(categorySection).not.toContain("2026-08-27");
		}
	});
});
