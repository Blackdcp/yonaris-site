import { createFileRoute } from "@tanstack/react-router";
import { permanentRedirectHandlers } from "@/lib/permanent-redirect";
import { getRedirect } from "@/lib/site-manifest";

const redirect = getRedirect("/zh/pricing");
if (!redirect) throw new Error("Missing manifest redirect for /zh/pricing");

export const Route = createFileRoute("/zh/pricing")({
	server: { handlers: permanentRedirectHandlers(redirect.to) },
});
