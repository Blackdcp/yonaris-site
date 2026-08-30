import { createFileRoute } from "@tanstack/react-router";
import { permanentRedirectHandlers } from "@/lib/permanent-redirect";
import { getRedirect } from "@/lib/site-manifest";

const redirect = getRedirect("/diagnostic");
if (!redirect) throw new Error("Missing manifest redirect for /diagnostic");

export const Route = createFileRoute("/diagnostic")({
	server: { handlers: permanentRedirectHandlers(redirect.to) },
});
