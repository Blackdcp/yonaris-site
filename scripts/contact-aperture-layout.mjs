#!/usr/bin/env node

import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const outputDir = path.resolve(
	process.argv[2] ?? ".superpowers/sdd/2026-08-30-yonaris-site-1-0-production/visual-task-8/contact-aperture-layout",
);
const baseUrl = new URL(process.argv[3] ?? "http://127.0.0.1:3000");
assert.equal(baseUrl.protocol, "http:");
assert.ok(["127.0.0.1", "localhost"].includes(baseUrl.hostname));
await mkdir(outputDir, { recursive: true });

const executablePath = [
	process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
	process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
	chromium.executablePath(),
	"C:/Program Files/Google/Chrome/Application/chrome.exe",
	"C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
].find((candidate) => candidate && existsSync(candidate));

const browser = await chromium.launch({
	...(executablePath ? { executablePath } : {}),
	headless: true,
	timeout: 15_000,
});
const results = [];
const failures = [];

function recordFailure(message) {
	failures.push(message);
}

async function waitForState(page, state) {
	await page.locator(`[data-contact-aperture][data-v1-state="${state}"]`).waitFor({ timeout: 10_000 });
}

async function capture(page, viewport, state, suffix = "") {
	const metrics = await page.evaluate(() => {
		const aperture = document.querySelector("[data-contact-aperture]");
		const firstViewport = document.querySelector("[data-contact-first-viewport]");
		const form = document.querySelector("form[action='/api/contact']");
		const details = document.querySelector("details[data-contact-high-intent]");
		const submit = form?.querySelector("button[type='submit']");
		const box = (element) => element ? element.getBoundingClientRect().toJSON() : null;
		const style = aperture ? getComputedStyle(aperture) : null;
		const signal = aperture?.querySelector(".site-v1-contact-aperture__signal i");
		const signalStyle = signal ? getComputedStyle(signal) : null;
		return {
			url: location.href,
			state: aperture?.getAttribute("data-v1-state"),
			geometry: aperture?.getAttribute("data-contact-geometry"),
			signal: aperture?.getAttribute("data-contact-signal"),
			depth: aperture?.getAttribute("data-contact-depth"),
			motionPreference: aperture?.getAttribute("data-motion-preference"),
			enhanced: aperture?.getAttribute("data-enhanced") ?? "false",
			documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
			apertureBox: box(aperture),
			firstViewportBox: box(firstViewport),
			formMethod: form?.getAttribute("method"),
			formAction: form?.getAttribute("action"),
			requiredCount: form?.querySelectorAll(":is(input,textarea)[required]").length,
			detailsOpen: details?.hasAttribute("open"),
			submitHeight: submit?.getBoundingClientRect().height,
			transitionDuration: style?.transitionDuration,
			signalAnimationName: signalStyle?.animationName,
			activeName: document.activeElement?.getAttribute("name") ?? document.activeElement?.getAttribute("data-contact-status"),
		};
	});
	const label = `${viewport.name}-${state}${suffix}`;
	const stateFailures = [];
	if (metrics.state !== state) stateFailures.push(`expected state ${state}, got ${metrics.state}`);
	if (metrics.documentOverflow > 1) stateFailures.push(`horizontal overflow ${metrics.documentOverflow}px`);
	if (!metrics.apertureBox || metrics.apertureBox.width <= 0 || metrics.apertureBox.height <= 0) stateFailures.push("empty aperture box");
	if (metrics.apertureBox && metrics.apertureBox.right > viewport.width + 1) stateFailures.push(`aperture exceeds viewport at ${metrics.apertureBox.right}px`);
	if (metrics.formMethod && metrics.formMethod.toLowerCase() !== "post") stateFailures.push(`form method ${metrics.formMethod}`);
	if (metrics.formAction && metrics.formAction !== "/api/contact") stateFailures.push(`form action ${metrics.formAction}`);
	if (state !== "confirmed" && metrics.requiredCount !== 1) stateFailures.push(`required fields ${metrics.requiredCount}`);
	if (state !== "confirmed" && metrics.submitHeight !== undefined && metrics.submitHeight !== null && metrics.submitHeight < 44) stateFailures.push(`submit target ${metrics.submitHeight}px`);
	for (const failure of stateFailures) recordFailure(`${label}: ${failure}`);
	results.push({ viewport: viewport.name, state, suffix, metrics, failures: stateFailures });
	await page.screenshot({
		path: path.join(outputDir, `${label}.png`),
		fullPage: true,
		animations: "disabled",
	});
	return metrics;
}

async function openContact(page) {
	await page.goto(new URL("/contact", baseUrl).href, { waitUntil: "networkidle", timeout: 15_000 });
	await page.locator('[data-contact-aperture][data-enhanced="true"]').waitFor({ timeout: 10_000 });
}

async function runEnhanced(viewport) {
	const context = await browser.newContext({
		viewport: { width: viewport.width, height: viewport.height },
		hasTouch: viewport.hasTouch,
	});
	const page = await context.newPage();
	const browserErrors = [];
	const submissions = [];
	let responseMode = "unconfirmed";
	page.on("pageerror", (error) => browserErrors.push(`pageerror: ${error.message}`));
	page.on("console", (message) => { if (message.type() === "error") browserErrors.push(`console: ${message.text()}`); });
	await page.route("**/api/contact", async (route) => {
		const request = route.request();
		if (request.method() !== "POST") return route.abort();
		let body = null;
		try { body = request.postDataJSON(); } catch { body = request.postData(); }
		submissions.push({
			id: request.headers()["idempotency-key"],
			contentType: request.headers()["content-type"],
			body,
			responseMode,
		});
		await route.fulfill({
			status: responseMode === "confirmed" ? 202 : 503,
			contentType: "application/json; charset=utf-8",
			body: JSON.stringify(responseMode === "confirmed" ? { status: "confirmed" } : { status: "unconfirmed" }),
		});
	});

	try {
		await openContact(page);
		await capture(page, viewport, "idle");
		await page.locator('[name="workEmail"]').focus();
		await waitForState(page, "focused");
		await capture(page, viewport, "focused");
		await page.locator("details[data-contact-high-intent] summary").click();
		await waitForState(page, "expanded");
		const expanded = await capture(page, viewport, "expanded");
		if (!expanded.detailsOpen) recordFailure(`${viewport.name}-expanded: details are not open`);

		await openContact(page);
		await page.locator('[name="workEmail"]').fill("not-an-email");
		await page.locator('button[type="submit"]').click();
		await waitForState(page, "invalid");
		const invalid = await capture(page, viewport, "invalid");
		if (invalid.activeName !== "workEmail") recordFailure(`${viewport.name}-invalid: focus did not move to workEmail`);

		await openContact(page);
		responseMode = "unconfirmed";
		await page.locator('[name="workEmail"]').fill("visual-probe@example.com");
		await page.locator('[name="curiosity"]').fill("A preserved intercepted-production probe.");
		await page.locator('button[type="submit"]').click();
		await waitForState(page, "unconfirmed");
		const unconfirmed = await capture(page, viewport, "unconfirmed");
		if (unconfirmed.activeName !== "unconfirmed") recordFailure(`${viewport.name}-unconfirmed: feedback did not receive focus`);
		assert.equal(await page.locator('[name="workEmail"]').inputValue(), "visual-probe@example.com");
		assert.equal(await page.locator('[name="curiosity"]').inputValue(), "A preserved intercepted-production probe.");

		responseMode = "confirmed";
		await page.locator('button[type="submit"]').click();
		await waitForState(page, "confirmed");
		const confirmed = await capture(page, viewport, "confirmed");
		if (confirmed.activeName !== "confirmed") recordFailure(`${viewport.name}-confirmed: confirmation did not receive focus`);
		assert.equal(submissions.length, 2);
		assert.ok(submissions[0].id);
		assert.equal(submissions[0].id, submissions[1].id);
		assert.deepEqual(submissions[0].body, submissions[1].body);
		assert.deepEqual(submissions[0].body, {
			locale: "en",
			workEmail: "visual-probe@example.com",
			curiosity: "A preserved intercepted-production probe.",
			requestType: "conversation",
		});
		results.push({ viewport: viewport.name, transport: "intercepted", submissions, browserErrors });
		for (const error of browserErrors) {
			if (!/Failed to load resource: the server responded with a status of 503 \(Service Unavailable\)/u.test(error)) {
				recordFailure(`${viewport.name}: ${error}`);
			}
		}
	} finally {
		await context.close();
	}
}

async function runReducedMotion(viewport) {
	const context = await browser.newContext({
		viewport: { width: viewport.width, height: viewport.height },
		hasTouch: viewport.hasTouch,
		reducedMotion: "reduce",
	});
	const page = await context.newPage();
	try {
		await openContact(page);
		await page.locator('[name="workEmail"]').focus();
		await page.locator("details[data-contact-high-intent] summary").click();
		await waitForState(page, "expanded");
		const metrics = await capture(page, viewport, "expanded", "-reduced");
		if (metrics.motionPreference !== "reduced") recordFailure(`${viewport.name}-reduced: preference ${metrics.motionPreference}`);
		if (metrics.signalAnimationName !== "none") recordFailure(`${viewport.name}-reduced: signal animation ${metrics.signalAnimationName}`);
	} finally {
		await context.close();
	}
}

async function submitNative(page, workEmail) {
	await page.goto(new URL("/contact", baseUrl).href, { waitUntil: "domcontentloaded", timeout: 15_000 });
	await page.locator('[name="workEmail"]').fill(workEmail);
	await page.locator('[name="curiosity"]').fill("Native values stay present.");
	const navigation = page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 15_000 });
	await page.locator('button[type="submit"]').click();
	return navigation;
}

async function runNoJavaScript(viewport) {
	for (const [state, email, expectedStatus] of [
		["invalid", "not-an-email", 422],
		["unconfirmed", "native-probe@example.com", 503],
	]) {
		const context = await browser.newContext({
			viewport: { width: viewport.width, height: viewport.height },
			hasTouch: viewport.hasTouch,
			javaScriptEnabled: false,
			userAgent: `Yonaris-Contact-Probe/${viewport.name}/${state}`,
		});
		const page = await context.newPage();
		try {
			const response = await submitNative(page, email);
			if (response?.status() !== expectedStatus) recordFailure(`${viewport.name}-no-js-${state}: HTTP ${response?.status()}`);
			await waitForState(page, state);
			const metrics = await capture(page, viewport, state, "-no-js");
			if (metrics.enhanced !== "false") recordFailure(`${viewport.name}-no-js-${state}: unexpectedly enhanced`);
			assert.equal(await page.locator('[name="workEmail"]').inputValue(), email);
			assert.equal(await page.locator('[name="curiosity"]').inputValue(), "Native values stay present.");
		} finally {
			await context.close();
		}
	}
}

try {
	for (const viewport of [
		{ name: "desktop-1440x1000", width: 1440, height: 1000, hasTouch: false },
		{ name: "mobile-390x844", width: 390, height: 844, hasTouch: true },
	]) {
		await runEnhanced(viewport);
		await runReducedMotion(viewport);
		await runNoJavaScript(viewport);
	}
} catch (error) {
	recordFailure(`fatal: ${error instanceof Error ? error.stack ?? error.message : String(error)}`);
} finally {
	await browser.close();
}

const report = {
	passed: failures.length === 0,
	baseUrl: baseUrl.href,
	executablePath: executablePath ?? null,
	networkBoundary: "Enhanced submissions were intercepted; no-JS unconfirmed used a production server started with delivery environment variables explicitly blank.",
	failures,
	results,
};
await writeFile(path.join(outputDir, "metrics.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
await writeFile(
	path.join(outputDir, "report.md"),
	[
		"# Contact aperture production probe",
		"",
		`Result: ${report.passed ? "PASS" : "FAIL"}`,
		"",
		"- Viewports: 1440x1000 and 390x844",
		"- Enhanced states: idle, focused, expanded, invalid, unconfirmed, confirmed",
		"- Additional states: reduced-motion expanded; JavaScript-disabled invalid and unconfirmed",
		"- Delivery safety: enhanced POSTs intercepted; native unconfirmed exercised with delivery configuration blank",
		`- Failures: ${failures.length}`,
		...(failures.length ? ["", ...failures.map((failure) => `- ${failure}`)] : []),
		"",
	].join("\n"),
	"utf8",
);
console.log(JSON.stringify({ passed: report.passed, failures, outputDir }, null, 2));
if (failures.length) process.exitCode = 1;
