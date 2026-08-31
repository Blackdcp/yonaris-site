import { COMPANY_FACTS } from "@/content/public-site/canonical/company-facts";
import { PRODUCT_FACTS } from "@/content/public-site/canonical/product-facts";
import { GLOBAL_EN_BUYER_QUESTION } from "@/content/public-site/global-en/buyer-question";
import { GLOBAL_EN_CASEWORK_PAGE } from "@/content/public-site/global-en/pages/casework";
import { GLOBAL_EN_COMPANY_PAGE } from "@/content/public-site/global-en/pages/company";
import { GLOBAL_EN_CONTACT_PAGE } from "@/content/public-site/global-en/pages/contact";
import { GLOBAL_EN_HOME_PAGE } from "@/content/public-site/global-en/pages/home";
import { GLOBAL_EN_HUMAN_AGENT_PAGE } from "@/content/public-site/global-en/pages/human-agent";
import { GLOBAL_EN_PRIVACY_PAGE } from "@/content/public-site/global-en/pages/privacy";
import { GLOBAL_EN_PRODUCT_PAGE } from "@/content/public-site/global-en/pages/product";
import { ZH_CN_BUYER_QUESTION } from "@/content/public-site/zh-cn/buyer-question";
import { ZH_CN_CASEWORK_PAGE } from "@/content/public-site/zh-cn/pages/casework";
import { ZH_CN_COMPANY_PAGE } from "@/content/public-site/zh-cn/pages/company";
import { ZH_CN_CONTACT_PAGE } from "@/content/public-site/zh-cn/pages/contact";
import { ZH_CN_HOME_PAGE } from "@/content/public-site/zh-cn/pages/home";
import { ZH_CN_HUMAN_AGENT_PAGE } from "@/content/public-site/zh-cn/pages/human-agent";
import { ZH_CN_PRIVACY_PAGE } from "@/content/public-site/zh-cn/pages/privacy";
import { ZH_CN_PRODUCT_PAGE } from "@/content/public-site/zh-cn/pages/product";
import { PUBLIC_PAGE_KEYS } from "@/site/public-page-manifest";
import { getAgentPath, getMarkdownPath, getPublicPagePath } from "@/site/route-selectors";
import type { PublicPageKey, SiteEdition } from "@/site/route-types";
import type { AgentFact, AgentQuestion, AgentTopic, ExperienceLocale } from "./types";

const LAST_REVIEWED = "2026-08-30";
const SOURCE_ID = "yonaris.source.approved-public-site.2026-08-30";
const pages = {
	"global-en": { home: GLOBAL_EN_HOME_PAGE, product: GLOBAL_EN_PRODUCT_PAGE, casework: GLOBAL_EN_CASEWORK_PAGE, company: GLOBAL_EN_COMPANY_PAGE, "human-agent": GLOBAL_EN_HUMAN_AGENT_PAGE, contact: GLOBAL_EN_CONTACT_PAGE, privacy: GLOBAL_EN_PRIVACY_PAGE },
	"zh-cn": { home: ZH_CN_HOME_PAGE, product: ZH_CN_PRODUCT_PAGE, casework: ZH_CN_CASEWORK_PAGE, company: ZH_CN_COMPANY_PAGE, "human-agent": ZH_CN_HUMAN_AGENT_PAGE, contact: ZH_CN_CONTACT_PAGE, privacy: ZH_CN_PRIVACY_PAGE },
} as const;
const limitations = {
	"global-en": ["Records cover only their stated question, market, language, source and review conditions.", "A source supports only the fact and scope it states.", "No record guarantees ranking, indexing, retrieval, citation, recommendation or a commercial result."],
	"zh-cn": ["记录只覆盖明确写出的客户问题、市场、语言、来源和复核条件。", "一项来源只能支持它明确写出的事实与适用范围。", "任何记录都不保证排名、收录、检索、引用、推荐或商业结果。"],
} as const;

function localizedFact(edition: SiteEdition, key: PublicPageKey): AgentFact {
	const zh = edition === "zh-cn";
	const humanPath = getPublicPagePath(edition, key);
	if (key === "home" || key === "human-agent") {
		const fact = PRODUCT_FACTS.category;
		return { id: fact.id, value: fact.value[edition], evidenceUrl: `${humanPath}#${fact.id}`, source: fact.source.label[edition], sourceId: fact.source.id, scope: fact.scope[edition], lastReviewed: fact.lastReviewed, boundary: fact.boundary[edition] };
	}
	if (key === "product") {
		const fact = PRODUCT_FACTS.capability;
		return { id: fact.id, value: fact.value[edition], evidenceUrl: `${humanPath}#${fact.id}`, source: fact.source.label[edition], sourceId: fact.source.id, scope: fact.scope[edition], lastReviewed: fact.lastReviewed, boundary: fact.boundary[edition] };
	}
	if (key === "company") return { id: COMPANY_FACTS.publicName.id, value: COMPANY_FACTS.publicName.value, evidenceUrl: `${humanPath}#${COMPANY_FACTS.publicName.id}`, source: zh ? "Yonaris 已批准的公司公开声明" : COMPANY_FACTS.publicName.source.label, sourceId: COMPANY_FACTS.publicName.source.id, scope: zh ? "Yonaris 的公开公司名称。" : COMPANY_FACTS.publicName.scope, lastReviewed: COMPANY_FACTS.publicName.lastReviewed, boundary: zh ? "名称本身不代表产品能力或结果。" : COMPANY_FACTS.publicName.boundary };
	if (key === "casework") {
		const record = zh ? ZH_CN_BUYER_QUESTION : GLOBAL_EN_BUYER_QUESTION;
		return { id: record.id, value: record.question, evidenceUrl: `${humanPath}#${record.id}`, source: record.disclosure.sourceLabel, sourceId: record.disclosure.sourceId, scope: zh ? "选定渠道与固定观测条件下的代表性案例。" : "A representative case under selected channels and fixed observation conditions.", lastReviewed: LAST_REVIEWED, boundary: record.disclosure.boundary };
	}
	const page = pages[edition][key];
	return { id: `yonaris.${key}.approved-public-statement`, value: page.metadata.description, evidenceUrl: humanPath, source: zh ? "Yonaris 已批准的公开页面" : "Yonaris approved public page", sourceId: SOURCE_ID, scope: zh ? "该页面公开说明的范围。" : "The scope stated on the corresponding public page.", lastReviewed: LAST_REVIEWED, boundary: zh ? "该说明不构成排名、收录、引用或结果保证。" : "This statement does not guarantee ranking, indexing, citation or outcomes." };
}

function buildTopic(edition: SiteEdition, key: PublicPageKey): AgentTopic {
	const locale: ExperienceLocale = edition === "global-en" ? "en" : "zh";
	const page = pages[edition][key];
	const fact = localizedFact(edition, key);
	const question: AgentQuestion = { id: `${key}.overview`, title: edition === "zh-cn" ? "这份记录说明什么？" : "What does this record state?", factIds: [fact.id] };
	return { id: `${locale}.${key}`, locale, language: edition === "global-en" ? "en" : "zh-CN", title: page.metadata.title, summary: page.metadata.description, humanPath: getPublicPagePath(edition, key), agentPath: getAgentPath(edition, key), markdownPath: getMarkdownPath(edition, key), lastReviewed: LAST_REVIEWED, reviewedBy: "Yonaris", scope: edition === "zh-cn" ? "与对应中文公开页一致的结构化事实记录。" : "A structured fact record aligned with the corresponding public page.", limitations: limitations[edition], questions: [question], groups: [{ id: `yonaris.${key}.facts`, title: edition === "zh-cn" ? "可核对的公开事实" : "Verifiable public facts", facts: [fact] }] };
}

type Region = Readonly<Record<PublicPageKey, AgentTopic>>;
function buildRegion(edition: SiteEdition): Region { return Object.fromEntries(PUBLIC_PAGE_KEYS.map((key) => [key, buildTopic(edition, key)])) as Region; }
export const AGENT_FACTS = { global: buildRegion("global-en"), zh: buildRegion("zh-cn") } as const;
