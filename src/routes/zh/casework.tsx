import { createFileRoute } from "@tanstack/react-router";
import { ChineseCaseworkPage } from "@/components/experience/china-v1/pages/casework-page";
import { ZH_CN_CASEWORK_PAGE } from "@/content/public-site/zh-cn/pages/casework";
import { buildPageHead } from "@/editions/page-head";

export const Route = createFileRoute("/zh/casework")({ head: () => buildPageHead("zh-cn", "casework", undefined, ZH_CN_CASEWORK_PAGE.metadata), component: ChineseCaseworkPage });
