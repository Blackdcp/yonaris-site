import { describe, expect, test } from "vitest";
import { buildPageHead } from "./page-head";
import { globalEnglishPageHead } from "./global-en/edition";
import { zhPageHead } from "./zh-cn/edition";
import { GLOBAL_EN_HOME_PAGE } from "@/content/public-site/global-en/pages/home";
import { GLOBAL_EN_HUMAN_AGENT_PAGE } from "@/content/public-site/global-en/pages/human-agent";
import { PRODUCT_FACTS } from "@/content/public-site/canonical/product-facts";

describe("edition page heads", () => {
	test("derives canonical and reciprocal locale paths from the public manifest", () => {
		const head = buildPageHead("global-en", "casework");
		expect(head.links).toContainEqual({ rel: "canonical", href: "https://yonaris.com/casework" });
		expect(head.links).toContainEqual({ rel: "alternate", hrefLang: "zh-CN", href: "https://yonaris.com/zh/casework" });
	});

	test("keeps pre-migration legacy handlers canonical to their current routes", () => {
		expect(globalEnglishPageHead("approach").links).toContainEqual({ rel: "canonical", href: "https://yonaris.com/approach" });
		expect(globalEnglishPageHead("company").links).toContainEqual({ rel: "canonical", href: "https://yonaris.com/company" });
		expect(zhPageHead("approach").links).toContainEqual({ rel: "canonical", href: "https://yonaris.com/zh/approach" });
		expect(zhPageHead("company").links).toContainEqual({ rel: "canonical", href: "https://yonaris.com/zh/company" });
	});

	test("uses the approved public Home metadata in the WebPage JSON-LD node", () => {
		const head = globalEnglishPageHead("home");
		const graph = JSON.parse(head.scripts[0].children)["@graph"] as Array<Record<string, unknown>>;
		const webPage = graph.find((node) => node["@type"] === "WebPage");

		expect(webPage?.name).toBe(GLOBAL_EN_HOME_PAGE.metadata.title);
		expect(webPage?.description).toBe(GLOBAL_EN_HOME_PAGE.metadata.description);
	});

	test("keeps the Human / Agent head on its canonical page and live category record", () => {
		const head = buildPageHead("global-en", "human-agent", undefined, GLOBAL_EN_HUMAN_AGENT_PAGE.metadata);
		const graph = JSON.parse(head.scripts[0].children)["@graph"] as Array<Record<string, unknown>>;
		const webPage = graph.find((node) => node["@type"] === "WebPage");
		const factList = graph.find((node) => node["@type"] === "ItemList") as
			| (Record<string, unknown> & { itemListElement?: Array<Record<string, unknown>> })
			| undefined;
		const category = factList?.itemListElement?.find((item) => item.identifier === PRODUCT_FACTS.category.id);

		expect(head.links).toContainEqual({ rel: "canonical", href: "https://yonaris.com/human-agent" });
		expect(head.links).toContainEqual({ rel: "alternate", hrefLang: "zh-CN", href: "https://yonaris.com/zh/human-agent" });
		expect(head.links).toContainEqual({
			rel: "alternate",
			type: "text/html",
			href: `https://yonaris.com/agent#${PRODUCT_FACTS.category.id}`,
		});
		expect(head.links.some((link) => "href" in link && /\/agent\/human-agent|\/agent\/company/.test(link.href))).toBe(false);
		expect(webPage?.["@id"]).toBe("https://yonaris.com/human-agent#webpage");
		expect(webPage?.url).toBe("https://yonaris.com/human-agent");
		expect(webPage?.name).toBe(GLOBAL_EN_HUMAN_AGENT_PAGE.metadata.title);
		expect(webPage?.description).toBe(GLOBAL_EN_HUMAN_AGENT_PAGE.metadata.description);
		expect(category?.name).toBe(PRODUCT_FACTS.category.value["global-en"]);
		expect(category?.url).toBe(`https://yonaris.com/human-agent#${PRODUCT_FACTS.category.id}`);
		expect(category?.dateModified).toBe(PRODUCT_FACTS.category.lastReviewed);
		expect(category?.description).toContain(PRODUCT_FACTS.category.source.label["global-en"]);
		expect(category?.description).toContain(PRODUCT_FACTS.category.boundary["global-en"]);
		expect(category?.additionalProperty).toEqual(expect.arrayContaining([
			expect.objectContaining({ name: "Source ID", value: PRODUCT_FACTS.category.source.id }),
			expect.objectContaining({ name: "Fact scope", value: PRODUCT_FACTS.category.scope["global-en"] }),
			expect.objectContaining({ name: "Fact last reviewed", value: PRODUCT_FACTS.category.lastReviewed }),
		]));
	});
});
