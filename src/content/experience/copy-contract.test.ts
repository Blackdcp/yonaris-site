import { describe, expect, it } from "vitest";
import { GLOBAL_EN_CASEWORK_PAGE } from "@/content/public-site/global-en/pages/casework";
import { GLOBAL_EN_HOME_PAGE } from "@/content/public-site/global-en/pages/home";
import { GLOBAL_EN_PRODUCT_PAGE } from "@/content/public-site/global-en/pages/product";
import { ZH_CN_CASEWORK_PAGE } from "@/content/public-site/zh-cn/pages/casework";
import { ZH_CN_HOME_PAGE } from "@/content/public-site/zh-cn/pages/home";
import { ZH_CN_PRODUCT_PAGE } from "@/content/public-site/zh-cn/pages/product";

describe("approved bilingual public copy", () => {
	it("keeps the separately authored home propositions and buyer entry logic", () => {
		expect(GLOBAL_EN_HOME_PAGE.hero.headline).toBe("Know what buyers are being told—and what to change.");
		expect(ZH_CN_HOME_PAGE.hero.headline).toBe("看清客户听到了什么，再决定哪里值得改。");
		expect(GLOBAL_EN_HOME_PAGE.heroEvent.question).not.toBe(ZH_CN_HOME_PAGE.heroEvent.question);
	});

	it("keeps product review states distinct and within the approved claim boundary", () => {
		expect(GLOBAL_EN_PRODUCT_PAGE.theatre.stateLabels).toContain("Cannot attribute");
		expect(ZH_CN_PRODUCT_PAGE.theatre.stateLabels).toContain("无法归因");
		expect(`${JSON.stringify(GLOBAL_EN_PRODUCT_PAGE)}\n${JSON.stringify(ZH_CN_PRODUCT_PAGE)}`).not.toMatch(
			/guaranteed improvement|保证改善|autonomous execution|自动执行/i,
		);
	});

	it("discloses representative casework and preserves changed, unchanged and non-attributable limits", () => {
		expect(GLOBAL_EN_CASEWORK_PAGE.hero.disclosure).toBe(
			"Representative casework — not a customer performance claim.",
		);
		expect(ZH_CN_CASEWORK_PAGE.hero.disclosure).toBe("代表性案例演示，不构成客户效果声明。");
		expect(GLOBAL_EN_CASEWORK_PAGE.walkthrough[6].body).toContain("did not change");
		expect(ZH_CN_CASEWORK_PAGE.walkthrough[6].body).toContain("没有变化");
		expect(GLOBAL_EN_CASEWORK_PAGE.walkthrough[7].body).toContain("cannot prove");
		expect(ZH_CN_CASEWORK_PAGE.walkthrough[7].body).toContain("不能证明");
	});
});
