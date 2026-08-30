import { defineConfig } from "@playwright/test";
import { resolveSystemChrome, VIEWPORT_MATRIX } from "./scripts/site-v1-english-matrix.mjs";

const baseURL = process.env.YONARIS_TEST_BASE_URL ?? "http://127.0.0.1:3000";
const executablePath = resolveSystemChrome();

export default defineConfig({
	testDir: "./e2e",
	outputDir: "test-results/site-v1-english",
	timeout: 180_000,
	expect: { timeout: 10_000 },
	fullyParallel: false,
	workers: 1,
	retries: 0,
	reporter: [["line"], ["html", { outputFolder: "playwright-report/site-v1-english", open: "never" }]],
	use: {
		baseURL,
		browserName: "chromium",
		colorScheme: "light",
		locale: "en-US",
		serviceWorkers: "block",
		actionTimeout: 10_000,
		navigationTimeout: 30_000,
		launchOptions: { executablePath },
		screenshot: "only-on-failure",
		trace: "retain-on-failure",
		video: "off",
	},
	projects: VIEWPORT_MATRIX.map((viewport) => ({
		name: viewport.id,
		use: {
			viewport: { width: viewport.width, height: viewport.height },
			hasTouch: viewport.input === "touch",
		},
	})),
});
