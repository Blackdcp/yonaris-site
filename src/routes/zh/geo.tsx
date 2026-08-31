import { createFileRoute } from "@tanstack/react-router";
import { permanentRedirectHandlers } from "@/lib/permanent-redirect";
import { getRedirect } from "@/lib/site-manifest";

const redirect = getRedirect("/zh/geo");
if (!redirect) throw new Error("Missing manifest redirect for /zh/geo");

export const Route = createFileRoute("/zh/geo")({ server: { handlers: permanentRedirectHandlers(redirect.to) } });
