# Yonaris Website 1.0 Production Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` to execute this plan task by task. Use `superpowers:test-driven-development` for every behavioural change and `superpowers:verification-before-completion` before any completion claim.

**Goal:** Ship the approved bilingual Yonaris Website 1.0 as a production-ready, cinematic buyer experience that explains the real product with concise copy, authored motion and a low-friction conversion path.

**Architecture:** Replace Site 06's page/scene/CSS monoliths with one public-page manifest, edition-specific page assemblers and copy records, and shared typed interaction components. One immutable representative `BuyerQuestionRecord` per edition powers Home, Product, Casework and Human/Agent so every transformation is causally coherent. Preserve the current TanStack Start SSR, security headers, Cloudflare delivery, machine-response negotiation and Vercel runtime, while replacing the legacy IA and required-three-field lead contract.

**Tech Stack:** React 19, TypeScript 7, TanStack Router/Start, Vite 8, CSS modules-by-convention through scoped global styles, Vitest, React DOM server rendering, Playwright, Zod, Cloudflare Email Routing API, Vercel.

**Approved specifications:**

- `docs/superpowers/specs/2026-08-29-english-site-1-0-design.md`
- `docs/superpowers/specs/2026-08-29-english-site-1-0-design.zh-CN.md`
- `docs/superpowers/specs/2026-08-30-yonaris-site-1-0-bilingual-copy.md`

## Global constraints

- English is implemented and stabilised first; Chinese follows with the same design system but separately authored structure and language. Both editions are required for the 1.0 release gate.
- Public category is exactly `AI-Native MarTech Infrastructure` / `AI 原生营销科技基础设施`. The old long category sentence must not survive as a second canonical category.
- Copy establishes the question and boundary; visual transformation carries most of the explanation.
- Product theatre may exceed Portal visually, but every input, system action, human boundary, output and review state must stay inside verified product capability.
- No invented customer outcome, live-state claim, autonomous execution claim or causal revenue claim.
- Particles, rings, glow, parallax, image movement, scroll choreography, stylised dashboards and atmospheric motion are allowed. They must be authored, varied by scene, pausable where automatic, and stable under reduced motion.
- Every core page owns one memorable visual event. Do not repeat a generic card grid or the same animation template across pages.
- The three-ring evidence lens remains a prominent signature interaction.
- No stock-photo credits or third-party copyrighted imagery. New raster imagery must be generated for Yonaris and stored locally.
- Primary navigation is Product / Casework / Company / Talk to Yonaris and 产品 / 案例拆解 / 关于 Yonaris / 联系 Yonaris. Human/Agent is prominent in page composition and footer, not a primary-nav mode toggle.
- Page assemblers orchestrate only. Shared interaction components receive typed props and must not import edition copy directly.
- Do not append to `site-06.css`, `global-pages.tsx`, `china-pages.tsx`, `global-scenes.tsx` or `china-scenes.tsx`. Replace their production consumers, then retire them.
- New or materially changed behaviour starts with a failing test. Each task ends with its focused tests, type checking where relevant, and a scoped commit.
- On this Windows PowerShell workspace, execute every `pnpm` example below as `pnpm.cmd`; direct `pnpm` is blocked by the local execution policy.
- Whenever a task adds, removes or renames a TanStack file route, run `pnpm.cmd build` before `check-types`, verify the generated route, and stage `src/routeTree.gen.ts`. Never hand-edit the generated route tree.

## Visual event contract

The following matrix is an implementation contract, not art-direction commentary. A page is incomplete until its information, explanatory transformation, atmosphere, direct control and reduced-motion equivalent are all present and observable in browser tests.

| Page | Information anchor | Explanatory visual event | Atmosphere | Direct input | Reduced-motion equivalent |
|---|---|---|---|---|---|
| Home | One representative buyer question | The same question fans into answer environments, comparison reasons and attached sources, then resolves into the five-view record | Evidence fragments, optical depth and controlled light cross the field without substituting for data | Environment/channel selection, pause and record-view controls | Every environment and all five record views remain directly selectable; no information is collapsed into one final frame |
| Product | One persistent buyer-question record | One continuous workspace physically transforms through Questions, Answers, Sources & Gaps, Actions Under Review and Outcome Review while stable evidence IDs persist | Moving evidence spine, masked image depth and restrained signal bloom | Step controls, scrub/keyboard navigation and evidence inspection | All five views remain rendered and selectable; transitions become immediate, not hidden |
| Casework | Initial observation and review boundary | A reversible evidence timeline keeps changed, unchanged and non-attributable findings attached during re-observation | Temporal light, trace persistence and local depth around the timeline | Timeline scrub, step selection and evidence inspection | Every before/review/after state is separately selectable with persistent limitations |
| Company | What Yonaris is and the operating principles | An aperture links each operating principle to its evidence/boundary line instead of merely revealing a heading | Original corridor imagery, controlled grain and directional light | Principle selection by click, touch and keyboard | All principles and evidence lines are visible/selectable without clip-path animation |
| Human/Agent | One unchanged public fact | Three independently operable rings focus Answer, Evidence and Machine-readable fact while fact ID/source/scope/timestamp/boundary persist | Orbital depth, restrained particles and optical focus | Direct manipulation of each layer ring plus keyboard controls | Every layer remains directly selectable; no single static end state replaces the layers |
| Contact | A low-commitment invitation and one required email field | A conversation aperture expands from email into optional curiosity/context and, only after confirmed delivery, resolves into a human follow-up path | Calm light field and local signal ripple tied to focus/submission state | Focus, optional expansion, submit, retry and collapse | Optional fields and every validation/submission state remain usable without animated expansion |

Shared `SceneOrchestrator` code may manage lifecycle, pause, input ownership and reduced-motion preference only. It must not output scene geometry or a reusable page animation template; each event component owns its DOM, state graph and choreography.

Browser tests must capture every event before and after each meaningful input. They must assert stable record/fact IDs across transformations, a changed `data-v1-state`, and scene-specific geometry/class signatures. Static DOM plus swapped copy, hidden panels or decorative circles alone do not satisfy this contract.

The final visual review must compare the rendered pages with Scrunch, Bluefish and DeepLumen at the level of overall craft while explicitly rejecting copied geometry, copy, image composition, feature sequence or signature effect. Local original imagery is necessary but not sufficient to pass this review.

---

## Task 1: Establish one public route and content contract

**Files:**

- Create: `src/site/route-types.ts`
- Create: `src/site/public-page-manifest.ts`
- Create: `src/site/redirects.ts`
- Create: `src/site/route-selectors.ts`
- Create: `src/site/public-page-manifest.test.ts`
- Create: `src/content/public-site/global-en/navigation.ts`
- Create: `src/content/public-site/zh-cn/navigation.ts`
- Create: `src/editions/page-head.ts`
- Create: `src/editions/page-head.test.ts`
- Modify: `src/lib/site-manifest.ts`
- Modify: `src/content/site/types.ts`
- Modify: `src/content/experience/types.ts`
- Modify: `src/lib/site-manifest.test.ts`
- Modify: `src/lib/permanent-redirect.ts`
- Modify: `src/lib/permanent-redirect.test.ts`
- Modify: `src/lib/site-navigation.ts`
- Modify: `src/lib/site-navigation.test.ts`
- Modify: `src/editions/registry.ts`
- Modify: `src/editions/registry.test.ts`
- Modify: `scripts/audit-site-manifest.ts`
- Create: `scripts/audit-site-manifest.test.mjs`

### Step 1: Write the failing manifest contract tests

Cover these exact semantic keys and canonical paths:

```ts
const PUBLIC_PAGE_KEYS = [
  "home",
  "product",
  "casework",
  "company",
  "human-agent",
  "contact",
  "privacy",
] as const;
```

Assert:

- English and Chinese paths exist for all seven keys.
- Only Product, Casework, Company and Contact appear in primary navigation.
- every legacy route resolves directly to a final canonical without a redirect chain;
- locale switches map semantic page keys, never string-replace path prefixes;
- `approach` and `geo` anchors resolve to Product, `results` to Casework and `diagnostic` to Contact;
- redirect query parameters remain before fragments (`/approach?utm=x` becomes `/product?utm=x#how-it-works`, never `/product#how-it-works?utm=x`);
- sitemap, edition registry and navigation selectors derive from the same manifest object.
- the route audit is bidirectional: every real route is classified and every canonical/redirect manifest entry has a real handler.

Run:

```bash
pnpm.cmd test src/site/public-page-manifest.test.ts src/lib/site-manifest.test.ts src/lib/site-navigation.test.ts src/editions/registry.test.ts src/editions/page-head.test.ts
node --test scripts/audit-site-manifest.test.mjs
```

Expected: FAIL because new semantic keys, paths and selectors do not exist.

### Step 2: Implement the minimal route types and manifest

Use this public shape:

```ts
export type PublicPageKey =
  | "home"
  | "product"
  | "casework"
  | "company"
  | "human-agent"
  | "contact"
  | "privacy";

export type SiteEdition = "global-en" | "zh-cn";

export interface PublicPageRoute {
  readonly key: PublicPageKey;
  readonly paths: Readonly<Record<SiteEdition, `/${string}`>>;
  readonly agentPaths: Readonly<Record<SiteEdition, `/${string}`>>;
  readonly sitemap: Readonly<{
    priority: number;
    lastVerified: `${number}-${number}-${number}`;
  }>;
}

export type NavigationTarget =
  | { readonly kind: "page"; readonly page: PublicPageKey; readonly hash?: string }
  | { readonly kind: "machine"; readonly route: "agent-index" };
```

Keep machine-only route definitions separate from public page definitions. Header and footer order, Contact CTA treatment, Agent documents and the Markets & Languages Product anchor live in edition-owned navigation records made only of `NavigationTarget` values; labels remain edition-authored while paths resolve through manifest selectors.

`PublicPageKey` is a new contract. Keep `HumanPageKey` and `HUMAN_PAGE_KEYS` as deprecated legacy contracts until Task 11 removes their final consumer. During Tasks 1–10, `src/content/site/types.ts` and `src/content/experience/types.ts` may expose compatibility adapters but must not define a second new route union. This keeps every intermediate commit type-correct.

Add `buildPageHead(edition, page)` in `src/editions/page-head.ts`. Edition modules become thin wrappers and may not maintain private path maps.

### Step 3: Implement direct legacy redirects

Include the approved aliases plus existing public aliases:

```ts
const redirects = {
  "/platform": "/product",
  "/approach": "/product#how-it-works",
  "/results": "/casework",
  "/geo": "/product#markets-languages",
  "/diagnostic": "/contact",
  "/features": "/product",
  "/methodology": "/product#how-it-works",
  "/vision": "/company",
  "/pricing": "/contact",
  "/off-site-aeo": "/product#markets-languages",
} as const;
```

Add Chinese equivalents and machine aliases. Preserve 308 status codes.

Test every Human, Chinese, Agent and Markdown legacy alias with both GET and HEAD: exactly one 308, query-before-fragment ordering, and a final canonical target with no redirect chain.

At this stage, establish redirect/alias data and the fragment-safe helper only. Human route handlers switch in Tasks 9–10 and machine aliases switch in Task 11, so the branch remains buildable after every task.

### Step 4: Run focused verification

```bash
pnpm.cmd test src/site/public-page-manifest.test.ts src/lib/site-manifest.test.ts src/lib/site-navigation.test.ts src/editions/registry.test.ts src/editions/page-head.test.ts
node --test scripts/audit-site-manifest.test.mjs
pnpm.cmd check-types
```

Expected: PASS.

### Step 5: Commit

```bash
git add src/site src/lib/site-manifest.ts src/lib/site-manifest.test.ts src/lib/permanent-redirect.ts src/lib/permanent-redirect.test.ts src/lib/site-navigation.ts src/lib/site-navigation.test.ts src/content/site/types.ts src/content/experience/types.ts src/content/public-site/global-en/navigation.ts src/content/public-site/zh-cn/navigation.ts src/editions scripts/audit-site-manifest.ts scripts/audit-site-manifest.test.mjs
git commit -m "refactor: make public page manifest the route source"
```

---

## Task 2: Build canonical public facts and edition-specific buyer records

**Files:**

- Create: `src/content/public-site/contracts/common.ts`
- Create: `src/content/public-site/contracts/buyer-question.ts`
- Create: `src/content/public-site/contracts/public-fact.ts`
- Create: `src/content/public-site/contracts/pages/home.ts`
- Create: `src/content/public-site/contracts/pages/product.ts`
- Create: `src/content/public-site/contracts/pages/casework.ts`
- Create: `src/content/public-site/contracts/pages/company.ts`
- Create: `src/content/public-site/contracts/pages/human-agent.ts`
- Create: `src/content/public-site/contracts/pages/contact.ts`
- Create: `src/content/public-site/contracts/pages/privacy.ts`
- Create: `src/content/public-site/canonical/company-facts.ts`
- Create: `src/content/public-site/canonical/product-facts.ts`
- Create: `src/content/public-site/global-en/buyer-question.ts`
- Create: `src/content/public-site/global-en/pages/home.ts`
- Create: `src/content/public-site/global-en/pages/product.ts`
- Create: `src/content/public-site/global-en/pages/casework.ts`
- Create: `src/content/public-site/global-en/pages/company.ts`
- Create: `src/content/public-site/global-en/pages/human-agent.ts`
- Create: `src/content/public-site/global-en/pages/contact.ts`
- Create: `src/content/public-site/global-en/pages/privacy.ts`
- Create: `src/content/public-site/zh-cn/buyer-question.ts`
- Create: `src/content/public-site/zh-cn/pages/home.ts`
- Create: `src/content/public-site/zh-cn/pages/product.ts`
- Create: `src/content/public-site/zh-cn/pages/casework.ts`
- Create: `src/content/public-site/zh-cn/pages/company.ts`
- Create: `src/content/public-site/zh-cn/pages/human-agent.ts`
- Create: `src/content/public-site/zh-cn/pages/contact.ts`
- Create: `src/content/public-site/zh-cn/pages/privacy.ts`
- Create: `src/content/public-site/content-contract.test.ts`
- Modify: `src/content/experience/canonical-public-facts.ts`
- Modify: `src/content/experience/category-contract.test.tsx`
- Modify: `src/content/experience/copy-contract.test.ts`
- Keep legacy consumers temporarily: `src/content/experience/global-copy.ts`
- Keep legacy consumers temporarily: `src/content/experience/china-copy.ts`
- Keep legacy consumers temporarily: `src/content/experience/product-demo.ts`
- Modify or retire after consumer migration: `src/content/experience/product-demo.test.ts`

### Step 1: Write the failing content contract

Tests must assert:

- the exact bilingual category strings;
- every edition has one immutable `BuyerQuestionRecord` with stable IDs;
- English and Chinese representative questions are independently authored;
- every record contains observation conditions, answer environments, comparison reasons, source/evidence trace, gaps, proposed actions, human review and unchanged limits;
- invented percentages, rankings, scores, customer names and customer outcomes are absent even when product theatre is marked representative; only real, authorised metrics may be public;
- fake schemes such as `representative://` and fabricated third-party source URLs are absent; representative records use explicit local IDs and honest source labels;
- all primary CTA labels match the approved copy deck;
- content records store typed targets, not raw internal URLs;
- banned old category and obsolete primary CTAs are absent.

Run:

```bash
pnpm.cmd test src/content/public-site/content-contract.test.ts src/content/experience/category-contract.test.tsx src/content/experience/copy-contract.test.ts
```

Expected: FAIL because the new contracts and approved copy modules do not exist.

### Step 2: Implement immutable contracts

Use stable IDs rather than array positions:

```ts
export interface BuyerQuestionRecord {
  readonly id: string;
  readonly edition: "global-en" | "zh-cn";
  readonly question: string;
  readonly audience: string;
  readonly market: string;
  readonly language: string;
  readonly observationConditions: ObservationConditions;
  readonly channelAnswers: readonly ChannelAnswer[];
  readonly comparisonReasons: readonly ComparisonReason[];
  readonly evidence: readonly EvidenceItem[];
  readonly gaps: readonly EvidenceGap[];
  readonly proposedActions: readonly ReviewedAction[];
  readonly review: OutcomeReview;
  readonly disclosure: RepresentativeDisclosure;
}
```

Make fact boundaries explicit in types. A changed observation and a commercial outcome are different types and cannot be rendered as interchangeable claims.

### Step 3: Transcribe the approved bilingual deck into typed modules

Transcribe exact approved copy from the copy specification. Do not translate at component level. English and Chinese page records expose the same semantic fields but may order supporting clauses differently.

Update `canonical-public-facts.ts` to re-export the new canonical fact source temporarily so machine consumers do not fork another truth source. Preserve its legacy `PAGE_FACTS`-shaped exports as adapters until old Human/Agent consumers reach zero in Task 11. Do not stop old copy/demo imports during this task; each later page migration removes its own consumer, and Task 12 retires the old modules after the zero-consumer audit. Rewrite or retire `product-demo.test.ts` at that point so it no longer protects invented 79/35/42/3120 metrics.

Every page copy file owns one page only. `index.ts` files may re-export but may not contain copy, state or assembly logic. Shared page contracts constrain verified facts and required semantic fields, not identical English/Chinese section order.

### Step 4: Run focused verification

```bash
pnpm.cmd test src/content/public-site/content-contract.test.ts src/content/experience/category-contract.test.tsx src/content/experience/copy-contract.test.ts
pnpm.cmd check-types
```

Expected: PASS.

### Step 5: Commit

```bash
git add src/content/public-site src/content/experience/canonical-public-facts.ts src/content/experience/category-contract.test.tsx src/content/experience/copy-contract.test.ts
git commit -m "feat: add approved bilingual public content contract"
```

---

## Task 3: Create the new shell, visual tokens and motion foundation

**Files:**

- Create: `src/components/experience/shared/shell/site-shell.tsx`
- Create: `src/components/experience/shared/shell/site-header.tsx`
- Create: `src/components/experience/shared/shell/site-footer.tsx`
- Create: `src/components/experience/shared/shell/edition-link.tsx`
- Create: `src/components/experience/shared/motion/use-motion-preference.ts`
- Create: `src/components/experience/shared/motion/use-interaction-control.ts`
- Create: `src/components/experience/shared/motion/scene-orchestrator.tsx`
- Create: `src/components/experience/shared/shell/site-shell.test.tsx`
- Create: `src/styles/site-v1/tokens.css`
- Create: `src/styles/site-v1/base.css`
- Create: `src/styles/site-v1/shell.css`
- Create: `src/styles/site-v1/motion.css`
- Create: `src/content/public-site/assets.ts`
- Create: `src/content/public-site/assets.test.ts`
- Create: `public/assets/site-v1/hero-evidence-field.png`
- Create: `public/assets/site-v1/product-observation-room.png`
- Create: `public/assets/site-v1/company-light-corridor.png`
- Modify: `src/styles.css`

### Step 1: Write failing shell and motion tests

Assert:

- primary navigation is exact per edition and active state derives from semantic page key;
- Human/Agent exists in a prominent footer/reading control but not primary nav;
- keyboard and touch activate menus and locale links;
- automatic scenes stop on pointer, keyboard or touch interaction;
- reduced-motion mode returns stable end states and disables nonessential transforms;
- header and footer render without JS from SSR output;
- no external image host or photo attribution is emitted.

Run:

```bash
pnpm.cmd test src/components/experience/shared/shell/site-shell.test.tsx src/components/experience/original-imagery.test.tsx
```

Expected: FAIL because the new shell and local generated imagery do not exist.

### Step 2: Generate and store original Yonaris imagery

Use the `imagegen` skill to generate a coherent fictional evidence environment: cinematic enterprise interiors, controlled warm light through deep navy space, optical glass and evidence surfaces, no logos, no identifiable people, no text, no resemblance to a supplied competitor screenshot. Generate at least the three named assets above and inspect them before use.

Optimise locally without introducing a remote runtime dependency. Create responsive WebP/AVIF derivatives and record each asset's generated provenance, master/derivatives, intrinsic dimensions, mobile crop, focal point, alt/decorative role and owning page in `src/content/public-site/assets.ts` and `public/assets/site-v1/README.md`. An asset cannot serve as a generic repeated hero banner across unrelated pages.

### Step 3: Implement the shell and motion control

The shell takes semantic page state and edition-owned labels:

```tsx
<SiteShell edition="global-en" pageKey="product" copy={navigationCopy}>
  {children}
</SiteShell>
```

`useInteractionControl` begins in `playing`, switches to `controlled` on any direct input, supports explicit pause/resume, and exposes `reduced` when `prefers-reduced-motion` is active. Do not make hover the only access path.

### Step 4: Implement visual tokens and responsive foundation

Create a purpose-built token layer for deep navy, warm ivory, controlled orange, optical blue-grey, hairlines, grain, masks, type scale, spacing and easing. `tokens.css` and `base.css` may not contain page selectors. Keep all selectors under `site-v1-*` or component-specific scopes, and keep responsive rules beside the owning shell/page/interaction rather than growing a global responsive file. Import the new CSS after existing base during migration; do not add to `site-06.css`.

### Step 5: Verify and commit

```bash
pnpm.cmd test src/components/experience/shared/shell/site-shell.test.tsx src/components/experience/original-imagery.test.tsx src/content/public-site/assets.test.ts
pnpm.cmd check-types
git add public/assets/site-v1 src/content/public-site/assets.ts src/content/public-site/assets.test.ts src/components/experience/shared/shell src/components/experience/shared/motion src/styles.css src/styles/site-v1
git commit -m "feat: establish cinematic site v1 foundation"
```

---

## Task 4: Build the English Home answer field and five-view record preview

**Files:**

- Create: `src/components/experience/shared/buyer-question/buyer-question-provider.tsx`
- Create: `src/components/experience/shared/buyer-question/representative-disclosure.tsx`
- Create: `src/components/experience/shared/home/home-answer-field.tsx`
- Create: `src/components/experience/shared/home/product-record-preview.tsx`
- Create: `src/components/experience/shared/home/answer-environment.tsx`
- Create: `src/components/experience/shared/home/home-interactions.test.tsx`
- Create: `src/components/experience/global/english-site-shell.tsx`
- Create: `src/components/experience/global/pages/home-page.tsx`
- Create: `src/components/experience/global/pages/home-page.test.tsx`
- Create: `src/styles/site-v1/home.css`
- Create: `src/styles/site-v1/answer-field.css`
- Modify: `src/routes/index.tsx`
- Modify: `src/editions/global-en/edition.ts`
- Modify: `src/editions/global-en/edition.test.ts`

### Step 1: Write failing interaction and page tests

Assert the Home scene visibly progresses through:

1. one buyer question;
2. several answer environments;
3. alternatives and comparison reasons;
4. source and evidence trace;
5. a transition into the fixed five-view record.

Assert all five approved Home preview labels are present in server-rendered HTML: `What buyers ask`, `What they hear`, `Why they hear it`, `What your team can change`, and `What changed afterwards`. Controls are keyboard operable, the representative disclosure is always readable, and this preview never auto-advances.

Assert `See Yonaris in action` moves to the ungated Product preview and never opens, scrolls to or focuses Contact. Every representative record appearance on Home includes a readable disclosure.

Run:

```bash
pnpm.cmd test src/components/experience/shared/home/home-interactions.test.tsx src/components/experience/global/pages/home-page.test.tsx src/editions/global-en/edition.test.ts
```

Expected: FAIL because Home still renders Site 06.

### Step 2: Implement the answer field as one spatial scene

Do not build a row of feature cards. The question is the fixed spatial anchor; answer environments appear as distinct layers, comparison reasons physically reorder the field, and evidence lines attach to claims. Atmospheric particles and light may move independently of data transformation.

### Step 3: Implement the five-view record preview

The Home-facing labels are `What buyers ask`, `What they hear`, `Why they hear it`, `What your team can change`, and `What changed afterwards`; internal semantic view IDs may map to the Product record states. Switching view must transform the same stable record rather than swap unrelated screenshots. Render every view in SSR, then enhance to a user-controlled roving-tab experience after hydration. Do not autoplay this preview.

### Step 4: Assemble English Home and update head metadata

Keep page assembly concise. Use approved Home copy exactly. The fixed page sequence is Hero → answer event → Product preview → Human/Agent signature → Casework preview → closing conversion. Do not insert a separate category bridge or another generic feature section.

### Step 5: Verify and commit

```bash
pnpm.cmd test src/components/experience/shared/home/home-interactions.test.tsx src/components/experience/global/pages/home-page.test.tsx src/editions/global-en/edition.test.ts
pnpm.cmd check-types
git add src/components/experience/shared/buyer-question src/components/experience/shared/home src/components/experience/global src/styles/site-v1 src/routes/index.tsx src/editions/global-en
git commit -m "feat: build cinematic English home experience"
```

---

## Task 5: Build the English Product continuous workspace

**Files:**

- Create: `src/components/experience/shared/product/product-question-workspace.tsx`
- Create: `src/components/experience/shared/product/workspace-state.ts`
- Create: `src/components/experience/shared/product/workspace-state.test.ts`
- Create: `src/components/experience/shared/product/workspace-stage.tsx`
- Create: `src/components/experience/shared/product/views/buyer-questions-view.tsx`
- Create: `src/components/experience/shared/product/views/current-answers-view.tsx`
- Create: `src/components/experience/shared/product/views/sources-gaps-view.tsx`
- Create: `src/components/experience/shared/product/views/actions-under-review-view.tsx`
- Create: `src/components/experience/shared/product/views/outcome-review-view.tsx`
- Create: `src/components/experience/shared/product/product-question-workspace.test.tsx`
- Create: `src/components/experience/global/pages/product-page.tsx`
- Create: `src/components/experience/global/pages/product-page.test.tsx`
- Create: `src/styles/site-v1/product.css`
- Create: `src/styles/site-v1/workspace.css`
- Modify: `src/routes/product.tsx`

### Step 1: Write failing workspace tests

Assert:

- one record persists through all five states;
- the first meaningful viewport, before interaction, answers what Yonaris observes, what the system produces, what the team uses and how results are reviewed;
- stable `data-record-id` and evidence node IDs persist while `data-v1-state` and scene geometry signatures change;
- each transition exposes input, system observation, evidence, human decision boundary, output and review;
- unchanged and not-attributable observations remain visible;
- Actions Under Review never appear as autonomously executed;
- user control works by pointer, keyboard and touch;
- no invented score or customer metric is rendered;
- representative disclosure is readable wherever the record appears;
- `#how-it-works` and `#markets-languages` anchors exist.

Run:

```bash
pnpm.cmd test src/components/experience/shared/product/product-question-workspace.test.tsx src/components/experience/global/pages/product-page.test.tsx
```

Expected: FAIL.

### Step 2: Implement the continuous cinematic workspace

Use one persistent stage, not five dashboard cards. Each state changes composition: question plane contracts into answer environments, citations pull into an evidence spine, gaps open spatially, reviewed actions enter a bounded queue, and re-observation overlays the original condition. Preserve stable source IDs through every transformation. Keep transition/reducer logic in pure `workspace-state.ts`; the workspace root orchestrates state and views but may not accumulate all view markup and animation geometry.

### Step 3: Add market and language capability inside the product story

Present global market/language capability as product scope, not as a separate “China out / foreign company in” service category. Avoid a standalone “Global Markets” abstraction. The section should show that the same review method can be configured for different markets, languages and answer environments.

### Step 4: Assemble Product and verify

Close the page with a short Human/Agent bridge and low-friction conversation path. The bridge uses the signature fact projection but does not duplicate the full Human/Agent page.

```bash
pnpm.cmd test src/components/experience/shared/product/product-question-workspace.test.tsx src/components/experience/global/pages/product-page.test.tsx
pnpm.cmd check-types
git add src/components/experience/shared/product src/components/experience/global/pages/product-page.tsx src/components/experience/global/pages/product-page.test.tsx src/styles/site-v1 src/routes/product.tsx
git commit -m "feat: build English product observation workspace"
```

---

## Task 6: Build English Casework and Company narratives

**Files:**

- Create: `src/components/experience/shared/casework/casework-walkthrough.tsx`
- Create: `src/components/experience/shared/casework/casework-step.tsx`
- Create: `src/components/experience/shared/casework/casework-walkthrough.test.tsx`
- Create: `src/components/experience/global/pages/casework-page.tsx`
- Create: `src/components/experience/global/pages/casework-page.test.tsx`
- Create: `src/components/experience/global/pages/company-page.tsx`
- Create: `src/components/experience/global/pages/company-page.test.tsx`
- Create: `src/styles/site-v1/casework.css`
- Create: `src/styles/site-v1/company.css`
- Create: `src/routes/casework.tsx`
- Modify: `src/routes/company.tsx`

### Step 1: Write failing page tests

Casework must expose all eight approved steps, in order and in SSR: situation, buyer question, what buyers heard, what shaped the answer, missing/misleading evidence, team-reviewed change/validation, later observation, and what still cannot be claimed. It also exposes changed, unchanged, non-attributable limits and representative disclosure. Company must cover the six approved factual modules—why Yonaris exists, who it is for, across markets, human judgement, what Yonaris does not promise, and verified public facts—without becoming another product page.

Assert each page has a unique signature visual event: Casework uses a reversible evidence timeline; Company uses an original image aperture whose principle selection visibly attaches the selected operating principle to its evidence and boundary line. A clip-path entrance that only reveals headings does not pass.

Run:

```bash
pnpm.cmd test src/components/experience/shared/casework/casework-walkthrough.test.tsx src/components/experience/global/pages/casework-page.test.tsx src/components/experience/global/pages/company-page.test.tsx
```

Expected: FAIL.

### Step 2: Implement the representative walkthrough

Use the same edition record. Do not imply a customer case study. The user can scrub between original and re-observed conditions; source attachments and limitations persist instead of disappearing at the “after” state.

### Step 3: Implement the concise Company composition

Pair approved factual copy with generated cinematic imagery. Motion should behave like an opening/closing aperture and evidence line, not reuse Product tabs or Home answer motion.

### Step 4: Verify and commit

```bash
pnpm.cmd test src/components/experience/shared/casework/casework-walkthrough.test.tsx src/components/experience/global/pages/casework-page.test.tsx src/components/experience/global/pages/company-page.test.tsx
pnpm.cmd build
pnpm.cmd check-types
git add src/components/experience/shared/casework src/components/experience/global/pages src/styles/site-v1 src/routes/casework.tsx src/routes/company.tsx src/routeTree.gen.ts
git commit -m "feat: add English casework and company narratives"
```

---

## Task 7: Build the signature Human/Agent evidence lens

**Files:**

- Create: `src/components/experience/shared/human-agent/evidence-lens.tsx`
- Create: `src/components/experience/shared/human-agent/human-agent-projection.tsx`
- Create: `src/components/experience/shared/human-agent/evidence-lens.test.tsx`
- Create: `src/components/experience/global/pages/human-agent-page.tsx`
- Create: `src/components/experience/global/pages/human-agent-page.test.tsx`
- Create: `src/styles/site-v1/human-agent.css`
- Create: `src/routes/human-agent.tsx`
- Modify: `src/components/experience/global/pages/home-page.tsx`
- Modify: `src/components/experience/global/pages/home-page.test.tsx`
- Modify: `src/components/experience/global/pages/product-page.tsx`
- Modify: `src/components/experience/global/pages/product-page.test.tsx`
- Convert to compatibility re-export or retire production use: `src/components/experience/shared/human-agent-link.tsx`
- Convert to compatibility re-export or retire production use: `src/components/experience/shared/dual-reading-stage.tsx`

### Step 1: Write failing lens tests

Assert:

- one unchanged fact projects through Human, Evidence and Agent layers;
- Answer, Evidence and Machine-readable fact rings are each directly operable, not decorative-only;
- each layer changes representation without changing the underlying fact ID;
- layer selection changes layout/density and `data-v1-state`, not only copy or an active class;
- the Agent projection exposes claim, source, scope, timestamp and boundary;
- no claim says the page itself guarantees crawling, indexing, ranking or citation;
- the lens is visible above the fold on its page and both Home and Product install a tested, visible bridge;
- keyboard, touch and reduced-motion states are complete.

Run:

```bash
pnpm.cmd test src/components/experience/shared/human-agent/evidence-lens.test.tsx src/components/experience/global/pages/human-agent-page.test.tsx
```

Expected: FAIL.

### Step 2: Implement the evidence lens as a spatial transformation

The outer Answer ring, middle Evidence ring and inner Machine-readable fact ring each focus the corresponding approved layer. Ring movement changes layout, density and labels while the same stable fact ID, source, scope, timestamp and boundary remain attached. It is not a two-button mode toggle, not three decorative circles and not a code-themed skin.

### Step 3: Assemble and verify

```bash
pnpm.cmd test src/components/experience/shared/human-agent/evidence-lens.test.tsx src/components/experience/global/pages/human-agent-page.test.tsx src/components/experience/global/pages/home-page.test.tsx src/components/experience/global/pages/product-page.test.tsx
pnpm.cmd build
pnpm.cmd check-types
git add src/components/experience/shared/human-agent src/components/experience/shared/human-agent-link.tsx src/components/experience/shared/dual-reading-stage.tsx src/components/experience/global/pages/human-agent-page.tsx src/components/experience/global/pages/home-page.tsx src/components/experience/global/pages/home-page.test.tsx src/components/experience/global/pages/product-page.tsx src/components/experience/global/pages/product-page.test.tsx src/styles/site-v1/human-agent.css src/routes/human-agent.tsx src/routeTree.gen.ts
git commit -m "feat: build signature human agent evidence lens"
```

---

## Task 8: Replace the lead flow with a low-friction Contact experience

**Files:**

- Create: `src/lib/contact-schema.ts`
- Create: `src/lib/contact-schema.test.ts`
- Create: `src/lib/contact-client.ts`
- Create: `src/lib/contact-client.test.ts`
- Create: `src/lib/contact-delivery.server.ts`
- Create: `src/lib/contact-delivery.server.test.ts`
- Create: `src/components/experience/shared/contact/low-friction-lead-form.tsx`
- Create: `src/components/experience/shared/contact/contact-fields.tsx`
- Create: `src/components/experience/shared/contact/high-intent-fields.tsx`
- Create: `src/components/experience/shared/contact/use-contact-form.ts`
- Create: `src/components/experience/shared/contact/low-friction-lead-form.test.tsx`
- Create: `src/components/experience/global/pages/contact-page.tsx`
- Create: `src/components/experience/global/pages/contact-page.test.tsx`
- Create: `src/styles/site-v1/contact.css`
- Create: `src/routes/contact.tsx`
- Create: `src/routes/api/contact.ts`
- Modify: `src/lib/diagnostic-delivery.server.ts`
- Modify or convert to compatibility adapter: `src/lib/diagnostic-schema.ts`
- Modify or convert to compatibility adapter: `src/lib/diagnostic-client.ts`
- Modify: `src/lib/diagnostic-api-protocol.ts`
- Modify: `src/lib/diagnostic-request-intent.ts`
- Modify: `src/lib/diagnostic-analytics-privacy.ts`
- Modify: corresponding `diagnostic-*.test.ts` files
- Modify: `src/routes/api/diagnostic.ts`
- Modify or retire: `src/components/experience/shared/lead-form.test.tsx`
- Modify: `scripts/site-06-privacy-hydration.mjs`
- Stop production imports from: `src/components/experience/shared/lead-form.tsx`

### Step 1: Write failing schema and delivery tests

Contract:

```ts
export interface ContactLead {
  readonly locale: "en" | "zh-CN";
  readonly workEmail: string;
  readonly name?: string;
  readonly companyOrWebsite?: string;
  readonly curiosity?: string;
  readonly marketQuestion?: string;
  readonly marketOrLanguage?: string;
  readonly buyerOrCommercialContext?: string;
  readonly requestType: "conversation" | "privacy";
  readonly botField?: string;
}

export interface ContactLeadDraft {
  readonly locale: "en" | "zh-CN";
  readonly workEmail: string;
  readonly name: string;
  readonly companyOrWebsite: string;
  readonly curiosity: string;
  readonly marketQuestion: string;
  readonly marketOrLanguage: string;
  readonly buyerOrCommercialContext: string;
  readonly requestType: "conversation" | "privacy";
  readonly botField: string;
}
```

Tests must prove work email is the only required conversation field; optional curiosity is short and low-pressure; high-intent market fields are collapsed by default; privacy uses an explicit manual-review boundary; request-size, same-origin, bot-field, rate-limit, timeout, idempotency and confirmed/unconfirmed delivery semantics remain intact.

Also render and test the Contact visual-event contract: focusing the email field opens the conversation aperture, optional expansion creates a distinct state, validation/retry preserve values, and only a server-confirmed result may resolve into the human follow-up state. Capture the idle, focused, expanded, invalid, unconfirmed and confirmed states with stable form IDs and changed `data-v1-state` values.

Run:

```bash
pnpm.cmd test src/lib/contact-schema.test.ts src/lib/contact-client.test.ts src/lib/contact-delivery.server.test.ts src/components/experience/shared/contact/low-friction-lead-form.test.tsx
```

Expected: FAIL.

### Step 2: Extract the secure delivery core

Reuse proven Cloudflare API token/account/recipient behaviour without duplicating secrets or weakening security. `contact-delivery.server.ts` becomes the only implementation of validation, rate limiting, idempotency/single-flight handling and Cloudflare sending; `diagnostic-delivery.server.ts` becomes a compatibility adapter/re-export rather than a second implementation. Preserve a temporary `/api/diagnostic` compatibility adapter.

Treat the existing custom IP header as untrusted unless it is set by a verified edge path; derive the client key from trusted Vercel/forwarding context with an explicit fallback. Make process-local idempotency limitations explicit in code/tests and attach a stable submission ID to delivery. Do not claim cross-instance exactly-once delivery without a configured durable store.

Support both enhanced JSON and native `FormData` submission. Server output uses a discriminated result:

```ts
type ContactFormResult =
  | { status: "invalid"; values: ContactLeadDraft; fieldErrors: Record<string, string> }
  | { status: "unconfirmed"; values: ContactLeadDraft; message: string }
  | { status: "confirmed" };
```

### Step 3: Implement Contact page and CTA module

The default scene asks only for work email and offers optional curiosity. The high-intent expansion is available without implying that the visitor must already have a problem. Success, retry and privacy states preserve entered values and focus management. Provide a native `method="post"`/server action path and test JS-disabled validation, value preservation and confirmed/unconfirmed response rendering.

Migrate analytics/privacy intent recognition and query-string PII cleaning from `/diagnostic` to canonical `/contact` and `/zh/contact`, while keeping legacy aliases covered. Rewrite or retire every old test that locks three required fields or a Chinese phone requirement.

### Step 4: Verify and commit

```bash
pnpm.cmd test src/lib/contact-schema.test.ts src/lib/contact-client.test.ts src/lib/contact-delivery.server.test.ts src/lib/diagnostic-schema.test.ts src/lib/diagnostic-client.test.ts src/lib/diagnostic-api-protocol.test.ts src/lib/diagnostic-request-intent.test.ts src/lib/diagnostic-analytics-privacy.test.ts src/components/experience/shared/contact/low-friction-lead-form.test.tsx src/components/experience/shared/lead-form.test.tsx src/components/experience/global/pages/contact-page.test.tsx
pnpm.cmd build
pnpm.cmd check-types
git add src/lib/contact-* src/lib/diagnostic-* src/components/experience/shared/contact src/components/experience/shared/lead-form.test.tsx src/components/experience/global/pages/contact-page* src/styles/site-v1/contact.css src/routes/contact.tsx src/routes/api/contact.ts src/routes/api/diagnostic.ts scripts/site-06-privacy-hydration.mjs src/routeTree.gen.ts
git commit -m "feat: add low friction contact conversion flow"
```

---

## Task 9: Complete English Privacy and migrate every English route

**Files:**

- Create: `src/components/experience/global/pages/privacy-page.tsx`
- Create: `src/components/experience/global/pages/privacy-page.test.tsx`
- Modify: `src/routes/privacy.tsx`
- Modify: `src/routes/platform.tsx`
- Modify: `src/routes/approach.tsx`
- Modify: `src/routes/results.tsx`
- Modify: `src/routes/geo.tsx`
- Modify: `src/routes/diagnostic.tsx`
- Modify: remaining English legacy route adapters
- Modify: `src/components/experience/global/global-experience.test.tsx`
- Modify: `scripts/audit-legacy-consumers.mjs`
- Modify: `scripts/audit-legacy-consumers.test.mjs`

### Step 1: Write failing migration tests

Assert every canonical English route imports its dedicated assembler, legacy routes return direct 308 targets, Privacy uses the new shell and manual-review form contract, and no canonical route imports `global-pages.tsx`, `global-scenes.tsx` or `site-06-shell.tsx`.

Run:

```bash
pnpm.cmd test src/components/experience/global src/lib/permanent-redirect.test.ts
node --test scripts/audit-legacy-consumers.test.mjs
```

Expected: FAIL while legacy consumers remain.

### Step 2: Migrate routes and pass the audit

Do not hand-edit `routeTree.gen.ts`; let the TanStack/Vite generator update it. Keep old component files until both editions and machine consumers have migrated, but make production English routes stop importing them.

### Step 3: Verify and commit

```bash
pnpm.cmd test
pnpm.cmd test:scripts
pnpm.cmd check-types
pnpm.cmd audit:legacy-marketing
git add src/routes src/components/experience/global scripts src/routeTree.gen.ts
git commit -m "refactor: migrate English public routes to site v1"
```

---

## Task 9A: Lock the English visual and interaction baseline before Chinese work

**Files:**

- Modify: `package.json`
- Create: `playwright.config.ts`
- Create: `e2e/english-visual-lock.spec.ts`
- Create: `scripts/site-v1-english-matrix.mjs`
- Create: `scripts/site-v1-english-matrix.test.mjs`

### Step 1: Write the failing English browser gate

At 360, 390, 1024, 1280 and 1440 widths, capture and inspect Home's answer/preview states, all five Product states, all eight Casework steps, all Company principles, all three Human/Agent layers, Contact idle/focused/expanded/invalid/unconfirmed/confirmed, and Privacy. Assert stable record/fact IDs, changing state/scene signatures, keyboard/touch parity, reduced-motion access to every state, no overflow and no browser/network errors.

Contact confirmed/unconfirmed browser states use an explicit delivery stub. Automated tests must never send a real Cloudflare email.

Add `test:e2e` and `visual:english` package scripts in this task. The Playwright config reads `YONARIS_TEST_BASE_URL`; it does not invent a nonstandard CLI `--base-url` option.

### Step 2: Build and inspect the English production output

```bash
pnpm.cmd test
pnpm.cmd check-types
pnpm.cmd build
node --test scripts/site-v1-english-matrix.test.mjs
```

Start the production build in a separate session, set `$env:YONARIS_TEST_BASE_URL` to the local origin, then run `pnpm.cmd test:e2e` and the English visual matrix. Compare the rendered work with the approved visual-event contract and competitor craft benchmark. Correct every failed or visibly template-like scene before Task 10 begins; this is a self-review checkpoint and does not require another user confirmation.

Exact local sequence after the build:

```powershell
.\\node_modules\\.bin\\playwright.CMD install chromium
pnpm.cmd start
$env:YONARIS_TEST_BASE_URL="http://127.0.0.1:3000/"
pnpm.cmd test:e2e
pnpm.cmd visual:english --base-url http://127.0.0.1:3000/ --output artifacts/site-v1-english
```

Run `pnpm.cmd start` in its own session so the remaining commands execute against the live production build.

### Step 3: Commit the English lock

```bash
git add package.json playwright.config.ts e2e/english-visual-lock.spec.ts scripts/site-v1-english-matrix.mjs scripts/site-v1-english-matrix.test.mjs
git commit -m "test: lock English site v1 visual baseline"
```

---

## Task 10: Build the separately authored Chinese edition

**Files:**

- Create: `src/components/experience/china/chinese-site-shell.tsx`
- Create: `src/components/experience/china/pages/home-page.tsx`
- Create: `src/components/experience/china/pages/product-page.tsx`
- Create: `src/components/experience/china/pages/casework-page.tsx`
- Create: `src/components/experience/china/pages/company-page.tsx`
- Create: `src/components/experience/china/pages/human-agent-page.tsx`
- Create: `src/components/experience/china/pages/contact-page.tsx`
- Create: `src/components/experience/china/pages/privacy-page.tsx`
- Create: `src/components/experience/china/chinese-experience.test.tsx`
- Create: `src/routes/zh/casework.tsx`
- Create: `src/routes/zh/human-agent.tsx`
- Create: `src/routes/zh/contact.tsx`
- Modify: `src/routes/zh/index.tsx`
- Modify: `src/routes/zh/product.tsx`
- Modify: `src/routes/zh/company.tsx`
- Modify: `src/routes/zh/privacy.tsx`
- Modify: all Chinese legacy route adapters
- Modify: `src/editions/zh-cn/edition.ts`
- Modify: `src/editions/zh-cn/edition.test.ts`
- Create: `src/styles/site-v1/chinese.css` (global Chinese typography tokens only; page/interaction responsive differences stay with their owning CSS)

### Step 1: Write failing Chinese experience tests

Assert:

- all seven Chinese canonical routes render independently authored approved copy;
- the Chinese Home starts from recognisable team anxiety and concrete operating actions rather than an English sentence structure;
- visual quality, interaction depth and memorable-event count equal the English edition;
- shared components receive the Chinese record and labels through props/context;
- typography, line breaks and mobile stacking are intentional for Chinese;
- CTA asks for a low-commitment conversation, not a mandatory diagnosis;
- no mojibake or replacement characters occur in source or rendered HTML.

Run:

```bash
pnpm.cmd test src/components/experience/china/chinese-experience.test.tsx src/editions/zh-cn/edition.test.ts
```

Expected: FAIL.

### Step 2: Assemble Chinese pages from approved copy and shared interactions

Reuse typed interaction engines, not English page assemblers. Allow Chinese sections to change lead order and pacing while preserving product facts and visual system. Use the Chinese representative buyer question, not the English record translated at runtime.

### Step 3: Migrate Chinese routes and verify

```bash
pnpm.cmd test src/components/experience/china/chinese-experience.test.tsx src/editions/zh-cn/edition.test.ts src/lib/permanent-redirect.test.ts
pnpm.cmd build
pnpm.cmd check-types
git add src/components/experience/china src/routes/zh src/editions/zh-cn src/styles/site-v1/chinese.css src/routeTree.gen.ts
git commit -m "feat: build locally authored Chinese site v1"
```

---

## Task 11: Rebuild Agent, Markdown, metadata and discovery from canonical facts

**Files:**

- Create: `src/lib/machine-documents/paths.ts`
- Create: `src/lib/machine-documents/markdown-renderer.ts`
- Create: `src/lib/machine-documents/catalog-renderer.ts`
- Create: `src/lib/machine-documents/json-ld-renderer.ts`
- Create: `src/lib/machine-documents/machine-documents.test.ts`
- Modify: `src/lib/machine-documents.ts`
- Modify: `src/content/experience/agent-facts.ts`
- Modify: `src/lib/locale-paths.ts`
- Modify: `src/lib/markdown-negotiation.ts`
- Modify: `src/lib/seo.ts`
- Modify: `src/lib/sitemap.ts`
- Modify: `src/lib/sitemap.test.ts`
- Modify: `src/routes/agent/*`
- Modify: `src/routes/agent.$.ts`
- Create: `src/routes/agent/casework.tsx`
- Create: `src/routes/agent/human-agent.tsx`
- Create: `src/routes/agent/contact.tsx`
- Modify: `src/routes/zh/agent/*`
- Modify: `src/routes/zh/agent.$.ts`
- Create: `src/routes/zh/agent/casework.tsx`
- Create: `src/routes/zh/agent/human-agent.tsx`
- Create: `src/routes/zh/agent/contact.tsx`
- Modify: `src/routes/llms[.]txt.ts`
- Modify: `src/routes/llms-full[.]txt.ts`
- Modify: `src/routes/llms[.]mdx.agent.$.ts`
- Modify: `src/routes/llms[.]mdx.site.$.ts`
- Modify: `src/routes/llms[.]mdx.zh-agent.$.ts`
- Modify: `src/routes/sitemap[.]xml.ts`
- Modify: `src/routes/-root-head.test.ts`
- Modify: `src/lib/machine-response.test.ts`
- Modify: `src/components/experience/agent/agent-experience.test.tsx`
- Create: `src/editions/bilingual-metadata.test.ts`

### Step 1: Write failing machine-parity tests

Assert:

- new canonical public pages have matching Agent and Markdown endpoints;
- legacy Agent aliases resolve directly to the correct new topic;
- facts contain claim, evidence URL/source, scope, last reviewed and boundary;
- machine documents read canonical facts and never scrape or mirror page marketing copy;
- JSON-LD category and descriptions match approved metadata;
- all 14 human pages match the copy deck's exact title/description and emit one canonical, reciprocal `en`/`zh-CN` hreflang, English `x-default`, OG and Twitter metadata;
- canonical, hreflang, x-default, sitemap and robots entries match the manifest;
- Agent and Markdown surfaces pass GET/HEAD, Accept negotiation, cache and noindex tests for the new topics and legacy aliases;
- Human/Agent UI is not described as a ranking/indexing guarantee;
- no route duplicate source survives outside adapters generated from the manifest.

Run:

```bash
pnpm.cmd test src/lib/machine-documents/machine-documents.test.ts src/lib/machine-documents.test.ts src/lib/machine-response.test.ts src/lib/markdown-negotiation.test.ts src/lib/sitemap.test.ts src/editions/bilingual-metadata.test.ts src/components/experience/agent/agent-experience.test.tsx src/routes/-root-head.test.ts
```

Expected: FAIL.

### Step 2: Split renderers and rebuild canonical topics

Keep `machine-documents.ts` as a compatibility barrel only. `machine-documents/paths.ts` may call manifest selectors only and may not contain path literals. Machine pages use canonical public facts and stable IDs. `agent-facts.ts` becomes a compatibility barrel/selector; it may not introduce claim/source/scope/boundary text or import page copy. Human pages reference shared facts by stable fact ID instead of copying canonical text.

### Step 3: Verify and commit

```bash
pnpm.cmd test src/lib/machine-documents src/lib/machine-documents.test.ts src/lib/machine-response.test.ts src/lib/markdown-negotiation.test.ts src/lib/sitemap.test.ts src/editions/bilingual-metadata.test.ts src/components/experience/agent/agent-experience.test.tsx src/routes/-root-head.test.ts
pnpm.cmd build
pnpm.cmd check-types
git add src/lib/machine-documents src/lib/machine-documents.ts src/lib/machine-response.test.ts src/content/experience/agent-facts.ts src/lib/locale-paths.ts src/lib/markdown-negotiation.ts src/lib/seo.ts src/lib/sitemap* src/editions/bilingual-metadata.test.ts src/components/experience/agent/agent-experience.test.tsx src/routes/agent src/routes/agent.$.ts src/routes/zh/agent src/routes/zh/agent.$.ts src/routes/llms* src/routes/sitemap* src/routes/-root-head.test.ts src/routeTree.gen.ts
git commit -m "refactor: derive machine discovery from canonical facts"
```

---

## Task 12: Retire Site 06 consumers and complete production QA

**Files:**

- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify: `playwright.config.ts`
- Modify: `src/styles.css`
- Modify: `src/styles.test.ts`
- Modify: `src/styles/experience/agent.css`
- Modify: `scripts/smoke-marketing.mjs`
- Modify: `scripts/smoke-marketing.test.mjs`
- Create: `scripts/site-v1-visual-matrix.mjs`
- Create: `scripts/site-v1-visual-matrix.test.mjs`
- Create: `scripts/lighthouse-preview.mjs`
- Create: `scripts/lighthouse-preview.test.mjs`
- Create: `e2e/canonical-pages.spec.ts`
- Create: `e2e/interactions.spec.ts`
- Create: `e2e/accessibility.spec.ts`
- Create: `e2e/contact.spec.ts`
- Create: `e2e/contact-no-js.spec.ts`
- Create: `e2e/visual.spec.ts`
- Stop production imports from: `src/components/experience/global/global-pages.tsx`
- Stop production imports from: `src/components/experience/global/global-scenes.tsx`
- Stop production imports from: `src/components/experience/china/china-pages.tsx`
- Stop production imports from: `src/components/experience/china/china-scenes.tsx`
- Stop production imports from: `src/components/experience/shared/site-06-shell.tsx`
- Stop production imports from: `src/styles/experience/site-06.css`

### Step 1: Write failing launch-gate checks

Add checks for:

- every canonical route returns 200 and every legacy alias reaches one final 308 target;
- form submission reaches confirmed or explicit unconfirmed state without losing input;
- primary interactions work at desktop, tablet and mobile widths;
- keyboard order, focus visibility, labels, landmarks and contrast;
- reduced-motion screenshots contain all meaningful content;
- JS-disabled Product exposes all five views, Casework exposes all eight steps, Human/Agent exposes direct layer links, and Contact server validation preserves values;
- no horizontal overflow at 360, 390, 1024, 1280 or 1440 widths;
- no third-party image host, photo credit, fake metric or banned copy;
- no canonical public route imports a Site 06 page, scene, shell or stylesheet;
- English and Chinese screenshots exist for Home, Product, Casework, Company, Human/Agent, Contact and Privacy at 360, 390, 1024, 1280 and 1440 widths;
- state screenshots cover every visual-event transition, Product/Casework active states, Human/Evidence/Agent, Contact invalid/unconfirmed/confirmed and reduced motion;
- stable record/fact IDs persist across state changes while scene-specific geometry and `data-v1-state` change;
- there are no console errors, page errors, failed requests, HTTP 4xx/5xx responses or missing assets;
- performance checks flag oversized route imagery and unbounded animation timers for correction; formal release gating uses the approved Lighthouse, LCP and CLS thresholds below, and every image declares intrinsic dimensions.

Run:

```bash
pnpm.cmd test:scripts
pnpm.cmd test
```

Expected: FAIL until the migration and scripts are complete.

### Step 2: Remove production imports and update smoke/visual tooling

Once audits prove zero consumers across Human, Agent and machine surfaces, remove the `site-06.css` import. Migrate any Agent primitive still relying on `.site-06-*` selectors first. Keep reference fixtures only if tests still use them; do not delete user assets merely for tidiness. Rename public QA scripts to Site V1 and make them enumerate routes from the manifest.

Update `package.json` so `visual:matrix` points to `site-v1-visual-matrix.mjs`, `test:e2e` runs the root Playwright config, and `audit:lighthouse` runs the three-pass preview audit. The scripts must accept explicit base URL/output arguments.

Add Lighthouse as an exact-pinned development dependency and commit the lockfile; do not rely on a globally installed CLI.

### Step 3: Run the full local verification matrix

```bash
pnpm.cmd test
pnpm.cmd test:scripts
pnpm.cmd check-types
pnpm.cmd build
pnpm.cmd audit:legacy-marketing
pnpm.cmd audit:site-manifest
```

Expected: every command exits 0.

### Step 4: Inspect rendered output

Install the checked-in Playwright version's Chromium with `.\\node_modules\\.bin\\playwright.CMD install chromium` when absent. Start the production build in a separate local session, then run:

```bash
pnpm.cmd smoke:site --base-url http://127.0.0.1:3000/
$env:YONARIS_TEST_BASE_URL="http://127.0.0.1:3000/"
pnpm.cmd test:e2e
pnpm.cmd visual:matrix --base-url http://127.0.0.1:3000/ --output artifacts/site-v1-visual-matrix
```

Use the in-app browser plus Playwright screenshots to inspect every canonical route at 360, 390, 1024, 1280 and 1440 widths. Verify every visual-event state, first-view choreography, manual controls, Chinese line breaking, reduced motion and Contact idle/error/unconfirmed/success states. Correct visual regressions before continuing.

Perform a separate manual competitor-comparison sign-off: match the craft level of Scrunch, Bluefish and DeepLumen while rejecting copied geometry, copy, image composition, feature sequence and signature effects.

### Step 5: Verify Vercel preview and real delivery

Deploy a preview from the implementation branch. Confirm server headers, canonical domains and the presence—not values—of `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_EMAIL_API_TOKEN`, `CLOUDFLARE_EMAIL_FROM` and `MARKETING_LEAD_RECIPIENT`. Verify `/api/contact` and keep the `/api/diagnostic` compatibility adapter throughout 1.0.

Run `pnpm.cmd audit:lighthouse --url <preview-url>` for three Lighthouse mobile passes and require the median to reach Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95 and SEO ≥ 95, with LCP ≤ 2.5 seconds and CLS ≤ 0.1. Submit one clearly marked Preview test lead and verify provider acceptance plus exactly one target-mailbox receipt carrying the same submission ID.

Do not promote to the custom-domain production deployment until the full verification matrix and manual visual inspection pass.

After promotion, rerun canonical/metadata/Agent/redirect/security smoke tests against `https://yonaris.com`, then submit one clearly marked Production test lead and verify provider acceptance plus exactly one target-mailbox receipt carrying the same submission ID. Keep the previous Vercel deployment available for immediate rollback until this passes.

### Step 6: Commit the launch gate

```bash
git add package.json pnpm-lock.yaml playwright.config.ts src/styles.css src/styles.test.ts src/styles/experience/agent.css scripts e2e
git commit -m "test: enforce bilingual site v1 launch gate"
```

## Final acceptance audit

Before declaring the work complete, inspect both the code and rendered site against every item below:

1. A first-time buyer can answer “what is Yonaris?” from the first viewport.
2. The product is explained through one coherent observable buyer-question record, not verbose feature sections.
3. Home, Product, Casework, Company, Human/Agent and Contact each have a distinct memorable visual event.
4. The evidence lens is a real three-layer interaction and remains prominent.
5. English and Chinese share product truth and design quality but do not share sentence logic or page assembly blindly.
6. Human/Agent is not a primary-nav gimmick and does not make indexing promises.
7. CTA is low-friction and work email is the only required conversation field.
8. Representative product theatre is clearly disclosed and never presented as a customer result or live scan.
9. Original imagery is local, coherent and free of third-party attribution.
10. Automatic motion yields to user control; reduced-motion preserves meaning.
11. Canonical HTML, Agent HTML, Markdown, JSON-LD, sitemap and metadata share one fact/route source.
12. No Site 06 monolith is consumed by a canonical public route.
13. Tests, type checking, production build, route smoke test and visual matrix all pass from a clean checkout.
