import { createFileRoute } from "@tanstack/react-router";
import {
	renderContactNativeDocument,
	resolveContactServerUiCopy,
} from "@/components/experience/global/pages/contact-native-document.server";
import { sendContactWithCloudflare } from "@/lib/contact-delivery.server";
import { createContactRoutePostHandler } from "@/lib/contact-route.server";

const handleContactLead = createContactRoutePostHandler({
	getEnv: () => process.env,
	productionDeliver: sendContactWithCloudflare,
	now: Date.now,
	renderNativeResult: renderContactNativeDocument,
	getFormUiCopy: resolveContactServerUiCopy,
});

export const Route = createFileRoute("/api/contact")({
	server: {
		handlers: {
			POST: ({ request }) => handleContactLead(request),
		},
	},
});
