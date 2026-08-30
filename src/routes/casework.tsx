import { createFileRoute } from "@tanstack/react-router";
import { CaseworkPage } from "@/components/experience/global/pages/casework-page";
import { GLOBAL_EN_CASEWORK_PAGE } from "@/content/public-site/global-en/pages/casework";
import { buildPageHead } from "@/editions/page-head";

export const Route = createFileRoute("/casework")({
	head: () => buildPageHead("global-en", "casework", undefined, GLOBAL_EN_CASEWORK_PAGE.metadata),
	component: CaseworkPage,
});
