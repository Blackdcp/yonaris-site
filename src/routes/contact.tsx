import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/components/experience/global/pages/contact-page";
import { GLOBAL_EN_CONTACT_PAGE } from "@/content/public-site/global-en/pages/contact";
import { buildPageHead } from "@/editions/page-head";
import { useContactRequestType, validateContactRouteSearch } from "@/lib/contact-request-intent";

function ContactRoutePage() {
	const search = Route.useSearch();
	const requestType = useContactRequestType(search);
	return <ContactPage requestType={requestType} />;
}

export const Route = createFileRoute("/contact")({
	validateSearch: validateContactRouteSearch,
	head: () => buildPageHead("global-en", "contact", undefined, GLOBAL_EN_CONTACT_PAGE.metadata),
	component: ContactRoutePage,
});
