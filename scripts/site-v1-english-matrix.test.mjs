import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { describe, it } from "node:test";

import {
	ENGLISH_ROUTE_MATRIX,
	INTERACTIVE_CONTROL_RAIL_ATTACHMENT_SELECTOR,
	OWNER_ATTACHMENT_SELECTORS,
	SYSTEM_CHROME_PATH,
	VIEWPORT_MATRIX,
	assertDistinctRenderedStates,
	assertInteractionParity,
	assertMotionEvidence,
	auditTouchTargets,
	artifactName,
	buildCapturePlan,
	buildNoJavaScriptPlan,
	computedMotionBudgetMs,
	quantizeGeometryPixel,
	keyboardActivationKey,
	parseCliArgs,
	requiredManualModalities,
	resolveContactE2EToken,
	renderHtmlIndex,
	renderedSignature,
	semanticAttachmentVector,
	semanticStyleVector,
	resolveSystemChrome,
	visibleFocusIndicator,
} from "./site-v1-english-matrix.mjs";
import { tsImport } from "tsx/esm/api";

describe("Site V1 English production matrix contract", () => {
	it("locks five required viewports and seven canonical English routes", () => {
		assert.deepEqual(
			VIEWPORT_MATRIX.map(({ width, height }) => [width, height]),
			[[360, 800], [390, 844], [1024, 768], [1280, 800], [1440, 900]],
		);
		assert.deepEqual(ENGLISH_ROUTE_MATRIX.map(({ key }) => key), ["home", "product", "casework", "company", "human-agent", "contact", "privacy"]);
		for (const route of ENGLISH_ROUTE_MATRIX) {
			assert.ok(route.states.length >= 2, `${route.path} needs multiple authored states`);
			assert.ok(route.rootSelector.startsWith("["), `${route.path} needs a stable root selector`);
		}
	});

	it("derives canonical English paths from PUBLIC_PAGE_MANIFEST", async () => {
		const { PUBLIC_PAGE_MANIFEST } = await tsImport("../src/site/public-page-manifest.ts", import.meta.url);
		assert.deepEqual(
			ENGLISH_ROUTE_MATRIX.map(({ path }) => path),
			PUBLIC_PAGE_MANIFEST.map((page) => page.paths["global-en"]),
		);
	});

	for (const route of ["/", "/product", "/casework", "/company", "/human-agent"]) {
		it(`rejects label/data-state mutations with a frozen rendered scene for ${route}`, () => {
			const rendered = { attachment: true, box: [0, 0, 400, 300], styles: ["grid", "1", "none"], visibleContentHash: "same" };
			assert.throws(() => assertDistinctRenderedStates(route, [
				{ state: "mutated-label-a", dataState: "fake-a", stableId: "stable.record", rendered },
				{ state: "mutated-label-b", dataState: "fake-b", stableId: "stable.record", rendered },
			]), /rendered signatures/i);
		});
	}

	it("builds full normal coverage plus complete reduced-motion sweeps at 390 and 1280", () => {
		const plan = buildCapturePlan();
		const normal = plan.filter(({ motion }) => motion === "normal");
		const reduced = plan.filter(({ motion }) => motion === "reduced");
		const stateCount = ENGLISH_ROUTE_MATRIX.reduce((sum, route) => sum + route.states.length, 0);

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

	it("requires a high-entropy Contact E2E token before native valid POSTs", () => {
		assert.throws(() => resolveContactE2EToken({}), /E2E token/i);
		assert.throws(() => resolveContactE2EToken({ YONARIS_CONTACT_E2E_TOKEN: "short" }), /high-entropy/i);
		assert.equal(
			resolveContactE2EToken({ YONARIS_CONTACT_E2E_TOKEN: "0123456789abcdef0123456789abcdef0123456789abcdef" }),
			"0123456789abcdef0123456789abcdef0123456789abcdef",
		);
	});

	it("requires pointer+keyboard state parity and adds touch parity at the mobile lock width", () => {
		assert.deepEqual(requiredManualModalities({ width: 1280 }), ["pointer", "keyboard"]);
		assert.deepEqual(requiredManualModalities({ width: 390 }), ["touch", "pointer", "keyboard"]);
	});

	it("uses the native summary activation key and preserves button keyboard coverage", () => {
		assert.equal(keyboardActivationKey("summary", 0), "Enter");
		assert.equal(keyboardActivationKey("a", 0), "Enter");
		assert.equal(keyboardActivationKey("button", 0), "Space");
		assert.equal(keyboardActivationKey("button", 1), "Enter");
	});

	it("waits through the computed owner transition and caps pathological animation budgets", () => {
		assert.equal(computedMotionBudgetMs({
			transitionDuration: "120ms, 0.4s",
			transitionDelay: "30ms",
			animationDuration: "0s",
			animationDelay: "0s",
			animationIterationCount: "1",
		}), 430);
		assert.equal(computedMotionBudgetMs({
			transitionDuration: "0s",
			transitionDelay: "0s",
			animationDuration: "2s",
			animationDelay: "100ms",
			animationIterationCount: "infinite",
		}), 1_500);
	});

	it("excludes only aria-hidden atmospheric motion from the rendered-scene settle budget", () => {
		const infiniteAtmosphere = {
			transitionDuration: "0s",
			transitionDelay: "0s",
			animationDuration: "5.5s",
			animationDelay: "-240ms",
			animationIterationCount: "infinite",
		};
		assert.equal(computedMotionBudgetMs({ ...infiniteAtmosphere, atmosphericMotion: true }), 0);
		assert.equal(computedMotionBudgetMs({ ...infiniteAtmosphere, atmosphericMotion: false }), 1_500);
		assert.equal(computedMotionBudgetMs({ ...infiniteAtmosphere, ariaHidden: true, atmosphericMotion: false }), 1_500);
	});

	it("fingerprints real owner attachment semantics independently of state labels", () => {
		const base = semanticAttachmentVector({
			tagName: "path",
			attributes: { d: "M0 0 L10 10", points: "0,0 10,10", "data-active": "true", href: "/record", src: "/asset-a.png", alt: "Evidence record" },
			currentSrc: "/asset-a@2x.png",
		});
		for (const mutation of [
			{ attributes: { d: "M0 0 L20 20" } },
			{ attributes: { points: "0,0 20,20" } },
			{ attributes: { "data-active": "false" } },
			{ attributes: { href: "/different-record" } },
			{ attributes: { src: "/asset-b.png" } },
			{ attributes: { alt: "Different evidence" } },
			{ currentSrc: "/asset-b@2x.png" },
		]) {
			const changed = semanticAttachmentVector({
				tagName: "path",
				attributes: { d: "M0 0 L10 10", points: "0,0 10,10", "data-active": "true", href: "/record", src: "/asset-a.png", alt: "Evidence record", ...mutation.attributes },
				currentSrc: mutation.currentSrc ?? "/asset-a@2x.png",
			});
			assert.notEqual(renderedSignature([{ ownerAttachments: [base] }]), renderedSignature([{ ownerAttachments: [changed] }]));
		}
	});

	it("fingerprints computed SVG presentation rather than relying on data-active labels", () => {
		const base = semanticStyleVector({
			fill: "none",
			stroke: "rgb(240, 122, 61)",
			strokeWidth: "2px",
			strokeDasharray: "1px, 5px",
			strokeDashoffset: "0px",
			filter: "none",
		});
		for (const changedProperty of ["fill", "stroke", "strokeWidth", "strokeDasharray", "strokeDashoffset", "filter"]) {
			const changed = semanticStyleVector({
				fill: "none",
				stroke: "rgb(240, 122, 61)",
				strokeWidth: "2px",
				strokeDasharray: "1px, 5px",
				strokeDashoffset: "0px",
				filter: "none",
				[changedProperty]: "mutation",
			});
			assert.notEqual(renderedSignature([{ ownerAttachments: [{ styles: base }] }]), renderedSignature([{ ownerAttachments: [{ styles: changed }] }]));
		}
	});

	it("limits owner attachment capture to assets and explicit Human optics instead of layout links", () => {
		assert.deepEqual(OWNER_ATTACHMENT_SELECTORS, [
			"[data-lens-optics]",
			"[data-lens-ring]",
			"[data-lens-attachment]",
			"[data-lens-optics] [aria-hidden='true']",
			"[data-human-agent-projection] a[href]",
			"svg",
			"svg *",
			"img",
			"picture",
			"source",
			"video",
			"audio",
		]);
		assert.ok(!OWNER_ATTACHMENT_SELECTORS.includes("a[href]"));
		assert.ok(!OWNER_ATTACHMENT_SELECTORS.includes("[aria-hidden='true']"));
		assert.equal(INTERACTIVE_CONTROL_RAIL_ATTACHMENT_SELECTOR, ".site-v1-casework-timeline__scrub[role='group'] svg");
	});

	it("quantizes subpixel layout drift without hiding a real one-pixel geometry change", () => {
		assert.equal(quantizeGeometryPixel(174), quantizeGeometryPixel(174.25));
		assert.equal(quantizeGeometryPixel(174.25), quantizeGeometryPixel(174.49));
		assert.notEqual(quantizeGeometryPixel(174), quantizeGeometryPixel(175));
	});

	it("rejects modality parity when stable ID, state or independent rendered signature differs", () => {
		const baseline = { modality: "pointer", stableId: "record.1", state: "answer.ai", renderedSignature: "abc", rendered: [{ box: [100, 200] }] };
		assert.doesNotThrow(() => assertInteractionParity("/", "answer-ai", [baseline, { ...baseline, modality: "keyboard" }]));
		for (const changed of [
			{ stableId: "record.2" },
			{ state: "answer.search" },
			{ renderedSignature: "def" },
		]) {
			assert.throws(() => assertInteractionParity("/", "answer-ai", [baseline, { ...baseline, ...changed, modality: "keyboard" }]), /parity/i);
		}
		assert.throws(
			() => assertInteractionParity("/", "answer-ai", [baseline, {
				...baseline,
				modality: "keyboard",
				renderedSignature: "geometry-changed",
				rendered: [{ box: [101, 200] }],
			}]),
			/first rendered difference.*\$\.0\.box\.0.*100.*101/iu,
		);
	});

	it("requires a real focus-visible paint rather than only a focused element box", () => {
		assert.equal(visibleFocusIndicator({ matchesFocusVisible: true, outlineStyle: "solid", outlineWidth: 2, boxShadow: "none" }), true);
		assert.equal(visibleFocusIndicator({ matchesFocusVisible: true, outlineStyle: "none", outlineWidth: 0, boxShadow: "none" }), false);
		assert.equal(visibleFocusIndicator({ matchesFocusVisible: false, outlineStyle: "solid", outlineWidth: 2, boxShadow: "none" }), false);
	});

	it("requires delayed stability/yield and quiescent meaningful reduced states", () => {
		const stable = { beforeStabilized: true, afterStabilized: true, semanticRunningAnimations: 0, atmosphericRunningAnimations: 0 };
		assert.doesNotThrow(() => assertMotionEvidence("/", "answer-ai", { ...stable, mode: "normal", beforeSignature: "same", afterSignature: "same", orchestrators: [{ paused: true, mode: "controlled" }], meaningful: true, runningAnimations: 0 }));
		assert.throws(() => assertMotionEvidence("/", "answer-ai", { ...stable, beforeStabilized: false, mode: "normal", beforeSignature: "same", afterSignature: "same", orchestrators: [], meaningful: true, runningAnimations: 0 }), /stabilize/i);
		assert.throws(() => assertMotionEvidence("/", "answer-ai", { ...stable, mode: "normal", beforeSignature: "before", afterSignature: "after", orchestrators: [], meaningful: true, runningAnimations: 0 }), /yield|stable/i);
		assert.throws(() => assertMotionEvidence("/", "answer-ai", { ...stable, mode: "normal", beforeSignature: "same", afterSignature: "same", orchestrators: [{ paused: false, mode: "playing" }], meaningful: true, runningAnimations: 0 }), /yield|paused/i);
		assert.throws(() => assertMotionEvidence("/", "answer-ai", { ...stable, mode: "normal", beforeSignature: "same", afterSignature: "same", orchestrators: [], meaningful: true, runningAnimations: 1, semanticRunningAnimations: 1 }), /semantic.*motion|quiescent/i);
		assert.doesNotThrow(() => assertMotionEvidence("/", "answer-ai", { ...stable, mode: "normal", beforeSignature: "same", afterSignature: "same", orchestrators: [], meaningful: true, runningAnimations: 12, atmosphericRunningAnimations: 12 }));
		assert.doesNotThrow(() => assertMotionEvidence("/", "answer-ai", { ...stable, mode: "reduced", beforeSignature: "same", afterSignature: "same", orchestrators: [{ paused: true, mode: "reduced" }], meaningful: true, runningAnimations: 0 }));
		assert.throws(() => assertMotionEvidence("/", "answer-ai", { ...stable, mode: "reduced", beforeSignature: "same", afterSignature: "same", orchestrators: [], meaningful: true, runningAnimations: 1, atmosphericRunningAnimations: 1 }), /quiescent/i);
	});

	it("applies the 44px touch audit to native and enhanced Contact controls", () => {
		assert.throws(() => auditTouchTargets("/contact", { width: 390 }, [{ label: "high intent", width: 200, height: 20 }]), /20\.0|44/u);
		assert.deepEqual(auditTouchTargets("/contact", { width: 390 }, [{ label: "high intent", width: 200, height: 44 }]), []);
	});

	it("locks the native Contact summary to a 44px touch target", async () => {
		const source = await readFile(new URL("../src/components/experience/global/pages/contact-native-document.server.tsx", import.meta.url), "utf8");
		assert.match(source, /site-v1-contact-form__high-intent summary[^}]*min-height:\s*44px/su);
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
