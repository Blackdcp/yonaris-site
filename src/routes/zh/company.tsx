import { createFileRoute } from "@tanstack/react-router";
import { ChineseCompanyPage } from "@/components/experience/china-v1/pages/company-page";
import { ZH_CN_COMPANY_PAGE } from "@/content/public-site/zh-cn/pages/company";
import { buildPageHead } from "@/editions/page-head";

export const Route = createFileRoute("/zh/company")({ head: () => buildPageHead("zh-cn", "company", undefined, ZH_CN_COMPANY_PAGE.metadata), component: ChineseCompanyPage });
