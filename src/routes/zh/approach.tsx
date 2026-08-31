import { createFileRoute } from "@tanstack/react-router";
import { permanentRedirectHandlers } from "@/lib/permanent-redirect";
import { getRedirect } from "@/lib/site-manifest";

const redirect = getRedirect("/zh/approach");
if (!redirect) throw new Error("Missing manifest redirect for /zh/approach");

export const Route = createFileRoute("/zh/approach")({ server: { handlers: permanentRedirectHandlers(redirect.to) } });
