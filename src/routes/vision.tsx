import { createFileRoute } from "@tanstack/react-router";
import { permanentRedirectHandlers } from "@/lib/permanent-redirect";
import { getRedirect } from "@/lib/site-manifest";

const redirect = getRedirect("/vision");
if (!redirect) throw new Error("Missing manifest redirect for /vision");

export const Route = createFileRoute("/vision")({
	server: { handlers: permanentRedirectHandlers(redirect.to) },
});
