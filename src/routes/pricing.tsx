import { createFileRoute } from "@tanstack/react-router";
import { permanentRedirectHandlers } from "@/lib/permanent-redirect";
import { getRedirect } from "@/lib/site-manifest";

const redirect = getRedirect("/pricing");
if (!redirect) throw new Error("Missing manifest redirect for /pricing");

export const Route = createFileRoute("/pricing")({
	server: { handlers: permanentRedirectHandlers(redirect.to) },
});
