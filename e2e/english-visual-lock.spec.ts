import { expect, test, type TestInfo } from "@playwright/test";
import {
	ENGLISH_ROUTE_MATRIX,
	exerciseEnglishRoute,
	exerciseNoJavaScriptRoute,
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
