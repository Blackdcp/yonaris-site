import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const outputDir = path.resolve(
	process.argv[2] ?? ".superpowers/sdd/2026-08-30-yonaris-site-1-0-production/visual-task-7/final",
);
const baseUrl = process.env.SITE_PROBE_URL ?? "http://127.0.0.1:3000";
const expectedFactId = "yonaris.category.ai-native-martech";
const expectedAgentHref = `/agent#${expectedFactId}`;
const expectedStates = {
	human: {
		geometry: "answer-orbit-expanded",
		depth: "outer-forward",
		mask: "answer-wide",
		density: "narrative",
	},
	evidence: {
		geometry: "evidence-orbit-offset",
		depth: "middle-forward",
		mask: "evidence-cross-section",
		density: "contextual",
	},
	agent: {
		geometry: "record-core-compressed",
		depth: "inner-forward",
		mask: "record-core",
		density: "structured",
	},
};
const viewports = [
	{ name: "desktop", width: 1440, height: 1000, hasTouch: false },
	{ name: "mobile", width: 390, height: 844, hasTouch: true },
];

await mkdir(outputDir, { recursive: true });
const executablePath = [
	process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
	chromium.executablePath(),
	"C:/Program Files/Google/Chrome/Application/chrome.exe",
	"C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
].find((candidate) => candidate && existsSync(candidate));
const browser = await chromium.launch({ ...(executablePath ? { executablePath } : {}), headless: true, timeout: 15_000 });
const results = [];

function collectFailures(metrics, expectedState) {
	const expected = expectedStates[expectedState];
	const failures = [];
	if (metrics.state !== expectedState) failures.push(`state ${metrics.state}; expected ${expectedState}`);
	if (metrics.geometry !== expected.geometry) failures.push(`geometry ${metrics.geometry}; expected ${expected.geometry}`);
	if (metrics.depth !== expected.depth) failures.push(`depth ${metrics.depth}; expected ${expected.depth}`);
	if (metrics.mask !== expected.mask) failures.push(`mask ${metrics.mask}; expected ${expected.mask}`);
	if (metrics.density !== expected.density) failures.push(`density ${metrics.density}; expected ${expected.density}`);
	if (metrics.activeCount !== 1) failures.push(`active projections ${metrics.activeCount}; expected 1`);
	if (metrics.pressedCount !== 1 || metrics.pressedState !== expectedState) failures.push(`pressed state ${metrics.pressedState}/${metrics.pressedCount}`);
	if (metrics.activeAttachmentStroke !== "2px") failures.push(`active attachment stroke ${metrics.activeAttachmentStroke}`);
	if (!metrics.controlsInside || !metrics.activeInside) failures.push("controls or active projection escape the lens horizontally");
	if (metrics.documentOverflow !== 0) failures.push(`document overflow ${metrics.documentOverflow}`);
	if (metrics.factIds.some((id) => id !== expectedFactId)) failures.push(`fact identity changed: ${metrics.factIds.join(",")}`);
	if (new Set(metrics.attachments).size !== 1) failures.push("canonical fact attachment differs between projections");
	if (metrics.focalMaskImage === "none") failures.push("focal mask is not applied");
	return failures;
}

async function captureInteractive(viewport) {
	const context = await browser.newContext({
		viewport: { width: viewport.width, height: viewport.height },
		hasTouch: viewport.hasTouch,
		reducedMotion: "no-preference",
	});
	const page = await context.newPage();
	const consoleErrors = [];
	const failedRequests = [];
	page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
	page.on("pageerror", (error) => consoleErrors.push(error.message));
	page.on("requestfailed", (request) => failedRequests.push(`${request.method()} ${request.url()} ${request.failure()?.errorText ?? "failed"}`));
	await page.goto(`${baseUrl}/human-agent`, { waitUntil: "networkidle", timeout: 15_000 });

	const metadata = await page.evaluate((factId) => {
		const graph = [...document.querySelectorAll('script[type="application/ld+json"]')].flatMap((script) => {
			try { return JSON.parse(script.textContent || "{}")["@graph"] ?? []; } catch { return []; }
		});
		const webPage = graph.find((node) => node["@type"] === "WebPage");
		const fact = graph.find((node) => node.identifier === factId);
		return {
			title: document.title,
			canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href"),
			webPageId: webPage?.["@id"],
			webPageUrl: webPage?.url,
			factId: fact?.identifier,
			agentAlternate: document.querySelector('link[rel="alternate"][type="text/html"][href*="/agent#"]')?.getAttribute("href"),
		};
	}, expectedFactId);
	const metadataFailures = [];
	if (!metadata.canonical?.endsWith("/human-agent")) metadataFailures.push(`canonical ${metadata.canonical}`);
	if (!metadata.webPageId?.includes("/human-agent#webpage") || !metadata.webPageUrl?.endsWith("/human-agent")) metadataFailures.push(`WebPage ${metadata.webPageId}/${metadata.webPageUrl}`);
	if (metadata.factId !== expectedFactId) metadataFailures.push(`JSON-LD fact ${metadata.factId}`);
	if (!metadata.agentAlternate?.endsWith(expectedAgentHref)) metadataFailures.push(`Agent alternate ${metadata.agentAlternate}`);
	results.push({ viewport: viewport.name, scene: "metadata", metrics: metadata, failures: metadataFailures });

	if (viewport.hasTouch) {
		const first = page.locator('[data-lens-select-layer="human"]');
		await first.focus();
		await page.keyboard.press("ArrowLeft");
		if (await page.locator("[data-human-agent-lens]").getAttribute("data-v1-state") !== "agent") {
			throw new Error("Reverse keyboard traversal did not wrap to Agent");
		}
		await page.keyboard.press("ArrowRight");
	}

	const geometrySignatures = new Set();
	for (const state of Object.keys(expectedStates)) {
		const control = page.locator(`[data-lens-select-layer="${state}"]`);
		if (await control.count() !== 1) throw new Error(`Expected one ${state} control`);
		if (viewport.hasTouch) await control.tap({ timeout: 5_000 });
		else await control.click({ timeout: 5_000 });
		await page.waitForTimeout(450);
		await page.evaluate(() => {
			const root = document.querySelector("[data-human-agent-lens]");
			if (!root) return;
			const top = root.getBoundingClientRect().top + scrollY;
			scrollTo(0, Math.max(0, top - (innerWidth <= 700 ? 72 : 104)));
		});

		const metrics = await page.evaluate(({ state, factId, expectedAgentHref }) => {
			const root = document.querySelector("[data-human-agent-lens]");
			const active = root?.querySelector(`[data-human-agent-projection="${state}"][data-active="true"]`);
			const controls = [...(root?.querySelectorAll("[data-lens-ring-control]") ?? [])];
			const attachments = [...(root?.querySelectorAll("[data-fact-attachment]") ?? [])];
			const box = (element) => element?.getBoundingClientRect().toJSON() ?? null;
			const insideHorizontally = (outer, inner) => Boolean(outer && inner && inner.left >= outer.left - 1 && inner.right <= outer.right + 1);
			const rootBox = box(root);
			const activeBox = box(active);
			const activeAttachment = root?.querySelector(`[data-lens-attachment="${state}"]`);
			const optics = root?.querySelector("[data-lens-optics]");
			const pressed = controls.filter((control) => control.getAttribute("aria-pressed") === "true");
			return {
				state: root?.getAttribute("data-v1-state"),
				geometry: root?.getAttribute("data-lens-geometry"),
				depth: root?.getAttribute("data-lens-depth"),
				mask: root?.getAttribute("data-lens-focal-mask"),
				density: root?.getAttribute("data-lens-density"),
				motion: root?.getAttribute("data-motion-preference"),
				activeCount: root?.querySelectorAll('[data-human-agent-projection][data-active="true"]').length ?? 0,
				pressedCount: pressed.length,
				pressedState: pressed[0]?.getAttribute("data-lens-select-layer"),
				root: rootBox,
				optics: box(optics),
				activeProjection: activeBox,
				controlsInside: controls.every((control) => insideHorizontally(rootBox, box(control))),
				activeInside: insideHorizontally(rootBox, activeBox),
				documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
				factIds: [...(root?.querySelectorAll("[data-fact-id]") ?? [])].map((node) => node.getAttribute("data-fact-id")),
				attachments: attachments.map((item) => item.textContent?.replace(/\s+/g, " ").trim()),
				attachmentIds: attachments.map((item) => item.getAttribute("data-fact-attachment")),
				activeAttachmentStroke: activeAttachment ? getComputedStyle(activeAttachment).strokeWidth : null,
				focalMaskImage: getComputedStyle(root?.querySelector(".site-v1-evidence-lens__focal-mask")).maskImage,
				ringTransforms: [...(root?.querySelectorAll("[data-lens-ring]") ?? [])]
					.filter((item) => item.classList.contains("site-v1-evidence-lens__ring"))
					.map((item) => getComputedStyle(item).transform),
				focalPosition: optics ? [getComputedStyle(optics).getPropertyValue("--lens-focal-x"), getComputedStyle(optics).getPropertyValue("--lens-focal-y")] : [],
				agentHref: root?.querySelector('a[href*="/agent#"]')?.getAttribute("href"),
				expectedAgentHref,
				factId,
			};
		}, { state, factId: expectedFactId, expectedAgentHref });
		geometrySignatures.add(JSON.stringify([metrics.ringTransforms, metrics.focalPosition]));
		const failures = collectFailures(metrics, state);
		if (!metrics.factIds.length || metrics.attachmentIds.some((id) => id !== expectedFactId)) failures.push("canonical fact ID is missing from the lens");
		if (state === "agent" && metrics.agentHref !== expectedAgentHref) failures.push(`Agent link ${metrics.agentHref}`);
		results.push({ viewport: viewport.name, scene: state, metrics, failures });
		await page.screenshot({
			path: path.join(outputDir, `${viewport.name}-${state}.png`),
			animations: "disabled",
			fullPage: false,
		});
	}
	if (geometrySignatures.size !== 3) {
		results.push({ viewport: viewport.name, scene: "geometry-uniqueness", failures: [`unique ring/focal geometries ${geometrySignatures.size}/3`] });
	}
	results.push({ viewport: viewport.name, scene: "runtime", metrics: { consoleErrors, failedRequests }, failures: [...consoleErrors, ...failedRequests] });
	await context.close();
}

async function captureReducedMotion(viewport) {
	const context = await browser.newContext({
		viewport: { width: viewport.width, height: viewport.height },
		hasTouch: viewport.hasTouch,
		reducedMotion: "reduce",
	});
	const page = await context.newPage();
	await page.goto(`${baseUrl}/human-agent`, { waitUntil: "networkidle", timeout: 15_000 });
	const control = page.locator('[data-lens-select-layer="evidence"]');
	if (viewport.hasTouch) await control.tap();
	else await control.click();
	await page.evaluate(() => {
		const root = document.querySelector("[data-human-agent-lens]");
		if (!root) return;
		const top = root.getBoundingClientRect().top + scrollY;
		scrollTo(0, Math.max(0, top - (innerWidth <= 700 ? 72 : 104)));
	});
	const metrics = await page.evaluate(() => {
		const root = document.querySelector("[data-human-agent-lens]");
		const ring = root?.querySelector(".site-v1-evidence-lens__ring");
		const particle = root?.querySelector(".site-v1-evidence-lens__particles i");
		return {
			state: root?.getAttribute("data-v1-state"),
			preference: root?.getAttribute("data-motion-preference"),
			matches: matchMedia("(prefers-reduced-motion: reduce)").matches,
			ringTransition: ring ? getComputedStyle(ring).transitionDuration : null,
			particleAnimation: particle ? getComputedStyle(particle).animationName : null,
			documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
		};
	});
	const failures = [];
	if (metrics.state !== "evidence") failures.push(`reduced-motion direct selection state ${metrics.state}`);
	if (metrics.preference !== "reduced" || !metrics.matches) failures.push(`reduced-motion preference ${metrics.preference}/${metrics.matches}`);
	if (metrics.ringTransition !== "0s" || metrics.particleAnimation !== "none") failures.push(`motion remains ${metrics.ringTransition}/${metrics.particleAnimation}`);
	if (metrics.documentOverflow !== 0) failures.push(`document overflow ${metrics.documentOverflow}`);
	results.push({ viewport: viewport.name, scene: "reduced-motion", metrics, failures });
	await page.screenshot({ path: path.join(outputDir, `${viewport.name}-reduced-motion.png`), animations: "disabled", fullPage: false });
	await context.close();
}

async function captureNoJs(viewport) {
	const context = await browser.newContext({
		viewport: { width: viewport.width, height: viewport.height },
		hasTouch: viewport.hasTouch,
		javaScriptEnabled: false,
	});
	const page = await context.newPage();
	await page.goto(`${baseUrl}/human-agent`, { waitUntil: "networkidle", timeout: 15_000 });
	const metrics = await page.evaluate((factId) => {
		const root = document.querySelector("[data-human-agent-lens]");
		const projections = [...(root?.querySelectorAll("[data-human-agent-projection]") ?? [])];
		return {
			enhanced: root?.getAttribute("data-enhanced") ?? null,
			projectionCount: projections.length,
			readableProjectionCount: projections.filter((item) => {
				const style = getComputedStyle(item);
				return style.visibility !== "hidden" && style.display !== "none" && item.textContent?.trim();
			}).length,
			factIds: projections.map((item) => item.getAttribute("data-fact-id")),
			attachmentCount: root?.querySelectorAll(`[data-fact-attachment="${factId}"]`).length ?? 0,
			controlCount: root?.querySelectorAll("[data-lens-ring-control]").length ?? 0,
			documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
		};
	}, expectedFactId);
	const failures = [];
	if (metrics.enhanced !== null) failures.push(`no-JS root was enhanced: ${metrics.enhanced}`);
	if (metrics.projectionCount !== 3 || metrics.readableProjectionCount !== 3) failures.push(`no-JS projections ${metrics.readableProjectionCount}/${metrics.projectionCount}`);
	if (metrics.controlCount !== 3) failures.push(`no-JS controls ${metrics.controlCount}`);
	if (metrics.attachmentCount !== 3 || metrics.factIds.some((id) => id !== expectedFactId)) failures.push("no-JS canonical record is incomplete");
	if (metrics.documentOverflow !== 0) failures.push(`document overflow ${metrics.documentOverflow}`);
	results.push({ viewport: viewport.name, scene: "no-js", metrics, failures });
	await page.screenshot({ path: path.join(outputDir, `${viewport.name}-no-js.png`), animations: "disabled", fullPage: true });
	await context.close();
}

try {
	for (const viewport of viewports) {
		await captureInteractive(viewport);
		await captureReducedMotion(viewport);
		await captureNoJs(viewport);
	}
	const failures = results.flatMap((item) => item.failures ?? []);
	const report = JSON.stringify({ passed: failures.length === 0, failures, results }, null, 2);
	await writeFile(path.join(outputDir, "metrics.json"), `${report}\n`, "utf8");
	console.log(report);
	if (failures.length) process.exitCode = 1;
} finally {
	await browser.close();
}
