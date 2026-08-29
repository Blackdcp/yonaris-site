# Yonaris English Website 1.0 Visual Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete local, high-fidelity English 1.0 visual prototype for Home, Product, Casework, Company, Human/Agent, and Contact so the user can approve visual design and interaction before production development begins.

**Architecture:** Create an isolated vanilla Vite prototype under `prototypes/site-10` in a dedicated git worktree. A single disclosed `BuyerQuestionRecord` feeds every page, while each page owns one visual event. Reuse only the approved Yonaris wordmark, local fonts, and original Site 09 imagery; do not copy Site 09 page code or rejected interaction structure.

**Tech Stack:** Vite, semantic HTML, modular CSS, ES modules, Node test runner, Playwright.

**Spec:** `docs/superpowers/specs/2026-08-29-english-site-1-0-design.md`

## Global Constraints

- This is a local visual prototype only; it must not modify production routes, API delivery, Vercel configuration, or LAS.
- Build the whole English site, not only Home.
- Primary navigation is exactly `Product`, `Casework`, `Company`, `Talk to Yonaris`.
- Human/Agent is prominent inside the experience but absent from primary navigation.
- Primary hero CTA is `See Yonaris in action`; it is ungated.
- Contact requires only `Work email`; all other fields are optional.
- The representative question is exactly: `Which analytics partner can support an enterprise marketing team across several markets without losing local context or evidence?`
- The representative entities are `Your company`, `Alternative A`, and `Alternative B`.
- The prototype must visibly disclose representative content and must not show invented customer results, rankings, live data, or performance percentages.
- The evidence lens remains the one explicitly inherited signature interaction.
- Reuse Site 09 brand fonts, official wordmark, and original imagery only; no remote media or stock photos.
- Do not reproduce Scrunch, Bluefish, or DeepLumen page geometry or signature effects.
- Every major interaction must change information or reveal causality.
- All routes must remain usable at 1440, 1024, and 390 pixels with keyboard, touch, and reduced motion.

---

## File Structure

```text
prototypes/site-10/
  index.html                         Vite entry document
  package.json                       prototype scripts and dependencies
  vite.config.mjs                    local preview server
  playwright.config.mjs              browser test matrix
  assets/brand/                      approved wordmark and local fonts
  assets/imagery/                    approved original image derivatives
  src/main.js                        boot and route mounting
  src/router.js                      hash route parsing and navigation
  src/model.js                       canonical representative buyer record
  src/shell.js                       header, footer, route frame
  src/pages/home.js                  answer-field and product-preview scenes
  src/pages/product.js               continuous question workspace
  src/pages/casework.js              representative walkthrough
  src/pages/company.js               concise company and boundary page
  src/pages/human-agent.js           deep evidence-lens page
  src/pages/contact.js               low-friction contact prototype
  src/interactions/evidence-lens.js  shared lens controller
  src/styles/tokens.css              colour, type, spacing, motion tokens
  src/styles/base.css                reset and semantic defaults
  src/styles/shell.css               navigation, footer, route transitions
  src/styles/home.css                Home compositions
  src/styles/product.css             Product compositions
  src/styles/pages.css               Casework, Company, Human/Agent, Contact
  src/styles/responsive.css          breakpoint and reduced-motion rules
  tests/model.test.mjs               copy/data truth contract
  tests/structure.test.mjs           IA and CTA contract
  e2e/site.spec.mjs                  route, interaction, overflow, console QA
```

---

### Task 1: Isolated Prototype Foundation and Truth Contract

**Files:**
- Create: `prototypes/site-10/index.html`
- Create: `prototypes/site-10/package.json`
- Create: `prototypes/site-10/vite.config.mjs`
- Create: `prototypes/site-10/src/main.js`
- Create: `prototypes/site-10/src/router.js`
- Create: `prototypes/site-10/src/model.js`
- Create: `prototypes/site-10/src/shell.js`
- Create: `prototypes/site-10/src/styles/tokens.css`
- Create: `prototypes/site-10/src/styles/base.css`
- Create: `prototypes/site-10/src/styles/shell.css`
- Create: `prototypes/site-10/tests/model.test.mjs`
- Create: `prototypes/site-10/tests/structure.test.mjs`
- Copy: approved fonts, wordmark, and original image derivatives from the Site 09 worktree into `prototypes/site-10/assets/`

**Interfaces:**
- Produces: `BUYER_RECORD`, `ROUTES`, `routeForHash(hash)`, `renderShell(pageHtml, activeRoute)`, and `mountRoute()`.
- Consumes: approved English 1.0 spec and existing local assets only.

- [ ] **Step 1: Write the truth-contract tests**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { BUYER_RECORD, NAV_ITEMS } from "../src/model.js";

test("uses the approved buyer question and entities", () => {
  assert.equal(BUYER_RECORD.question, "Which analytics partner can support an enterprise marketing team across several markets without losing local context or evidence?");
  assert.deepEqual(BUYER_RECORD.entities, ["Your company", "Alternative A", "Alternative B"]);
});

test("keeps Human Agent out of primary navigation", () => {
  assert.deepEqual(NAV_ITEMS.map((item) => item.label), ["Product", "Casework", "Company", "Talk to Yonaris"]);
});
```

- [ ] **Step 2: Run tests and verify they fail because the model does not exist**

Run: `npm --prefix prototypes/site-10 test`

Expected: FAIL with `ERR_MODULE_NOT_FOUND`.

- [ ] **Step 3: Implement the representative record, router, shell, tokens, and semantic route frame**

The record must contain one observed question, four channel answers, three comparison reasons, evidence links, one reviewed action, one changed observation, one unchanged limitation, Human/Evidence/Agent representations, and the representative disclosure. The shell must render the approved navigation and footer links.

- [ ] **Step 4: Copy only approved local assets and record their origin in `assets/imagery/manifest.json`**

The manifest must identify every file as an original Yonaris visual asset reused from Site 09 and must contain no remote URL or stock attribution.

- [ ] **Step 5: Run unit tests and inspect the blank routed shell at 1440 and 390 pixels**

Run: `npm --prefix prototypes/site-10 test`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add prototypes/site-10
git commit -m "prototype: scaffold English site 1.0 visual system"
```

---

### Task 2: Home Buyer-Answer Experience

**Files:**
- Create: `prototypes/site-10/src/pages/home.js`
- Create: `prototypes/site-10/src/styles/home.css`
- Modify: `prototypes/site-10/src/main.js`
- Modify: `prototypes/site-10/tests/structure.test.mjs`

**Interfaces:**
- Consumes: `BUYER_RECORD`, `renderShell()`.
- Produces: `renderHome(record)` and Home controls with `data-channel`, `data-reason`, `data-home-view`, and `data-lens-depth` hooks.

- [ ] **Step 1: Add failing Home structure tests**

Assert the exact headline `Know what buyers are being told—and what to change.`, the ungated `See Yonaris in action` action, all four channel labels, five product-preview labels, near-full-screen Human/Agent section, Casework disclosure, and closing `Talk to Yonaris` CTA.

- [ ] **Step 2: Run the focused tests and verify failure**

Run: `node --test prototypes/site-10/tests/structure.test.mjs`

Expected: FAIL because `renderHome` is absent.

- [ ] **Step 3: Implement the hero answer field**

Use a two-part editorial field: the buyer question and shortlist logic occupy the left/centre; a cropped original image and evidence rays establish physical depth on the right. Channel selection must update the answer, comparison reason, source, and evidence attachment in the same visual field.

- [ ] **Step 4: Implement the continuous Product preview**

Keep the buyer question fixed while the user selects `What buyers ask`, `What they hear`, `Why they hear it`, `What your team can change`, and `What changed afterwards`. Every selection updates the central record rather than swapping a marketing card.

- [ ] **Step 5: Implement the full-width Human/Agent signature and Casework preview**

The signature uses the three-layer evidence lens and the copy `One fact. Two readers. No conflicting versions.` It links to `#/human-agent` but does not add a navigation item.

- [ ] **Step 6: Verify desktop/mobile composition and commit**

```bash
git add prototypes/site-10/src/pages/home.js prototypes/site-10/src/styles/home.css prototypes/site-10/src/main.js prototypes/site-10/tests/structure.test.mjs
git commit -m "prototype: design buyer-clarity home experience"
```

---

### Task 3: Product Question Workspace

**Files:**
- Create: `prototypes/site-10/src/pages/product.js`
- Create: `prototypes/site-10/src/styles/product.css`
- Modify: `prototypes/site-10/src/main.js`
- Modify: `prototypes/site-10/tests/structure.test.mjs`

**Interfaces:**
- Consumes: `BUYER_RECORD`, `renderShell()`.
- Produces: `renderProduct(record)` with `data-product-view` controls and one persistent `data-decision-record` surface.

- [ ] **Step 1: Add failing Product tests**

Assert the headline `From a buyer question to a clear next move.`, visible input/action/output explanation without interaction, and exactly five customer-language work views.

- [ ] **Step 2: Run the focused tests and verify failure**

Run: `node --test prototypes/site-10/tests/structure.test.mjs`

Expected: FAIL because `renderProduct` is absent.

- [ ] **Step 3: Implement the first-screen product definition**

Show `What enters Yonaris`, `What Yonaris does`, and `What your team receives` as one composed operating statement, not three generic cards.

- [ ] **Step 4: Implement one cinematic question workspace**

The fixed question anchors five views: `Buyer questions`, `Current answers`, `Sources and gaps`, `Actions under review`, and `Outcome review`. Each view must expose real capability relationships and update evidence, owner, review boundary, changed item, and unchanged item.

- [ ] **Step 5: Add the shorter Human/Agent and Markets/Languages sections**

The Human/Agent section uses the same record; the Markets section changes market/language/source context without describing outbound or inbound service packages.

- [ ] **Step 6: Verify desktop/mobile composition and commit**

```bash
git add prototypes/site-10/src/pages/product.js prototypes/site-10/src/styles/product.css prototypes/site-10/src/main.js prototypes/site-10/tests/structure.test.mjs
git commit -m "prototype: show Yonaris product through one buyer question"
```

---

### Task 4: Casework, Company, Human/Agent, and Contact Pages

**Files:**
- Create: `prototypes/site-10/src/pages/casework.js`
- Create: `prototypes/site-10/src/pages/company.js`
- Create: `prototypes/site-10/src/pages/human-agent.js`
- Create: `prototypes/site-10/src/pages/contact.js`
- Create: `prototypes/site-10/src/interactions/evidence-lens.js`
- Create: `prototypes/site-10/src/styles/pages.css`
- Modify: `prototypes/site-10/src/main.js`
- Modify: `prototypes/site-10/tests/structure.test.mjs`

**Interfaces:**
- Consumes: `BUYER_RECORD`, `renderShell()`.
- Produces: `renderCasework`, `renderCompany`, `renderHumanAgent`, `renderContact`, and `bindEvidenceLens`.

- [ ] **Step 1: Add failing route and content tests**

Assert all four routes render, Casework contains all eight approved steps and disclosure, Company is concise and factual, Human/Agent maps the same fact IDs, and Contact has one required field plus an optional market-question expansion.

- [ ] **Step 2: Run tests and verify failure**

Run: `node --test prototypes/site-10/tests/structure.test.mjs`

Expected: FAIL because the page renderers are absent.

- [ ] **Step 3: Implement Casework as one inspectable record**

Use a pinned evidence spine with initial answer, evidence relationship, reviewed action, re-observation, and unchanged limitation. Do not use a generic before/after slider.

- [ ] **Step 4: Implement Company as a short trust composition**

Use the headline `We build for the moment before the sales conversation.` Show purpose, teams served, global context as a record property, human boundary, and public contact facts without fake biographies or achievements.

- [ ] **Step 5: Implement the deep Human/Agent evidence lens**

Map one stable fact through Human, Evidence, and Agent depths. The interface must make the evidence lens the dominant visual and expose direct Agent-document destinations as prototype links.

- [ ] **Step 6: Implement low-friction Contact**

Require only `Work email`. Keep Name, Company/site, and curiosity optional. `I already have a market question` expands optional question, market/language, and buyer-context fields. The visual submission is local-only and clearly says no message is sent from the prototype.

- [ ] **Step 7: Verify desktop/mobile composition and commit**

```bash
git add prototypes/site-10/src/pages prototypes/site-10/src/interactions prototypes/site-10/src/styles/pages.css prototypes/site-10/src/main.js prototypes/site-10/tests/structure.test.mjs
git commit -m "prototype: complete English 1.0 supporting pages"
```

---

### Task 5: Responsive Closure, Browser QA, and User Preview

**Files:**
- Create: `prototypes/site-10/src/styles/responsive.css`
- Create: `prototypes/site-10/playwright.config.mjs`
- Create: `prototypes/site-10/e2e/site.spec.mjs`
- Modify: `prototypes/site-10/package.json`
- Modify: all prototype styles only where QA exposes a concrete defect

**Interfaces:**
- Consumes: the completed six-route prototype.
- Produces: `npm --prefix prototypes/site-10 run qa`, screenshots, and a running local preview URL.

- [ ] **Step 1: Write the Playwright route and interaction matrix**

```js
for (const route of ["home", "product", "casework", "company", "human-agent", "contact"]) {
  test(`${route} renders without overflow or console errors`, async ({ page }) => {
    const errors = [];
    page.on("console", (message) => message.type() === "error" && errors.push(message.text()));
    await page.goto(`/#/${route}`);
    await expect(page.locator("main")).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    expect(errors).toEqual([]);
  });
}
```

- [ ] **Step 2: Run E2E and verify failures expose unfinished responsive behaviour**

Run: `npm --prefix prototypes/site-10 run e2e`

Expected: any genuine mobile or route defects fail before fixes.

- [ ] **Step 3: Implement the 1440, 1024, and 390-pixel responsive system**

Recompose rather than merely shrink. Mobile keeps the question and active evidence first, converts complex fields to horizontal snap-free readable sequences, and retains 44-pixel targets.

- [ ] **Step 4: Add reduced-motion, keyboard, touch, focus, and local-form checks**

Ensure every interactive state can be reached without hover and that reduced motion preserves each information state.

- [ ] **Step 5: Run the complete QA command**

Run: `npm --prefix prototypes/site-10 run qa`

Expected: unit and Playwright suites pass at all configured widths with no console errors, request failures, missing assets, or overflow.

- [ ] **Step 6: Start the local preview and open it in Codex**

Run: `npm --prefix prototypes/site-10 run dev -- --host 127.0.0.1 --port 4180`

Expected: `http://127.0.0.1:4180/#/home` renders the new full-site visual prototype.

- [ ] **Step 7: Commit**

```bash
git add prototypes/site-10
git commit -m "prototype: finish English site 1.0 visual QA"
```

