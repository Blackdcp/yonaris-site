import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { SITE_MANIFEST, SITE_REDIRECTS, findSiteRoute } from "../src/lib/site-manifest";
import { PUBLIC_PAGE_MANIFEST } from "../src/site/public-page-manifest";
import { getMarkdownPath } from "../src/site/route-selectors";

const DEFAULT_ROUTES_ROOT = fileURLToPath(new URL("../src/routes/", import.meta.url));
const FILE_ROUTE_PATTERN = /createFileRoute\(\s*["'`]([^"'`]+)["'`]\s*\)/g;

export interface SiteManifestAudit {
	readonly unclassifiedRoutes: readonly `/${string}`[];
	readonly unrealizedManifestPaths: readonly `/${string}`[];
}

async function listRouteFiles(directory: string): Promise<string[]> {
	const entries = await readdir(directory, { withFileTypes: true });
	const files = await Promise.all(entries.map((entry) => {
		const entryPath = path.join(directory, entry.name);
		return entry.isDirectory() ? listRouteFiles(entryPath) : Promise.resolve([entryPath]);
	}));
	return files.flat().filter((file) => /\.[cm]?[jt]sx?$/.test(file));
}

export function normalizeFileRoutePattern(routePath: string): `/${string}` {
	const normalized = routePath.split("/").map((segment) => (segment.startsWith("$") ? "*" : segment)).join("/");
	return (normalized === "/" ? normalized : normalized.replace(/\/+$/, "")) as `/${string}`;
}

export async function discoverRoutePatterns(routesRoot = DEFAULT_ROUTES_ROOT): Promise<`/${string}`[]> {
	const patterns = new Set<`/${string}`>();
	for (const file of await listRouteFiles(routesRoot)) {
		const source = await readFile(file, "utf8");
		for (const match of source.matchAll(FILE_ROUTE_PATTERN)) patterns.add(normalizeFileRoutePattern(match[1]));
	}
	return [...patterns].sort();
}

function declaredManifestPaths(): `/${string}`[] {
	return [
		...SITE_MANIFEST.flatMap((route) => Object.values(route.canonicals)),
		...PUBLIC_PAGE_MANIFEST.flatMap((page) => Object.values(page.agentPaths)),
		...PUBLIC_PAGE_MANIFEST.flatMap((page) => [getMarkdownPath("global-en", page.key), getMarkdownPath("zh-cn", page.key)]),
		...SITE_REDIRECTS.flatMap((redirect) => [redirect.from, redirect.to.split("#", 1)[0] as `/${string}`]),
	];
}

export async function auditSiteManifest(routesRoot = DEFAULT_ROUTES_ROOT): Promise<SiteManifestAudit> {
	const patterns = await discoverRoutePatterns(routesRoot);
	return {
		unclassifiedRoutes: patterns.filter((pattern) => !findSiteRoute(pattern)),
		unrealizedManifestPaths: [...new Set(declaredManifestPaths().filter((pathname) => !patterns.includes(pathname)))].sort(),
	};
}

async function main(): Promise<void> {
	const audit = await auditSiteManifest();
	if (audit.unclassifiedRoutes.length === 0 && audit.unrealizedManifestPaths.length === 0) {
		console.log("All real and declared public route patterns are classified.");
		return;
	}
	if (audit.unclassifiedRoutes.length > 0) console.error(`Unclassified public route patterns:\n${audit.unclassifiedRoutes.map((pattern) => `- ${pattern}`).join("\n")}`);
	if (audit.unrealizedManifestPaths.length > 0) console.error(`Manifest paths without handlers:\n${audit.unrealizedManifestPaths.map((pattern) => `- ${pattern}`).join("\n")}`);
	process.exitCode = 1;
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : undefined;
if (invokedPath === import.meta.url) await main();
