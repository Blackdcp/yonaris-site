import { createFileRoute } from "@tanstack/react-router";
import { permanentRedirectHandlers } from "@/lib/permanent-redirect";
import { getRedirect } from "@/lib/site-manifest";

const redirect = getRedirect("/features");
if (!redirect) throw new Error("Missing manifest redirect for /features");

export const Route = createFileRoute("/features")({
	server: { handlers: permanentRedirectHandlers(redirect.to) },
});
