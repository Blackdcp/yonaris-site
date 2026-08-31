import { createFileRoute } from "@tanstack/react-router";
import { permanentRedirectHandlers } from "@/lib/permanent-redirect";
import { getRedirect } from "@/lib/site-manifest";

const redirect = getRedirect("/zh/features");
if (!redirect) throw new Error("Missing manifest redirect for /zh/features");

export const Route = createFileRoute("/zh/features")({
	server: { handlers: permanentRedirectHandlers(redirect.to) },
});
