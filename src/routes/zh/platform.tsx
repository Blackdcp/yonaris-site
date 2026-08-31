import { createFileRoute } from "@tanstack/react-router";
import { permanentRedirectHandlers } from "@/lib/permanent-redirect";
import { getRedirect } from "@/lib/site-manifest";

const redirect = getRedirect("/zh/platform");
if (!redirect) throw new Error("Missing manifest redirect for /zh/platform");

export const Route = createFileRoute("/zh/platform")({
	server: { handlers: permanentRedirectHandlers(redirect.to) },
});
