import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const outputDir = path.resolve(process.argv[2] ?? ".superpowers/sdd/2026-08-30-yonaris-site-1-0-production/visual-task-6a/casework-timeline-layout");
const expectedRecordId = "yonaris.buyer-question.global-en.enterprise-analytics-markets.v1";
const expectedTitle = "Yonaris Casework — One question worked through";
const expectedDescription = "Follow a representative buyer question from its first answer to evidence, reviewed action, later review and remaining limits.";
const expectedDisclosure = "Representative casework — not a customer performance claim.";

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
		await page.goto("http://127.0.0.1:3000/casework", { waitUntil: "networkidle", timeout: 15_000 });
		const firstViewport = await page.evaluate(() => {
			const box = (selector) => document.querySelector(selector)?.getBoundingClientRect().toJSON() ?? null;
			const visibleInViewport = (rect) => Boolean(rect && rect.top >= -1 && rect.left >= -1 && rect.right <= innerWidth + 1 && rect.bottom <= innerHeight + 1);
			const overlaps = (first, second) => Boolean(first && second && first.left < second.right - 1 && first.right > second.left + 1 && first.top < second.bottom - 1 && first.bottom > second.top + 1);
			const situation = box("[data-casework-first-viewport] .site-v1-casework-hero__situation");
			const question = box("[data-casework-first-viewport] blockquote");
			const recordId = box("[data-casework-first-viewport] blockquote code");
			const disclosure = box("[data-casework-first-viewport] > .site-v1-representative-disclosure");
			return {
				situation,
				question,
				recordId,
				disclosure,
				allVisible: [situation, question, disclosure].every(visibleInViewport),
				recordDisclosureOverlap: overlaps(recordId, disclosure),
				documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
			};
		});
		const firstViewportFailures = [];
		if (!firstViewport.allVisible) firstViewportFailures.push("situation, question and disclosure do not all fit the first viewport");
		if (firstViewport.recordDisclosureOverlap) firstViewportFailures.push("record identity overlaps representative disclosure");
		if (firstViewport.documentOverflow !== 0) firstViewportFailures.push(`first viewport document overflow ${firstViewport.documentOverflow}`);
		results.push({ viewport: viewport.name, scene: "first-viewport", metrics: firstViewport, failures: firstViewportFailures });
		await page.locator("[data-casework-first-viewport]").screenshot({ path: path.join(outputDir, `${viewport.name}-first-viewport.png`), animations: "disabled", timeout: 10_000 });
		await page.locator("[data-casework-walkthrough]").scrollIntoViewIfNeeded();

		const metadata = await page.evaluate(() => {
			const scripts = [...document.querySelectorAll('script[type="application/ld+json"]')];
			const graph = scripts.flatMap((script) => {
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
			const firstControl = page.locator('[data-casework-select-step="0"]');
			await firstControl.focus();
			for (let index = 1; index < 8; index += 1) {
				await page.keyboard.press("ArrowRight");
				const active = await page.locator("[data-casework-step]:not([hidden])").getAttribute("data-casework-step");
				if (active !== String(index)) throw new Error(`Mobile keyboard stopped at ${active}; expected ${index}`);
			}
			await page.keyboard.press("Home");
		}

		for (let index = 0; index < 8; index += 1) {
			const control = page.locator(`[data-casework-select-step="${index}"]`);
			if (viewport.hasTouch) await control.tap({ timeout: 5_000 });
			else await control.click({ timeout: 5_000 });
			const metrics = await page.evaluate(({ index, expectedRecordId, expectedDisclosure }) => {
				const box = (element) => element ? element.getBoundingClientRect().toJSON() : null;
				const overlaps = (first, second) => Boolean(first && second && first.left < second.right - 1 && first.right > second.left + 1 && first.top < second.bottom - 1 && first.bottom > second.top + 1);
				const insideHorizontally = (outer, inner) => Boolean(outer && inner && inner.left >= outer.left - 1 && inner.right <= outer.right + 1);
				const timeline = document.querySelector("[data-casework-walkthrough]");
				const stage = timeline?.querySelector(".site-v1-casework-timeline__stage");
				const active = stage?.querySelector(`[data-casework-step="${index}"]:not([hidden])`);
				const navigation = timeline?.querySelector(".site-v1-casework-timeline__navigation");
				const disclosure = timeline?.querySelector(":scope > .site-v1-representative-disclosure");
				const directBoxes = [...(active?.children ?? [])].filter((element) => getComputedStyle(element).display !== "none").map((element) => ({ tag: element.tagName, box: box(element) }));
				const collisions = [];
				for (let first = 0; first < directBoxes.length; first += 1) {
					for (let second = first + 1; second < directBoxes.length; second += 1) {
						if (overlaps(directBoxes[first].box, directBoxes[second].box)) collisions.push(`${directBoxes[first].tag}/${directBoxes[second].tag}`);
					}
				}
				const timelineBox = box(timeline);
				const stageBox = box(stage);
				const activeBox = box(active);
				const disclosureBox = box(disclosure);
				const navigationBox = box(navigation);
				const canonicalNodes = [...(active?.querySelectorAll("[data-canonical-id]") ?? [])];
				return {
					activeCount: stage?.querySelectorAll("[data-casework-step]:not([hidden])").length,
					activeIndex: active?.getAttribute("data-casework-step"),
					recordId: active?.getAttribute("data-record-id"),
					canonicalCount: canonicalNodes.length,
					canonicalKinds: [...new Set(canonicalNodes.map((node) => node.getAttribute("data-canonical-kind")))],
					documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
					timelineWidth: [timeline?.clientWidth, timeline?.scrollWidth],
					stageWidth: [stage?.clientWidth, stage?.scrollWidth],
					activeInsideTimeline: insideHorizontally(timelineBox, activeBox),
					activeInsideStage: insideHorizontally(stageBox, activeBox),
					disclosureInsideTimeline: insideHorizontally(timelineBox, disclosureBox),
					disclosureAdjacent: disclosure?.previousElementSibling === navigation,
					disclosureReadable: disclosure?.textContent?.includes(expectedDisclosure),
					disclosureOverlap: overlaps(navigationBox, disclosureBox),
					collisions,
					laterResults: active?.querySelectorAll("[data-review-result]").length ?? 0,
					questionStable: timeline?.querySelector(".site-v1-casework-timeline__axis p")?.textContent === document.querySelector("[data-casework-first-viewport] blockquote p")?.textContent,
					rootRecordStable: timeline?.getAttribute("data-record-id") === expectedRecordId,
				};
			}, { index, expectedRecordId, expectedDisclosure });

			const failures = [];
			if (metrics.activeCount !== 1 || metrics.activeIndex !== String(index)) failures.push(`active state ${metrics.activeCount}/${metrics.activeIndex}`);
			if (metrics.recordId !== expectedRecordId || !metrics.rootRecordStable || !metrics.questionStable) failures.push("canonical question/record axis changed");
			if (metrics.canonicalCount === 0) failures.push("active state has no canonical relationships");
			if (metrics.documentOverflow !== 0) failures.push(`document overflow ${metrics.documentOverflow}`);
			if (metrics.timelineWidth[0] !== metrics.timelineWidth[1]) failures.push(`timeline overflow ${metrics.timelineWidth.join("/")}`);
			if (metrics.stageWidth[0] !== metrics.stageWidth[1]) failures.push(`stage overflow ${metrics.stageWidth.join("/")}`);
			if (!metrics.activeInsideTimeline || !metrics.activeInsideStage) failures.push("active state clipped horizontally");
			if (!metrics.disclosureInsideTimeline || !metrics.disclosureAdjacent || !metrics.disclosureReadable || metrics.disclosureOverlap) failures.push("disclosure not adjacent/readable");
			if (metrics.collisions.length) failures.push(`direct content collision ${metrics.collisions.join(",")}`);
			if (index >= 6 && metrics.laterResults !== 3) failures.push(`later observation results ${metrics.laterResults}`);
			results.push({ viewport: viewport.name, state: index + 1, metrics, failures });
			await page.locator("[data-casework-walkthrough]").screenshot({ path: path.join(outputDir, `${viewport.name}-step-${String(index + 1).padStart(2, "0")}.png`), animations: "disabled", timeout: 10_000 });
		}

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
