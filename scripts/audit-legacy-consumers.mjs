#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const SOURCE_ROOT = "src";

const ENGLISH_CANONICAL_ROUTE_ROOTS = [
	"src/routes/index.tsx",
	"src/routes/product.tsx",
	"src/routes/casework.tsx",
	"src/routes/company.tsx",
	"src/routes/human-agent.tsx",
	"src/routes/contact.tsx",
	"src/routes/privacy.tsx",
];

const ENGLISH_SITE_V1_BANNED_IMPORTS = new Set([
	"src/components/experience/global/global-pages.tsx",
	"src/components/experience/global/global-scenes.tsx",
	"src/components/experience/shared/site-06-shell.tsx",
]);

const RETIRED_SOURCE_PATHS = new Set([
	"src/components/community.tsx",
	"src/components/contact-form.tsx",
	"src/components/cta.tsx",
	"src/components/customer-logos.tsx",
	"src/components/faq.tsx",
	"src/components/features.tsx",
	"src/components/hero.tsx",
	"src/components/marketing/detail-page.tsx",
	"src/components/marketing/marketing-link.tsx",
	"src/components/marketing/marketing-shell.tsx",
	"src/components/marketing/section.tsx",
	"src/components/marketing/signal-field.tsx",
	"src/components/off-site-aeo.tsx",
	"src/components/pricing.tsx",
	"src/components/quickstart-block.tsx",
	"src/components/stats.tsx",
	"src/components/testimonial.tsx",
	"src/components/waitlist-form.tsx",
	"src/lib/github-stars.ts",
	"src/lib/marketing-content.ts",
	"src/lib/marketing-seo.ts",
]);

const RETIRED_IDENTIFIERS = [
	"DetailPageContent",
	"DiagnosticPreviewContent",
	"HOME_FAQS",
	"MARKETING_ROUTES",
	"MARKETING_SITEMAP_PATHS",
	"MarketingContent",
	"MarketingDetailPage",
	"MarketingDetailPageKey",
	"MarketingLink",
	"MarketingPageKey",
	"MarketingRoute",
	"MarketingSection",
	"MarketingSectionContent",
	"MarketingShell",
	"OFFSITE_FAQS",
	"PRICING_FAQS",
	"SectionIntro",
	"SignalField",
	"getLocalizedPath",
	"getMarketingContent",
	"getMarketingDetailPage",
	"getMarketingNavigation",
	"getMarketingPageMeta",
	"marketingPageHead",
].sort();

const REDIRECT_KEY_EXEMPTIONS = new Map([
	["src/routes/platform.tsx", new Set(["platform"])],
	["src/routes/zh/platform.tsx", new Set(["platform"])],
	["src/routes/methodology.tsx", new Set(["methodology"])],
	["src/routes/zh/methodology.tsx", new Set(["methodology"])],
	["src/routes/results.tsx", new Set(["results"])],
	["src/routes/zh/results.tsx", new Set(["results"])],
]);

function normalizePath(value) {
	return value.replaceAll("\\", "/");
}

function git(repoRoot, args, encoding = "utf8") {
	const result = spawnSync("git", args, {
		cwd: repoRoot,
		encoding,
		maxBuffer: 16 * 1024 * 1024,
	});
	if (result.error) throw result.error;
	if (result.status !== 0) {
		const stderr = Buffer.isBuffer(result.stderr) ? result.stderr.toString("utf8") : result.stderr;
		throw new Error(`git ${args.join(" ")} failed (${result.status}):\n${stderr}`);
	}
	return result.stdout;
}

function repositoryRoot(cwd) {
	return String(git(cwd, ["rev-parse", "--show-toplevel"])).trim();
}

function candidatePaths(repoRoot) {
	const output = git(
		repoRoot,
		["ls-files", "-z", "--cached", "--others", "--exclude-standard", "--", SOURCE_ROOT],
		null,
	);
	return output
		.toString("utf8")
		.split("\0")
		.filter(Boolean)
		.map(normalizePath)
		.sort((left, right) => left.localeCompare(right, "en"));
}

function isProductionSource(relativePath) {
	const basename = path.posix.basename(relativePath);
	if (basename === "routeTree.gen.ts") return false;
	if (/\.(?:test|spec)\.[^/]+$/i.test(basename)) return false;
	return relativePath.endsWith(".ts") || relativePath.endsWith(".tsx");
}

function lineAt(source, index) {
	let line = 1;
	for (let cursor = 0; cursor < index; cursor += 1) if (source.charCodeAt(cursor) === 10) line += 1;
	return line;
}

function withoutTypeScriptExtension(relativePath) {
	return relativePath.replace(/\.tsx?$/i, "");
}

function retiredImportTarget(importer, specifier) {
	let resolved;
	if (specifier.startsWith("@/")) {
		resolved = `${SOURCE_ROOT}/${specifier.slice(2)}`;
	} else if (specifier.startsWith(".")) {
		resolved = path.posix.normalize(path.posix.join(path.posix.dirname(importer), specifier));
	} else {
		return undefined;
	}

	const normalized = normalizePath(resolved).replace(/\.(?:js|jsx)$/i, "");
	for (const retiredPath of RETIRED_SOURCE_PATHS) {
		if (normalized === retiredPath || normalized === withoutTypeScriptExtension(retiredPath)) return retiredPath;
	}
	return undefined;
}

function collectMatches(source, expression) {
	return [...source.matchAll(expression)];
}

function sourceImportMatches(source) {
	const matches = [];
	for (const expression of [
		/\bfrom\s*["'`]([^"'`]+)["'`]/g,
		/\bimport\s*["'`]([^"'`]+)["'`]/g,
		/\bimport\s*\(\s*["'`]([^"'`]+)["'`]\s*\)/g,
		/\brequire\s*\(\s*["'`]([^"'`]+)["'`]\s*\)/g,
	]) {
		for (const match of collectMatches(source, expression)) {
			matches.push({ index: match.index, specifier: match[1] });
		}
	}
	return matches.sort((left, right) => left.index - right.index);
}

function resolveProductionImport(importer, specifier, sourcePaths) {
	let resolved;
	if (specifier.startsWith("@/")) {
		resolved = `${SOURCE_ROOT}/${specifier.slice(2)}`;
	} else if (specifier.startsWith(".")) {
		resolved = path.posix.normalize(path.posix.join(path.posix.dirname(importer), specifier));
	} else {
		return undefined;
	}

	const normalized = normalizePath(resolved).replace(/\.(?:js|jsx)$/i, "");
	const candidates = /\.tsx?$/i.test(normalized)
		? [normalized]
		: [`${normalized}.ts`, `${normalized}.tsx`, `${normalized}/index.ts`, `${normalized}/index.tsx`];
	return candidates.find((candidate) => sourcePaths.has(candidate));
}

function auditEnglishSiteV1Graph(sources) {
	const violations = [];
	const visited = new Set();
	const pending = ENGLISH_CANONICAL_ROUTE_ROOTS.filter((root) => sources.has(root));
	const sourcePaths = new Set(sources.keys());

	while (pending.length > 0) {
		const importer = pending.pop();
		if (!importer || visited.has(importer)) continue;
		visited.add(importer);
		const source = sources.get(importer);
		if (source === undefined) continue;

		for (const match of sourceImportMatches(source)) {
			const target = resolveProductionImport(importer, match.specifier, sourcePaths);
			if (!target) continue;
			if (ENGLISH_SITE_V1_BANNED_IMPORTS.has(target)) {
				violations.push({
					path: importer,
					line: lineAt(source, match.index),
					rule: "english-site-v1-import",
					message: `English canonical graph imports legacy ${target}`,
				});
				continue;
			}
			if (!visited.has(target)) pending.push(target);
		}
	}

	return violations;
}

function auditSource(relativePath, source) {
	const violations = [];
	const add = (line, rule, message) => violations.push({ path: relativePath, line, rule, message });

	if (RETIRED_SOURCE_PATHS.has(relativePath)) add(1, "retired-source", "Retired source definition must be deleted");

	const importExpressions = [
		/\bfrom\s*["'`]([^"'`]+)["'`]/g,
		/\bimport\s*["'`]([^"'`]+)["'`]/g,
		/\bimport\s*\(\s*["'`]([^"'`]+)["'`]\s*\)/g,
		/\brequire\s*\(\s*["'`]([^"'`]+)["'`]\s*\)/g,
	];
	for (const expression of importExpressions) {
		for (const match of collectMatches(source, expression)) {
			const retiredTarget = retiredImportTarget(relativePath, match[1]);
			if (retiredTarget) add(lineAt(source, match.index), "retired-import", `Import resolves to ${retiredTarget}`);
		}
	}

	for (const identifier of RETIRED_IDENTIFIERS) {
		const expression = new RegExp(`\\b${identifier}\\b`, "g");
		for (const match of collectMatches(source, expression)) {
			add(lineAt(source, match.index), "retired-identifier", identifier);
		}
	}

	for (const match of collectMatches(source, /\bmarketing-(?:content|seo)\b/g)) {
		add(lineAt(source, match.index), "retired-module-name", match[0]);
	}

	const allowedKeys = REDIRECT_KEY_EXEMPTIONS.get(relativePath) ?? new Set();
	for (const match of collectMatches(source, /(["'`])(platform|methodology|results)\1/g)) {
		const key = match[2];
		if (!allowedKeys.has(key)) add(lineAt(source, match.index), "retired-page-key", key);
	}

	return violations;
}

function compareViolations(left, right) {
	return (
		left.path.localeCompare(right.path, "en") ||
		left.line - right.line ||
		left.rule.localeCompare(right.rule, "en") ||
		left.message.localeCompare(right.message, "en")
	);
}

export function auditLegacyConsumers(cwd = process.cwd()) {
	const repoRoot = repositoryRoot(cwd);
	const violations = [];
	const productionSources = new Map();
	for (const relativePath of candidatePaths(repoRoot)) {
		if (!isProductionSource(relativePath)) continue;
		const absolutePath = path.join(repoRoot, ...relativePath.split("/"));
		if (!existsSync(absolutePath)) continue;
		const source = readFileSync(absolutePath, "utf8");
		productionSources.set(relativePath, source);
		violations.push(...auditSource(relativePath, source));
	}
	violations.push(...auditEnglishSiteV1Graph(productionSources));

	const unique = new Map();
	for (const violation of violations) {
		const key = `${violation.path}\0${violation.line}\0${violation.rule}\0${violation.message}`;
		unique.set(key, violation);
	}
	return [...unique.values()].sort(compareViolations);
}

export function formatViolations(violations) {
	return violations.map(({ path: sourcePath, line, rule, message }) => `${sourcePath}:${line} [${rule}] ${message}`);
}

function main() {
	const violations = auditLegacyConsumers();
	if (violations.length === 0) {
		console.log("Legacy marketing audit passed: no retired marketing consumers.");
		return;
	}

	console.error(`Legacy marketing audit found ${violations.length} violation(s):`);
	for (const line of formatViolations(violations)) console.error(line);
	process.exitCode = 1;
}

main();
