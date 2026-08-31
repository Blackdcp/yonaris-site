import { createFileRoute } from "@tanstack/react-router";
import { permanentRedirectHandlers } from "@/lib/permanent-redirect";
import { getRedirect } from "@/lib/site-manifest";

const redirect = getRedirect("/zh/diagnostic");
if (!redirect) throw new Error("Missing manifest redirect for /zh/diagnostic");

export const Route = createFileRoute("/zh/diagnostic")({
	server: { handlers: permanentRedirectHandlers(redirect.to) },
});
