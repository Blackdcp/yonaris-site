# Yonaris Site 09 Interactive Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a standalone, clickable, high-fidelity English six-page Site 09 prototype that keeps Site 08's mature visual atmosphere while replacing its repeated templates, fake product UI, static interactions, and generic AI imagery with authored product theatre.

**Architecture:** Create an isolated static prototype under `prototypes/site-09/`; do not import it from production `src/`, `public/`, routes, or build configuration. A single deterministic state store drives routing, continuous persistent Human/Evidence/Agent reading progress, the homepage decision field, Product's five-state Control Point, Approach, Casework, and Contact. A BP-grounded canonical record graph provides a distinct record for every route and generates all Human, Evidence, and Agent projections, while Vite serves the prototype and Node/Playwright tests verify causality, accessibility, responsive behavior, and visual output.

**Tech Stack:** Semantic HTML, modern CSS, native ES modules, SVG/CSS transforms, Vite 8, Node 24 `node:test`, Playwright 1.61, ImageGen-created raster assets, optional ImageMagick for responsive derivatives.

**Spec:** `docs/superpowers/specs/2026-08-29-site-09-interactive-prototype-design.md`

## Global Constraints

- The prototype lives only in `prototypes/site-09/`; do not modify production `src/`, `public/`, route files, Vite configuration, API handlers, or deployment configuration.
- The canonical category is exactly `AI-Native MarTech Infrastructure`; GEO is an observable entry point, not the company category.
- Product theatre may exceed the visual presentation of Portal, but every demonstrated capability and causal relationship must remain inside Yonaris's product boundary.
- Use deterministic representative fixtures generated from one record model per interaction; do not pretend fixtures are customer, live-market, or production data.
- Do not invent customer names, logos, quotes, rankings, revenue, performance percentages, realtime statuses, precise customer outcomes, or fake production metadata.
- Home must include a visible Commercial Response or Outcome signal returning into a Learn loop so the flagship experience cannot collapse into GEO monitoring.
- Product must express `Observe → Interpret → Execute → Outcome → Learn` as one transforming Control Point, never five cards or conventional tabs.
- Human, Evidence, and Agent views consume the same canonical record, stable fact/source IDs, scope, boundaries, and source relationships.
- Continuous Human/Evidence/Agent reading progress persists across prototype routes; each route's local Agent record remains directly addressable.
- The six pages have different primary compositions and events; do not reuse one Hero, card grid, or footer CTA skeleton.
- Retain Site 08's deep navy, warm ivory, orange signal, mature enterprise tone, image scale, and evidence-lens concept; do not inherit its page skeleton or rejected copy.
- Avoid generic black-gold boardrooms, glass-office stock scenes, floating SaaS cards, universal eyebrow labels, forced five-line headlines, decorative hashes, and ornamental machine metadata.
- No copyrighted stock images, external font/CDN dependencies, remote image URLs, reference-site code, reference-site copy, or pixel-level reproduction.
- Every primary interaction changes shared content or relationship state; animation-only state changes do not count.
- Pointer drag has keyboard and touch equivalents; hover-only content has focus and tap equivalents.
- Support `prefers-reduced-motion`; no information or controls disappear in reduced-motion mode.
- Design mobile task flows at 360px and 390px rather than stacking desktop sections.
- Do not enter production implementation or deployment after this plan; stop at a verified local prototype.

## File Structure

| Path | Responsibility |
|---|---|
| `prototypes/site-09/index.html` | Prototype document shell and metadata |
| `prototypes/site-09/package.json` | Local prototype commands only |
| `prototypes/site-09/vite.config.mjs` | Isolated Vite root and strict local port |
| `prototypes/site-09/playwright.config.mjs` | Local preview and browser-matrix configuration |
| `prototypes/site-09/src/main.js` | Bootstraps store, router, shell, and route renderers |
| `prototypes/site-09/src/model.js` | Representative scenarios, canonical facts/sources, phase constants |
| `prototypes/site-09/src/store.js` | Deterministic shared state and persistent reading mode |
| `prototypes/site-09/src/router.js` | Hash routing for six pages plus the direct Agent record |
| `prototypes/site-09/src/registry.js` | Explicit public and Agent renderer registration |
| `prototypes/site-09/src/derive.js` | Generic Human/Evidence/Agent record derivation only |
| `prototypes/site-09/src/scenes/*.js` | Pure page-specific interaction-frame selectors |
| `prototypes/site-09/content/bp-capability-map.md` | Verified BP capability, customer-language, and prohibited-inference map |
| `prototypes/site-09/src/components/shell.js` | Global navigation, reading-mode controller, footer, route mounting |
| `prototypes/site-09/src/components/home.js` | Market Decision Field and its controls |
| `prototypes/site-09/src/components/product.js` | Five-state transforming MarTech Control Point |
| `prototypes/site-09/src/components/approach.js` | Outcome Spec work-session scene |
| `prototypes/site-09/src/components/human-agent.js` | Three-ring evidence lens and full-page conversion |
| `prototypes/site-09/src/components/casework.js` | Evidence/time-section Before/Change/Re-observe scene |
| `prototypes/site-09/src/components/contact.js` | Two-stage local-only manual-intake simulation |
| `prototypes/site-09/src/interaction.js` | Pointer, keyboard, touch, autoplay, pause, and reduced-motion helpers |
| `prototypes/site-09/src/styles/tokens.css` | Color, type, spacing, easing, and surface tokens |
| `prototypes/site-09/src/styles/base.css` | Reset, typography, focus, controls, and accessibility primitives |
| `prototypes/site-09/src/styles/shell.css` | Navigation, global reading controller, route transition, footer |
| `prototypes/site-09/src/styles/scenes.css` | Distinct page compositions and product-theatre geometry |
| `prototypes/site-09/src/styles/responsive.css` | Deliberate 1024/768/390/360 layouts and reduced motion |
| `prototypes/site-09/assets/brand/` | Copied official Yonaris wordmark and local Geist font files |
| `prototypes/site-09/assets/imagery/` | Generated master and responsive original imagery |
| `prototypes/site-09/tests/*.test.mjs` | Node unit and contract tests |
| `prototypes/site-09/e2e/*.spec.mjs` | Incremental page behavior plus final accessibility, overflow, and state tests |
| `prototypes/site-09/scripts/visual-qa.mjs` | Full-page desktop/mobile screenshots and console-error report |
| `prototypes/site-09/.gitignore` | Ignores generated screenshots and local Vite state |

---

### Task 1: Isolated Prototype Scaffold and Recursive Production Boundary

**Files:**
- Create: `prototypes/site-09/package.json`
- Create: `prototypes/site-09/vite.config.mjs`
- Create: `prototypes/site-09/index.html`
- Create: `prototypes/site-09/src/main.js`
- Create: `prototypes/site-09/.gitignore`
- Create: `prototypes/site-09/tests/structure.test.mjs`

**Interfaces:**
- Consumes: repository-local Vite and Node binaries from the root installation.
- Produces: a static module entry at `/src/main.js`, mount element `#app`, and prototype-only scripts `dev`, `test:unit`, and `test:e2e`.

**Execution precondition:** Execute this plan in a new feature worktree created from the clean `main` commit that contains this approved spec and plan. Before Step 1, run all three commands below; stop if any output differs:

```powershell
git status --porcelain                       # expected: no output
git diff --name-only main...HEAD             # expected: no output
git merge-base HEAD main                     # expected: same hash as `git rev-parse HEAD`
```

This clean worktree commit is the implementation baseline used by Task 10; no pre-existing staged, unstaged, or untracked changes are permitted in the implementation worktree.

- [ ] **Step 1: Write the failing boundary test**

```js
// prototypes/site-09/tests/structure.test.mjs
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { extname } from "node:path";
import test from "node:test";

const root = new URL("../", import.meta.url);
const required = ["index.html", "src/main.js", "vite.config.mjs", "package.json"];
const textExtensions = new Set([".html", ".css", ".js", ".mjs", ".json", ".md"]);

function walk(url) {
  return readdirSync(url, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory() && [".vite", "artifacts", "node_modules"].includes(entry.name)) return [];
    const child = new URL(entry.name + (entry.isDirectory() ? "/" : ""), url);
    return entry.isDirectory() ? walk(child) : [child];
  });
}

test("prototype is isolated from production and remote runtime assets", () => {
  for (const file of required) assert.equal(existsSync(new URL(file, root)), true, file);
  for (const file of walk(root).filter((url) => textExtensions.has(extname(url.pathname)))) {
    const source = readFileSync(file, "utf8");
    assert.doesNotMatch(source, /(?:\.\.\/){2,}(?:src|public)\//, file.pathname);
    assert.doesNotMatch(source, /from\s+["']@\//, file.pathname);
    assert.doesNotMatch(source, /(?:src|href)=["']https?:\/\//, file.pathname);
  }
});
```

- [ ] **Step 2: Run the test and verify the scaffold is absent**

Run: `node --test prototypes/site-09/tests/structure.test.mjs`

Expected: FAIL because the required prototype files do not exist.

- [ ] **Step 3: Create the minimal isolated application shell**

```json
{
  "name": "yonaris-site-09-prototype",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --host 127.0.0.1 --port 4179 --strictPort",
    "test:unit": "node --test tests/*.test.mjs",
    "test:e2e": "playwright test --config playwright.config.mjs",
    "qa": "node scripts/visual-qa.mjs"
  }
}
```

```js
// prototypes/site-09/vite.config.mjs
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  server: { host: "127.0.0.1", port: 4179, strictPort: true },
  preview: { host: "127.0.0.1", port: 4179, strictPort: true },
});
```

`index.html` must contain `#app`, a local stylesheet import, and `<script type="module" src="/src/main.js"></script>`. `src/main.js` must render a visible `Yonaris Site 09 prototype` boot message until Task 4 mounts the first real scene.

- [ ] **Step 4: Rerun the boundary test**

Run: `node --test prototypes/site-09/tests/structure.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit the scaffold**

```bash
git add prototypes/site-09
git commit -m "feat(prototype): scaffold isolated site 09 experience"
```

### Task 2: BP Capability Map, Canonical Record Graph, Continuous Reading State, and Router

**Files:**
- Create: `prototypes/site-09/scripts/verify-bp.mjs`
- Create: `prototypes/site-09/content/bp-capability-map.md`
- Create: `prototypes/site-09/src/model.js`
- Create: `prototypes/site-09/src/store.js`
- Create: `prototypes/site-09/src/router.js`
- Create: `prototypes/site-09/src/derive.js`
- Create: `prototypes/site-09/src/registry.js`
- Create: `prototypes/site-09/tests/content-source.test.mjs`
- Create: `prototypes/site-09/tests/model.test.mjs`
- Create: `prototypes/site-09/tests/store-router.test.mjs`
- Modify: `prototypes/site-09/src/main.js`

**Interfaces:**
- Produces: `ROUTES`, `PRODUCT_PHASES`, `PAGE_RECORDS`, `PRODUCT_DECISION`, `getRecordForRoute()`, `createPrototypeStore()`, `parsePrototypeHash()`, `createHashRouter()`, `createRouteRegistry()`, `deriveAgentRecord()`, `deriveEvidenceView()`, `factCoverage()`, and `readingStageAt()`.
- Consumers: every renderer and every browser test. `#/agent-record/:sourceRoute` always consumes the same canonical record as its Human route.

- [ ] **Step 1: Verify the only approved content source**

`verify-bp.mjs` reads `C:\Users\user\Desktop\Yonaris_Seed_BP_20260812_Final.pdf`, calculates SHA-256, and throws unless it equals `2BB0DCA99B0ACC125B6902CCBD9B4AA2585C96DF5F9C70DF2227B20D1AA67F77`.

Run: `node prototypes/site-09/scripts/verify-bp.mjs`

Expected: stdout contains `BP verified: 2BB0DCA99B0ACC125B6902CCBD9B4AA2585C96DF5F9C70DF2227B20D1AA67F77`.

- [ ] **Step 2: Write failing content, model, store, and router tests**

```js
// prototypes/site-09/tests/model.test.mjs
import assert from "node:assert/strict";
import test from "node:test";
import { PAGE_RECORDS, PRODUCT_DECISION, PRODUCT_PHASES, ROUTES, getRecordForRoute } from "../src/model.js";
import { deriveAgentRecord, deriveEvidenceView, factCoverage, readingStageAt } from "../src/derive.js";

test("every public route has one canonical record graph", () => {
  assert.deepEqual(Object.keys(PAGE_RECORDS), ROUTES);
  for (const route of ROUTES) {
    const record = getRecordForRoute(route);
    assert.equal(record.route, route);
    assert.ok(record.facts.length >= 2, route);
    assert.ok(record.sources.length >= 1, route);
    assert.ok(record.facts.every((fact) => fact.sourceIds.length && fact.scope && fact.boundary), route);
  }
});

test("agent and evidence views preserve exact canonical identities", () => {
  for (const route of ROUTES) {
    const record = getRecordForRoute(route);
    const agent = deriveAgentRecord(record);
    assert.deepEqual(factCoverage(record, agent), { preserved: record.facts.length, total: record.facts.length, ratio: 1 });
    assert.deepEqual(deriveEvidenceView(record).map((item) => item.factId), record.facts.map((fact) => fact.id));
  }
});

test("product owns the complete BP control-point contract", () => {
  assert.deepEqual(PRODUCT_PHASES, ["observe", "interpret", "execute", "outcome", "learn"]);
  assert.ok(PRODUCT_DECISION.phases.interpret.evidenceGrade.length > 0);
  assert.deepEqual(Object.keys(PRODUCT_DECISION.phases.outcome.frozen), ["market", "modelScope", "question", "comparisonConditions"]);
  assert.ok(PRODUCT_DECISION.phases.outcome.outcomeProof.sourceFactIds.length > 0);
  assert.ok(PRODUCT_DECISION.phases.learn.decisionSignals.length > 0);
});

test("continuous reading progress includes the Evidence middle state", () => {
  assert.equal(readingStageAt(0), "human");
  assert.equal(readingStageAt(0.5), "evidence");
  assert.equal(readingStageAt(1), "agent");
});
```

```js
// prototypes/site-09/tests/store-router.test.mjs
import assert from "node:assert/strict";
import test from "node:test";
import { parsePrototypeHash } from "../src/router.js";
import { createPrototypeStore } from "../src/store.js";

test("continuous reading progress persists while scene state resets", () => {
  const memory = new Map();
  const storage = { getItem: (key) => memory.get(key) ?? null, setItem: (key, value) => memory.set(key, value) };
  const store = createPrototypeStore({ storage });
  store.setReadingProgress(0.63);
  store.updateScene("home", { progress: 0.7, playing: false });
  assert.equal(JSON.parse(memory.get("yonaris-site09-reading-progress")), 0.63);
  store.resetScenes();
  assert.equal(store.getState().readingProgress, 0.63);
  assert.equal(store.getState().scenes.home.progress, 0);
});

test("agent records are directly addressable for every source route", () => {
  assert.deepEqual(parsePrototypeHash("#/agent-record/product"), { id: "agent-record", sourceRoute: "product" });
  assert.deepEqual(parsePrototypeHash("#/casework"), { id: "casework", sourceRoute: "casework" });
});
```

`content-source.test.mjs` asserts that `bp-capability-map.md` records the exact hash and all nine allowed BP terms. It also splits at the `Prohibited inference` heading and rejects `guaranteed uplift`, `realtime global coverage`, and `autonomous campaign execution` in the allowed/customer-language portion.

- [ ] **Step 3: Run tests and verify missing modules fail**

Run: `node --test prototypes/site-09/tests/content-source.test.mjs prototypes/site-09/tests/model.test.mjs prototypes/site-09/tests/store-router.test.mjs`

Expected: FAIL with module-not-found errors.

- [ ] **Step 4: Implement the immutable route record graph and generic derivations**

First read the verified PDF and satisfy the already-failing content-source test by writing `bp-capability-map.md` with exactly three sections: `Allowed capability`, `Customer-language expression`, and `Prohibited inference`. Cite BP page numbers for Product Truth, Market Intent, Model / Agent Behavior, Commercial Response, Decision Event, Evidence Grade, Outcome Spec, Outcome Proof, and Decision Signals. Explicitly prohibit autonomous execution, guaranteed uplift, realtime coverage, customer outcomes, and any capability absent from the BP. Rerun only `content-source.test.mjs`; expected PASS before creating `model.js`.

```js
export const ROUTES = ["home", "product", "approach", "human-agent", "casework", "contact"];
export const PRODUCT_PHASES = ["observe", "interpret", "execute", "outcome", "learn"];
```

`PAGE_RECORDS` has one frozen record for every route. Use this exact shape, changing the ID prefix per route:

```js
{
  id: "record-home",
  route: "home",
  disclosure: "Representative product demonstration — not customer performance or live market data.",
  human: {
    headline: "The market is already deciding.",
    summary: "Observe the evidence path before choosing the next intervention.",
    phraseFactIds: ["home-fact-1", "home-fact-2"],
  },
  facts: [
    {
      id: "home-fact-1",
      statement: "A comparison answer can be inspected through its supporting sources and conditions.",
      sourceIds: ["home-source-1"],
      scope: "Representative B2B comparison question",
      boundary: "Demonstrates inspectability; does not claim live-market coverage or customer performance.",
    },
    {
      id: "home-fact-2",
      statement: "A reviewed commercial-response signal can return to the next observation cycle.",
      sourceIds: ["home-source-2"],
      scope: "Representative reviewed response",
      boundary: "Shows the learning relationship without claiming attribution or uplift.",
    },
  ],
  sources: [
    {
      id: "home-source-1",
      title: "Representative public evidence set",
      role: "observed",
      locator: "representative://home/source-1",
      scope: "Deterministic prototype fixture",
    },
    {
      id: "home-source-2",
      title: "Representative reviewed response",
      role: "reviewed",
      locator: "representative://home/source-2",
      scope: "Deterministic prototype fixture",
    },
  ],
}
```

All six records derive their claims from `bp-capability-map.md` and omit ranks, lift percentages, fake timestamps, hashes, and customer names. `PRODUCT_DECISION` belongs to the Product record and contains the tested Evidence Grade, frozen Outcome conditions, Outcome Proof, and Decision Signals.

Use this exact minimum content contract; expand wording only when the BP map cites the supporting page:

| Route | Required fact 1 | Required fact 2 | Representative sources | Boundary |
|---|---|---|---|---|
| Home | A comparison answer can be inspected through sources and conditions. | A reviewed Commercial Response can return to the next observation cycle. | public evidence set; reviewed response | no live coverage, attribution, or uplift claim |
| Product | Observe, Interpret, Execute, Outcome, and Learn belong to one decision record. | Outcome Proof remains tied to frozen market, model scope, question, and comparison conditions. | observed signals; reviewed Outcome Spec | no autonomous execution or guaranteed outcome |
| Approach | The Outcome Spec fixes the decision and comparison conditions before intervention. | Same-condition review keeps the human boundary visible. | frozen question; reviewer note | no claim that the method removes judgment |
| Human / Agent | Human, Evidence, and Agent projections preserve the same fact IDs. | Sources, scope, and boundaries remain attached in every projection. | public statement; source relationship | no claim that machine readability guarantees indexing |
| Casework | An intervention may change an owned evidence relationship. | Unchanged limitations remain explicit after re-observation. | before evidence; same-condition review | no customer result or performance percentage |
| Contact | Consultation begins with one market question and its decision context. | A person reviews fit and recommends the next conversation. | submitted question contract; human-review policy | prototype sends no message and performs no automated audit |

Every representative source uses a stable `representative://<route>/<source>` locator, never a fake public URL or production timestamp.

`deriveAgentRecord(record)` retains exact fact/source IDs. `deriveEvidenceView(record)` returns one item per `phraseFactIds`. `factCoverage()` returns `{ preserved, total, ratio }`. `readingStageAt(progress)` clamps 0–1 and maps 0–0.24 to Human, 0.25–0.74 to Evidence, and 0.75–1 to Agent.

- [ ] **Step 5: Implement continuous shared state, routing, and explicit renderer registration**

```js
export const initialState = {
  route: { id: "home", sourceRoute: "home" },
  readingProgress: 0,
  scenes: {
    home: { progress: 0, playing: true },
    product: { progress: 0 },
    approach: { progress: 0 },
    humanAgent: { lensX: 0.5, lensY: 0.5, expanded: false },
    casework: { mix: 0 },
    contact: { step: 1, status: "idle", values: { website: "", question: "", name: "", email: "", context: "" } },
  },
};
```

`createPrototypeStore({ storage })` exposes `getState`, `subscribe`, `navigate`, `setReadingProgress`, `nudgeReadingProgress`, `updateScene`, and `resetScenes`. Clamp all numeric progress values to 0–1 and persist only `readingProgress` under `yonaris-site09-reading-progress`.

Implement the store in this order: read and validate the stored number; deep-clone `initialState`; hold listeners in a `Set`; use one `commit(recipe)` function that replaces state and synchronously notifies listeners; make `setReadingProgress()` persist after committing; make `updateScene(scene, patch)` reject unknown scene keys; make `resetScenes()` deep-clone only `initialState.scenes`. `subscribe(listener)` returns an unsubscribe function.

`parsePrototypeHash()` accepts all public hashes plus `#/agent-record/:sourceRoute`; invalid input returns Home. `createHashRouter({ onRoute })` owns one `hashchange` listener and exposes `start()` and `destroy()`.

`parsePrototypeHash(hash)` strips the leading `#/`, splits on `/`, validates both the route ID and Agent source route against `ROUTES`, and always returns `{ id, sourceRoute }`. `start()` immediately calls `onRoute(parsePrototypeHash(location.hash))` before installing the listener; `destroy()` removes the exact same listener.

`createRouteRegistry()` exposes `register(route, renderer)`, `resolve(route)`, and `list()`. `resolve()` throws `Missing renderer: <route>`. `main.js` instantiates store/router/registry and prints the parsed route until Task 4 mounts the shell with Home. Each page task below must modify `main.js` to import and register its renderer; no implicit discovery is allowed.

Registry implementation is one private `Map`: `register()` rejects duplicate keys and non-functions, `resolve()` returns the function or throws, and `list()` returns a frozen insertion-order key array. `main.js` keeps exactly one store, router, and registry instance for the page lifetime.

- [ ] **Step 6: Rerun tests and commit the state foundation**

Run: `node --test prototypes/site-09/tests/content-source.test.mjs prototypes/site-09/tests/model.test.mjs prototypes/site-09/tests/store-router.test.mjs`

Expected: PASS.

```bash
git add prototypes/site-09
git commit -m "feat(prototype): add BP-grounded canonical decision state"
```

### Task 3: Authored Visual Foundation and Global Shell

**Files:**
- Create: `prototypes/site-09/src/components/shell.js`
- Create: `prototypes/site-09/src/styles/tokens.css`
- Create: `prototypes/site-09/src/styles/base.css`
- Create: `prototypes/site-09/src/styles/shell.css`
- Create: `prototypes/site-09/src/styles/scenes.css`
- Create: `prototypes/site-09/src/styles/responsive.css`
- Create: `prototypes/site-09/tests/visual-contract.test.mjs`
- Create: `prototypes/site-09/playwright.config.mjs`
- Create: `prototypes/site-09/e2e/shell-harness.html`
- Create: `prototypes/site-09/e2e/shell-harness.js`
- Create: `prototypes/site-09/e2e/shell.spec.mjs`
- Copy: `public/brand/logos/yonaris-wordmark-white.png` → `prototypes/site-09/assets/brand/yonaris-wordmark-white.png`
- Copy: `node_modules/@fontsource/geist-sans/files/geist-sans-latin-400-normal.woff2` → `prototypes/site-09/assets/brand/fonts/geist-sans-latin-400-normal.woff2`
- Copy: `node_modules/@fontsource/geist-sans/files/geist-sans-latin-600-normal.woff2` → `prototypes/site-09/assets/brand/fonts/geist-sans-latin-600-normal.woff2`
- Copy: `node_modules/@fontsource/geist-mono/files/geist-mono-latin-400-normal.woff2` → `prototypes/site-09/assets/brand/fonts/geist-mono-latin-400-normal.woff2`
- Copy: `node_modules/@fontsource/geist-mono/files/geist-mono-latin-600-normal.woff2` → `prototypes/site-09/assets/brand/fonts/geist-mono-latin-600-normal.woff2`

**Interfaces:**
- Consumes: store/router from Task 2.
- Produces: `createShell({ store, router, registry })`, `.site-shell`, `#reading-progress`, `[data-reading-stage]`, `[data-route]`, and global design tokens.

- [ ] **Step 1: Write the visual contract test**

```js
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("visual system is local, focused, and not a floating-card theme", () => {
  const files = ["tokens.css", "base.css", "shell.css", "scenes.css", "responsive.css"];
  const css = files.map((file) => readFileSync(new URL(`../src/styles/${file}`, import.meta.url), "utf8")).join("\n");
  assert.doesNotMatch(css, /https?:\/\//);
  assert.doesNotMatch(css, /transition:\s*all/);
  assert.doesNotMatch(css, /\.bento|\.feature-card|\.dashboard-card/);
  assert.match(css, /--ink:\s*#071722/);
  assert.match(css, /--paper:\s*#f1ede4/);
  assert.match(css, /--signal:\s*#ff5b1a/);
});
```

Create `shell-harness.html` with `#app` and a module import for `shell-harness.js`. The harness imports the real store, router, registry, and shell; it registers the same tiny test renderer for all six route IDs, mounts `createShell()`, and starts the router. Write `shell.spec.mjs` before `shell.js` exists:

```js
import { expect, test } from "@playwright/test";

test("continuous reading depth persists while registry resolves routes", async ({ page }) => {
  await page.goto("/e2e/shell-harness.html#/home");
  const slider = page.getByRole("slider", { name: "Human to Agent reading" });
  await slider.fill("0.55");
  await expect(page.locator("html")).toHaveAttribute("data-reading-stage", "evidence");
  await page.getByRole("link", { name: "Product" }).click();
  await expect(page.locator("main")).toHaveAttribute("data-test-route", "product");
  await expect(slider).toHaveValue("0.55");
  await page.reload();
  await expect(page.getByRole("slider", { name: "Human to Agent reading" })).toHaveValue("0.55");
});
```

Create `playwright.config.mjs` now with `webServer.command = "pnpm dev"`, `webServer.url = "http://127.0.0.1:4179"`, `reuseExistingServer = true`, and one Chromium project at 1440×1000 so the failing browser test can run before Shell implementation.

- [ ] **Step 2: Run the test and verify missing CSS fails**

Run: `node --test prototypes/site-09/tests/visual-contract.test.mjs`

Run: `pnpm --dir prototypes/site-09 test:e2e -- e2e/shell.spec.mjs`

Expected: both FAIL because the CSS and Shell are absent.

- [ ] **Step 3: Implement the shell and token system**

Define local `@font-face` rules for Geist Sans and Geist Mono. Use a system editorial serif stack only for evidence conclusions. Required root tokens:

```css
:root {
  --ink: #071722;
  --ink-raised: #0d2430;
  --paper: #f1ede4;
  --paper-cool: #e7ecea;
  --signal: #ff5b1a;
  --line-dark: rgba(241, 237, 228, 0.18);
  --line-light: rgba(7, 23, 34, 0.18);
  --font-sans: "Geist Site09", "Helvetica Neue", Arial, sans-serif;
  --font-serif: "Iowan Old Style", Baskerville, Georgia, serif;
  --font-mono: "Geist Mono Site09", Consolas, monospace;
  --ease-field: cubic-bezier(0.22, 0.8, 0.24, 1);
}
```

The shell has a restrained top bar, six route links, one prominent continuous `Human — Evidence — Agent` range controller, language label without a fake Chinese prototype link, and a minimal footer. The native range uses `min="0"`, `max="1"`, `step="0.01"`, `aria-label="Human to Agent reading"`, remains visible at all widths, calls `setReadingProgress()`, and updates `--reading-progress` plus `data-reading-stage` on `<html>`. Arrow keys move by `0.05`; Home/End set exact endpoints. This is one continuous transformation, not two buttons switching documents.

The six route containers must use distinct composition classes: `.home-field`, `.product-control-point`, `.approach-workroom`, `.human-agent-transform`, `.casework-section`, and `.contact-threshold`. Shell route changes call `registry.resolve(route.id)` and pass `{ state, store, route }` to the registered renderer. Task 4 replaces the temporary boot text and mounts the shell only after the first real renderer exists.

Implement Shell in five bounded substeps: (1) emit header/nav/range/`<main>`/footer once; (2) attach one delegated click handler for internal hash links and one `input` handler for the range; (3) subscribe to store, update range value, `--reading-progress`, and `data-reading-stage`; (4) replace only `<main>` contents on route changes through `registry.resolve(route.id)`; (5) return `destroy()` that removes handlers, unsubscribes, and clears the mount. Do not rebuild the header during scene updates.

- [ ] **Step 4: Copy only official local brand/font assets and verify**

Run PowerShell `Copy-Item -LiteralPath` for the approved wordmark and the four exact WOFF2 files listed above. Do not copy Site 06 photography. Then run:

`node --test prototypes/site-09/tests/visual-contract.test.mjs`

Expected: PASS.

Import the Playwright config with `node -e "import('./prototypes/site-09/playwright.config.mjs')"`; expected exit code 0.

Run `pnpm --dir prototypes/site-09 test:e2e -- e2e/shell.spec.mjs`; expected PASS before committing the shell.

- [ ] **Step 5: Commit the shell**

```bash
git add prototypes/site-09
git commit -m "feat(prototype): establish site 09 visual shell"
```

### Task 4: Home Market Decision Field

**Files:**
- Create: `prototypes/site-09/src/components/home.js`
- Create: `prototypes/site-09/src/scenes/home-state.js`
- Create: `prototypes/site-09/src/interaction.js`
- Create: `prototypes/site-09/tests/home-field.test.mjs`
- Create: `prototypes/site-09/e2e/home.spec.mjs`
- Modify: `prototypes/site-09/src/main.js`
- Modify: `prototypes/site-09/src/styles/scenes.css`
- Modify: `prototypes/site-09/src/styles/responsive.css`

**Interfaces:**
- Consumes: `getRecordForRoute("home")` and store `scenes.home`.
- Produces: `homeFrameAt(record, progress)`, `renderHome({ state, store, route })`, `createPlaybackController()`, `[data-home-progress]`, `#home-progress`, `#home-play`, and `#home-replay`.

- [ ] **Step 1: Write causal-frame and playback tests**

```js
import assert from "node:assert/strict";
import test from "node:test";
import { getRecordForRoute } from "../src/model.js";
import { homeFrameAt } from "../src/scenes/home-state.js";
import { createPlaybackController } from "../src/interaction.js";

test("home ends with a commercial response feeding learn", () => {
  const frame = homeFrameAt(getRecordForRoute("home"), 1);
  assert.ok(frame.commercialResponse);
  assert.ok(frame.learn);
  assert.notEqual(frame.learn.sourceSignalId, undefined);
});

test("manual interaction stops autoplay and replay resets deterministically", () => {
  const controller = createPlaybackController({ duration: 12000 });
  controller.tick(3000);
  controller.interact(0.62);
  assert.equal(controller.snapshot().playing, false);
  controller.replay();
  assert.deepEqual(controller.snapshot(), { progress: 0, playing: true });
});

test("reduced motion disables autoplay without removing manual frames", () => {
  const controller = createPlaybackController({ duration: 12000, reducedMotion: true });
  controller.tick(6000);
  assert.deepEqual(controller.snapshot(), { progress: 0, playing: false });
  controller.interact(1);
  assert.equal(controller.snapshot().progress, 1);
});
```

Before implementation, write `e2e/home.spec.mjs` to assert: the exact visible category `AI-Native MarTech Infrastructure`; the slider `Scrub the decision field` changes `[data-active-evidence]`, `[data-decision-condition]`, and `[data-outcome-signal]`; manual input changes `[data-home-progress]` to `data-playing="false"`; Replay restores progress 0; and ArrowRight advances by 0.05. Run it once and expect failure because Home is not registered.

- [ ] **Step 2: Run tests and verify missing interaction code fails**

Run: `node --test prototypes/site-09/tests/home-field.test.mjs`

Expected: FAIL.

- [ ] **Step 3: Implement one continuous scene, not a hero/card split**

The Home renderer uses one full-viewport `<section>` containing:

- category statement: `AI-Native MarTech Infrastructure`;
- headline: `The market is already deciding. Make the decision observable.`
- supporting sentence: `Yonaris reveals how people and agents discover, compare and select — then turns the deciding evidence into action and learning.`
- one `<svg class="decision-field">` with source trajectories, evidence anchors, a comparison condition, and a returning outcome path;
- a range input labelled `Scrub the decision field`;
- Pause/Play and Replay controls;
- a visible representative-demonstration disclosure;
- CTA links to Product and Contact.

State changes must update trajectory geometry, evidence labels, decision condition, Commercial Response, and Learn return path together. Do not render phase cards or numbered stage buttons.

At the end of `home.js`, export `registerHome(registry)` which calls `registry.register("home", renderHome)`. `main.js` imports `createShell` and `registerHome`, registers Home, replaces the temporary boot text with `createShell({ store, router, registry })`, and only then calls `router.start()`.

Implement in bounded substeps: (1) make `homeFrameAt()` return five deterministic milestones and interpolate only SVG coordinates between them; (2) render semantic text, disclosure, controls, and one SVG with stable `data-*` selectors; (3) bind range/keyboard/Play/Replay to `store.updateScene("home", patch)`; (4) bind the playback controller and viewport observer; (5) update SVG paths/text from the same derived frame; (6) add desktop and mobile geometry; (7) register and mount.

- [ ] **Step 4: Add autoplay, manual takeover, keyboard/touch parity, and reduced motion**

Autoplay begins only while the field intersects the viewport, pauses when hidden, stops on any manual input, and runs no more than one loop until Replay. ArrowLeft/ArrowRight change the range by `0.05`; Home/End jump to 0/1. Export `prefersReducedMotion()` from `interaction.js`; `createPlaybackController()` receives its result and starts paused when true. Under reduced motion, manual controls still select every frame immediately without trajectory animation.

Run: `node --test prototypes/site-09/tests/home-field.test.mjs`

Run: `pnpm --dir prototypes/site-09 test:e2e -- e2e/home.spec.mjs`

Expected: both PASS.

- [ ] **Step 5: Commit Home**

```bash
git add prototypes/site-09
git commit -m "feat(prototype): build the market decision field"
```

### Task 5: Product Transforming Control Point

**Files:**
- Create: `prototypes/site-09/src/components/product.js`
- Create: `prototypes/site-09/src/scenes/product-state.js`
- Create: `prototypes/site-09/tests/product-control-point.test.mjs`
- Create: `prototypes/site-09/e2e/product.spec.mjs`
- Modify: `prototypes/site-09/src/main.js`
- Modify: `prototypes/site-09/src/styles/scenes.css`
- Modify: `prototypes/site-09/src/styles/responsive.css`

**Interfaces:**
- Consumes: `PRODUCT_DECISION`, `getRecordForRoute("product")`, and store `scenes.product`.
- Produces: `renderProduct({ state, store, route })`, `productFrameAt(decision, progress)`, `#product-control-point`, `#product-progress`, `[data-product-phase]`, and a sticky transforming stage.

- [ ] **Step 1: Write the phase-continuity test**

```js
import assert from "node:assert/strict";
import test from "node:test";
import { PRODUCT_DECISION } from "../src/model.js";
import { productFrameAt } from "../src/scenes/product-state.js";

test("one decision object survives all five control-point states", () => {
  const frames = [0, 0.24, 0.49, 0.74, 1].map((progress) => productFrameAt(PRODUCT_DECISION, progress));
  assert.deepEqual(frames.map((frame) => frame.phase), ["observe", "interpret", "execute", "outcome", "learn"]);
  assert.equal(new Set(frames.map((frame) => frame.decisionId)).size, 1);
  assert.ok(frames[2].actions.length > 1);
  assert.ok(frames[1].evidenceGrade);
  assert.deepEqual(Object.keys(frames[3].frozen), ["market", "modelScope", "question", "comparisonConditions"]);
  assert.ok(frames[3].outcomeProof.sourceFactIds.length > 0);
  assert.ok(frames[4].decisionSignals.length > 0);
  for (let index = 1; index < frames.length; index += 1) {
    assert.notDeepEqual(frames[index].geometry, frames[index - 1].geometry);
    assert.notDeepEqual(frames[index].relationships, frames[index - 1].relationships);
  }
});
```

Before implementation, write `e2e/product.spec.mjs`. It focuses `#product-control-point`, presses End, expects `data-product-phase="learn"`, a visible `[data-decision-signal]`, and the same `[data-decision-id]` value captured in Observe. ArrowUp/ArrowDown and PageUp/PageDown must change the phase; on 390px, filling `#product-progress` must reach all five named states. Run once and expect failure because Product is not registered.

- [ ] **Step 2: Run the test and verify the Product derivation is absent**

Run: `node --test prototypes/site-09/tests/product-control-point.test.mjs`

Expected: FAIL.

- [ ] **Step 3: Implement the five spatial states**

Headline: `One control point from market signal to outcome proof.`

Render one persistent decision core, not five cards:

- Observe: trajectories fan out across AI, search, public evidence, and comparison surfaces;
- Interpret: trajectories collapse into facts, source roles, evidence gaps, and boundaries;
- Execute: the core sends distinct paths to content, brand expression, demand generation, and commercial response;
- Outcome: the scene freezes conditions and exposes action/evidence/result relationships without uplift claims;
- Learn: response and outcome signals feed back into the core.

A vertical scroll corridor controls desktop progress; a labelled range and swipe gesture control mobile progress. ArrowUp/ArrowDown and PageUp/PageDown provide keyboard parity. Phase names may appear as quiet orientation labels but never as clickable cards or tabs.

`productFrameAt()` is a pure clamp-and-select function owned only by `product-state.js`; it never derives or mutates generic records. `registerProduct(registry)` registers `renderProduct`, and `main.js` calls it before `router.start()`.

Implement in bounded substeps: (1) encode the five exact phase frames from `PRODUCT_DECISION`; (2) render one persistent decision-core SVG and one semantic inspection region; (3) bind scroll progress, range, swipe, and keyboard to the same normalized store value; (4) update geometry/relationships without replacing the core node; (5) style desktop sticky corridor; (6) style the mobile task-first control; (7) register Product.

- [ ] **Step 4: Run unit and browser causality tests**

`node --test prototypes/site-09/tests/product-control-point.test.mjs`

`pnpm --dir prototypes/site-09 test:e2e -- e2e/product.spec.mjs`

Expected: both PASS.

- [ ] **Step 5: Commit Product**

```bash
git add prototypes/site-09
git commit -m "feat(prototype): stage the martech control point"
```

### Task 6: Approach Workroom and Casework Evidence Section

**Files:**
- Create: `prototypes/site-09/src/components/approach.js`
- Create: `prototypes/site-09/src/components/casework.js`
- Create: `prototypes/site-09/src/scenes/approach-state.js`
- Create: `prototypes/site-09/src/scenes/casework-state.js`
- Create: `prototypes/site-09/tests/proof-scenes.test.mjs`
- Create: `prototypes/site-09/e2e/proof-scenes.spec.mjs`
- Modify: `prototypes/site-09/src/main.js`
- Modify: `prototypes/site-09/src/styles/scenes.css`
- Modify: `prototypes/site-09/src/styles/responsive.css`

**Interfaces:**
- Consumes: `getRecordForRoute("approach")`, `getRecordForRoute("casework")`, store `scenes.approach.progress`, and store `scenes.casework.mix`.
- Produces: `renderApproach({ state, store, route })`, `renderCasework({ state, store, route })`, `approachFrameAt(record, progress)`, `caseworkFrameAt(record, mix)`, `#approach-progress`, and `#casework-mix`.

- [ ] **Step 1: Write Outcome Spec and honest-diff tests**

```js
import assert from "node:assert/strict";
import test from "node:test";
import { getRecordForRoute } from "../src/model.js";
import { approachFrameAt } from "../src/scenes/approach-state.js";
import { caseworkFrameAt } from "../src/scenes/casework-state.js";

test("approach fixes the decision before it proposes intervention", () => {
  const record = getRecordForRoute("approach");
  const scoped = approachFrameAt(record, 0.2);
  const acted = approachFrameAt(record, 0.75);
  assert.ok(scoped.frozenQuestion);
  assert.ok(scoped.frozenConditions.length > 0);
  assert.ok(acted.humanBoundary);
  assert.ok(acted.intervention.sourceFactIds.length > 0);
});

test("casework exposes changed and unchanged evidence", () => {
  const after = caseworkFrameAt(getRecordForRoute("casework"), 1);
  assert.ok(after.changed.length > 0);
  assert.ok(after.unchanged.length > 0);
  assert.equal(after.performanceClaim, null);
});
```

Before implementation, write `e2e/proof-scenes.spec.mjs`. Approach: fill `#approach-progress` from 0.2 to 0.75 and require the same `[data-frozen-question-id]`, a new `[data-intervention]`, and a visible `[data-human-boundary]`. Casework: focus `#casework-mix`, press End, and require both `[data-casework-changed]` and `[data-casework-unchanged]`; press Home and require the accessible live summary to return to Before. Run once and expect missing-renderer failures.

- [ ] **Step 2: Run tests and verify scene derivations are absent**

Run: `node --test prototypes/site-09/tests/proof-scenes.test.mjs`

Expected: FAIL.

- [ ] **Step 3: Implement Approach as a workroom, not a process grid**

Headline: `Agree the decision before changing the answer.`

Use one large Outcome Spec surface that gains layers as the user scrubs: frozen question, comparison conditions, observed evidence, evidence gap, human boundary, intervention, and same-condition review. An editorial human note remains visible beside the system record. Do not render numbered columns or a four-step strip.

`approachFrameAt()` is owned only by `approach-state.js`. `registerApproach(registry)` registers the renderer, and `main.js` calls it before `router.start()`.

Approach substeps: (1) encode the fixed question ID and five Outcome Spec layers; (2) render one `<section data-outcome-spec>` plus editorial note; (3) bind the range/keyboard to store progress; (4) reveal layers from the derived frame while the question ID remains; (5) style the workroom composition; (6) register Approach.

- [ ] **Step 4: Implement Casework as a reversible evidence/time section**

Headline: `See what changed — and what still cannot be claimed.`

The user drags one divider across the same answer/evidence field. The before side shows reliance on a third-party proof; the change side shows an inspectable owned evidence boundary; the re-observe side shows the new source relationship and preserves explicit limitations. The drag control exposes ArrowLeft/ArrowRight, Home/End, tap anchors for Before/Change/Re-observe, and an accessible live summary.

`caseworkFrameAt()` is owned only by `casework-state.js`. `registerCasework(registry)` registers the renderer, and `main.js` calls it before `router.start()`.

Casework substeps: (1) encode Before/Change/Re-observe frames with explicit `changed` and `unchanged`; (2) render one clipped evidence plane and divider; (3) bind pointer capture, tap anchors, and keyboard to one mix value; (4) update the accessible live summary; (5) style desktop and task-first mobile layouts; (6) register Casework.

Run: `node --test prototypes/site-09/tests/proof-scenes.test.mjs`

Run: `pnpm --dir prototypes/site-09 test:e2e -- e2e/proof-scenes.spec.mjs`

Expected: both PASS.

- [ ] **Step 5: Commit proof scenes**

```bash
git add prototypes/site-09
git commit -m "feat(prototype): add accountable work and casework scenes"
```

### Task 7: Human/Agent Evidence Lens and Direct Agent Record

**Files:**
- Create: `prototypes/site-09/src/components/human-agent.js`
- Create: `prototypes/site-09/tests/human-agent.test.mjs`
- Create: `prototypes/site-09/e2e/human-agent.spec.mjs`
- Modify: `prototypes/site-09/src/interaction.js`
- Modify: `prototypes/site-09/src/components/shell.js`
- Modify: `prototypes/site-09/src/main.js`
- Modify: `prototypes/site-09/src/styles/scenes.css`
- Modify: `prototypes/site-09/src/styles/responsive.css`

**Interfaces:**
- Consumes: `PAGE_RECORDS`, `deriveEvidenceView`, `deriveAgentRecord`, `factCoverage`, store `readingProgress`, and store `scenes.humanAgent`.
- Produces: `renderHumanAgent({ state, store, route })`, `renderReadingProjection({ record, progress })`, `renderAgentRecord({ state, store, route })`, `createLensController()`, `#evidence-lens`, and direct routes `#/agent-record/:sourceRoute`.

- [ ] **Step 1: Write mapping, persistence, and controller tests**

```js
import assert from "node:assert/strict";
import test from "node:test";
import { PAGE_RECORDS, ROUTES, getRecordForRoute } from "../src/model.js";
import { deriveAgentRecord, deriveEvidenceView, factCoverage } from "../src/derive.js";
import { createLensController } from "../src/interaction.js";

test("all six routes have Human, Evidence, and Agent parity", () => {
  assert.deepEqual(Object.keys(PAGE_RECORDS), ROUTES);
  for (const route of ROUTES) {
    const record = getRecordForRoute(route);
    const evidence = deriveEvidenceView(record);
    const agent = deriveAgentRecord(record);
    assert.deepEqual(factCoverage(record, agent), { preserved: record.facts.length, total: record.facts.length, ratio: 1 });
    assert.deepEqual(evidence.map((item) => item.factId), agent.facts.map((fact) => fact.id));
  }
});

test("lens has pointer, keyboard, and tap movement", () => {
  const lens = createLensController({ x: 0.5, y: 0.5 });
  lens.moveByKeyboard("ArrowRight");
  lens.moveByTap(0.2, 0.3);
  assert.deepEqual(lens.snapshot(), { x: 0.2, y: 0.3, expanded: false });
});
```

Before implementation, write `e2e/human-agent.spec.mjs`. For each public route, fill `#reading-progress` with `0`, `0.5`, and `1`; expect `data-reading-stage` Human/Evidence/Agent, expect `[data-active-reading-record]` to equal that route, and expect the set of `[data-reading-fact-id]` values to remain identical. Navigate directly to `#/agent-record/product` and assert its `[data-fact-id]` values equal the Product page set. On the Human/Agent page, ArrowRight on the lens must change `[data-active-fact]`; tap coordinates must reveal the same fact/source/scope/boundary panel. Run once and expect failure.

- [ ] **Step 2: Run tests and verify the lens controller is absent**

Run: `node --test prototypes/site-09/tests/human-agent.test.mjs`

Expected: FAIL.

- [ ] **Step 3: Implement the local three-ring evidence lens**

Headline: `One public truth. Two readable forms.`

The outer ring preserves the Human statement, the middle ring reveals fact/source/scope/boundary, and the inner ring reveals the Agent record. Moving the lens updates an actual phrase/fact relationship and the readable inspection panel; it must not merely clip an unrelated visual layer. The rings remain circular at all target widths.

`createLensController()` belongs to `interaction.js`, clamps x/y, and exposes `moveByPointer`, `moveByKeyboard`, `moveByTap`, `toggleExpanded`, and `snapshot`.

Lens substeps: (1) create the pure controller and pass unit tests; (2) render three concentric SVG rings with one focusable control surface; (3) map normalized x/y to the nearest phrase anchor; (4) render the active fact/source/scope/boundary from that anchor; (5) add pointer capture, tap, arrows, and expand/collapse; (6) preserve circular geometry with `aspect-ratio: 1` at every width.

- [ ] **Step 4: Implement whole-page transformation and direct Agent record**

`renderReadingProjection()` receives the current route's record from `getRecordForRoute(route.sourceRoute)`. The persistent shell controller interpolates `--reading-progress`; every route keeps its scene but regroups prose, evidence relations, and Agent facts from that route's record. `renderAgentRecord({ state, store, route })` reads `route.sourceRoute`, then `#/agent-record/:sourceRoute` renders semantic `<article>`, `<dl>`, stable fragment IDs, and source links from the same object. Render coverage from `{ preserved, total }`, for example `2 of 2 facts retained`; never hardcode a count or `0 facts lost`.

`registerHumanAgent(registry)` registers both `human-agent` and `agent-record`. `main.js` invokes it before `router.start()`. `shell.js` calls `renderReadingProjection()` for every route, not only Human/Agent.

Global projection substeps: (1) render all current-route fact nodes once with stable IDs; (2) bind CSS opacity/position/grouping to numeric `--reading-progress`; (3) keep fact nodes in the DOM at all stages; (4) implement the semantic Agent article wrapper; (5) add route-specific direct links; (6) register both renderers and run all-route parity tests.

Run: `node --test prototypes/site-09/tests/human-agent.test.mjs`

Run: `pnpm --dir prototypes/site-09 test:e2e -- e2e/human-agent.spec.mjs`

Expected: both PASS.

- [ ] **Step 5: Commit Human/Agent**

```bash
git add prototypes/site-09
git commit -m "feat(prototype): create the human agent evidence transform"
```

### Task 8: Progressive Contact Threshold

**Files:**
- Create: `prototypes/site-09/src/components/contact.js`
- Create: `prototypes/site-09/tests/contact.test.mjs`
- Create: `prototypes/site-09/e2e/contact.spec.mjs`
- Modify: `prototypes/site-09/src/main.js`
- Modify: `prototypes/site-09/src/styles/scenes.css`
- Modify: `prototypes/site-09/src/styles/responsive.css`

**Interfaces:**
- Consumes: `getRecordForRoute("contact")` and store `scenes.contact`.
- Produces: `renderContact({ state, store, route })`, `validateContactStep()`, `submitLocalIntake()`, `#contact-form`, and local success/error states.

- [ ] **Step 1: Write progressive-intake and value-preservation tests**

```js
import assert from "node:assert/strict";
import test from "node:test";
import { submitLocalIntake, validateContactStep } from "../src/components/contact.js";

test("step one only requires website and a real market question", () => {
  assert.deepEqual(validateContactStep(1, { website: "yonaris.com", question: "" }), { question: "Bring one real market question." });
  assert.deepEqual(validateContactStep(1, { website: "yonaris.com", question: "What determines trust in this category?" }), {});
});

test("a simulated error preserves every submitted value", async () => {
  const values = { website: "yonaris.com", question: "What decides the shortlist?", name: "Alex", email: "alex@example.com", context: "Multi-market launch" };
  const result = await submitLocalIntake(values, { outcome: "error" });
  assert.equal(result.status, "error");
  assert.deepEqual(result.values, values);
});
```

Before implementation, write `e2e/contact.spec.mjs`. It proves Step 1 only exposes website/company, market question, and Continue; invalid Continue focuses the market-question error; valid input reveals Step 2; `?intake=error` preserves all entered values after the recoverable error; Replay/try-again succeeds locally and shows `Prototype only — no message was sent.`. Assert no request is made outside `127.0.0.1`. Run once and expect a missing-renderer failure.

- [ ] **Step 2: Run tests and verify the Contact module is absent**

Run: `node --test prototypes/site-09/tests/contact.test.mjs`

Expected: FAIL.

- [ ] **Step 3: Implement the two-stage local-only intake**

Headline: `Bring the market question your team keeps having to answer.`

Step 1 fields: website/company and market question. Step 2 fields: name, email, and optional context. Visible copy states: `Every submission is reviewed by a person. We reply with fit, a recommended starting point, and the next conversation — not an automated audit.`

`submitLocalIntake()` uses no network. It returns deterministic success or error for QA, preserves values on error, and displays `Prototype only — no message was sent.` on success. The primary path defaults to success; `?intake=error` enables the recoverable-error demonstration for tests.

`registerContact(registry)` registers `renderContact`, and `main.js` invokes it before `router.start()`.

Implement in bounded substeps: (1) render Step 1 fields and inline errors; (2) validate and focus the first error; (3) preserve values while replacing the field group with Step 2; (4) implement deterministic local success/error without `fetch`; (5) add retry with preserved values; (6) style the threshold scene and mobile reading order; (7) register Contact.

- [ ] **Step 4: Run tests and verify the interaction**

Run: `node --test prototypes/site-09/tests/contact.test.mjs`

Run: `pnpm --dir prototypes/site-09 test:e2e -- e2e/contact.spec.mjs`

Expected: both PASS.

- [ ] **Step 5: Commit Contact**

```bash
git add prototypes/site-09
git commit -m "feat(prototype): add the progressive human intake"
```

### Task 9: Original Image World and Visual Integration

**Files:**
- Create: `prototypes/site-09/assets/imagery/refraction-decision-master.png`
- Create: `prototypes/site-09/assets/imagery/refraction-decision-768.webp`
- Create: `prototypes/site-09/assets/imagery/refraction-decision-1280.webp`
- Create: `prototypes/site-09/assets/imagery/refraction-decision-1920.webp`
- Create: `prototypes/site-09/assets/imagery/selection-workroom-master.png`
- Create: `prototypes/site-09/assets/imagery/selection-workroom-768.webp`
- Create: `prototypes/site-09/assets/imagery/selection-workroom-1280.webp`
- Create: `prototypes/site-09/assets/imagery/selection-workroom-1920.webp`
- Create: `prototypes/site-09/assets/imagery/boundary-evidence-master.png`
- Create: `prototypes/site-09/assets/imagery/boundary-evidence-768.webp`
- Create: `prototypes/site-09/assets/imagery/boundary-evidence-1280.webp`
- Create: `prototypes/site-09/assets/imagery/boundary-evidence-1920.webp`
- Create: `prototypes/site-09/assets/imagery/manifest.json`
- Create: `prototypes/site-09/tests/imagery.test.mjs`
- Modify: `prototypes/site-09/src/components/home.js`
- Modify: `prototypes/site-09/src/components/approach.js`
- Modify: `prototypes/site-09/src/components/casework.js`
- Modify: `prototypes/site-09/src/components/contact.js`
- Modify: `prototypes/site-09/src/styles/scenes.css`

**Interfaces:**
- Produces: three internally consistent, copyright-safe image families and a manifest with role, crop focus, dimensions, file size, and SHA-256.
- Consumers: Home, Approach, Casework, and Contact visual compositions.

- [ ] **Step 1: Write the asset contract test**

```js
import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import test from "node:test";

test("only approved original image families ship", async () => {
  const expectedFiles = [
    "boundary-evidence-1280.webp", "boundary-evidence-1920.webp", "boundary-evidence-768.webp", "boundary-evidence-master.png",
    "manifest.json",
    "refraction-decision-1280.webp", "refraction-decision-1920.webp", "refraction-decision-768.webp", "refraction-decision-master.png",
    "selection-workroom-1280.webp", "selection-workroom-1920.webp", "selection-workroom-768.webp", "selection-workroom-master.png",
  ];
  assert.deepEqual((await readdir(new URL("../assets/imagery/", import.meta.url))).sort(), expectedFiles);
  const manifest = JSON.parse(await readFile(new URL("../assets/imagery/manifest.json", import.meta.url), "utf8"));
  assert.deepEqual(manifest.families.map((family) => family.id), ["refraction-decision", "selection-workroom", "boundary-evidence"]);
  for (const family of manifest.families) {
    assert.equal(family.origin, "Yonaris ImageGen original");
    assert.equal(family.master.endsWith("-master.png"), true);
    assert.deepEqual(family.variants.map(({ width, height }) => [width, height]), [[768, 480], [1280, 800], [1920, 1200]]);
    for (const variant of family.variants) {
      const file = new URL(`../assets/imagery/${variant.file}`, import.meta.url);
      assert.ok((await stat(file)).size <= 350_000, variant.file);
      assert.match(variant.sha256, /^[a-f0-9]{64}$/);
    }
  }
});
```

- [ ] **Step 2: Run the test and verify the manifest is absent**

Run: `node --test prototypes/site-09/tests/imagery.test.mjs`

Expected: FAIL.

- [ ] **Step 3: Generate three masters with the ImageGen skill**

Use these distinct but related prompts; every prompt requires no logos, no readable text, no UI screenshots, no watermarks, no luxury boardroom, no orange light beam, and no generic executive portrait:

- `refraction-decision`: an editorial cinematic scene where layers of optical glass and moving public information traces refract around a real B2B decision table; cool nocturnal navy, warm neutral material, restrained human presence, large negative space;
- `selection-workroom`: documentary close view of hands comparing physical evidence, transparent sheets, annotations, and projected boundaries in an active work session; tactile, intelligent, imperfect, not posed;
- `boundary-evidence`: architectural-material study of light crossing paper, glass, and a precise physical boundary, with a distant human action rather than a portrait; calm, rigorous, globally neutral.

Inspect each generated master at original resolution before accepting it.

- [ ] **Step 4: Create responsive derivatives and integrate them as spatial material**

Create only the nine exact WebP derivatives listed above at 768×480, 1280×800, and 1920×1200. Use a 16:10 authored crop, WebP quality 84, strip EXIF/ICC/comment metadata, and keep every derivative under 350 KB. `manifest.json` uses `{ families: [{ id, origin, master, cropFocus, roles, variants: [{ file, width, height, sha256 }] }] }`; record the master SHA-256 separately as `masterSha256`.

Exact placement is: Home uses `refraction-decision`; Approach uses `selection-workroom`; Casework and Contact use `boundary-evidence`. Images must participate in the scene: Home trajectories emerge from refraction planes; Approach evidence anchors align with workroom materials; Casework's divider intersects the boundary image; Contact's threshold line continues into the material boundary. Use `<picture>` with the three exact variants, explicit intrinsic dimensions, `decoding="async"`, and scene-specific alt text. Do not place rounded interface cards on top of the images.

Run: `node --test prototypes/site-09/tests/imagery.test.mjs`

Expected: PASS.

- [ ] **Step 5: Commit the original image world**

```bash
git add prototypes/site-09
git commit -m "feat(prototype): establish the original image world"
```

### Task 10: Browser Matrix, Visual QA, and Persistent Local Preview

**Files:**
- Modify: `prototypes/site-09/playwright.config.mjs`
- Create: `prototypes/site-09/e2e/prototype.spec.mjs`
- Create: `prototypes/site-09/scripts/visual-qa.mjs`
- Modify: `prototypes/site-09/src/interaction.js`
- Modify: `prototypes/site-09/src/components/shell.js`
- Modify: `prototypes/site-09/src/components/home.js`
- Modify: `prototypes/site-09/src/components/product.js`
- Modify: `prototypes/site-09/src/components/approach.js`
- Modify: `prototypes/site-09/src/components/human-agent.js`
- Modify: `prototypes/site-09/src/components/casework.js`
- Modify: `prototypes/site-09/src/components/contact.js`
- Modify: `prototypes/site-09/src/styles/base.css`
- Modify: `prototypes/site-09/src/styles/shell.css`
- Modify: `prototypes/site-09/src/styles/scenes.css`
- Modify: `prototypes/site-09/src/styles/responsive.css`

**Interfaces:**
- Consumes: complete prototype.
- Produces: passing unit/E2E suites, full-page screenshots in ignored `artifacts/`, a console-error report, and a persistent local preview at `http://127.0.0.1:4179/#/home`.

- [ ] **Step 1: Write end-to-end behavior tests before final polish**

```js
import { expect, test } from "@playwright/test";

const routes = ["home", "product", "approach", "human-agent", "casework", "contact"];

for (const route of routes) {
  test(`${route} renders without horizontal overflow`, async ({ page }) => {
    await page.goto(`/#/${route}`);
    await expect(page.locator("main")).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test("continuous reading depth persists across routes and agent record preserves facts", async ({ page }) => {
  await page.goto("/#/home");
  await page.getByRole("slider", { name: /human to agent reading/i }).fill("1");
  await page.getByRole("link", { name: "Product" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-reading-stage", "agent");
  const productFactIds = await page.locator("[data-reading-fact-id]").evaluateAll((nodes) => nodes.map((node) => node.dataset.readingFactId));
  await page.goto("/#/agent-record/product");
  const agentFactIds = await page.locator("[data-fact-id]").evaluateAll((nodes) => nodes.map((node) => node.dataset.factId));
  expect(agentFactIds).toEqual(productFactIds);
});

test("home identifies the category before interaction", async ({ page }) => {
  await page.goto("/#/home");
  await expect(page.getByText("AI-Native MarTech Infrastructure", { exact: true })).toBeVisible();
});

test("manual Home input changes evidence and stops autoplay", async ({ page }) => {
  await page.goto("/#/home");
  const slider = page.getByRole("slider", { name: /scrub the decision field/i });
  await slider.fill("0.82");
  await expect(page.locator("[data-home-progress]")).toHaveAttribute("data-playing", "false");
  await expect(page.locator("[data-outcome-signal]")).toBeVisible();
});

test("product keyboard control reaches Learn on the same decision", async ({ page }) => {
  await page.goto("/#/product");
  await page.locator("#product-control-point").focus();
  await page.keyboard.press("End");
  await expect(page.locator("[data-product-phase]")).toHaveAttribute("data-product-phase", "learn");
  await expect(page.locator("[data-decision-signal]")).toBeVisible();
});

test("approach changes the shared Outcome Spec", async ({ page }) => {
  await page.goto("/#/approach");
  await page.locator("#approach-progress").fill("0.75");
  await expect(page.locator("[data-outcome-spec]")).toHaveAttribute("data-stage", "intervention");
  await expect(page.locator("[data-human-boundary]")).toBeVisible();
});

test("evidence lens changes the inspected canonical fact", async ({ page }) => {
  await page.goto("/#/human-agent");
  const lens = page.locator("#evidence-lens");
  await lens.focus();
  const before = await page.locator("[data-active-fact]").getAttribute("data-active-fact");
  await page.keyboard.press("ArrowRight");
  await expect.poll(() => page.locator("[data-active-fact]").getAttribute("data-active-fact")).not.toBe(before);
});

test("casework exposes both change and unchanged limits", async ({ page }) => {
  await page.goto("/#/casework");
  const section = page.locator("#casework-mix");
  await section.focus();
  await page.keyboard.press("End");
  await expect(page.locator("[data-casework-changed]")).toBeVisible();
  await expect(page.locator("[data-casework-unchanged]")).toBeVisible();
});

test("contact advances progressively and preserves an error submission", async ({ page }) => {
  await page.goto("/?intake=error#/contact");
  await page.getByLabel("Website or company").fill("yonaris.com");
  await page.getByLabel("Market question").fill("What determines the shortlist?");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("Name").fill("Alex");
  await page.getByLabel("Email").fill("alex@example.com");
  await page.getByRole("button", { name: /send for human review/i }).click();
  await expect(page.getByRole("alert")).toContainText("Try again");
  await expect(page.getByLabel("Email")).toHaveValue("alex@example.com");
});
```

- [ ] **Step 2: Configure the browser matrix and run failures**

Expand the existing Playwright config to exact Chromium projects: desktop 1440×1000, laptop 1280×800, tablet 1024×768, mobile 390×844 with touch, and mobile 360×800 with touch. Keep the Vite `webServer` created in Task 3. Add a separate reduced-motion describe block that calls `page.emulateMedia({ reducedMotion: "reduce" })`, waits four seconds on Home, and asserts progress did not auto-advance while all controls and final information remain reachable.

Run: `pnpm --dir prototypes/site-09 test:e2e`

Expected: initial failures identify unfinished responsive or accessibility work.

- [ ] **Step 3: Complete accessibility, responsive, and reduced-motion fixes**

Require all six routes plus all six `#/agent-record/:sourceRoute` paths to pass:

- keyboard navigation and visible focus;
- touch targets of at least 44px;
- no horizontal overflow;
- no hover-only inaccessible content;
- no console errors or failed local assets;
- stateful controls expose labels and current values;
- reduced-motion renders the same information without autoplay or trajectory animation;
- mobile scenes reorder their task and controls instead of simply stacking desktop columns.

Add the shared minimum-target and reduced-motion contracts rather than page-local exceptions:

```css
.scene-control,
.mode-control,
.route-link {
  min-inline-size: 44px;
  min-block-size: 44px;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Keep the reusable motion gate introduced in Task 4 as the only autoplay gate, and make every later autoplay controller consume it:

```js
export const prefersReducedMotion = () =>
  globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
```

- [ ] **Step 4: Capture and inspect the complete visual matrix**

`scripts/visual-qa.mjs` must capture every route at 1440×1000 and 390×844, plus exact named states: Home `start`, `manual-outcome`, `replay`; Product `observe`, `interpret`, `execute`, `outcome`, `learn`; Approach `scope`, `intervention`, `review`; Human/Agent `human`, `evidence`, `agent`, `lens-expanded`; Casework `before`, `change`, `re-observe`; Contact `step-1`, `step-2`, `error`, `success`. It records page errors, console errors, request failures, missing assets, document dimensions, active route, reading progress, and screenshot path in `artifacts/qa-report.json`.

Run:

```bash
pnpm --dir prototypes/site-09 test:unit
pnpm --dir prototypes/site-09 test:e2e
pnpm --dir prototypes/site-09 qa
```

Expected: all tests PASS, `qa-report.json` contains empty error arrays, and manual image inspection finds no template repetition, clipped content, broken lens geometry, generic floating cards, or mobile desktop-stacking.

- [ ] **Step 5: Run production-boundary verification and commit**

Compare the prototype branch to its merge-base with `main` and require every implementation path to start with `prototypes/site-09/`:

```powershell
$baseline = git merge-base HEAD main
$committed = git diff --name-only "$baseline..HEAD"
$working = git diff --name-only
$untracked = git ls-files --others --exclude-standard
$changed = @($committed; $working; $untracked) | Sort-Object -Unique
$unexpected = $changed | Where-Object { $_ -notlike 'prototypes/site-09/*' }
if ($unexpected) { throw "Production files changed: $($unexpected -join ', ')" }
```

```bash
git add prototypes/site-09
git commit -m "test(prototype): verify the complete site 09 experience"
```

- [ ] **Step 6: Start a persistent hidden local preview and hand off only the URL**

Use a hidden Windows process with working directory `prototypes/site-09` and command `pnpm dev`. Verify HTTP 200, Home title, all six navigation links, and zero browser console errors before opening `http://127.0.0.1:4179/#/home` in the Codex browser panel.

Do not merge into production, deploy to Vercel, or modify the public domain. The user's next decision is whether this complete local prototype is visually and experientially approved.
