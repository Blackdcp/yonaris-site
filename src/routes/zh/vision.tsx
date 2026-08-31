import { createFileRoute } from "@tanstack/react-router";
import { permanentRedirectHandlers } from "@/lib/permanent-redirect";
import { getRedirect } from "@/lib/site-manifest";

const redirect = getRedirect("/zh/vision");
if (!redirect) throw new Error("Missing manifest redirect for /zh/vision");

export const Route = createFileRoute("/zh/vision")({
	server: { handlers: permanentRedirectHandlers(redirect.to) },
});
