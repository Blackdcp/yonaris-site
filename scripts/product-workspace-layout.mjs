import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const outputDir = path.resolve(process.argv[2] ?? ".superpowers/sdd/2026-08-30-yonaris-site-1-0-production/visual-task-5/product-workspace-layout");
const states = [
	["Buyer questions", "buyer-questions"],
	["Current answers", "current-answers"],
	["Sources and gaps", "sources-gaps"],
	["Actions under review", "actions-under-review"],
	["Outcome review", "outcome-review"],
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

try {
	for (const viewport of [{ name: "desktop", width: 1440, height: 1000, hasTouch: false }, { name: "mobile", width: 390, height: 844, hasTouch: true }]) {
		const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, hasTouch: viewport.hasTouch });
		const page = await context.newPage();
		const consoleErrors = [];
		const failedRequests = [];
		page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
		page.on("pageerror", (error) => consoleErrors.push(error.message));
		page.on("requestfailed", (request) => failedRequests.push(`${request.method()} ${request.url()} ${request.failure()?.errorText ?? "failed"}`));
		await page.goto("http://127.0.0.1:3000/product", { waitUntil: "networkidle", timeout: 15_000 });
		await page.locator("#product-theatre").scrollIntoViewIfNeeded();

		const metadata = await page.evaluate(() => {
			const scripts = [...document.querySelectorAll('script[type="application/ld+json"]')];
			const graph = scripts.flatMap((script) => {
				try { return JSON.parse(script.textContent || "{}")["@graph"] ?? []; } catch { return []; }
			});
			const webPage = graph.find((node) => node["@type"] === "WebPage");
			return { title: document.title, description: document.querySelector('meta[name="description"]')?.getAttribute("content"), jsonLdName: webPage?.name, jsonLdDescription: webPage?.description };
		});

		if (metadata.title !== "Yonaris Product — From buyer question to next move" || metadata.description !== "Connect buyer questions, observed answers, evidence, reviewed actions and outcome review in one working record." || metadata.jsonLdName !== metadata.title || metadata.jsonLdDescription !== metadata.description) {
			throw new Error(`Metadata mismatch: ${JSON.stringify(metadata)}`);
		}
		await page.locator("#how-it-works").screenshot({ path: path.join(outputDir, `${viewport.name}-how-it-works.png`), animations: "disabled", timeout: 10_000 });

		if (viewport.hasTouch) {
			await page.getByRole("tab", { name: states[0][0] }).focus();
			for (let index = 0; index < states.length; index += 1) {
				const expected = page.getByRole("tab", { name: states[index][0] });
				if ((await expected.getAttribute("aria-selected")) !== "true") throw new Error(`Mobile keyboard did not reach ${states[index][0]}`);
				if (index < states.length - 1) await page.keyboard.press("ArrowRight");
			}
		}

		for (const [label, slug] of states) {
			const tab = page.getByRole("tab", { name: label });
			if (viewport.hasTouch) await tab.tap({ timeout: 5_000 });
			else await tab.click({ timeout: 5_000 });
			await page.waitForTimeout(80);
			const metrics = await page.evaluate(({ slug }) => {
				const box = (element) => element ? element.getBoundingClientRect().toJSON() : null;
				const boxesOverlap = (first, second) => Boolean(first && second && first.left < second.right && first.right > second.left && first.top < second.bottom && first.bottom > second.top);
				const workspace = document.querySelector(".site-v1-product-workspace");
				const controls = document.querySelector(".site-v1-product-workspace__controls");
				const controlButtons = [...(controls?.querySelectorAll(':scope > button[role="tab"]') ?? [])];
				const panel = document.querySelector(`[data-workspace-view="${slug}"]:not([hidden])`);
				const disclosure = document.querySelector(".site-v1-product-workspace > .site-v1-representative-disclosure");
				const workspaceBox = box(workspace);
				const panelBox = box(panel);
				const disclosureBox = box(disclosure);
				const inside = (child) => Boolean(workspaceBox && child && child.left >= workspaceBox.left - 1 && child.right <= workspaceBox.right + 1);
				const sheets = [...document.querySelectorAll('[data-workspace-view="current-answers"] [data-answer-sheet]')].map(box);
				const answerBoundary = box(document.querySelector('[data-workspace-view="current-answers"] .site-v1-workspace-answer-environments > p'));
				const unchanged = box(document.querySelector('[data-workspace-view="outcome-review"] [data-review-comparison="unchanged"]'));
				const cannotAttribute = box(document.querySelector('[data-workspace-view="outcome-review"] [data-review-comparison="cannot-attribute"]'));
				const method = document.querySelector("#how-it-works");
				const methodItems = [...(method?.querySelectorAll(".site-v1-product-method__field > p") ?? [])];
				return {
					documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
					workspace: { clientWidth: workspace?.clientWidth, scrollWidth: workspace?.scrollWidth, scrollLeft: workspace?.scrollLeft, box: workspaceBox },
					controls: {
						clientWidth: controls?.clientWidth,
						scrollWidth: controls?.scrollWidth,
						scrollLeft: controls?.scrollLeft,
						orientation: controls?.getAttribute("aria-orientation"),
						pathCount: controls?.querySelectorAll(':scope > svg[aria-hidden="true"] path').length,
						buttonWidths: controlButtons.map((button) => Math.round(button.getBoundingClientRect().width)),
						buttonBorders: controlButtons.map((button) => getComputedStyle(button).borderRightWidth),
					},
					recordAnchors: document.querySelectorAll("[data-persistent-record-anchors] > article, [data-persistent-record-anchors] > div").length,
					orderedRecordSpine: document.querySelectorAll("[data-persistent-record-spine]").length,
					method: {
						orderedStructures: method?.querySelectorAll("ol, li, [role='list']").length,
						itemWidths: methodItems.map((item) => Math.round(item.getBoundingClientRect().width)),
						itemBorders: methodItems.map((item) => getComputedStyle(item).borderWidth),
					},
					panelBox,
					disclosureBox,
					panelInside: inside(panelBox),
					disclosureInside: inside(disclosureBox),
					answerOverlap: sheets.some((sheet) => boxesOverlap(sheet, answerBoundary)),
					outcomeOverlap: boxesOverlap(unchanged, cannotAttribute),
				};
			}, { slug });

			const failures = [];
			if (metrics.documentOverflow !== 0) failures.push(`document overflow ${metrics.documentOverflow}`);
			if (metrics.workspace.clientWidth !== metrics.workspace.scrollWidth) failures.push(`workspace width ${metrics.workspace.clientWidth}/${metrics.workspace.scrollWidth}`);
			if (metrics.workspace.scrollLeft !== 0) failures.push(`workspace scrollLeft ${metrics.workspace.scrollLeft}`);
			if (!metrics.panelInside) failures.push("active panel outside workspace");
			if (!metrics.disclosureInside) failures.push("disclosure outside workspace");
			if (metrics.controls.orientation !== "horizontal") failures.push(`controls orientation ${metrics.controls.orientation}`);
			if (metrics.controls.pathCount !== 1) failures.push(`record path count ${metrics.controls.pathCount}`);
			if (new Set(metrics.controls.buttonWidths).size < 3) failures.push(`controls remain equal-width: ${metrics.controls.buttonWidths.join(",")}`);
			if (metrics.controls.buttonBorders.some((width) => width !== "0px")) failures.push(`controls retain boxed borders: ${metrics.controls.buttonBorders.join(",")}`);
			if (viewport.name === "desktop" && metrics.controls.scrollWidth !== metrics.controls.clientWidth) failures.push(`desktop controls clipped ${metrics.controls.clientWidth}/${metrics.controls.scrollWidth}`);
			if (metrics.recordAnchors !== 3 || metrics.orderedRecordSpine !== 0) failures.push(`record anchors/spine ${metrics.recordAnchors}/${metrics.orderedRecordSpine}`);
			if (metrics.method.orderedStructures !== 0 || metrics.method.itemWidths.length !== 6) failures.push(`method structure ${JSON.stringify(metrics.method)}`);
			if (viewport.name === "desktop" && new Set(metrics.method.itemWidths).size < 3) failures.push(`method remains equal-width: ${metrics.method.itemWidths.join(",")}`);
			if (metrics.method.itemBorders.some((width) => width !== "0px")) failures.push(`method retains item borders: ${metrics.method.itemBorders.join(",")}`);
			if (slug === "current-answers" && metrics.answerOverlap) failures.push("answer sheets overlap observation boundary");
			if (slug === "outcome-review" && metrics.outcomeOverlap) failures.push("unchanged overlaps cannot-attribute");
			results.push({ viewport: viewport.name, state: slug, metrics, failures });
			await page.evaluate(() => { if (document.activeElement instanceof HTMLElement) document.activeElement.blur(); });
			await page.locator(".site-v1-product-workspace").screenshot({ path: path.join(outputDir, `${viewport.name}-${slug}.png`), animations: "disabled", timeout: 10_000 });
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
