import { createFileRoute } from "@tanstack/react-router";
import { CompanyPage } from "@/components/experience/global/pages/company-page";
import { GLOBAL_EN_COMPANY_PAGE } from "@/content/public-site/global-en/pages/company";
import { buildPageHead } from "@/editions/page-head";

export const Route = createFileRoute("/company")({
	head: () => buildPageHead("global-en", "company", undefined, GLOBAL_EN_COMPANY_PAGE.metadata),
	component: CompanyPage,
});
