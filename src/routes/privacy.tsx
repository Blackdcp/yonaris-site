import { createFileRoute } from "@tanstack/react-router";
import { PrivacyPage } from "@/components/experience/global/pages/privacy-page";
import { GLOBAL_EN_PRIVACY_PAGE } from "@/content/public-site/global-en/pages/privacy";
import { buildPageHead } from "@/editions/page-head";

export const Route = createFileRoute("/privacy")({
	head: () => buildPageHead("global-en", "privacy", undefined, GLOBAL_EN_PRIVACY_PAGE.metadata),
	component: PrivacyPage,
});
