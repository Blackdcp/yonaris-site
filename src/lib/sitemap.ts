import { PUBLIC_PAGE_MANIFEST } from "@/site/public-page-manifest";

export interface SitemapEntry {
	path: string;
	priority: number;
	lastVerified?: string;
}

export function buildSitemapEntries(): readonly SitemapEntry[] {
	return PUBLIC_PAGE_MANIFEST.flatMap((route) => (["global-en", "zh-cn"] as const).map((edition) => ({
		path: route.paths[edition],
		priority: route.sitemap.priority,
		lastVerified: route.sitemap.lastVerified,
	})));
}

function normalizeOrigin(origin: string): string {
	return origin.replace(/\/+$/, "");
}

function escapeXml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&apos;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;");
}

function absoluteUrl(origin: string, path: string): string {
	return `${normalizeOrigin(origin)}${path}`;
}

export function renderSitemap(origin: string): string {
	const entries = buildSitemapEntries();
	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
	.map((entry) => {
		const lastmod = entry.lastVerified ? `\n    <lastmod>${escapeXml(entry.lastVerified)}</lastmod>` : "";
		return `  <url>
		<loc>${escapeXml(absoluteUrl(origin, entry.path))}</loc>${lastmod}
		<priority>${entry.priority}</priority>
	</url>`;
	})
	.join("\n")}
</urlset>`;
}

export function renderRobots(origin: string): string {
	return `User-agent: *
Allow: /

Sitemap: ${normalizeOrigin(origin)}/sitemap.xml`;
}
