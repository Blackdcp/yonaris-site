import { createFileRoute } from "@tanstack/react-router";
import type { PublicPageKey } from "@/site/route-types";
import {
	agentCatalogLinks,
	agentCatalogPath,
	agentDocumentLinks,
	agentMarkdownPath,
	renderAgentCatalog,
	renderCoreMarkdown,
} from "@/lib/machine-documents";
import { machineDocumentResponse } from "@/lib/machine-response";

const markdownKeys = new Map<string, PublicPageKey>([
	["index.md", "home"],
	["product.md", "product"],
	["casework.md", "casework"],
	["company.md", "company"],
	["human-agent.md", "human-agent"],
	["contact.md", "contact"],
	["privacy.md", "privacy"],
]);

function routeResponse(splat: string | undefined, head: boolean): Response {
	if (splat === "catalog.json") {
		return machineDocumentResponse(head ? null : renderAgentCatalog("zh"), {
			language: "zh",
			contentType: "application/ld+json; charset=utf-8",
			contentLocation: agentCatalogPath("zh"),
			links: agentCatalogLinks("zh"),
		});
	}

	const key = splat ? markdownKeys.get(splat) : undefined;
	if (!key) return new Response(head ? null : "Not Found", { status: 404 });
	return machineDocumentResponse(head ? null : renderCoreMarkdown(key, "zh"), {
		language: "zh",
		contentLocation: agentMarkdownPath("zh", key),
		links: agentDocumentLinks("zh", key),
	});
}

export const Route = createFileRoute("/zh/agent/$")({
	server: {
		handlers: {
			GET: ({ params }) => routeResponse(params._splat, false),
			HEAD: ({ params }) => routeResponse(params._splat, true),
		},
	},
});
