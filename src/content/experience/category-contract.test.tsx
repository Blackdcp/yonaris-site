import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { CanonicalRecordTransform } from "@/components/experience/shared/canonical-record-transform";
import { PRODUCT_FACTS } from "@/content/public-site/canonical/product-facts";
import { GLOBAL_EN_HOME_PAGE } from "@/content/public-site/global-en/pages/home";
import { ZH_CN_HOME_PAGE } from "@/content/public-site/zh-cn/pages/home";
import { AGENT_FACTS } from "./agent-facts";
import { EN_CATEGORY, EN_READING_RECORDS, ZH_CATEGORY, ZH_READING_RECORDS } from "./canonical-public-facts";

interface CategoryProjection {
	readonly stableId?: string;
	readonly fact?: string;
	readonly sourceId?: string;
	readonly source?: string;
	readonly scope?: string;
	readonly lastReviewed?: string;
	readonly boundary?: string;
}

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

		const projections = [
			EN_READING_RECORDS.find((record) => record.id === "category"),
			ZH_READING_RECORDS.find((record) => record.id === "category"),
		] as readonly (CategoryProjection | undefined)[];

		for (const [index, projection] of projections.entries()) {
			expect(projection).toMatchObject({
				stableId: PRODUCT_FACTS.category.id,
				fact: index === 0 ? PRODUCT_FACTS.category.value["global-en"] : PRODUCT_FACTS.category.value["zh-cn"],
				sourceId: PRODUCT_FACTS.category.source.id,
				source: PRODUCT_FACTS.category.source.label,
				scope: PRODUCT_FACTS.category.scope,
				lastReviewed: PRODUCT_FACTS.category.lastReviewed,
				boundary: PRODUCT_FACTS.category.boundary,
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
			expect(html).toContain(PRODUCT_FACTS.category.id);
			expect(html).toContain(PRODUCT_FACTS.category.value[index === 0 ? "global-en" : "zh-cn"]);
			expect(html).toContain(PRODUCT_FACTS.category.source.label);
			expect(html).toContain(PRODUCT_FACTS.category.lastReviewed);
			expect(html).toContain(PRODUCT_FACTS.category.boundary);
			expect(html).not.toContain(index === 0 ? "27 Aug 2026" : "2026 年 8 月 27 日");
		}
		for (const [index, agentFact] of agentProjections.entries()) {
			expect(agentFact).toMatchObject({
				id: PRODUCT_FACTS.category.id,
				value: PRODUCT_FACTS.category.value[index === 0 ? "global-en" : "zh-cn"],
				boundary: PRODUCT_FACTS.category.boundary,
			});
			expect(agentFact?.source).toContain(PRODUCT_FACTS.category.source.label);
			expect(agentFact?.source).toContain(PRODUCT_FACTS.category.lastReviewed);
		}
	});
});
