import { createFileRoute } from "@tanstack/react-router";
import { permanentRedirectHandlers } from "@/lib/permanent-redirect";
import { getRedirect } from "@/lib/site-manifest";

const redirect = getRedirect("/zh/results");
if (!redirect) throw new Error("Missing manifest redirect for /zh/results");

export const Route = createFileRoute("/zh/results")({
	server: { handlers: permanentRedirectHandlers(redirect.to) },
});
