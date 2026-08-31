import { createFileRoute } from "@tanstack/react-router";
import { ChineseContactPage } from "@/components/experience/china-v1/pages/contact-page";
import { ZH_CN_CONTACT_PAGE } from "@/content/public-site/zh-cn/pages/contact";
import { buildPageHead } from "@/editions/page-head";
import { useContactRequestType, validateContactRouteSearch } from "@/lib/contact-request-intent";

function ChineseContactRoutePage() { const requestType = useContactRequestType(Route.useSearch()); return <ChineseContactPage requestType={requestType} />; }

export const Route = createFileRoute("/zh/contact")({ validateSearch: validateContactRouteSearch, head: () => buildPageHead("zh-cn", "contact", undefined, ZH_CN_CONTACT_PAGE.metadata), component: ChineseContactRoutePage });
