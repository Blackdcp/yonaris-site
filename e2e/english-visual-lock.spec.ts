import { expect, test, type TestInfo } from "@playwright/test";
import {
	CONTACT_E2E_TOKEN_HEADER,
	ENGLISH_ROUTE_MATRIX,
	exerciseEnglishRoute,
	exerciseNoJavaScriptRoute,
	renderedSceneSnapshot,
	renderedSignature,
	resolveContactE2EToken,
} from "../scripts/site-v1-english-matrix.mjs";

function projectViewport(testInfo: TestInfo) {
	const viewport = testInfo.project.use.viewport;
	if (!viewport) throw new Error("The English visual lock requires an explicit project viewport.");
	return viewport;
}

for (const route of ENGLISH_ROUTE_MATRIX) {
	test(`${route.path} exposes every declared manual state`, async ({ page }, testInfo) => {
		const viewport = projectViewport(testInfo);
		const result = await exerciseEnglishRoute({
			page,
			baseUrl: testInfo.project.use.baseURL as string,
			route,
			viewport,
			input: viewport.width <= 390 ? "touch" : "pointer",
			motion: "normal",
		});
		expect(result.failures).toEqual([]);
		expect(result.states).toEqual(route.states);
	});

	test(`${route.path} remains directly controllable with reduced motion`, async ({ page }, testInfo) => {
		const viewport = projectViewport(testInfo);
		test.skip(![390, 1280].includes(viewport.width), "Complete reduced-motion sweeps run at 390 and 1280.");
		const result = await exerciseEnglishRoute({
			page,
			baseUrl: testInfo.project.use.baseURL as string,
			route,
			viewport,
			input: viewport.width === 390 ? "touch" : "pointer",
			motion: "reduced",
		});
		expect(result.failures).toEqual([]);
		expect(result.states).toEqual(route.states);
	});

	if (route.noJavaScriptStates?.length) {
		test(`${route.path} preserves its server-rendered no-JavaScript contract`, async ({ browser }, testInfo) => {
			const viewport = projectViewport(testInfo);
			test.skip(![390, 1280].includes(viewport.width), "No-JavaScript sweeps run at the mobile and desktop lock widths.");
			const context = await browser.newContext({
				baseURL: testInfo.project.use.baseURL as string,
				javaScriptEnabled: false,
				viewport,
				hasTouch: viewport.width === 390,
				extraHTTPHeaders: route.path === "/contact"
					? { [CONTACT_E2E_TOKEN_HEADER]: resolveContactE2EToken() }
					: undefined,
			});
			try {
				const page = await context.newPage();
				const result = await exerciseNoJavaScriptRoute({
					page,
					baseUrl: testInfo.project.use.baseURL as string,
					route,
					viewport,
				});
				expect(result.failures).toEqual([]);
				expect(result.states).toEqual(route.noJavaScriptStates);
			} finally {
				await context.close();
			}
		});
	}
}

test("390 Contact keeps idle submit actionable by touch, pointer, Enter and Space", async ({ page }, testInfo) => {
	const viewport = projectViewport(testInfo);
	test.skip(viewport.width !== 390, "The mobile interaction regression runs at the 390 lock width.");
	const baseUrl = testInfo.project.use.baseURL as string;
	for (const modality of ["tap", "click", "Enter", "Space"] as const) {
		await page.goto(new URL("/contact", baseUrl).href, { waitUntil: "load" });
		const aperture = page.locator("[data-contact-aperture][data-enhanced='true'][data-v1-state='idle']");
		await aperture.waitFor();
		const submit = page.locator("[data-contact-aperture] button[type='submit']");
		if (modality === "tap") await submit.tap();
		else if (modality === "click") await submit.click();
		else {
			await submit.focus();
			const focusPaint = await submit.evaluate((node) => {
				const style = getComputedStyle(node);
				return node.matches(":focus-visible") && (
					(style.outlineStyle !== "none" && Number.parseFloat(style.outlineWidth) >= 1)
					|| (style.boxShadow !== "none" && style.boxShadow !== "")
				);
			});
			expect(focusPaint, `${modality} submit focus should have visible paint`).toBe(true);
			await submit.press(modality);
		}
		await expect(page.locator("[data-contact-aperture]")).toHaveAttribute("data-v1-state", "invalid");
		await expect(page.locator("#contact-work-email")).toBeFocused();
	}
});

test("1280 Human rendered oracle detects aria-hidden SVG and link attachment mutations", async ({ page }, testInfo) => {
	const viewport = projectViewport(testInfo);
	test.skip(viewport.width !== 1280, "The independent attachment mutation oracle runs at the desktop lock width.");
	await page.goto(new URL("/human-agent", testInfo.project.use.baseURL as string).href, { waitUntil: "load" });
	await page.locator("[data-human-agent-lens][data-enhanced='true']").waitFor();
	await page.waitForTimeout(1_000);
	const selector = "[data-human-agent-projection='human'][data-active='true']";
	const before = await renderedSceneSnapshot(page, selector);
	const attachments = before.flatMap((scene) => scene.ownerAttachments ?? []);
	expect(attachments.some(({ semantic }) => semantic[0] === "path" && Object.fromEntries(semantic[1]).d)).toBe(true);
	expect(attachments.some(({ semantic }) => semantic[0] === "a" && String(Object.fromEntries(semantic[1]).href).startsWith("/agent#"))).toBe(true);

	await page.locator("[data-lens-attachment='human']").evaluate((node) => node.setAttribute("d", `${node.getAttribute("d")} L301 75`));
	const pathMutated = await renderedSceneSnapshot(page, selector);
	expect(renderedSignature(pathMutated)).not.toBe(renderedSignature(before));
	await page.locator("[data-lens-attachment='human']").evaluate((node) => {
		const path = node as SVGPathElement;
		path.style.transition = "none";
		path.style.stroke = "rgb(1, 2, 3)";
	});
	const styleMutated = await renderedSceneSnapshot(page, selector);
	expect(renderedSignature(styleMutated)).not.toBe(renderedSignature(pathMutated));

	await page.locator("[data-human-agent-projection='agent'] a[href^='/agent#']").evaluate((node) => node.setAttribute("href", "/agent#mutated-record"));
	const hrefMutated = await renderedSceneSnapshot(page, selector);
	expect(renderedSignature(hrefMutated)).not.toBe(renderedSignature(styleMutated));
});
