import { createFileRoute } from "@tanstack/react-router";
import { permanentRedirectHandlers } from "@/lib/permanent-redirect";
import { getRedirect } from "@/lib/site-manifest";

const redirect = getRedirect("/off-site-aeo");
if (!redirect) throw new Error("Missing manifest redirect for /off-site-aeo");

export const Route = createFileRoute("/off-site-aeo")({
	server: { handlers: permanentRedirectHandlers(redirect.to) },
});
