import { describe, expect, it } from "vitest";
import { PRODUCT_FACTS } from "@/content/public-site/canonical/product-facts";
import { GLOBAL_EN_HOME_PAGE } from "@/content/public-site/global-en/pages/home";
import { ZH_CN_HOME_PAGE } from "@/content/public-site/zh-cn/pages/home";
import { EN_CATEGORY, ZH_CATEGORY } from "./canonical-public-facts";

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
});
