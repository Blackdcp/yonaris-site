import { describe, expect, it } from "vitest";
import { COMPANY_FACTS } from "./canonical/company-facts";
import { PRODUCT_FACTS } from "./canonical/product-facts";
import type { BuyerQuestionRecord } from "./contracts/buyer-question";
import { GLOBAL_EN_BUYER_QUESTION } from "./global-en/buyer-question";
import { GLOBAL_EN_CASEWORK_PAGE } from "./global-en/pages/casework";
import { GLOBAL_EN_COMPANY_PAGE } from "./global-en/pages/company";
import { GLOBAL_EN_CONTACT_PAGE } from "./global-en/pages/contact";
import { GLOBAL_EN_HOME_PAGE } from "./global-en/pages/home";
import { GLOBAL_EN_HUMAN_AGENT_PAGE } from "./global-en/pages/human-agent";
import { GLOBAL_EN_PRIVACY_PAGE } from "./global-en/pages/privacy";
import { GLOBAL_EN_PRODUCT_PAGE } from "./global-en/pages/product";
import { ZH_CN_BUYER_QUESTION } from "./zh-cn/buyer-question";
import { ZH_CN_CASEWORK_PAGE } from "./zh-cn/pages/casework";
import { ZH_CN_COMPANY_PAGE } from "./zh-cn/pages/company";
import { ZH_CN_CONTACT_PAGE } from "./zh-cn/pages/contact";
import { ZH_CN_HOME_PAGE } from "./zh-cn/pages/home";
import { ZH_CN_HUMAN_AGENT_PAGE } from "./zh-cn/pages/human-agent";
import { ZH_CN_PRIVACY_PAGE } from "./zh-cn/pages/privacy";
import { ZH_CN_PRODUCT_PAGE } from "./zh-cn/pages/product";

const records = [GLOBAL_EN_BUYER_QUESTION, ZH_CN_BUYER_QUESTION] as const satisfies readonly BuyerQuestionRecord[];
const pages = [
	GLOBAL_EN_HOME_PAGE, GLOBAL_EN_PRODUCT_PAGE, GLOBAL_EN_CASEWORK_PAGE, GLOBAL_EN_COMPANY_PAGE,
	GLOBAL_EN_HUMAN_AGENT_PAGE, GLOBAL_EN_CONTACT_PAGE, GLOBAL_EN_PRIVACY_PAGE,
	ZH_CN_HOME_PAGE, ZH_CN_PRODUCT_PAGE, ZH_CN_CASEWORK_PAGE, ZH_CN_COMPANY_PAGE,
	ZH_CN_HUMAN_AGENT_PAGE, ZH_CN_CONTACT_PAGE, ZH_CN_PRIVACY_PAGE,
] as const;

function allStrings(value: unknown): string[] {
	if (typeof value === "string") return [value];
	if (Array.isArray(value)) return value.flatMap(allStrings);
	if (value && typeof value === "object") return Object.values(value).flatMap(allStrings);
	return [];
}

function isDeepFrozen(value: unknown): boolean {
	if (!value || typeof value !== "object") return true;
	return Object.isFrozen(value) && Object.values(value).every(isDeepFrozen);
}

describe("canonical public content contract", () => {
	it("publishes the one approved category in both editions", () => {
		expect(PRODUCT_FACTS.category.value).toEqual({
			"global-en": "AI-Native MarTech Infrastructure",
			"zh-cn": "AI 原生营销科技基础设施",
		});
		expect(COMPANY_FACTS.publicName.value).toBe("Yonaris");
	});

	it("provides one stable, deeply immutable representative record per edition", () => {
		expect(records.map((record) => record.edition)).toEqual(["global-en", "zh-cn"]);
		expect(new Set(records.map((record) => record.id)).size).toBe(2);
		expect(records.every(isDeepFrozen)).toBe(true);
	});

	it("authors the two buyer questions independently", () => {
		expect(GLOBAL_EN_BUYER_QUESTION.question).toBe(
			"Which analytics partner can support an enterprise marketing team across several markets without losing local context or evidence?",
		);
		expect(ZH_CN_BUYER_QUESTION.question).toBe("为什么竞品先进入了客户的备选，而我们的优势没有成为选择理由？");
		expect(GLOBAL_EN_BUYER_QUESTION.question).not.toBe(ZH_CN_BUYER_QUESTION.question);
	});

	it("keeps the complete inspection and review trail on every record", () => {
		for (const record of records) {
			expect(record.observationConditions.channels.length).toBeGreaterThan(0);
			expect(record.channelAnswers.length).toBeGreaterThan(0);
			expect(record.comparisonReasons.length).toBeGreaterThan(0);
			expect(record.evidence.length).toBeGreaterThan(0);
			expect(record.evidence.every((item) => item.trace.length > 0)).toBe(true);
			expect(record.gaps.length).toBeGreaterThan(0);
			expect(record.proposedActions.length).toBeGreaterThan(0);
			expect(record.proposedActions.every((action) => action.reviewedBy === "human-team")).toBe(true);
			expect(record.review.changed.length).toBeGreaterThan(0);
			expect(record.review.unchanged.length).toBeGreaterThan(0);
			expect(record.review.attribution.status).toBe("cannot-attribute");
			expect(record.review.commercialOutcome).toBeNull();
			expect(record.disclosure.boundary.length).toBeGreaterThan(0);
		}
	});

	it("uses honest local representative sources and publishes no invented results", () => {
		const text = allStrings(records).join("\n");
		expect(records.every((record) => record.disclosure.sourceId.startsWith("yonaris.local.representative."))).toBe(true);
		expect(records.every((record) => /representative|代表性/.test(record.disclosure.sourceLabel))).toBe(true);
		expect(text).not.toMatch(/representative:\/\//i);
		expect(text).not.toMatch(/https?:\/\/(?!yonaris\.com)/i);
		expect(text).not.toMatch(/\b\d+(?:\.\d+)?%|\btop[- ]?\d+\b|\bscore\b|\brank(?:ed|ing)?\b|(?<!真实)客户名称|客户结果|customer (?:name|result|outcome)/i);
	});

	it("stores typed navigation targets and the approved primary CTA labels", () => {
		expect(GLOBAL_EN_HOME_PAGE.hero.actions[0]).toEqual({ label: "See Yonaris in action", target: { kind: "page", page: "product" } });
		expect(ZH_CN_HOME_PAGE.hero.actions[0]).toEqual({ label: "看看 Yonaris 怎么工作", target: { kind: "page", page: "product" } });
		expect(GLOBAL_EN_PRODUCT_PAGE.hero.actions[0].label).toBe("Explore the product");
		expect(ZH_CN_PRODUCT_PAGE.hero.actions[0].label).toBe("看一次完整过程");
		expect(GLOBAL_EN_CASEWORK_PAGE.closing.action.label).toBe("Talk to Yonaris");
		expect(ZH_CN_CASEWORK_PAGE.closing.action.label).toBe("先聊聊");
		expect(GLOBAL_EN_COMPANY_PAGE.actions[0].label).toBe("See the product");
		expect(ZH_CN_COMPANY_PAGE.actions[0].label).toBe("看看产品");
		expect(GLOBAL_EN_HUMAN_AGENT_PAGE.actions[0].label).toBe("Open Agent documents");
		expect(ZH_CN_HUMAN_AGENT_PAGE.actions[0].label).toBe("查看 Agent 文档");
		expect(GLOBAL_EN_CONTACT_PAGE.form.submitLabel).toBe("Start a conversation");
		expect(ZH_CN_CONTACT_PAGE.form.submitLabel).toBe("开始聊聊");
		expect(GLOBAL_EN_PRIVACY_PAGE.action.label).toBe("Submit a privacy request");
		expect(ZH_CN_PRIVACY_PAGE.action.label).toBe("提交隐私请求");
		expect(allStrings(pages).filter((value) => value.startsWith("/"))).toEqual([]);
	});

	it("does not revive the old category or obsolete primary calls to action", () => {
		const text = allStrings({ records, pages, PRODUCT_FACTS, COMPANY_FACTS }).join("\n");
		expect(text).not.toMatch(/AI-native MarTech infrastructure built for decisions made by people and shaped by agents/i);
		expect(text).not.toMatch(/面向人类决策、由 Agent 共同塑造的 AI 原生营销科技基础设施/);
		expect(text).not.toMatch(/See your brand through AI|Walk through your question|Bring us your question|Share three details/i);
	});
});
