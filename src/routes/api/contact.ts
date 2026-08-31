import { createFileRoute } from "@tanstack/react-router";
import { renderContactNativeDocument } from "@/components/experience/global/pages/contact-native-document.server";
import { sendContactWithCloudflare } from "@/lib/contact-delivery.server";
import { createContactRoutePostHandler } from "@/lib/contact-route.server";
import { GLOBAL_EN_CONTACT_FORM_UI } from "@/content/public-site/global-en/pages/contact";

const handleContactLead = createContactRoutePostHandler({
	getEnv: () => process.env,
	productionDeliver: sendContactWithCloudflare,
	now: Date.now,
	renderNativeResult: renderContactNativeDocument,
	getFormUiCopy: () => GLOBAL_EN_CONTACT_FORM_UI,
});

export const Route = createFileRoute("/api/contact")({
	server: {
		handlers: {
			POST: ({ request }) => handleContactLead(request),
		},
	},
});
