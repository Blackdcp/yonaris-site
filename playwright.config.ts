import { defineConfig } from "@playwright/test";
import {
	CONTACT_E2E_TOKEN_HEADER,
	parseCliArgs,
	resolveSystemChrome,
	VIEWPORT_MATRIX,
} from "./scripts/site-v1-english-matrix.mjs";

const baseURL = parseCliArgs(["--base-url", process.env.YONARIS_TEST_BASE_URL ?? "http://127.0.0.1:3000"]).baseUrl;
const executablePath = resolveSystemChrome();
const contactE2EToken = process.env.YONARIS_CONTACT_E2E_TOKEN?.trim();

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
		extraHTTPHeaders: contactE2EToken ? { [CONTACT_E2E_TOKEN_HEADER]: contactE2EToken } : undefined,
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
