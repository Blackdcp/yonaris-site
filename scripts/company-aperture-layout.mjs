import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const outputDir = path.resolve(process.argv[2] ?? ".superpowers/sdd/2026-08-30-yonaris-site-1-0-production/visual-task-6b/company-aperture-layout");
const expectedTitle = "Company — Yonaris";
const expectedDescription = "Why Yonaris builds AI-Native MarTech Infrastructure to show teams what buyers are being told and what to change.";
const expectedPrinciples = ["why", "audience", "markets", "human-judgement", "non-promises"];

await mkdir(outputDir, { recursive: true });
const executablePath = [
	process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
	chromium.executablePath(),
	"C:/Program Files/Google/Chrome/Application/chrome.exe",
	"C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
].find((candidate) => candidate && existsSync(candidate));
const browser = await chromium.launch({ ...(executablePath ? { executablePath } : {}), headless: true, timeout: 15_000 });
const results = [];

try {
	for (const viewport of [
		{ name: "desktop", width: 1440, height: 1000, hasTouch: false },
		{ name: "mobile", width: 390, height: 844, hasTouch: true },
	]) {
		const context = await browser.newContext({
			viewport: { width: viewport.width, height: viewport.height },
			hasTouch: viewport.hasTouch,
			reducedMotion: viewport.name === "mobile" ? "reduce" : "no-preference",
		});
		const page = await context.newPage();
		const consoleErrors = [];
		const failedRequests = [];
		page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
		page.on("pageerror", (error) => consoleErrors.push(error.message));
		page.on("requestfailed", (request) => failedRequests.push(`${request.method()} ${request.url()} ${request.failure()?.errorText ?? "failed"}`));
		await page.goto("http://127.0.0.1:3000/company", { waitUntil: "networkidle", timeout: 15_000 });

		const firstViewport = await page.evaluate(() => {
			const box = (selector) => document.querySelector(selector)?.getBoundingClientRect().toJSON() ?? null;
			const intersectsViewport = (rect) => Boolean(rect && rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth);
			const image = document.querySelector("[data-company-aperture] img");
			return {
				headline: box("[data-company-aperture] h1"),
				body: box(".site-v1-company-aperture__hero > p:last-child"),
				headlineVisible: intersectsViewport(box("[data-company-aperture] h1")),
				bodyVisible: intersectsViewport(box(".site-v1-company-aperture__hero > p:last-child")),
				documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
				imageLoaded: Boolean(image?.complete && image.naturalWidth > 0),
			};
		});
		const firstFailures = [];
		if (!firstViewport.headlineVisible || !firstViewport.bodyVisible) firstFailures.push("headline/body are not meaningful in the first viewport");
		if (!firstViewport.imageLoaded) firstFailures.push("Company image did not load");
		if (firstViewport.documentOverflow !== 0) firstFailures.push(`first viewport overflow ${firstViewport.documentOverflow}`);
		results.push({ viewport: viewport.name, scene: "first-viewport", metrics: firstViewport, failures: firstFailures });
		await page.screenshot({ path: path.join(outputDir, `${viewport.name}-first-viewport.png`), animations: "disabled" });

		const metadata = await page.evaluate(() => {
			const graph = [...document.querySelectorAll('script[type="application/ld+json"]')].flatMap((script) => {
				try { return JSON.parse(script.textContent || "{}")["@graph"] ?? []; } catch { return []; }
			});
			const webPage = graph.find((node) => node["@type"] === "WebPage");
			return {
				title: document.title,
				description: document.querySelector('meta[name="description"]')?.getAttribute("content"),
				jsonLdName: webPage?.name,
				jsonLdDescription: webPage?.description,
			};
		});
		if (metadata.title !== expectedTitle || metadata.description !== expectedDescription || metadata.jsonLdName !== expectedTitle || metadata.jsonLdDescription !== expectedDescription) {
			throw new Error(`Metadata mismatch: ${JSON.stringify(metadata)}`);
		}

		if (viewport.hasTouch) {
			const first = page.locator('[data-company-select-principle="0"]');
			await first.focus();
			await page.keyboard.press("ArrowRight");
			if (await page.locator("[data-company-aperture]").getAttribute("data-active-principle") !== "audience") throw new Error("ArrowRight did not advance Company principle");
			await page.keyboard.press("ArrowLeft");
			if (await page.locator("[data-company-aperture]").getAttribute("data-active-principle") !== "why") throw new Error("ArrowLeft did not reverse Company principle");
			await page.keyboard.press("End");
			if (await page.locator("[data-company-aperture]").getAttribute("data-active-principle") !== "non-promises") throw new Error("End did not expose final Company principle");
			await page.keyboard.press("Home");
		}

		const geometries = new Set();
		for (let index = 0; index < expectedPrinciples.length; index += 1) {
			const control = page.locator(`[data-company-select-principle="${index}"]`);
			if (viewport.hasTouch) await control.tap({ timeout: 5_000 });
			else await control.click({ timeout: 5_000 });
			const metrics = await page.evaluate(({ index, expected }) => {
				const box = (element) => element ? element.getBoundingClientRect().toJSON() : null;
				const insideHorizontally = (outer, inner) => Boolean(outer && inner && inner.left >= outer.left - 1 && inner.right <= outer.right + 1);
				const root = document.querySelector("[data-company-aperture]");
				const mask = root?.querySelector("[data-company-aperture-mask]");
				const light = root?.querySelector("[data-company-aperture-light]");
				const panel = root?.querySelector(`[data-company-principle="${index}"]:not([hidden])`);
				const evidence = panel?.querySelector("[data-company-attached-evidence]");
				const boundary = panel?.querySelector("[data-company-attached-boundary]");
				const controls = [...(root?.querySelectorAll("[data-company-select-principle]") ?? [])];
				return {
					active: root?.getAttribute("data-active-principle"),
					activeCount: root?.querySelectorAll("[data-company-principle]:not([hidden])").length,
					pressed: controls.map((item) => item.getAttribute("aria-pressed")),
					geometry: [mask?.style.clipPath, light?.style.left, light?.style.width, light?.style.transform].join("|"),
					evidenceReadable: Boolean(evidence?.textContent?.trim()),
					boundaryReadable: Boolean(boundary?.textContent?.trim()),
					panelInside: insideHorizontally(box(root), box(panel)),
					controlsInside: controls.every((item) => insideHorizontally(box(root), box(item))),
					documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
					motion: matchMedia("(prefers-reduced-motion: reduce)").matches ? "reduced" : "full",
					expected,
				};
			}, { index, expected: expectedPrinciples[index] });
			geometries.add(metrics.geometry);
			const failures = [];
			if (metrics.active !== metrics.expected || metrics.activeCount !== 1) failures.push(`active state ${metrics.active}/${metrics.activeCount}`);
			if (metrics.pressed.filter((value) => value === "true").length !== 1 || metrics.pressed[index] !== "true") failures.push("pressed state does not match selection");
			if (!metrics.evidenceReadable || !metrics.boundaryReadable) failures.push("attached evidence/boundary is unreadable");
			if (!metrics.panelInside || !metrics.controlsInside) failures.push("panel or controls escape aperture horizontally");
			if (metrics.documentOverflow !== 0) failures.push(`document overflow ${metrics.documentOverflow}`);
			if (viewport.hasTouch && metrics.motion !== "reduced") failures.push("mobile reduced-motion preference not active");
			results.push({ viewport: viewport.name, principle: index + 1, metrics, failures });
			await page.screenshot({ path: path.join(outputDir, `${viewport.name}-principle-${String(index + 1).padStart(2, "0")}.png`), animations: "disabled" });
		}
		if (geometries.size !== expectedPrinciples.length) results.push({ viewport: viewport.name, failures: [`unique geometries ${geometries.size}/${expectedPrinciples.length}`] });

		results.push({ viewport: viewport.name, metadata, consoleErrors, failedRequests });
		if (consoleErrors.length || failedRequests.length) throw new Error(`Browser errors for ${viewport.name}: ${JSON.stringify({ consoleErrors, failedRequests })}`);
		await context.close();
	}

	const failures = results.flatMap((item) => item.failures ?? []);
	const report = JSON.stringify({ passed: failures.length === 0, failures, results }, null, 2);
	await writeFile(path.join(outputDir, "metrics.json"), `${report}\n`, "utf8");
	console.log(report);
	if (failures.length) process.exitCode = 1;
} finally {
	await browser.close();
}
