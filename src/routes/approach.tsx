import { createFileRoute } from "@tanstack/react-router";
import { permanentRedirectHandlers } from "@/lib/permanent-redirect";
import { getRedirect } from "@/lib/site-manifest";

const redirect = getRedirect("/approach");
if (!redirect) throw new Error("Missing manifest redirect for /approach");

export const Route = createFileRoute("/approach")({
	server: { handlers: permanentRedirectHandlers(redirect.to) },
});
