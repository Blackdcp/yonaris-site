import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { tsImport } from "tsx/esm/api";

const { PUBLIC_PAGE_MANIFEST } = await tsImport("../src/site/public-page-manifest.ts", import.meta.url);

export const SYSTEM_CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
export const CONTACT_E2E_TOKEN_HEADER = "X-Yonaris-Contact-E2E-Token";
export const CONTACT_E2E_OUTCOME_HEADER = "X-Yonaris-Contact-E2E-Outcome";
export const CONTACT_E2E_TRANSPORT_HEADER = "X-Yonaris-Contact-E2E-Transport";

export const VIEWPORT_MATRIX = Object.freeze([
	{ id: "360x800", width: 360, height: 800, input: "touch" },
	{ id: "390x844", width: 390, height: 844, input: "touch" },
	{ id: "1024x768", width: 1024, height: 768, input: "pointer" },
	{ id: "1280x800", width: 1280, height: 800, input: "pointer" },
	{ id: "1440x900", width: 1440, height: 900, input: "pointer" },
]);

const ENGLISH_PAGE_MATRIX = Object.freeze({
	home: {
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
	product: {
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
	casework: {
		slug: "casework",
		rootSelector: "[data-casework-walkthrough]",
		controlSelector: "[data-casework-select-step]",
		noJavaScriptStates: ["eight-steps"],
		states: Array.from({ length: 8 }, (_, index) => `step-${index + 1}`),
	},
	company: {
		slug: "company",
		rootSelector: "[data-company-aperture]",
		controlSelector: "[data-company-select-principle]",
		states: ["why", "audience", "markets", "human-judgement", "non-promises"],
	},
	"human-agent": {
		slug: "human-agent",
		rootSelector: "[data-human-agent-lens]",
		controlSelector: "[data-lens-select-layer]",
		noJavaScriptStates: ["direct-layers", "bridge-agent", "bridge-human"],
		states: ["human", "evidence", "agent", "bridge-agent", "bridge-human"],
	},
	contact: {
		slug: "contact",
		rootSelector: "[data-contact-aperture]",
		controlSelector: "[data-contact-aperture] summary, [data-contact-aperture] button[type='submit']",
		noJavaScriptStates: ["invalid-retained", "unconfirmed-retained", "confirmed"],
		states: ["idle", "focused", "expanded", "invalid", "unconfirmed", "confirmed", "privacy-intent"],
	},
	privacy: {
		slug: "privacy",
		rootSelector: "[data-privacy-composition]",
		controlSelector: "[data-privacy-composition] a[href='/contact?intent=privacy']",
		noJavaScriptStates: ["editorial", "contact-cta"],
		states: ["editorial", "contact-cta"],
	},
});

export const ENGLISH_ROUTE_MATRIX = Object.freeze(PUBLIC_PAGE_MANIFEST.map((page) => {
	const contract = ENGLISH_PAGE_MATRIX[page.key];
	if (!contract) throw new Error(`Missing English matrix contract for public page ${page.key}`);
	return Object.freeze({ key: page.key, path: page.paths["global-en"], ...contract });
}));

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

export function resolveContactE2EToken(env = process.env) {
	const token = env.YONARIS_CONTACT_E2E_TOKEN?.trim();
	if (!token) throw new Error("The Contact E2E token is required before native valid POSTs.");
	if (!/^[A-Za-z0-9_-]{48,128}$/u.test(token)) throw new Error("The Contact E2E token must be a 48-128 character high-entropy base64url value.");
	return token;
}

export function renderedSignature(rendered) {
	return createHash("sha256").update(JSON.stringify(rendered)).digest("hex");
}

export const RENDERED_GEOMETRY_QUANTUM_CSS_PX = 1;
export const RENDERED_ATTACHMENT_ATTRIBUTES = Object.freeze([
	"d",
	"points",
	"data-active",
	"href",
	"src",
	"srcset",
	"alt",
	"poster",
	"viewBox",
]);
export const RENDERED_STYLE_PROPERTIES = Object.freeze([
	"display",
	"visibility",
	"opacity",
	"transform",
	"clipPath",
	"maskImage",
	"backgroundColor",
	"backgroundImage",
	"borderColor",
	"borderWidth",
	"boxShadow",
	"color",
	"gridTemplateColumns",
	"gridTemplateRows",
	"position",
	"fill",
	"stroke",
	"strokeWidth",
	"strokeDasharray",
	"strokeDashoffset",
	"filter",
]);
export const OWNER_ATTACHMENT_SELECTORS = Object.freeze([
	"[data-lens-optics]",
	"[data-lens-ring]",
	"[data-lens-attachment]",
	"[data-lens-optics] [aria-hidden='true']",
	"[data-human-agent-projection] a[href]",
	"svg",
	"svg *",
	"img",
	"picture",
	"source",
	"video",
	"audio",
]);
export const INTERACTIVE_CONTROL_RAIL_ATTACHMENT_SELECTOR = ".site-v1-casework-timeline__scrub[role='group'] svg";

export function quantizeGeometryPixel(value, quantum = RENDERED_GEOMETRY_QUANTUM_CSS_PX) {
	return Math.round(value / quantum) * quantum;
}

export function semanticAttachmentVector({ tagName, attributes = {}, currentSrc = "" }) {
	return [
		String(tagName).toLowerCase(),
		RENDERED_ATTACHMENT_ATTRIBUTES.map((name) => [
			name,
			Object.hasOwn(attributes, name) ? String(attributes[name]) : null,
		]),
		currentSrc ? String(currentSrc) : null,
	];
}

export function semanticStyleVector(style) {
	return RENDERED_STYLE_PROPERTIES.map((property) => style?.[property] == null ? "" : String(style[property]));
}

export function assertDistinctRenderedStates(routePath, captures) {
	for (const capture of captures) {
		if (typeof capture.stableId !== "string" || capture.stableId.trim() === "") {
			throw new Error(`${routePath}: stable record/fact ID is missing for ${capture.state}`);
		}
	}
	const signatures = captures.map(({ rendered }) => renderedSignature(rendered));
	if (new Set(signatures).size !== captures.length) {
		throw new Error(`${routePath}: rendered signatures did not change independently for every state`);
	}
	return signatures;
}

export function requiredManualModalities(viewport) {
	return viewport.width <= 390 ? ["touch", "pointer", "keyboard"] : ["pointer", "keyboard"];
}

function firstPayloadDifference(left, right, path = "$") {
	if (Object.is(left, right)) return null;
	if (typeof left !== "object" || left === null || typeof right !== "object" || right === null) return { path, left, right };
	const keys = [...new Set([...Object.keys(left), ...Object.keys(right)])];
	for (const key of keys) {
		const difference = firstPayloadDifference(left[key], right[key], `${path}.${key}`);
		if (difference) return difference;
	}
	return null;
}

export function keyboardActivationKey(tagName, index) {
	const nativeName = tagName.toLowerCase();
	if (nativeName === "summary" || nativeName === "a") return "Enter";
	return index % 4 === 1 ? "Enter" : "Space";
}

function cssTimeList(value) {
	return String(value || "0s").split(",").map((entry) => {
		const token = entry.trim().toLowerCase();
		const amount = Number.parseFloat(token) || 0;
		return token.endsWith("ms") ? amount : amount * 1_000;
	});
}

function cssIterationList(value) {
	return String(value || "1").split(",").map((entry) => {
		const token = entry.trim().toLowerCase();
		return token === "infinite" ? Number.POSITIVE_INFINITY : Math.max(0, Number.parseFloat(token) || 0);
	});
}

export function computedMotionBudgetMs(style, capMs = 1_500) {
	if (style.atmosphericMotion === true) return 0;
	const budget = (durationValue, delayValue, iterationValue = "1") => {
		const durations = cssTimeList(durationValue);
		const delays = cssTimeList(delayValue);
		const iterations = cssIterationList(iterationValue);
		const count = Math.max(durations.length, delays.length, iterations.length);
		let maximum = 0;
		for (let index = 0; index < count; index += 1) {
			const duration = durations[index % durations.length];
			const delay = delays[index % delays.length];
			const iterationsForEntry = iterations[index % iterations.length];
			maximum = Math.max(maximum, delay + duration * iterationsForEntry);
		}
		return maximum;
	};
	return Math.min(capMs, Math.max(0,
		budget(style.transitionDuration, style.transitionDelay),
		budget(style.animationDuration, style.animationDelay, style.animationIterationCount),
	));
}

export function assertInteractionParity(routePath, state, evidence) {
	if (evidence.length < 2) throw new Error(`${routePath} ${state}: modality parity requires two independent activations`);
	const [baseline, ...comparisons] = evidence;
	if (!baseline.stableId || !baseline.renderedSignature) throw new Error(`${routePath} ${state}: modality parity is missing stable evidence`);
	for (const comparison of comparisons) {
		if (
			comparison.stableId !== baseline.stableId
			|| comparison.state !== baseline.state
			|| comparison.renderedSignature !== baseline.renderedSignature
		) {
			const difference = firstPayloadDifference(baseline.rendered, comparison.rendered);
			const differenceText = difference
				? `${difference.path}: ${JSON.stringify(difference.left)} -> ${JSON.stringify(difference.right)}`
				: "none";
			throw new Error(`${routePath} ${state}: modality parity changed the stable ID, state or rendered signature; first rendered difference ${differenceText}`);
		}
	}
}

export function visibleFocusIndicator(focus) {
	return Boolean(
		focus.matchesFocusVisible
		&& (
			(focus.outlineStyle !== "none" && Number(focus.outlineWidth) >= 1)
			|| (focus.boxShadow && focus.boxShadow !== "none")
		),
	);
}

export function assertMotionEvidence(routePath, state, evidence) {
	if (!evidence.meaningful) throw new Error(`${routePath} ${state}: rendered content is not meaningful`);
	if (!evidence.beforeStabilized || !evidence.afterStabilized) {
		throw new Error(`${routePath} ${state}: rendered evidence did not stabilize within the bounded sampling window`);
	}
	if (evidence.beforeSignature !== evidence.afterSignature) {
		throw new Error(`${routePath} ${state}: rendered state did not stay stable after automatic motion should yield`);
	}
	if (evidence.orchestrators.some(({ paused, mode }) => !paused || !["controlled", "reduced"].includes(mode))) {
		throw new Error(`${routePath} ${state}: automatic scene did not yield in a paused state`);
	}
	if (evidence.semanticRunningAnimations > 0) {
		throw new Error(`${routePath} ${state}: semantic motion was still running after direct control should yield`);
	}
	if (evidence.mode === "reduced" && evidence.runningAnimations !== 0) {
		throw new Error(`${routePath} ${state}: reduced mode is not quiescent`);
	}
}

export function auditTouchTargets(routePath, viewport, targets) {
	if (viewport.width > 390) return [];
	const failures = targets
		.filter(({ width, height }) => width < 44 || height < 44)
		.map(({ label, width, height }) => `${routePath}: touch target ${label} is ${width.toFixed(1)}x${height.toFixed(1)}; expected at least 44x44`);
	if (failures.length) throw new Error(failures.join("; "));
	return failures;
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

function applyDocumentAudit(result, route, viewport, documentCheck) {
	result.failures.push(...documentCheck.failures);
	try {
		auditTouchTargets(route.path, viewport, documentCheck.metrics.touchTargets);
	} catch (error) {
		result.failures.push(error instanceof Error ? error.message : String(error));
	}
	result.document = documentCheck.metrics;
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
			matchesFocusVisible: node.matches(":focus-visible"),
			outlineStyle: style.outlineStyle,
			outlineWidth: Number.parseFloat(style.outlineWidth) || 0,
			boxShadow: style.boxShadow,
		};
	});
	if (!focus || focus.width <= 0 || focus.height <= 0 || focus.opacity <= 0 || focus.visibility === "hidden" || focus.display === "none") {
		return [`${routePath}: keyboard focus is not visibly rendered`];
	}
	if (!visibleFocusIndicator(focus)) return [`${routePath}: keyboard focus has no focus-visible paint`];
	return [];
}

async function inspectControlFocus(locator, routePath, state) {
	const focus = await locator.evaluate((node) => {
		const style = getComputedStyle(node);
		return {
			matchesFocusVisible: node.matches(":focus-visible"),
			outlineStyle: style.outlineStyle,
			outlineWidth: Number.parseFloat(style.outlineWidth) || 0,
			boxShadow: style.boxShadow,
		};
	});
	invariant(visibleFocusIndicator(focus), `${routePath} ${state}: keyboard control has no focus-visible indicator`);
}

async function activateControl(locator, modality, index, routePath = "route", state = "state") {
	await locator.scrollIntoViewIfNeeded();
	if (modality === "touch") {
		await locator.tap();
		return;
	}
	if (modality === "pointer") {
		await locator.click();
		return;
	}
	await locator.page().keyboard.press("Tab");
	await locator.focus();
	await inspectControlFocus(locator, routePath, state);
	const tagName = await locator.evaluate((node) => node.tagName);
	await locator.press(keyboardActivationKey(tagName, index));
}

export async function renderedSceneSnapshot(page, selectorOrSelectors) {
	const selectors = Array.isArray(selectorOrSelectors) ? selectorOrSelectors : [selectorOrSelectors];
	return page.evaluate(({ evaluatedSelectors, geometryQuantum, attachmentAttributes, styleProperties, ownerAttachmentSelectors, interactiveControlRailAttachmentSelector }) => {
		const round = (value) => Math.round(value / geometryQuantum) * geometryQuantum;
		const rect = (box, origin) => [
			round(box.x - origin.x),
			round(box.y - origin.y),
			round(box.width),
			round(box.height),
		];
		const styleVector = (style) => styleProperties.map((property) => style[property] == null ? "" : String(style[property]));
		const visible = (node) => {
			const style = getComputedStyle(node);
			const box = node.getBoundingClientRect();
			return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0 && box.width > 0 && box.height > 0;
		};
		return evaluatedSelectors.map((selector) => {
			const node = document.querySelector(selector);
			if (!(node instanceof HTMLElement || node instanceof SVGElement)) return { selector, attached: false };
			const origin = node.getBoundingClientRect();
			const owner = node.closest("[data-v1-state]") || node;
			const ownerOrigin = owner.getBoundingClientRect();
			const descendants = [node, ...node.querySelectorAll("*")]
				.filter((candidate) => visible(candidate) && !candidate.closest("[data-visual-atmosphere='true'][aria-hidden='true']"))
				.slice(0, 160)
				.map((candidate) => {
					const style = getComputedStyle(candidate);
					const ownText = [...candidate.childNodes]
						.filter((child) => child.nodeType === Node.TEXT_NODE)
						.map((child) => child.textContent ?? "")
						.join(" ")
						.replace(/\s+/gu, " ")
						.trim()
						.slice(0, 240);
					return [candidate.tagName, rect(candidate.getBoundingClientRect(), origin), styleVector(style), ownText];
				});
			const style = getComputedStyle(node);
			const before = getComputedStyle(node, "::before");
			const after = getComputedStyle(node, "::after");
			const ownerAttachments = [...owner.querySelectorAll(ownerAttachmentSelectors.join(","))]
				.filter((candidate) => (
					!candidate.closest("[data-visual-atmosphere='true'][aria-hidden='true']")
					&& !candidate.closest(interactiveControlRailAttachmentSelector)
				))
				.slice(0, 200)
				.map((candidate) => {
					const candidateStyle = getComputedStyle(candidate);
					const candidateBefore = getComputedStyle(candidate, "::before");
					const candidateAfter = getComputedStyle(candidate, "::after");
					const attributes = Object.fromEntries(attachmentAttributes
						.filter((name) => candidate.hasAttribute(name))
						.map((name) => [name, candidate.getAttribute(name)]));
					const currentSrc = "currentSrc" in candidate ? candidate.currentSrc : "";
					return {
						semantic: [
							candidate.tagName.toLowerCase(),
							attachmentAttributes.map((name) => [name, Object.hasOwn(attributes, name) ? String(attributes[name]) : null]),
							currentSrc ? String(currentSrc) : null,
						],
						box: rect(candidate.getBoundingClientRect(), ownerOrigin),
						styles: styleVector(candidateStyle),
						pseudo: [styleVector(candidateBefore), candidateBefore.content, styleVector(candidateAfter), candidateAfter.content],
					};
				});
			return {
				selector,
				attached: true,
				box: [round(origin.width), round(origin.height)],
				styles: styleVector(style),
				pseudo: [styleVector(before), before.content, styleVector(after), after.content],
				visibleContent: visible(node) ? (node.innerText || "").replace(/\s+/gu, " ").trim().slice(0, 4_000) : "",
				descendants,
				ownerAttachments,
			};
		});
	}, {
		evaluatedSelectors: selectors,
		geometryQuantum: RENDERED_GEOMETRY_QUANTUM_CSS_PX,
		attachmentAttributes: RENDERED_ATTACHMENT_ATTRIBUTES,
		styleProperties: RENDERED_STYLE_PROPERTIES,
		ownerAttachmentSelectors: OWNER_ATTACHMENT_SELECTORS,
		interactiveControlRailAttachmentSelector: INTERACTIVE_CONTROL_RAIL_ATTACHMENT_SELECTOR,
	});
}

async function stableRenderedEvidence(page, selectorOrSelectors) {
	let previous;
	let rendered;
	let signature;
	let stabilized = false;
	for (let attempt = 0; attempt < 12; attempt += 1) {
		rendered = await renderedSceneSnapshot(page, selectorOrSelectors);
		signature = renderedSignature(rendered);
		if (signature === previous) {
			stabilized = true;
			break;
		}
		previous = signature;
		await page.waitForTimeout(70);
	}
	return {
		rendered,
		renderedSignature: signature,
		stabilized,
		meaningful: rendered.some((scene) => scene.attached && (scene.visibleContent || scene.descendants?.length || scene.ownerAttachments?.length || scene.styles?.[0] === "none")),
	};
}

async function settleOwnerMotion(page, selectorOrSelectors) {
	const selectors = Array.isArray(selectorOrSelectors) ? selectorOrSelectors : [selectorOrSelectors];
	const computedStyles = await page.evaluate((evaluatedSelectors) => {
		const owners = new Set();
		for (const selector of evaluatedSelectors) {
			for (const node of document.querySelectorAll(selector)) owners.add(node.closest("[data-v1-state]") || node);
		}
		const styles = [];
		for (const owner of owners) {
			for (const node of [owner, ...owner.querySelectorAll("*")]) {
				for (const pseudo of [null, "::before", "::after"]) {
					const style = getComputedStyle(node, pseudo);
					styles.push({
						atmosphericMotion: node !== owner && Boolean(node.closest("[data-visual-atmosphere='true'][aria-hidden='true']")),
						transitionDuration: style.transitionDuration,
						transitionDelay: style.transitionDelay,
						animationDuration: style.animationDuration,
						animationDelay: style.animationDelay,
						animationIterationCount: style.animationIterationCount,
					});
				}
			}
		}
		return styles;
	}, selectors);
	const budget = computedStyles.reduce((maximum, style) => Math.max(maximum, computedMotionBudgetMs(style)), 0);
	if (budget > 0) await page.waitForTimeout(Math.min(1_500, Math.ceil(budget) + 34));
	await settleLayout(page);
	return budget;
}

async function motionEvidence(page, routePath, state, mode, selectorOrSelectors) {
	const settleBudgetMs = await settleOwnerMotion(page, selectorOrSelectors);
	const before = await stableRenderedEvidence(page, selectorOrSelectors);
	await page.waitForTimeout(320);
	const after = await stableRenderedEvidence(page, selectorOrSelectors);
	const motion = await page.evaluate(() => {
		const running = document.getAnimations().filter((animation) => animation.playState === "running");
		const atmospheric = running.filter((animation) => {
			const rawTarget = animation.effect?.target;
			const target = rawTarget instanceof Element
				? rawTarget
				: rawTarget && "element" in rawTarget && rawTarget.element instanceof Element
					? rawTarget.element
					: null;
			return Boolean(target?.closest("[data-visual-atmosphere='true'][aria-hidden='true']"));
		});
		return {
			orchestrators: [...document.querySelectorAll("[data-motion-state]")].map((node) => ({
				paused: node.getAttribute("data-motion-paused") === "true",
				mode: node.getAttribute("data-motion-state"),
			})),
			runningAnimations: running.length,
			atmosphericRunningAnimations: atmospheric.length,
			semanticRunningAnimations: running.length - atmospheric.length,
		};
	});
	assertMotionEvidence(routePath, state, {
		mode,
		beforeSignature: before.renderedSignature,
		afterSignature: after.renderedSignature,
		beforeStabilized: before.stabilized,
		afterStabilized: after.stabilized,
		meaningful: before.meaningful,
		...motion,
	});
	return { ...after, settleBudgetMs, comparisonGapMs: 320, motion };
}

async function controlStateParity({ page, route, state, stateSelector, stateValue, control, resetControl, sceneSelector, stableId, index, primaryModality, motion }) {
	const modalities = requiredManualModalities({ width: primaryModality === "touch" ? 390 : 1280 });
	const evidence = [];
	for (const modality of modalities) {
		if (resetControl) await activateControl(resetControl, primaryModality, index + 1, route.path, `${state}-reset`);
		await activateControl(control, modality, index, route.path, state);
		await page.locator(`${stateSelector}[${stateValue.attribute}='${stateValue.value}']`).waitFor();
		const rendered = await motionEvidence(page, route.path, state, motion, sceneSelector);
		evidence.push({
			modality,
			stableId: await stableId(),
			state: await page.locator(stateSelector).getAttribute(stateValue.attribute),
			renderedSignature: rendered.renderedSignature,
			rendered: rendered.rendered,
			settleBudgetMs: rendered.settleBudgetMs,
			comparisonGapMs: rendered.comparisonGapMs,
			motion: rendered.motion,
		});
	}
	assertInteractionParity(route.path, state, evidence);
	return evidence.at(-1);
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

async function recordState({ page, route, state, selector = route.rootSelector, sceneSelector = selector, renderedEvidence, states, captures, onCapture, settle = true }) {
	const target = page.locator(selector).first();
	await target.waitFor({ state: "visible" });
	await target.scrollIntoViewIfNeeded();
	if (settle) await settleLayout(page);
	const rendered = renderedEvidence ?? await stableRenderedEvidence(page, sceneSelector);
	const metrics = {
		...await stateMetrics(page, selector),
		renderedSignature: rendered.renderedSignature,
		sceneAttachmentHash: renderedSignature(rendered.rendered.map((scene) => ({ selector: scene.selector, attached: scene.attached, descendants: scene.descendants?.map(([tag]) => tag) }))),
	};
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
	invariant(recordId, "/: answer record ID is missing");
	const answerEvidence = [];
	for (let index = 0; index < answerStates.length; index += 1) {
		const evidence = await controlStateParity({
			page,
			route,
			state: route.states[index],
			stateSelector: route.rootSelector,
			stateValue: { attribute: "data-v1-state", value: answerStates[index] },
			control: answerControls.nth(index),
			resetControl: answerControls.nth((index + 1) % answerStates.length),
			sceneSelector: ".site-v1-answer-environment[data-active='true']",
			stableId: () => page.locator(route.rootSelector).getAttribute("data-record-id"),
			index,
			primaryModality: input,
			motion: options.motion,
		});
		invariant(evidence.stableId === recordId, "/: answer record ID changed");
		answerEvidence.push({ state: route.states[index], stableId: evidence.stableId, rendered: evidence.rendered });
		await recordState({ page, route, state: route.states[index], sceneSelector: ".site-v1-answer-environment[data-active='true']", renderedEvidence: evidence, states: result.states, captures: result.captures, onCapture });
	}
	assertDistinctRenderedStates("/", answerEvidence);
	const trace = page.locator("[data-evidence-trace]");
	invariant(await trace.isHidden(), "/: evidence trace should start hidden after channel selection");
	const traceControl = page.locator("[aria-controls='home-evidence-trace']");
	await activateControl(traceControl, input, 0, route.path, "trace-shown");
	await trace.waitFor({ state: "visible" });
	const pointerShown = await motionEvidence(page, route.path, "trace-shown", options.motion, "[data-evidence-trace]");
	await activateControl(traceControl, input, 0, route.path, "trace-hidden");
	await trace.waitFor({ state: "hidden" });
	const pointerHidden = await motionEvidence(page, route.path, "trace-hidden", options.motion, "[data-evidence-trace]");
	await activateControl(traceControl, "keyboard", 0, route.path, "trace-shown");
	await trace.waitFor({ state: "visible" });
	const keyboardShown = await motionEvidence(page, route.path, "trace-shown", options.motion, "[data-evidence-trace]");
	await activateControl(traceControl, "keyboard", 0, route.path, "trace-hidden");
	await trace.waitFor({ state: "hidden" });
	const keyboardHidden = await motionEvidence(page, route.path, "trace-hidden", options.motion, "[data-evidence-trace]");
	for (const [state, first, second] of [["trace-hidden", pointerHidden, keyboardHidden], ["trace-shown", pointerShown, keyboardShown]]) {
		assertInteractionParity(route.path, state, [
			{ modality: input, stableId: recordId, state, renderedSignature: first.renderedSignature },
			{ modality: "keyboard", stableId: recordId, state, renderedSignature: second.renderedSignature },
		]);
	}
	await recordState({ page, route, state: "trace-hidden", sceneSelector: "[data-evidence-trace]", renderedEvidence: keyboardHidden, states: result.states, captures: result.captures, onCapture });
	await activateControl(traceControl, "keyboard", 0, route.path, "trace-shown");
	await trace.waitFor({ state: "visible" });
	invariant(await trace.locator("[data-evidence-id]").count() > 0, "/: open evidence trace has no evidence IDs");
	await recordState({ page, route, state: "trace-shown", selector: "[data-evidence-trace]", renderedEvidence: keyboardShown, states: result.states, captures: result.captures, onCapture });

	const preview = page.locator("[data-product-record-preview]");
	const previewId = await preview.getAttribute("data-record-id");
	invariant(previewId, "/: product preview record ID is missing");
	const viewIds = ["buyer-question", "current-answer", "comparison-evidence", "reviewed-action", "later-review"];
	const controls = preview.locator("[role='tablist'] button");
	const previewEvidence = [];
	for (let index = 0; index < viewIds.length; index += 1) {
		const evidence = await controlStateParity({
			page,
			route,
			state: `record-${viewIds[index]}`,
			stateSelector: "[data-product-record-preview]",
			stateValue: { attribute: "data-v1-state", value: viewIds[index] },
			control: controls.nth(index),
			resetControl: controls.nth((index + 1) % viewIds.length),
			sceneSelector: `[data-record-view='${viewIds[index]}'][data-active-record-view='true']`,
			stableId: () => preview.getAttribute("data-record-id"),
			index,
			primaryModality: input,
			motion: options.motion,
		});
		invariant(evidence.stableId === previewId, "/: product preview record ID changed");
		const active = preview.locator(`[data-record-view='${viewIds[index]}'][data-active-record-view='true']`);
		invariant(await active.count() === 1, `/: preview ${viewIds[index]} is not uniquely active`);
		previewEvidence.push({ state: `record-${viewIds[index]}`, stableId: evidence.stableId, rendered: evidence.rendered });
		await recordState({ page, route, state: `record-${viewIds[index]}`, selector: "[data-product-record-preview]", sceneSelector: `[data-record-view='${viewIds[index]}'][data-active-record-view='true']`, renderedEvidence: evidence, states: result.states, captures: result.captures, onCapture });
	}
	assertDistinctRenderedStates("/ product preview", previewEvidence);
}

async function exerciseProduct(options, result) {
	const { page, route, input, baseUrl, onCapture } = options;
	const viewIds = ["buyer-questions", "current-answers", "sources-gaps", "actions-under-review", "outcome-review"];
	const controls = page.locator(`${route.rootSelector} [role='tablist'] button`);
	const root = page.locator(route.rootSelector);
	const recordId = await root.getAttribute("data-record-id");
	invariant(recordId, "/product: record ID is missing");
	const stateEvidence = [];
	for (let index = 0; index < viewIds.length; index += 1) {
		const evidence = await controlStateParity({
			page,
			route,
			state: viewIds[index],
			stateSelector: route.rootSelector,
			stateValue: { attribute: "data-v1-state", value: viewIds[index] },
			control: controls.nth(index),
			resetControl: controls.nth((index + 1) % viewIds.length),
			sceneSelector: `[data-workspace-view='${viewIds[index]}']:not([hidden])`,
			stableId: () => root.getAttribute("data-record-id"),
			index,
			primaryModality: input,
			motion: options.motion,
		});
		invariant(evidence.stableId === recordId, "/product: record ID changed");
		const active = root.locator(`[data-workspace-view='${viewIds[index]}']:not([hidden])`);
		invariant(await active.count() === 1, `/product: ${viewIds[index]} is not uniquely active`);
		stateEvidence.push({ state: viewIds[index], stableId: evidence.stableId, rendered: evidence.rendered });
		await recordState({ page, route, state: viewIds[index], sceneSelector: `[data-workspace-view='${viewIds[index]}']:not([hidden])`, renderedEvidence: evidence, states: result.states, captures: result.captures, onCapture });
	}
	assertDistinctRenderedStates("/product", stateEvidence);
	for (const [id, state] of [["how-it-works", "anchor-how-it-works"], ["markets-languages", "anchor-markets-languages"]]) {
		await openRoute(page, baseUrl, `/product#${id}`);
		invariant(new URL(page.url()).hash === `#${id}`, `/product: ${id} hash was not preserved`);
		invariant(await page.locator(`#${id}`).getAttribute("data-record-id"), `/product: ${id} stable record ID is missing`);
		const rendered = await motionEvidence(page, route.path, state, options.motion, `#${id}`);
		await recordState({ page, route, state, selector: `#${id}`, renderedEvidence: rendered, states: result.states, captures: result.captures, onCapture });
	}
}

async function exerciseCasework(options, result) {
	const { page, route, input, onCapture } = options;
	const root = page.locator(route.rootSelector);
	const recordId = await root.getAttribute("data-record-id");
	invariant(recordId, "/casework: record ID is missing");
	const controls = root.locator("[data-casework-select-step]");
	const stateEvidence = [];
	for (let index = 0; index < 8; index += 1) {
		const state = `step-${index + 1}`;
		const evidence = await controlStateParity({
			page,
			route,
			state,
			stateSelector: route.rootSelector,
			stateValue: { attribute: "data-v1-state", value: state },
			control: controls.nth(index),
			resetControl: controls.nth((index + 1) % 8),
			sceneSelector: "[data-casework-step]:not([hidden])",
			stableId: () => root.getAttribute("data-record-id"),
			index,
			primaryModality: input,
			motion: options.motion,
		});
		invariant(evidence.stableId === recordId, "/casework: record ID changed");
		invariant(await root.locator("[data-casework-step]:not([hidden])").count() === 1, `/casework: step ${index + 1} is not unique`);
		stateEvidence.push({ state, stableId: evidence.stableId, rendered: evidence.rendered });
		await recordState({ page, route, state, sceneSelector: "[data-casework-step]:not([hidden])", renderedEvidence: evidence, states: result.states, captures: result.captures, onCapture });
	}
	assertDistinctRenderedStates("/casework", stateEvidence);
}

async function exerciseCompany(options, result) {
	const { page, route, input, onCapture } = options;
	const root = page.locator(route.rootSelector);
	const controls = root.locator("[data-company-select-principle]");
	const stateEvidence = [];
	for (let index = 0; index < route.states.length; index += 1) {
		const state = route.states[index];
		const evidence = await controlStateParity({
			page,
			route,
			state,
			stateSelector: route.rootSelector,
			stateValue: { attribute: "data-active-principle", value: state },
			control: controls.nth(index),
			resetControl: controls.nth((index + 1) % route.states.length),
			sceneSelector: ["[data-company-principle]:not([hidden])", "[data-company-aperture-mask]", "[data-company-aperture-light]"],
			stableId: async () => (await root.locator("[data-company-principle]:not([hidden]) code").textContent())?.trim(),
			index,
			primaryModality: input,
			motion: options.motion,
		});
		invariant(await root.locator("[data-company-principle]:not([hidden])").count() === 1, `/company: ${route.states[index]} is not unique`);
		stateEvidence.push({ state, stableId: evidence.stableId, rendered: evidence.rendered });
		await recordState({ page, route, state, sceneSelector: ["[data-company-principle]:not([hidden])", "[data-company-aperture-mask]", "[data-company-aperture-light]"], renderedEvidence: evidence, states: result.states, captures: result.captures, onCapture });
	}
	assertDistinctRenderedStates("/company", stateEvidence);
}

async function exerciseHumanAgent(options, result) {
	const { page, route, input, onCapture } = options;
	const root = page.locator(route.rootSelector);
	const factId = await root.getAttribute("data-fact-id");
	invariant(factId, "/human-agent: fact ID is missing");
	const stateEvidence = [];
	for (let index = 0; index < 3; index += 1) {
		const layer = route.states[index];
		const evidence = await controlStateParity({
			page,
			route,
			state: layer,
			stateSelector: route.rootSelector,
			stateValue: { attribute: "data-v1-state", value: layer },
			control: root.locator(`[data-lens-select-layer='${layer}']`),
			resetControl: root.locator(`[data-lens-select-layer='${route.states[(index + 1) % 3]}']`),
			sceneSelector: `[data-human-agent-projection='${layer}'][data-active='true']`,
			stableId: () => root.getAttribute("data-fact-id"),
			index,
			primaryModality: input,
			motion: options.motion,
		});
		invariant(evidence.stableId === factId, "/human-agent: fact ID changed");
		invariant(await root.locator(`[data-human-agent-projection='${layer}'][data-active='true']`).count() === 1, `/human-agent: ${layer} is not active`);
		const ownerAttachments = evidence.rendered.flatMap((scene) => scene.ownerAttachments ?? []);
		const activePath = ownerAttachments.find((attachment) => {
			const [tagName, attributes] = attachment.semantic;
			const values = Object.fromEntries(attributes);
			const visualStyles = Object.fromEntries(RENDERED_STYLE_PROPERTIES.map((property, propertyIndex) => [property, attachment.styles[propertyIndex]]));
			return tagName === "path"
				&& values.d
				&& values["data-active"] === "true"
				&& visualStyles.stroke
				&& visualStyles.stroke !== "none"
				&& Number.parseFloat(visualStyles.strokeWidth) > 0;
		});
		invariant(activePath, `/human-agent: ${layer} active aria-hidden SVG attachment is missing from rendered evidence`);
		stateEvidence.push({ state: layer, stableId: evidence.stableId, rendered: evidence.rendered });
		await recordState({ page, route, state: layer, sceneSelector: `[data-human-agent-projection='${layer}'][data-active='true']`, renderedEvidence: evidence, states: result.states, captures: result.captures, onCapture });
	}
	assertDistinctRenderedStates("/human-agent", stateEvidence);
	const agentLink = page.locator("[data-human-agent-projection='agent'] a[href^='/agent#']");
	invariant(await agentLink.count() === 1, "/human-agent: agent record bridge is missing");
	invariant((await agentLink.getAttribute("href"))?.endsWith(`#${factId}`), "/human-agent: agent bridge lost the stable fact ID");
	await page.keyboard.press("Tab");
	await agentLink.focus();
	await inspectControlFocus(agentLink, route.path, "bridge-agent");
	const agentRendered = await motionEvidence(page, route.path, "bridge-agent", options.motion, "[data-human-agent-projection='agent']");
	await recordState({ page, route, state: "bridge-agent", selector: "[data-human-agent-projection='agent']", renderedEvidence: agentRendered, states: result.states, captures: result.captures, onCapture });
	const contactLink = page.locator("[data-human-agent-actions] a[href='/contact']");
	invariant(await contactLink.count() === 1, "/human-agent: human contact bridge is missing");
	await page.keyboard.press("Tab");
	await contactLink.focus();
	await inspectControlFocus(contactLink, route.path, "bridge-human");
	const humanRendered = await motionEvidence(page, route.path, "bridge-human", options.motion, "[data-human-agent-actions]");
	await recordState({ page, route, state: "bridge-human", selector: "[data-human-agent-actions]", renderedEvidence: humanRendered, states: result.states, captures: result.captures, onCapture });
}

async function exerciseContact(options, result, audit) {
	const { page, route, input, baseUrl, onCapture } = options;
	const stableSubmissionId = "0198ef3d-34e1-7f14-a74d-e09b66d14b11";
	await page.addInitScript((id) => {
		Object.defineProperty(globalThis.crypto, "randomUUID", { configurable: true, value: () => id });
	}, stableSubmissionId);
	const stub = await installContactStub(page);
	await openRoute(page, baseUrl, route.path);
	const idleRendered = await motionEvidence(page, route.path, "idle", options.motion, route.rootSelector);
	await recordState({ page, route, state: "idle", renderedEvidence: idleRendered, states: result.states, captures: result.captures, onCapture });

	const modalities = requiredManualModalities({ width: input === "touch" ? 390 : 1280 });
	async function openFreshContact() {
		await openRoute(page, baseUrl, route.path);
		await page.locator(`${route.rootSelector}[data-enhanced='true'][data-v1-state='idle']`).waitFor();
		const highIntent = page.locator("[data-contact-high-intent]");
		invariant(!await highIntent.evaluate((node) => node.open), "/contact: fresh high-intent details did not reset closed");
	}
	async function verifyState({ state, outcome, prepare, control, sceneSelector = route.rootSelector, assertState }) {
		const parity = [];
		for (const modality of modalities) {
			await openFreshContact();
			if (outcome) stub.setOutcome(outcome);
			if (prepare) await prepare();
			const requestOffset = stub.requests.length;
			const target = control();
			if (state === "focused" && modality === "keyboard") {
				await page.keyboard.press("Tab");
				await target.focus();
				await inspectControlFocus(target, route.path, state);
			} else {
				await activateControl(target, modality, 0, route.path, state);
			}
			await page.locator(`${route.rootSelector}[data-v1-state='${state}']`).waitFor();
			if (assertState) await assertState(requestOffset);
			const rendered = await motionEvidence(page, route.path, state, options.motion, sceneSelector);
			const request = stub.requests.at(-1);
			parity.push({
				modality,
				stableId: outcome ? request?.submissionId : "contact.aperture",
				state: await page.locator(route.rootSelector).getAttribute("data-v1-state"),
				renderedSignature: rendered.renderedSignature,
				rendered,
			});
		}
		assertInteractionParity(route.path, state, parity);
		return parity.at(-1).rendered;
	}

	const focusedRendered = await verifyState({
		state: "focused",
		control: () => page.locator("#contact-work-email"),
	});
	await recordState({ page, route, state: "focused", renderedEvidence: focusedRendered, states: result.states, captures: result.captures, onCapture });

	const expandedRendered = await verifyState({
		state: "expanded",
		control: () => page.locator("[data-contact-high-intent] summary"),
		sceneSelector: "[data-contact-high-intent]",
		assertState: async () => {
			invariant(await page.locator("[data-contact-high-intent]").evaluate((node) => node.open), "/contact: expanded state did not open high-intent details");
		},
	});
	await recordState({ page, route, state: "expanded", sceneSelector: "[data-contact-high-intent]", renderedEvidence: expandedRendered, states: result.states, captures: result.captures, onCapture });

	const invalidRendered = await verifyState({
		state: "invalid",
		control: () => page.locator("[data-contact-aperture] button[type='submit']"),
		assertState: async (requestOffset) => {
			invariant(stub.requests.length === requestOffset, "/contact: client-invalid form reached the endpoint");
			invariant(await page.evaluate(() => document.activeElement?.id) === "contact-work-email", "/contact: invalid state did not focus workEmail");
		},
	});
	await recordState({ page, route, state: "invalid", renderedEvidence: invalidRendered, states: result.states, captures: result.captures, onCapture });

	const retainedEmail = "matrix.contact@company.example";
	const retainedCuriosity = "Verify the intercepted English production matrix.";
	const prepareValid = async () => {
		await page.locator("#contact-work-email").fill(retainedEmail);
		await page.locator("#contact-curiosity").fill(retainedCuriosity);
	};
	audit.allowedContactStatuses.add(503);
	const unconfirmedRendered = await verifyState({
		state: "unconfirmed",
		outcome: "unconfirmed",
		prepare: prepareValid,
		control: () => page.locator("[data-contact-aperture] button[type='submit']"),
		assertState: async (requestOffset) => {
			invariant(stub.requests.length === requestOffset + 1, "/contact: unconfirmed submission was not intercepted exactly once");
			invariant(await page.locator("#contact-work-email").inputValue() === retainedEmail, "/contact: unconfirmed state lost workEmail");
			invariant(await page.locator("#contact-curiosity").inputValue() === retainedCuriosity, "/contact: unconfirmed state lost curiosity");
			invariant(await page.evaluate(() => document.activeElement?.getAttribute("data-contact-status")) === "unconfirmed", "/contact: unconfirmed status did not receive focus");
		},
	});
	await recordState({ page, route, state: "unconfirmed", renderedEvidence: unconfirmedRendered, states: result.states, captures: result.captures, onCapture });

	const confirmedRendered = await verifyState({
		state: "confirmed",
		outcome: "confirmed",
		prepare: prepareValid,
		control: () => page.locator("[data-contact-aperture] button[type='submit']"),
		assertState: async (requestOffset) => {
			invariant(stub.requests.length === requestOffset + 1, "/contact: confirmed submission was not intercepted exactly once");
			invariant(await page.evaluate(() => document.activeElement?.getAttribute("data-contact-status")) === "confirmed", "/contact: confirmed status did not receive focus");
		},
	});
	const validRequests = stub.requests.filter(({ payload }) => payload.workEmail === retainedEmail);
	const expectedValidRequests = modalities.length * 2;
	invariant(validRequests.length === expectedValidRequests, `/contact: expected ${expectedValidRequests} parity submissions, got ${validRequests.length}`);
	invariant(validRequests.every(({ submissionId }) => submissionId === stableSubmissionId), "/contact: modality parity did not preserve the stable submission ID");
	invariant(validRequests.every(({ payload }) => JSON.stringify(payload) === JSON.stringify(validRequests[0].payload)), "/contact: modality parity changed the submission payload");
	await recordState({ page, route, state: "confirmed", sceneSelector: "[data-contact-status='confirmed']", renderedEvidence: confirmedRendered, states: result.states, captures: result.captures, onCapture });

	await openRoute(page, baseUrl, "/contact?intent=privacy");
	invariant(await page.locator("input[name='requestType']").getAttribute("value") === "privacy", "/contact?intent=privacy: requestType is not privacy");
	invariant(await page.locator(".site-v1-contact-form__privacy-boundary").isVisible(), "/contact?intent=privacy: manual-review boundary is missing");
	const privacyRendered = await motionEvidence(page, route.path, "privacy-intent", options.motion, route.rootSelector);
	await recordState({ page, route, state: "privacy-intent", renderedEvidence: privacyRendered, states: result.states, captures: result.captures, onCapture });
}

async function exercisePrivacy(options, result) {
	const { page, route, onCapture } = options;
	const sections = await page.locator("[data-privacy-section]").evaluateAll((nodes) => nodes.map((node) => node.getAttribute("data-privacy-section")));
	invariant(JSON.stringify(sections) === JSON.stringify(["submitted", "delivered", "used", "retention"]), "/privacy: editorial sections are incomplete or out of order");
	const editorialRendered = await motionEvidence(page, route.path, "editorial", options.motion, "[data-privacy-composition]");
	await recordState({ page, route, state: "editorial", renderedEvidence: editorialRendered, states: result.states, captures: result.captures, onCapture });
	const cta = page.locator("[data-privacy-composition] a[href='/contact?intent=privacy']");
	invariant(await cta.count() === 1, "/privacy: typed privacy-intent CTA is missing");
	await page.keyboard.press("Tab");
	await cta.focus();
	await inspectControlFocus(cta, route.path, "contact-cta");
	const ctaRendered = await motionEvidence(page, route.path, "contact-cta", options.motion, "[data-privacy-composition] a[href='/contact?intent=privacy']");
	await recordState({ page, route, state: "contact-cta", selector: "[data-privacy-composition] a[href='/contact?intent=privacy']", renderedEvidence: ctaRendered, states: result.states, captures: result.captures, onCapture });
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
			applyDocumentAudit(result, route, viewport, documentCheck);
			result.failures.push(...await inspectKeyboardFocus(page, route.path));
			if (route.path === "/") await exerciseHome(options, result);
			else if (route.path === "/product") await exerciseProduct(options, result);
			else if (route.path === "/casework") await exerciseCasework(options, result);
			else if (route.path === "/company") await exerciseCompany(options, result);
			else if (route.path === "/human-agent") await exerciseHumanAgent(options, result);
			else if (route.path === "/privacy") await exercisePrivacy(options, result);
		}
		if (route.path === "/contact") {
			const documentCheck = await inspectDocument(page, route);
			applyDocumentAudit(result, route, viewport, documentCheck);
			result.failures.push(...await inspectKeyboardFocus(page, route.path));
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

async function submitNativeContact(page, values, token, outcome) {
	await page.setExtraHTTPHeaders({
		[CONTACT_E2E_TOKEN_HEADER]: token,
		[CONTACT_E2E_OUTCOME_HEADER]: outcome,
	});
	for (const [name, value] of Object.entries(values)) await page.locator(`[name='${name}']`).fill(value);
	const [response] = await Promise.all([
		page.waitForNavigation({ waitUntil: "domcontentloaded" }),
		page.locator("form[action='/api/contact'] button[type='submit']").click(),
	]);
	await page.locator("[data-contact-aperture]").waitFor({ state: "attached" });
	await page.waitForTimeout(40);
	const responseHeaders = response ? await response.allHeaders() : {};
	invariant(responseHeaders[CONTACT_E2E_TRANSPORT_HEADER.toLowerCase()] === "fake", "/contact no-JS: response did not use the authorized fake transport");
	return response;
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
			const token = resolveContactE2EToken();
			const wrongToken = `${token.slice(0, -1)}${token.endsWith("a") ? "b" : "a"}`;
			const negative = await page.request.post(routeUrl(baseUrl, "/api/contact"), {
				headers: {
					Origin: new URL(baseUrl).origin,
					"Sec-Fetch-Site": "same-origin",
					[CONTACT_E2E_TOKEN_HEADER]: wrongToken,
					[CONTACT_E2E_OUTCOME_HEADER]: "confirmed",
				},
				form: { locale: "en", requestType: "conversation", submissionId: "0198ef3d-34e1-7f14-a74d-e09b66d14b11", workEmail: "must-not-deliver@company.example", botField: "" },
			});
			invariant(negative.status() === 403, `/contact no-JS: mismatched E2E token returned ${negative.status()} instead of failing closed`);
			invariant(negative.headers()[CONTACT_E2E_TRANSPORT_HEADER.toLowerCase()] === undefined, "/contact no-JS: rejected token reached fake delivery");

			const invalidResponse = await submitNativeContact(page, { curiosity: "Retain native invalid values" }, token, "unconfirmed");
			invariant(invalidResponse?.status() === 422, `/contact no-JS invalid: expected 422, got ${invalidResponse?.status()}`);
			invariant(new URL(page.url()).pathname === "/api/contact", "/contact no-JS invalid: response did not remain on native endpoint");
			invariant(await page.locator("[data-contact-aperture][data-v1-state='invalid']").count() === 1, "/contact no-JS: invalid aperture state is missing");
			invariant(await page.locator("#contact-work-email").getAttribute("aria-invalid") === "true", "/contact no-JS: workEmail is not marked invalid");
			invariant(await page.locator("#contact-curiosity").inputValue() === "Retain native invalid values", "/contact no-JS: invalid response lost values");
			invariant(await page.locator("#contact-work-email").getAttribute("autofocus") !== null, "/contact no-JS: rejected field is not the focus target");
			await recordState({ page, route, state: "invalid-retained", states: result.states, captures: result.captures, onCapture, settle: false });
			const invalidDocument = await inspectDocument(page, route);
			applyDocumentAudit(result, route, viewport, invalidDocument);
			const unconfirmedResponse = await submitNativeContact(page, { workEmail: "matrix.native@company.example", curiosity: "Retain native unconfirmed values" }, token, "unconfirmed");
			invariant(unconfirmedResponse?.status() === 503, `/contact no-JS unconfirmed: expected 503, got ${unconfirmedResponse?.status()}`);
			invariant(await page.locator("[data-contact-status='unconfirmed'][autofocus]").count() === 1, "/contact no-JS: unconfirmed focus target is missing");
			invariant(await page.locator("#contact-work-email").inputValue() === "matrix.native@company.example", "/contact no-JS: unconfirmed response lost workEmail");
			invariant(await page.locator("#contact-curiosity").inputValue() === "Retain native unconfirmed values", "/contact no-JS: unconfirmed response lost curiosity");
			await recordState({ page, route, state: "unconfirmed-retained", states: result.states, captures: result.captures, onCapture, settle: false });
			const unconfirmedDocument = await inspectDocument(page, route);
			applyDocumentAudit(result, route, viewport, unconfirmedDocument);
			const confirmedResponse = await submitNativeContact(page, {}, token, "confirmed");
			invariant(confirmedResponse?.status() === 202, `/contact no-JS confirmed: expected 202, got ${confirmedResponse?.status()}`);
			invariant(await page.locator("[data-contact-status='confirmed'][autofocus]").count() === 1, "/contact no-JS: confirmed focus target is missing");
			await recordState({ page, route, state: "confirmed", states: result.states, captures: result.captures, onCapture, settle: false });
		} else if (route.path === "/privacy") {
			const sections = await page.locator("[data-privacy-section]").evaluateAll((nodes) => nodes.map((node) => node.getAttribute("data-privacy-section")));
			invariant(JSON.stringify(sections) === JSON.stringify(["submitted", "delivered", "used", "retention"]), "/privacy no-JS: editorial copy is incomplete or out of order");
			await recordState({ page, route, state: "editorial", states: result.states, captures: result.captures, onCapture, settle: false });
			invariant(await page.locator("a[href='/contact?intent=privacy']").count() === 1, "/privacy no-JS: typed CTA is missing");
			await recordState({ page, route, state: "contact-cta", selector: "a[href='/contact?intent=privacy']", states: result.states, captures: result.captures, onCapture, settle: false });
		}
		const documentCheck = await inspectDocument(page, route);
		applyDocumentAudit(result, route, viewport, documentCheck);
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
	const contactE2EToken = resolveContactE2EToken();
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
				extraHTTPHeaders: { [CONTACT_E2E_TOKEN_HEADER]: contactE2EToken },
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
