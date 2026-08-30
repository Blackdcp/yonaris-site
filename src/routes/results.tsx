import { createFileRoute } from "@tanstack/react-router";
import { permanentRedirectHandlers } from "@/lib/permanent-redirect";
import { getRedirect } from "@/lib/site-manifest";

const redirect = getRedirect("/results");
if (!redirect) throw new Error("Missing manifest redirect for /results");

export const Route = createFileRoute("/results")({
	server: { handlers: permanentRedirectHandlers(redirect.to) },
});
