import { createFileRoute } from "@tanstack/react-router";
import { permanentRedirectHandlers } from "@/lib/permanent-redirect";
import { getRedirect } from "@/lib/site-manifest";

const redirect = getRedirect("/zh/off-site-aeo");
if (!redirect) throw new Error("Missing manifest redirect for /zh/off-site-aeo");

export const Route = createFileRoute("/zh/off-site-aeo")({
	server: { handlers: permanentRedirectHandlers(redirect.to) },
});
