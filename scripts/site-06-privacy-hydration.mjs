#!/usr/bin/env node

import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { chromium } from "@playwright/test";
const suppliedBaseUrl = process.argv[2] ?? "http://127.0.0.1:4173";
const baseUrl = new URL(suppliedBaseUrl);
assert.equal(baseUrl.protocol, "http:");
assert.ok(["127.0.0.1", "localhost"].includes(baseUrl.hostname));

const cases = [
	{
		path: "/contact",
		privacyHeading: "Curious where Yonaris could fit?",
		consultationHeading: "Curious where Yonaris could fit?",
		headingLevel: 1,
		stateKey: "__yonarisContactIntent",
		fieldSelector: "form [data-contact-field]",
		fieldCount: 7,
		directRequestType: "conversation",
		requiredCount: 1,
	},
	{
		path: "/diagnostic",
		privacyHeading: "Ask Yonaris to review a previous contact request.",
		consultationHeading: "Tell us where we should reach you.",
		headingLevel: 2,
		stateKey: "__yonarisDiagnosticIntent",
		fieldSelector: "form [data-lead-field]",
		fieldCount: 3,
		directRequestType: "consultation",
	},
	{
		path: "/zh/diagnostic",
		privacyHeading: "请 Yonaris 核对此前的联系申请。",
		consultationHeading: "怎么联系你？",
		headingLevel: 2,
		stateKey: "__yonarisDiagnosticIntent",
		fieldSelector: "form [data-lead-field]",
		fieldCount: 3,
		directRequestType: "consultation",
	},
];

const hydrationPattern = /hydration|hydrating|server rendered html|didn't match|does not match/iu;
const executablePath = [
	process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
	chromium.executablePath(),
	"C:/Program Files/Google/Chrome/Application/chrome.exe",
	"C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
].find((candidate) => candidate && existsSync(candidate));
const browser = await chromium.launch({ ...(executablePath ? { executablePath } : {}), headless: true, timeout: 15_000 });
try {
	for (const testCase of cases) {
		const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
		const failures = { initial: [], reload: [] };
		let phase = "initial";
		page.on("pageerror", (error) => failures[phase].push(`pageerror: ${error.message}`));
		page.on("console", (message) => {
			if (message.type() === "error" && hydrationPattern.test(message.text())) {
				failures[phase].push(`console: ${message.text()}`);
			}
		});

		await page.goto(new URL(`${testCase.path}?intent=privacy`, baseUrl).href);
		await page.waitForFunction(
			({ pathName, stateKey }) =>
				location.pathname === pathName &&
				location.search === "" &&
				history.state?.[stateKey] === "privacy" &&
				!window.$_TSR,
			{ pathName: testCase.path, stateKey: testCase.stateKey },
		);
		await page.getByRole("heading", { level: testCase.headingLevel, name: testCase.privacyHeading, exact: true }).waitFor();
		assert.equal(await page.locator(testCase.fieldSelector).count(), testCase.fieldCount);
		if (testCase.requiredCount !== undefined) {
			assert.equal(await page.locator("form :is(input,textarea)[required]").count(), testCase.requiredCount);
		}
		assert.equal(await page.locator('form input[name="requestType"]').inputValue(), "privacy");
		await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
		assert.deepEqual(failures.initial, [], `${testCase.path} emitted hydration failures on the initial privacy-query load`);

		phase = "reload";
		await page.reload();
		await page.waitForFunction(() => !window.$_TSR);
		await page.getByRole("heading", { level: testCase.headingLevel, name: testCase.privacyHeading, exact: true }).waitFor();
		assert.equal(await page.locator(testCase.fieldSelector).count(), testCase.fieldCount);
		assert.equal(await page.locator('form input[name="requestType"]').inputValue(), "privacy");
		await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
		assert.deepEqual(failures.reload, [], `${testCase.path} emitted hydration failures after a queryless privacy reload`);

		await page.close();

		const directPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
		await directPage.goto(new URL(testCase.path, baseUrl).href);
		await directPage.waitForFunction(() => !window.$_TSR);
		await directPage.getByRole("heading", { level: testCase.headingLevel, name: testCase.consultationHeading, exact: true }).waitFor();
		assert.equal(await directPage.locator('form input[name="requestType"]').inputValue(), testCase.directRequestType);
		await directPage.close();
		process.stdout.write(`${testCase.path}: privacy reload hydrates cleanly; direct route remains consultation\n`);
	}
} finally {
	await browser.close();
}
