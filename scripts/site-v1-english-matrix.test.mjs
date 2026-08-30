import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";

import {
	ENGLISH_ROUTE_MATRIX,
	SYSTEM_CHROME_PATH,
	VIEWPORT_MATRIX,
	artifactName,
	buildCapturePlan,
	buildNoJavaScriptPlan,
	parseCliArgs,
	renderHtmlIndex,
	resolveSystemChrome,
} from "./site-v1-english-matrix.mjs";

const EXPECTED_STATES = {
	"/": [
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
	"/product": [
		"buyer-questions",
		"current-answers",
		"sources-gaps",
		"actions-under-review",
		"outcome-review",
		"anchor-how-it-works",
		"anchor-markets-languages",
	],
	"/casework": Array.from({ length: 8 }, (_, index) => `step-${index + 1}`),
	"/company": ["why", "audience", "markets", "human-judgement", "non-promises"],
	"/human-agent": ["human", "evidence", "agent", "bridge-agent", "bridge-human"],
	"/contact": ["idle", "focused", "expanded", "invalid", "unconfirmed", "confirmed", "privacy-intent"],
	"/privacy": ["editorial", "contact-cta"],
};

describe("Site V1 English production matrix contract", () => {
	it("locks five required viewports and seven canonical English routes", () => {
		assert.deepEqual(
			VIEWPORT_MATRIX.map(({ width, height }) => [width, height]),
			[[360, 800], [390, 844], [1024, 768], [1280, 800], [1440, 900]],
		);
		assert.deepEqual(ENGLISH_ROUTE_MATRIX.map(({ path }) => path), Object.keys(EXPECTED_STATES));
		for (const route of ENGLISH_ROUTE_MATRIX) {
			assert.deepEqual(route.states, EXPECTED_STATES[route.path]);
			assert.ok(route.rootSelector.startsWith("["), `${route.path} needs a stable root selector`);
		}
	});

	it("builds full normal coverage plus complete reduced-motion sweeps at 390 and 1280", () => {
		const plan = buildCapturePlan();
		const normal = plan.filter(({ motion }) => motion === "normal");
		const reduced = plan.filter(({ motion }) => motion === "reduced");
		const stateCount = Object.values(EXPECTED_STATES).reduce((sum, states) => sum + states.length, 0);

		assert.equal(normal.length, stateCount * VIEWPORT_MATRIX.length);
		assert.equal(reduced.length, stateCount * 2);
		assert.deepEqual([...new Set(reduced.map(({ viewport }) => viewport))], ["390x844", "1280x800"]);
		assert.equal(new Set(plan.map((entry) => entry.artifact)).size, plan.length);
	});

	it("creates deterministic route/viewport/state/motion artifact names", () => {
		assert.equal(artifactName("/", "390x844", "answer-ai", "normal"), "home__390x844__answer-ai__normal.png");
		assert.equal(
			artifactName("/human-agent", "1280x800", "bridge-agent", "reduced"),
			"human-agent__1280x800__bridge-agent__reduced.png",
		);
	});

	it("locks no-JavaScript coverage to the five required server-rendered experiences", () => {
		const plan = buildNoJavaScriptPlan();
		assert.deepEqual([...new Set(plan.map(({ route }) => route))], ["/product", "/casework", "/human-agent", "/contact", "/privacy"]);
		assert.deepEqual([...new Set(plan.map(({ viewport }) => viewport))], ["390x844", "1280x800"]);
		assert.ok(plan.every(({ artifact }) => artifact.endsWith("__no-js.png")));
		assert.equal(new Set(plan.map(({ artifact }) => artifact)).size, plan.length);
	});

	it("uses only an existing explicit or fixed system Chrome executable", () => {
		assert.equal(SYSTEM_CHROME_PATH, "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe");
		assert.equal(resolveSystemChrome({}, (candidate) => candidate === SYSTEM_CHROME_PATH), SYSTEM_CHROME_PATH);
		assert.equal(
			resolveSystemChrome({ PLAYWRIGHT_CHROMIUM_EXECUTABLE: "D:\\Chrome\\chrome.exe" }, (candidate) => candidate === "D:\\Chrome\\chrome.exe"),
			"D:\\Chrome\\chrome.exe",
		);
		assert.throws(
			() => resolveSystemChrome({ PLAYWRIGHT_CHROMIUM_EXECUTABLE: "D:\\missing.exe" }, () => false),
			/System Chrome executable was not found/,
		);
	});

	it("accepts a loopback production URL and rejects remote targets", () => {
		assert.deepEqual(parseCliArgs(["--base-url", "http://127.0.0.1:4310", "--output", ".superpowers/matrix"]), {
			baseUrl: "http://127.0.0.1:4310",
			outputDirectory: ".superpowers/matrix",
		});
		assert.throws(() => parseCliArgs(["--base-url", "https://yonaris.com"]), /loopback/);
	});

	it("escapes report content and exposes the two package entry points", async () => {
		const html = renderHtmlIndex({ passed: false, artifacts: [{ route: "</h1><script>", viewport: "390x844", state: "idle", motion: "normal", file: "safe.png", metrics: {} }] });
		assert.doesNotMatch(html, /<script>/u);
		assert.match(html, /&lt;script&gt;/u);
		const pkg = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
		assert.equal(pkg.scripts["test:e2e"], "playwright test --config playwright.config.ts");
		assert.equal(pkg.scripts["visual:english"], "node scripts/site-v1-english-matrix.mjs");
	});
});
