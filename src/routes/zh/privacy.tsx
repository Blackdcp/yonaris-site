import { createFileRoute } from "@tanstack/react-router";
import { ChinesePrivacyPage } from "@/components/experience/china-v1/pages/privacy-page";
import { ZH_CN_PRIVACY_PAGE } from "@/content/public-site/zh-cn/pages/privacy";
import { buildPageHead } from "@/editions/page-head";

export const Route = createFileRoute("/zh/privacy")({ head: () => buildPageHead("zh-cn", "privacy", undefined, ZH_CN_PRIVACY_PAGE.metadata), component: ChinesePrivacyPage });
