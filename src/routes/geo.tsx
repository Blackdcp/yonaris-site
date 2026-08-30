import { createFileRoute } from "@tanstack/react-router";
import { permanentRedirectHandlers } from "@/lib/permanent-redirect";
import { getRedirect } from "@/lib/site-manifest";

const redirect = getRedirect("/geo");
if (!redirect) throw new Error("Missing manifest redirect for /geo");

export const Route = createFileRoute("/geo")({
	server: { handlers: permanentRedirectHandlers(redirect.to) },
});
