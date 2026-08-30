import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/experience/global/pages/home-page";
import { GLOBAL_EN_HOME_PAGE } from "@/content/public-site/global-en/pages/home";
import { buildPageHead } from "@/editions/page-head";

export const Route = createFileRoute("/")({
	head: () => buildPageHead("global-en", "home", undefined, GLOBAL_EN_HOME_PAGE.metadata),
	component: HomePage,
});
