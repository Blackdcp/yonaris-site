import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const SYSTEM_CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

export const VIEWPORT_MATRIX = Object.freeze([
	{ id: "360x800", width: 360, height: 800, input: "touch" },
	{ id: "390x844", width: 390, height: 844, input: "touch" },
	{ id: "1024x768", width: 1024, height: 768, input: "pointer" },
	{ id: "1280x800", width: 1280, height: 800, input: "pointer" },
	{ id: "1440x900", width: 1440, height: 900, input: "pointer" },
]);

export const ENGLISH_ROUTE_MATRIX = Object.freeze([
	{
		path: "/",
		slug: "home",
		rootSelector: "[data-home-answer-field]",
		controlSelector: "[data-home-answer-field] [role='tablist'] button, [data-home-answer-field] [aria-controls='home-evidence-trace'], [data-product-record-preview] [role='tablist'] button",
		states: [
			"answer-ai",
			"answer-search",
			"answer-editorial",
			"answer-company-owned",
			"trace-hidden",
			"trace-shown",
			"record-buyer-question",
			"record-current-answer",
			"record-comparison-evidence",
			"record-reviewed-action",
			"record-later-review",
		],
	},
	{
		path: "/product",
		slug: "product",
		rootSelector: "[data-product-question-workspace]",
		controlSelector: "[data-product-question-workspace] [role='tablist'] button",
		noJavaScriptStates: ["five-workspaces"],
		states: [
			"buyer-questions",
			"current-answers",
			"sources-gaps",
			"actions-under-review",
			"outcome-review",
			"anchor-how-it-works",
			"anchor-markets-languages",
		],
	},
	{
		path: "/casework",
		slug: "casework",
		rootSelector: "[data-casework-walkthrough]",
		controlSelector: "[data-casework-select-step]",
		noJavaScriptStates: ["eight-steps"],
		states: Array.from({ length: 8 }, (_, index) => `step-${index + 1}`),
	},
	{
		path: "/company",
		slug: "company",
		rootSelector: "[data-company-aperture]",
		controlSelector: "[data-company-select-principle]",
		states: ["why", "audience", "markets", "human-judgement", "non-promises"],
	},
	{
		path: "/human-agent",
		slug: "human-agent",
		rootSelector: "[data-human-agent-lens]",
		controlSelector: "[data-lens-select-layer]",
		noJavaScriptStates: ["direct-layers", "bridge-agent", "bridge-human"],
		states: ["human", "evidence", "agent", "bridge-agent", "bridge-human"],
	},
	{
		path: "/contact",
		slug: "contact",
		rootSelector: "[data-contact-aperture]",
		controlSelector: "[data-contact-aperture] summary, [data-contact-aperture] button[type='submit']",
		noJavaScriptStates: ["invalid-retained", "unconfirmed-retained"],
		states: ["idle", "focused", "expanded", "invalid", "unconfirmed", "confirmed", "privacy-intent"],
	},
	{
		path: "/privacy",
		slug: "privacy",
		rootSelector: "[data-privacy-composition]",
		controlSelector: "[data-privacy-composition] a[href='/contact?intent=privacy']",
		noJavaScriptStates: ["editorial", "contact-cta"],
		states: ["editorial", "contact-cta"],
	},
]);

const REDUCED_VIEWPORTS = new Set(["390x844", "1280x800"]);

export function artifactName(routePath, viewport, state, motion) {
	const slug = routePath === "/" ? "home" : routePath.slice(1).replaceAll("/", "-");
	return `${slug}__${viewport}__${state}__${motion}.png`;
}

export function buildCapturePlan() {
	const plan = [];
	for (const viewport of VIEWPORT_MATRIX) {
		for (const route of ENGLISH_ROUTE_MATRIX) {
			for (const state of route.states) {
				plan.push({
					route: route.path,
					slug: route.slug,
					viewport: viewport.id,
					width: viewport.width,
					height: viewport.height,
					input: viewport.input,
					state,
					motion: "normal",
					artifact: artifactName(route.path, viewport.id, state, "normal"),
				});
			}
		}
	}

	for (const viewport of VIEWPORT_MATRIX.filter(({ id }) => REDUCED_VIEWPORTS.has(id))) {
		for (const route of ENGLISH_ROUTE_MATRIX) {
			for (const state of route.states) {
				plan.push({
					route: route.path,
					slug: route.slug,
					viewport: viewport.id,
					width: viewport.width,
					height: viewport.height,
					input: viewport.input,
					state,
					motion: "reduced",
					artifact: artifactName(route.path, viewport.id, state, "reduced"),
				});
			}
		}
	}

	return plan;
}

export function buildNoJavaScriptPlan() {
	const plan = [];
	for (const viewport of VIEWPORT_MATRIX.filter(({ id }) => REDUCED_VIEWPORTS.has(id))) {
		for (const route of ENGLISH_ROUTE_MATRIX.filter(({ noJavaScriptStates }) => noJavaScriptStates?.length)) {
			for (const state of route.noJavaScriptStates) {
				plan.push({
					route: route.path,
					slug: route.slug,
					viewport: viewport.id,
					width: viewport.width,
					height: viewport.height,
					state,
					motion: "no-js",
					artifact: artifactName(route.path, viewport.id, state, "no-js"),
				});
			}
		}
	}
	return plan;
}

export function resolveSystemChrome(env = process.env, pathExists = existsSync) {
	const candidate = env.PLAYWRIGHT_CHROMIUM_EXECUTABLE?.trim() || SYSTEM_CHROME_PATH;
	if (!pathExists(candidate)) {
		throw new Error(`System Chrome executable was not found at ${candidate}. Browser downloads are disabled for this gate.`);
	}
	return candidate;
}

function readValue(args, index, flag) {
	const value = args[index + 1];
	if (!value || value.startsWith("--")) throw new Error(`${flag} requires a value`);
	return value;
}

export function parseCliArgs(args) {
	let baseUrl = process.env.YONARIS_TEST_BASE_URL || "http://127.0.0.1:3000";
	let outputDirectory = ".superpowers/sdd/2026-08-30-yonaris-site-1-0-production/visual-task-9a/english-matrix";
	for (let index = 0; index < args.length; index += 1) {
		const flag = args[index];
		if (flag === "--base-url") baseUrl = readValue(args, index++, flag);
		else if (flag === "--output") outputDirectory = readValue(args, index++, flag);
		else throw new Error(`Unknown argument: ${flag}`);
	}

	const url = new URL(baseUrl);
	if (url.protocol !== "http:" || !["127.0.0.1", "localhost", "[::1]"].includes(url.hostname)) {
		throw new Error("The English matrix base URL must be an HTTP loopback origin.");
	}
	return { baseUrl: url.origin, outputDirectory };
}

function invariant(value, message) {
	if (!value) throw new Error(message);
}

function routeUrl(baseUrl, routePath) {
	return new URL(routePath, `${baseUrl.replace(/\/$/u, "")}/`).href;
}

async function settleLayout(page) {
	await page.evaluate(async () => {
		await document.fonts?.ready;
		await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
	});
	await page.waitForTimeout(40);
}

function installPageAudit(page, baseUrl, allowedContactStatuses = new Set(), { javaScriptEnabled = true } = {}) {
	const failures = [];
	const origin = new URL(baseUrl).origin;
	const expectedConsoleStatus = () => [...allowedContactStatuses].some((status) => status >= 400);

	page.on("pageerror", (error) => failures.push(`page error: ${error.message}`));
	page.on("console", (message) => {
		if (message.type() !== "error") return;
		if (expectedConsoleStatus() && /Failed to load resource.*(?:422|503)/iu.test(message.text())) return;
		failures.push(`console error: ${message.text()}`);
	});
	page.on("requestfailed", (request) => {
		if (request.url().startsWith("data:") || request.url().startsWith("blob:")) return;
		if (!javaScriptEnabled && request.resourceType() === "script" && request.failure()?.errorText === "net::ERR_BLOCKED_BY_CSP") return;
		if (!javaScriptEnabled && request.resourceType() === "script" && request.failure()?.errorText === "csp") return;
		failures.push(`failed request: ${request.method()} ${request.url()} (${request.failure()?.errorText ?? "unknown"})`);
	});
	page.on("response", (response) => {
		if (response.status() < 400) return;
		const url = new URL(response.url());
		if (url.pathname === "/api/contact" && allowedContactStatuses.has(response.status())) return;
		failures.push(`unexpected HTTP ${response.status()}: ${response.url()}`);
	});
	page.on("request", (request) => {
		const url = new URL(request.url());
		if (url.protocol === "data:" || url.protocol === "blob:" || url.origin === origin) return;
		if (["image", "font"].includes(request.resourceType())) {
			failures.push(`third-party ${request.resourceType()} request: ${request.url()}`);
		}
	});

	return { failures, allowedContactStatuses };
}

async function inspectDocument(page, route) {
	const metrics = await page.evaluate(({ rootSelector, controlSelector }) => {
		const visible = (node) => {
			const style = getComputedStyle(node);
			const box = node.getBoundingClientRect();
			return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0 && box.width > 0 && box.height > 0;
		};
		const ids = [...document.querySelectorAll("[id]")].map((node) => node.id);
		const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
		const root = document.querySelector(rootSelector);
		const rootBox = root?.getBoundingClientRect();
		const touchTargets = [...document.querySelectorAll(controlSelector)]
			.filter(visible)
			.map((node) => {
				const box = node.getBoundingClientRect();
				return { label: node.getAttribute("aria-label") || node.textContent?.trim().slice(0, 80) || node.tagName, width: box.width, height: box.height };
			});
		const brokenImages = [...document.images]
			.filter((image) => image.complete && image.naturalWidth === 0)
			.map((image) => image.currentSrc || image.src);
		const externalAssets = performance.getEntriesByType("resource")
			.filter((entry) => {
				const url = new URL(entry.name, location.href);
				return url.origin !== location.origin && ["img", "css", "font"].includes(entry.initiatorType);
			})
			.map((entry) => entry.name);
		return {
			mainCount: document.querySelectorAll("main").length,
			h1Count: document.querySelectorAll("h1").length,
			rootCount: document.querySelectorAll(rootSelector).length,
			rootBox: rootBox ? { x: rootBox.x, y: rootBox.y, width: rootBox.width, height: rootBox.height } : null,
			documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
			duplicateIds,
			brokenImages,
			externalAssets,
			touchTargets,
		};
	}, { rootSelector: route.rootSelector, controlSelector: route.controlSelector });

	const failures = [];
	if (metrics.mainCount !== 1) failures.push(`${route.path}: expected one main, found ${metrics.mainCount}`);
	if (metrics.h1Count !== 1) failures.push(`${route.path}: expected one h1, found ${metrics.h1Count}`);
	if (metrics.rootCount !== 1) failures.push(`${route.path}: expected one ${route.rootSelector}, found ${metrics.rootCount}`);
	if (metrics.documentOverflow > 1) failures.push(`${route.path}: horizontal overflow ${metrics.documentOverflow}px`);
	if (metrics.duplicateIds.length) failures.push(`${route.path}: duplicate IDs ${metrics.duplicateIds.join(", ")}`);
	if (metrics.brokenImages.length) failures.push(`${route.path}: broken images ${metrics.brokenImages.join(", ")}`);
	if (metrics.externalAssets.length) failures.push(`${route.path}: third-party image/font assets ${metrics.externalAssets.join(", ")}`);
	return { metrics, failures };
}

async function inspectKeyboardFocus(page, routePath) {
	await page.keyboard.press("Tab");
	const focus = await page.evaluate(() => {
		const node = document.activeElement;
		if (!(node instanceof HTMLElement) || node === document.body) return null;
		const box = node.getBoundingClientRect();
		const style = getComputedStyle(node);
		return {
			tag: node.tagName,
			id: node.id,
			text: node.textContent?.trim().slice(0, 80) ?? "",
			width: box.width,
			height: box.height,
			opacity: Number(style.opacity),
			visibility: style.visibility,
			display: style.display,
		};
	});
	if (!focus || focus.width <= 0 || focus.height <= 0 || focus.opacity <= 0 || focus.visibility === "hidden" || focus.display === "none") {
		return [`${routePath}: keyboard focus is not visibly rendered`];
	}
	return [];
}

async function activateControl(locator, input, index) {
	await locator.scrollIntoViewIfNeeded();
	if (input === "touch") {
		await locator.tap();
		return;
	}
	if (index % 2 === 0) {
		await locator.click();
		return;
	}
	await locator.focus();
	await locator.press(index % 4 === 1 ? "Enter" : "Space");
}

async function stateMetrics(page, selector) {
	return page.locator(selector).evaluate((node, evaluatedSelector) => {
		const box = node.getBoundingClientRect();
		const data = Object.fromEntries([...node.attributes].filter(({ name }) => name.startsWith("data-")).map(({ name, value }) => [name, value]));
		const active = node.querySelector("[data-active='true'], [data-active-record-view], [aria-selected='true'], [aria-pressed='true'], :scope:not([hidden])");
		const activeBox = active?.getBoundingClientRect();
		return {
			selector: evaluatedSelector,
			data,
			box: { x: box.x, y: box.y, width: box.width, height: box.height },
			activeBox: activeBox ? { x: activeBox.x, y: activeBox.y, width: activeBox.width, height: activeBox.height } : null,
			activeText: active?.textContent?.trim().replace(/\s+/gu, " ").slice(0, 240) ?? "",
		};
	}, selector);
}

async function recordState({ page, route, state, selector = route.rootSelector, states, captures, onCapture, settle = true }) {
	const target = page.locator(selector).first();
	await target.waitFor({ state: "visible" });
	await target.scrollIntoViewIfNeeded();
	if (settle) await settleLayout(page);
	const metrics = await stateMetrics(page, selector);
	states.push(state);
	captures.push({ state, metrics });
	if (onCapture) await onCapture({ state, metrics, fullPage: route.path === "/privacy" });
	return metrics;
}

function contactDraft(input) {
	return {
		locale: input.locale === "zh-CN" ? "zh-CN" : "en",
		workEmail: typeof input.workEmail === "string" ? input.workEmail : "",
		name: typeof input.name === "string" ? input.name : "",
		companyOrWebsite: typeof input.companyOrWebsite === "string" ? input.companyOrWebsite : "",
		curiosity: typeof input.curiosity === "string" ? input.curiosity : "",
		marketQuestion: typeof input.marketQuestion === "string" ? input.marketQuestion : "",
		marketOrLanguage: typeof input.marketOrLanguage === "string" ? input.marketOrLanguage : "",
		buyerOrCommercialContext: typeof input.buyerOrCommercialContext === "string" ? input.buyerOrCommercialContext : "",
		requestType: input.requestType === "privacy" ? "privacy" : "conversation",
		botField: typeof input.botField === "string" ? input.botField : "",
	};
}

async function installContactStub(page) {
	let outcome = "unconfirmed";
	const requests = [];
	await page.route("**/api/contact", async (route) => {
		const request = route.request();
		let payload = {};
		try { payload = request.postDataJSON(); } catch { payload = {}; }
		const headers = await request.allHeaders();
		const submissionId = headers["idempotency-key"] ?? Object.entries(headers).find(([name]) => name.includes("submission"))?.[1] ?? "";
		requests.push({ outcome, payload, submissionId });
		if (outcome === "confirmed") {
			await route.fulfill({ status: 202, contentType: "application/json", body: JSON.stringify({ status: "confirmed" }) });
			return;
		}
		await route.fulfill({
			status: 503,
			contentType: "application/json",
			body: JSON.stringify({ status: "unconfirmed", values: contactDraft(payload), message: "Delivery was not confirmed by the matrix stub." }),
		});
	});
	return { requests, setOutcome: (next) => { outcome = next; } };
}

async function openRoute(page, baseUrl, routePath) {
	const target = routeUrl(baseUrl, routePath);
	const response = await page.goto(target, { waitUntil: "load" });
	if (response) invariant(response.status() < 400, `${routePath}: navigation returned ${response.status()}`);
	else invariant(page.url() === target, `${routePath}: same-document navigation did not reach ${target}`);
	await settleLayout(page);
}

async function openNoJavaScriptRoute(page, baseUrl, route) {
	const response = await page.goto(routeUrl(baseUrl, route.path), { waitUntil: "domcontentloaded" });
	invariant(response && response.status() < 400, `${route.path} no-JS: navigation failed`);
	await page.locator(route.rootSelector).waitFor({ state: "attached" });
	await page.waitForTimeout(40);
}

async function exerciseHome(options, result) {
	const { page, route, input, onCapture } = options;
	const answerStates = ["answer.ai", "answer.search", "answer.editorial", "answer.company-owned"];
	const answerControls = page.locator("[data-home-answer-field] [role='tablist'] button");
	const recordId = await page.locator(route.rootSelector).getAttribute("data-record-id");
	for (let index = 0; index < answerStates.length; index += 1) {
		await activateControl(answerControls.nth(index), input, index);
		await page.locator(`${route.rootSelector}[data-v1-state='${answerStates[index]}']`).waitFor();
		invariant(await page.locator(route.rootSelector).getAttribute("data-record-id") === recordId, "/: answer record ID changed");
		await recordState({ page, route, state: route.states[index], states: result.states, captures: result.captures, onCapture });
	}
	const trace = page.locator("[data-evidence-trace]");
	invariant(await trace.isHidden(), "/: evidence trace should start hidden after channel selection");
	await recordState({ page, route, state: "trace-hidden", states: result.states, captures: result.captures, onCapture });
	await activateControl(page.locator("[aria-controls='home-evidence-trace']"), input, 0);
	await trace.waitFor({ state: "visible" });
	invariant(await trace.locator("[data-evidence-id]").count() > 0, "/: open evidence trace has no evidence IDs");
	await recordState({ page, route, state: "trace-shown", selector: "[data-evidence-trace]", states: result.states, captures: result.captures, onCapture });

	const preview = page.locator("[data-product-record-preview]");
	const previewId = await preview.getAttribute("data-record-id");
	const viewIds = ["buyer-question", "current-answer", "comparison-evidence", "reviewed-action", "later-review"];
	const controls = preview.locator("[role='tablist'] button");
	const signatures = new Set();
	for (let index = 0; index < viewIds.length; index += 1) {
		await activateControl(controls.nth(index), input, index);
		await page.locator(`[data-product-record-preview][data-v1-state='${viewIds[index]}']`).waitFor();
		invariant(await preview.getAttribute("data-record-id") === previewId, "/: product preview record ID changed");
		const active = preview.locator(`[data-record-view='${viewIds[index]}'][data-active-record-view='true']`);
		invariant(await active.count() === 1, `/: preview ${viewIds[index]} is not uniquely active`);
		signatures.add(`${await active.getAttribute("data-geometry")}:${(await active.textContent())?.trim().slice(0, 80)}`);
		await recordState({ page, route, state: `record-${viewIds[index]}`, selector: "[data-product-record-preview]", states: result.states, captures: result.captures, onCapture });
	}
	invariant(signatures.size === viewIds.length, "/: product preview state geometry did not change for all five views");
}

async function exerciseProduct(options, result) {
	const { page, route, input, baseUrl, onCapture } = options;
	const viewIds = ["buyer-questions", "current-answers", "sources-gaps", "actions-under-review", "outcome-review"];
	const controls = page.locator(`${route.rootSelector} [role='tablist'] button`);
	const root = page.locator(route.rootSelector);
	const recordId = await root.getAttribute("data-record-id");
	const signatures = new Set();
	for (let index = 0; index < viewIds.length; index += 1) {
		await activateControl(controls.nth(index), input, index);
		await page.locator(`${route.rootSelector}[data-v1-state='${viewIds[index]}']`).waitFor();
		invariant(await root.getAttribute("data-record-id") === recordId, "/product: record ID changed");
		const active = root.locator(`[data-workspace-view='${viewIds[index]}']:not([hidden])`);
		invariant(await active.count() === 1, `/product: ${viewIds[index]} is not uniquely active`);
		signatures.add(`${viewIds[index]}:${(await active.textContent())?.trim().slice(0, 80)}`);
		await recordState({ page, route, state: viewIds[index], states: result.states, captures: result.captures, onCapture });
	}
	invariant(signatures.size === viewIds.length, "/product: workspace signatures did not change");
	for (const [id, state] of [["how-it-works", "anchor-how-it-works"], ["markets-languages", "anchor-markets-languages"]]) {
		await openRoute(page, baseUrl, `/product#${id}`);
		invariant(new URL(page.url()).hash === `#${id}`, `/product: ${id} hash was not preserved`);
		await recordState({ page, route, state, selector: `#${id}`, states: result.states, captures: result.captures, onCapture });
	}
}

async function exerciseCasework(options, result) {
	const { page, route, input, onCapture } = options;
	const root = page.locator(route.rootSelector);
	const recordId = await root.getAttribute("data-record-id");
	const controls = root.locator("[data-casework-select-step]");
	for (let index = 0; index < 8; index += 1) {
		await activateControl(controls.nth(index), input, index);
		await page.locator(`${route.rootSelector}[data-v1-state='step-${index + 1}']`).waitFor();
		invariant(await root.getAttribute("data-record-id") === recordId, "/casework: record ID changed");
		invariant(await root.locator("[data-casework-step]:not([hidden])").count() === 1, `/casework: step ${index + 1} is not unique`);
		await recordState({ page, route, state: `step-${index + 1}`, states: result.states, captures: result.captures, onCapture });
	}
}

async function exerciseCompany(options, result) {
	const { page, route, input, onCapture } = options;
	const root = page.locator(route.rootSelector);
	const controls = root.locator("[data-company-select-principle]");
	const geometry = new Set();
	for (let index = 0; index < route.states.length; index += 1) {
		await activateControl(controls.nth(index), input, index);
		await page.locator(`${route.rootSelector}[data-active-principle='${route.states[index]}']`).waitFor();
		invariant(await root.locator("[data-company-principle]:not([hidden])").count() === 1, `/company: ${route.states[index]} is not unique`);
		geometry.add(`${await root.locator("[data-company-aperture-mask]").getAttribute("style")}|${await root.locator("[data-company-aperture-light]").getAttribute("style")}`);
		await recordState({ page, route, state: route.states[index], states: result.states, captures: result.captures, onCapture });
	}
	invariant(geometry.size === route.states.length, "/company: aperture geometry did not change for all principles");
}

async function exerciseHumanAgent(options, result) {
	const { page, route, input, onCapture } = options;
	const root = page.locator(route.rootSelector);
	const factId = await root.getAttribute("data-fact-id");
	const geometry = new Set();
	for (let index = 0; index < 3; index += 1) {
		const layer = route.states[index];
		await activateControl(root.locator(`[data-lens-select-layer='${layer}']`), input, index);
		await page.locator(`${route.rootSelector}[data-v1-state='${layer}']`).waitFor();
		invariant(await root.getAttribute("data-fact-id") === factId, "/human-agent: fact ID changed");
		invariant(await root.locator(`[data-human-agent-projection='${layer}'][data-active='true']`).count() === 1, `/human-agent: ${layer} is not active`);
		geometry.add((await Promise.all(["data-lens-geometry", "data-lens-depth", "data-lens-focal-mask", "data-lens-density"].map((name) => root.getAttribute(name)))).join("|"));
		await recordState({ page, route, state: layer, states: result.states, captures: result.captures, onCapture });
	}
	invariant(geometry.size === 3, "/human-agent: lens geometry did not change for all layers");
	const agentLink = page.locator("[data-human-agent-projection='agent'] a[href^='/agent#']");
	invariant(await agentLink.count() === 1, "/human-agent: agent record bridge is missing");
	invariant((await agentLink.getAttribute("href"))?.endsWith(`#${factId}`), "/human-agent: agent bridge lost the stable fact ID");
	await recordState({ page, route, state: "bridge-agent", selector: "[data-human-agent-projection='agent']", states: result.states, captures: result.captures, onCapture });
	const contactLink = page.locator("[data-human-agent-actions] a[href='/contact']");
	invariant(await contactLink.count() === 1, "/human-agent: human contact bridge is missing");
	await recordState({ page, route, state: "bridge-human", selector: "[data-human-agent-actions]", states: result.states, captures: result.captures, onCapture });
}

async function exerciseContact(options, result, audit) {
	const { page, route, input, baseUrl, onCapture } = options;
	const stub = await installContactStub(page);
	await openRoute(page, baseUrl, route.path);
	await recordState({ page, route, state: "idle", states: result.states, captures: result.captures, onCapture });
	const email = page.locator("#contact-work-email");
	await email.focus();
	await page.locator(`${route.rootSelector}[data-v1-state='focused']`).waitFor();
	await recordState({ page, route, state: "focused", states: result.states, captures: result.captures, onCapture });
	await activateControl(page.locator("[data-contact-high-intent] summary"), input, 0);
	await page.locator(`${route.rootSelector}[data-v1-state='expanded']`).waitFor();
	await recordState({ page, route, state: "expanded", states: result.states, captures: result.captures, onCapture });
	await activateControl(page.locator("[data-contact-aperture] button[type='submit']"), input, 0);
	await page.locator(`${route.rootSelector}[data-v1-state='invalid']`).waitFor();
	invariant(await page.evaluate(() => document.activeElement?.id) === "contact-work-email", "/contact: invalid state did not focus workEmail");
	invariant(stub.requests.length === 0, "/contact: client-invalid form reached the endpoint");
	await recordState({ page, route, state: "invalid", states: result.states, captures: result.captures, onCapture });

	const retainedEmail = "matrix.contact@company.example";
	const retainedCuriosity = "Verify the intercepted English production matrix.";
	await email.fill(retainedEmail);
	await page.locator("#contact-curiosity").fill(retainedCuriosity);
	audit.allowedContactStatuses.add(503);
	stub.setOutcome("unconfirmed");
	await activateControl(page.locator("[data-contact-aperture] button[type='submit']"), input, 0);
	await page.locator(`${route.rootSelector}[data-v1-state='unconfirmed']`).waitFor();
	invariant(await email.inputValue() === retainedEmail, "/contact: unconfirmed state lost workEmail");
	invariant(await page.locator("#contact-curiosity").inputValue() === retainedCuriosity, "/contact: unconfirmed state lost curiosity");
	invariant(await page.evaluate(() => document.activeElement?.getAttribute("data-contact-status")) === "unconfirmed", "/contact: unconfirmed status did not receive focus");
	await recordState({ page, route, state: "unconfirmed", states: result.states, captures: result.captures, onCapture });

	stub.setOutcome("confirmed");
	await activateControl(page.locator("[data-contact-aperture] button[type='submit']"), input, 0);
	await page.locator(`${route.rootSelector}[data-v1-state='confirmed']`).waitFor();
	invariant(await page.evaluate(() => document.activeElement?.getAttribute("data-contact-status")) === "confirmed", "/contact: confirmed status did not receive focus");
	invariant(stub.requests.length === 2, `/contact: expected two intercepted submissions, got ${stub.requests.length}`);
	invariant(stub.requests[0].submissionId && stub.requests[0].submissionId === stub.requests[1].submissionId, "/contact: retry did not preserve the stable submission ID");
	invariant(JSON.stringify(stub.requests[0].payload) === JSON.stringify(stub.requests[1].payload), "/contact: retry payload changed before confirmation");
	await recordState({ page, route, state: "confirmed", states: result.states, captures: result.captures, onCapture });

	await openRoute(page, baseUrl, "/contact?intent=privacy");
	invariant(await page.locator("input[name='requestType']").getAttribute("value") === "privacy", "/contact?intent=privacy: requestType is not privacy");
	invariant(await page.locator(".site-v1-contact-form__privacy-boundary").isVisible(), "/contact?intent=privacy: manual-review boundary is missing");
	await recordState({ page, route, state: "privacy-intent", states: result.states, captures: result.captures, onCapture });
}

async function exercisePrivacy(options, result) {
	const { page, route, onCapture } = options;
	const sections = await page.locator("[data-privacy-section]").evaluateAll((nodes) => nodes.map((node) => node.getAttribute("data-privacy-section")));
	invariant(JSON.stringify(sections) === JSON.stringify(["submitted", "delivered", "used", "retention"]), "/privacy: editorial sections are incomplete or out of order");
	await recordState({ page, route, state: "editorial", states: result.states, captures: result.captures, onCapture });
	const cta = page.locator("[data-privacy-composition] a[href='/contact?intent=privacy']");
	invariant(await cta.count() === 1, "/privacy: typed privacy-intent CTA is missing");
	await recordState({ page, route, state: "contact-cta", selector: "[data-privacy-composition] a[href='/contact?intent=privacy']", states: result.states, captures: result.captures, onCapture });
}

export async function exerciseEnglishRoute(options) {
	const { page, baseUrl, route, viewport, motion = "normal" } = options;
	const result = { route: route.path, viewport: `${viewport.width}x${viewport.height}`, motion, states: [], captures: [], failures: [] };
	const audit = installPageAudit(page, baseUrl);
	try {
		await page.emulateMedia({ reducedMotion: motion === "reduced" ? "reduce" : "no-preference" });
		if (route.path !== "/contact") await openRoute(page, baseUrl, route.path);
		if (route.path === "/contact") {
			await exerciseContact(options, result, audit);
		} else {
			const documentCheck = await inspectDocument(page, route);
			result.failures.push(...documentCheck.failures);
			result.document = documentCheck.metrics;
			result.failures.push(...await inspectKeyboardFocus(page, route.path));
			if (viewport.width <= 390) {
				for (const target of documentCheck.metrics.touchTargets) {
					if (target.width < 44 || target.height < 44) result.failures.push(`${route.path}: touch target ${target.label} is ${target.width.toFixed(1)}x${target.height.toFixed(1)}`);
				}
			}
			if (route.path === "/") await exerciseHome(options, result);
			else if (route.path === "/product") await exerciseProduct(options, result);
			else if (route.path === "/casework") await exerciseCasework(options, result);
			else if (route.path === "/company") await exerciseCompany(options, result);
			else if (route.path === "/human-agent") await exerciseHumanAgent(options, result);
			else if (route.path === "/privacy") await exercisePrivacy(options, result);
		}
		if (route.path === "/contact") {
			const documentCheck = await inspectDocument(page, route);
			result.failures.push(...documentCheck.failures, ...await inspectKeyboardFocus(page, route.path));
			result.document = documentCheck.metrics;
		}
		if (motion === "reduced") {
			const reduced = await page.evaluate(() => ({
				matches: matchMedia("(prefers-reduced-motion: reduce)").matches,
				runningAnimations: document.getAnimations().filter((animation) => animation.playState === "running").length,
			}));
			if (!reduced.matches) result.failures.push(`${route.path}: reduced-motion media query did not match`);
			if (reduced.runningAnimations) result.failures.push(`${route.path}: ${reduced.runningAnimations} animations still running under reduced motion`);
		}
	} catch (error) {
		result.failures.push(`${route.path}: ${error instanceof Error ? error.message : String(error)}`);
	}
	result.failures.push(...audit.failures);
	return result;
}

async function submitNativeContact(page, values) {
	for (const [name, value] of Object.entries(values)) await page.locator(`[name='${name}']`).fill(value);
	await Promise.all([
		page.waitForNavigation({ waitUntil: "domcontentloaded" }),
		page.locator("form[action='/api/contact'] button[type='submit']").click(),
	]);
	await page.locator("[data-contact-aperture]").waitFor({ state: "attached" });
	await page.waitForTimeout(40);
}

export async function exerciseNoJavaScriptRoute(options) {
	const { page, baseUrl, route, viewport, onCapture } = options;
	const result = { route: route.path, viewport: `${viewport.width}x${viewport.height}`, motion: "no-js", states: [], captures: [], failures: [] };
	const audit = installPageAudit(page, baseUrl, new Set(route.path === "/contact" ? [422, 503] : []), { javaScriptEnabled: false });
	try {
		await openNoJavaScriptRoute(page, baseUrl, route);
		if (route.path === "/product") {
			invariant(await page.locator("[data-workspace-view]:not([hidden])").count() === 5, "/product no-JS: five workspaces are not readable");
			await recordState({ page, route, state: "five-workspaces", states: result.states, captures: result.captures, onCapture, settle: false });
		} else if (route.path === "/casework") {
			invariant(await page.locator("[data-casework-step]:not([hidden])").count() === 8, "/casework no-JS: eight steps are not readable");
			await recordState({ page, route, state: "eight-steps", states: result.states, captures: result.captures, onCapture, settle: false });
		} else if (route.path === "/human-agent") {
			invariant(await page.locator("[data-human-agent-projection]:not([hidden])").count() === 3, "/human-agent no-JS: three layers are not readable");
			await recordState({ page, route, state: "direct-layers", states: result.states, captures: result.captures, onCapture, settle: false });
			invariant(await page.locator("a[href^='/agent#']").count() >= 1, "/human-agent no-JS: agent bridge is missing");
			await recordState({ page, route, state: "bridge-agent", selector: "[data-human-agent-projection='agent']", states: result.states, captures: result.captures, onCapture, settle: false });
			invariant(await page.locator("[data-human-agent-actions] a[href='/contact']").count() === 1, "/human-agent no-JS: human bridge is missing");
			await recordState({ page, route, state: "bridge-human", selector: "[data-human-agent-actions]", states: result.states, captures: result.captures, onCapture, settle: false });
		} else if (route.path === "/contact") {
			await submitNativeContact(page, { curiosity: "Retain native invalid values" });
			invariant(new URL(page.url()).pathname === "/api/contact", "/contact no-JS invalid: response did not remain on native endpoint");
			invariant(await page.locator("[data-contact-aperture][data-v1-state='invalid']").count() === 1, "/contact no-JS: invalid aperture state is missing");
			invariant(await page.locator("#contact-work-email").getAttribute("aria-invalid") === "true", "/contact no-JS: workEmail is not marked invalid");
			invariant(await page.locator("#contact-curiosity").inputValue() === "Retain native invalid values", "/contact no-JS: invalid response lost values");
			invariant(await page.locator("#contact-work-email").getAttribute("autofocus") !== null, "/contact no-JS: rejected field is not the focus target");
			await recordState({ page, route, state: "invalid-retained", states: result.states, captures: result.captures, onCapture, settle: false });
			await submitNativeContact(page, { workEmail: "matrix.native@company.example", curiosity: "Retain native unconfirmed values" });
			invariant(await page.locator("[data-contact-status='unconfirmed'][autofocus]").count() === 1, "/contact no-JS: unconfirmed focus target is missing");
			invariant(await page.locator("#contact-work-email").inputValue() === "matrix.native@company.example", "/contact no-JS: unconfirmed response lost workEmail");
			invariant(await page.locator("#contact-curiosity").inputValue() === "Retain native unconfirmed values", "/contact no-JS: unconfirmed response lost curiosity");
			await recordState({ page, route, state: "unconfirmed-retained", states: result.states, captures: result.captures, onCapture, settle: false });
		} else if (route.path === "/privacy") {
			const sections = await page.locator("[data-privacy-section]").evaluateAll((nodes) => nodes.map((node) => node.getAttribute("data-privacy-section")));
			invariant(JSON.stringify(sections) === JSON.stringify(["submitted", "delivered", "used", "retention"]), "/privacy no-JS: editorial copy is incomplete or out of order");
			await recordState({ page, route, state: "editorial", states: result.states, captures: result.captures, onCapture, settle: false });
			invariant(await page.locator("a[href='/contact?intent=privacy']").count() === 1, "/privacy no-JS: typed CTA is missing");
			await recordState({ page, route, state: "contact-cta", selector: "a[href='/contact?intent=privacy']", states: result.states, captures: result.captures, onCapture, settle: false });
		}
		const documentCheck = await inspectDocument(page, route);
		result.failures.push(...documentCheck.failures);
		result.document = documentCheck.metrics;
	} catch (error) {
		result.failures.push(`${route.path} no-JS: ${error instanceof Error ? error.message : String(error)}`);
	}
	result.failures.push(...audit.failures);
	return result;
}

function escapeHtml(value) {
	return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

export function renderMarkdownReport(report) {
	const failures = report.results.flatMap((result) => result.failures.map((failure) => `${result.route} ${result.viewport} ${result.motion}: ${failure}`));
	return [
		"# Site V1 English production matrix",
		"",
		`- Result: ${failures.length ? "FAIL" : "PASS"}`,
		`- Browser: ${report.browser}`,
		`- Base URL: ${report.baseUrl}`,
		`- Route runs: ${report.results.length}`,
		`- State captures: ${report.artifacts.length}`,
		`- Failures: ${failures.length}`,
		"",
		"## Failures",
		"",
		...(failures.length ? failures.map((failure) => `- ${failure}`) : ["- None."]),
		"",
	].join("\n");
}

export function renderHtmlIndex(report) {
	const cards = report.artifacts.map((artifact) => `<article><h2>${escapeHtml(artifact.route)} · ${escapeHtml(artifact.viewport)} · ${escapeHtml(artifact.state)} · ${escapeHtml(artifact.motion)}</h2><img loading="lazy" src="${escapeHtml(artifact.file)}" alt="${escapeHtml(artifact.route)} ${escapeHtml(artifact.state)} at ${escapeHtml(artifact.viewport)} (${escapeHtml(artifact.motion)})"><pre>${escapeHtml(JSON.stringify(artifact.metrics, null, 2))}</pre></article>`).join("\n");
	return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Site V1 English production matrix</title><style>body{font:14px/1.5 system-ui;margin:2rem;background:#eef1f3;color:#102333}article{background:white;margin:0 0 2rem;padding:1rem;border:1px solid #b7c1c8}img{display:block;max-width:100%;height:auto;border:1px solid #d5dce0}pre{overflow:auto}</style><h1>Site V1 English production matrix</h1><p>${report.passed ? "PASS" : "FAIL"} · ${report.artifacts.length} captures</p>${cards}</html>`;
}

export async function runEnglishMatrix({ baseUrl, outputDirectory }) {
	const executablePath = resolveSystemChrome();
	const require = createRequire(import.meta.url);
	const { chromium } = require("@playwright/test");
	const output = path.resolve(outputDirectory);
	await mkdir(output, { recursive: true });
	const browser = await chromium.launch({ executablePath, headless: true });
	const results = [];
	const artifacts = [];
	try {
		for (const viewport of VIEWPORT_MATRIX) {
			for (const motion of ["normal", ...(REDUCED_VIEWPORTS.has(viewport.id) ? ["reduced"] : [])]) {
				const context = await browser.newContext({
					baseURL: baseUrl,
					viewport: { width: viewport.width, height: viewport.height },
					hasTouch: viewport.input === "touch",
					colorScheme: "light",
					locale: "en-US",
					serviceWorkers: "block",
				});
				try {
					for (const route of ENGLISH_ROUTE_MATRIX) {
						const page = await context.newPage();
						const onCapture = async ({ state, metrics, fullPage }) => {
							const file = artifactName(route.path, viewport.id, state, motion);
							await page.screenshot({ path: path.join(output, file), animations: "disabled", fullPage });
							artifacts.push({ route: route.path, viewport: viewport.id, state, motion, file, metrics });
						};
						results.push(await exerciseEnglishRoute({ page, baseUrl, route, viewport, input: viewport.input, motion, onCapture }));
						await page.close();
					}
				} finally {
					await context.close();
				}
			}
		}

		for (const viewport of VIEWPORT_MATRIX.filter(({ id }) => REDUCED_VIEWPORTS.has(id))) {
			const context = await browser.newContext({
				baseURL: baseUrl,
				viewport: { width: viewport.width, height: viewport.height },
				hasTouch: viewport.input === "touch",
				javaScriptEnabled: false,
				colorScheme: "light",
				locale: "en-US",
				serviceWorkers: "block",
			});
			try {
				for (const route of ENGLISH_ROUTE_MATRIX.filter(({ noJavaScriptStates }) => noJavaScriptStates?.length)) {
					const page = await context.newPage();
					const onCapture = async ({ state, metrics }) => {
						const file = artifactName(route.path, viewport.id, state, "no-js");
						await page.screenshot({ path: path.join(output, file), animations: "disabled", fullPage: true });
						artifacts.push({ route: route.path, viewport: viewport.id, state, motion: "no-js", file, metrics });
					};
					results.push(await exerciseNoJavaScriptRoute({ page, baseUrl, route, viewport, onCapture }));
					await page.close();
				}
			} finally {
				await context.close();
			}
		}
	} finally {
		await browser.close();
	}

	const failures = results.flatMap((result) => result.failures);
	const report = {
		passed: failures.length === 0,
		browser: executablePath,
		baseUrl,
		viewports: VIEWPORT_MATRIX,
		routes: ENGLISH_ROUTE_MATRIX.map(({ path: routePath, states, noJavaScriptStates }) => ({ path: routePath, states, noJavaScriptStates })),
		results,
		artifacts,
	};
	await writeFile(path.join(output, "metrics.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
	await writeFile(path.join(output, "report.md"), renderMarkdownReport(report), "utf8");
	await writeFile(path.join(output, "index.html"), renderHtmlIndex(report), "utf8");
	return report;
}

function isDirectExecution() {
	return typeof process.argv[1] === "string" && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
}

if (isDirectExecution()) {
	runEnglishMatrix(parseCliArgs(process.argv.slice(2))).then((report) => {
		console.log(JSON.stringify({ passed: report.passed, routeRuns: report.results.length, stateCaptures: report.artifacts.length, failures: report.results.flatMap((result) => result.failures) }, null, 2));
		if (!report.passed) process.exitCode = 1;
	}).catch((error) => {
		console.error(error);
		process.exitCode = 1;
	});
}
