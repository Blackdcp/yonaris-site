# Yonaris Site 09 Product-Truth Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the English Site 06 presentation layer with a production-ready Site 09 experience whose visual authorship, real product causality, Human/Agent evidence transformation, consultation path, and original imagery work as one coherent system.

**Architecture:** Keep all seven existing English routes and every SEO, machine-document, Agent, locale, privacy, and delivery contract. Build Site 09 as a Global-English-only generation with a typed demonstration scenario shared by Home, Product, Approach, Company, Market Context, and Contact; keep Chinese on Site 06. Site 09 components and CSS are isolated from Site 06, while the existing route exports remain stable through compatibility barrels.

**Tech Stack:** React 19, TypeScript 7, TanStack Start/Router, Vite 8, Vitest 4, Playwright 1.61, CSS modules by generation, Zod 4, Cloudflare Email Service, Vercel.

**Spec:** `docs/superpowers/specs/2026-08-28-site-09-product-truth-redesign.md`

## Global Constraints

- The canonical category is exactly: `AI-native MarTech infrastructure built for decisions made by people and shaped by agents.`
- English Site 09 must use one synthetic industrial operating-continuity scenario across all product interactions; no customer names, logos, quotes, rankings, revenue impact, citation lift, or deployment outcomes may be invented.
- The product disclosure is exactly: `Demonstration workspace — synthetic product fixture; not customer performance, live market data or evidence of buyer behaviour.`
- Real product relationships are limited to Portal-backed structures: prompt observation, Query Fan-Out, citations, comparison share, evidence gaps, possible human-reviewed actions, frozen review conditions, and accepted observations.
- Site 09 must not import Portal packages or call Portal/LAS at runtime.
- English Site 09 uses `.site-09` and `data-generation="site-09"`; Chinese remains `.site-06` and `data-generation="site-06"`.
- Global routes and exported page component names remain unchanged; `routeTree.gen.ts` is never edited by hand.
- Agent records retain stable identifiers, source, scope, limitations, `noindex,follow`, HTML Agent routes, Markdown routes, and discovery documents.
- One visible semantic element owns each `yonaris.*` DOM id; decorative fragments use `data-*` references and never duplicate stable ids.
- Motion explains state changes only. No decorative particles, autoplay carousels, universal scroll fades, cursor followers, or unrelated parallax.
- All interaction states are keyboard, pointer, touch, and reduced-motion accessible; touch targets are at least 44px and no document overflow is allowed at 360, 390, 1280, or 1440 pixels.
- English Site 09 typography uses Newsreader Variable for selected editorial statements, Geist Sans for product/navigation/body, and Geist Mono for machine metadata; Arial, Georgia, and Consolas are excluded from Site 09.
- Contact delivery continues through `/api/diagnostic`, preserves values on recoverable failure, uses idempotency, and shows success only after the server confirms delivery.
- Consultation may add website and buying-question fields only through a coordinated schema, delivery, privacy, analytics, Agent-fact, and test update; privacy and Chinese requests remain exactly three visible identity fields.
- Original imagery contains no copyrighted stock assets, logos, text, watermarks, anonymous executives, luxury boardrooms, fake screens, or orange light beams.
- Do not publish a fake instant audit, fake success, fake hash, fake timestamp, fake production URL, or numerical performance result.

---

### Task 1: Typed Site 09 decision scenario

**Files:**
- Create: `src/content/experience/site-09/types.ts`
- Create: `src/content/experience/site-09/decision-record.ts`
- Create: `src/content/experience/site-09/decision-record.test.ts`
- Modify: `src/content/experience/index.ts`

**Interfaces:**
- Produces `ReplayStageId`, `DecisionScenario`, `DecisionStage`, `ObservationBoundary`, `ScenarioCitation`, `ScenarioFact`, `ScenarioAction`, and `SITE_09_SCENARIO`.
- Produces `getStage(scenario, stageId)`, `getScenarioFactIds(scenario)`, and `scenarioStageProjection(scenario, stageId)` as pure functions used by every later task.

- [ ] **Step 1: Write the failing scenario contract tests**

```ts
import { describe, expect, it } from "vitest";
import {
  SITE_09_SCENARIO,
  getScenarioFactIds,
  getStage,
  scenarioStageProjection,
} from "./decision-record";

describe("Site 09 decision record", () => {
  it("keeps one question and boundary across six causal stages", () => {
    expect(SITE_09_SCENARIO.question).toBe(
      "Which industrial automation partner can modernize a production line without stopping output?",
    );
    expect(SITE_09_SCENARIO.stages.map((stage) => stage.id)).toEqual([
      "scope", "observe", "explain", "prove", "decide", "verify",
    ]);
    for (const stage of SITE_09_SCENARIO.stages) {
      const projection = scenarioStageProjection(SITE_09_SCENARIO, stage.id);
      expect(projection.question).toBe(SITE_09_SCENARIO.question);
      expect(projection.boundary).toBe(SITE_09_SCENARIO.boundary);
    }
  });

  it("derives every stage field from one internally coherent fixture", () => {
    expect(getStage(SITE_09_SCENARIO, "explain").queryIds).toEqual([
      "query-continuity", "query-commissioning", "query-brownfield",
    ]);
    expect(getStage(SITE_09_SCENARIO, "prove").citationIds).toEqual([
      "citation-owned-guide", "citation-independent-checklist", "citation-standards-explainer",
    ]);
    expect(getScenarioFactIds(SITE_09_SCENARIO)).toEqual([
      "yonaris.category.ai-native-martech",
      "yonaris.purpose.decision-system",
      "yonaris.scope.martech-system",
    ]);
  });

  it("contains no customer claim or pseudo-audit metadata", () => {
    const serialized = JSON.stringify(SITE_09_SCENARIO);
    expect(serialized).toContain("synthetic product fixture");
    expect(serialized).not.toMatch(/customer result|revenue|ranked #|sha-?256|https?:\/\//i);
  });
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- src/content/experience/site-09/decision-record.test.ts`

Expected: FAIL because `decision-record.ts` does not exist.

- [ ] **Step 3: Implement the typed scenario and selectors**

```ts
export type ReplayStageId = "scope" | "observe" | "explain" | "prove" | "decide" | "verify";

export interface ObservationBoundary {
  readonly market: "United Kingdom";
  readonly language: "English";
  readonly surface: "Selected AI answer surface";
  readonly window: "30-day observation window";
}

export interface DecisionStage {
  readonly id: ReplayStageId;
  readonly index: number;
  readonly label: string;
  readonly verb: string;
  readonly summary: string;
  readonly queryIds: readonly string[];
  readonly citationIds: readonly string[];
  readonly factIds: readonly string[];
  readonly actionId?: string;
}

export interface DecisionScenario {
  readonly id: "industrial-operating-continuity";
  readonly workspaceLabel: "Demonstration workspace";
  readonly disclosure: "Demonstration workspace — synthetic product fixture; not customer performance, live market data or evidence of buyer behaviour.";
  readonly question: "Which industrial automation partner can modernize a production line without stopping output?";
  readonly boundary: ObservationBoundary;
  readonly facts: readonly ScenarioFact[];
  readonly queries: readonly ScenarioQuery[];
  readonly answer: ScenarioAnswer;
  readonly citations: readonly ScenarioCitation[];
  readonly gap: ScenarioGap;
  readonly action: ScenarioAction;
  readonly verification: ScenarioVerification;
  readonly stages: readonly DecisionStage[];
}
```

Use neutral source roles (`Owned technical guide`, `Independent implementation checklist`, `Industrial standards explainer`) without clickable fake URLs. The action is explicitly pending human review and verification accepts the observation without claiming that market performance improved.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `npm test -- src/content/experience/site-09/decision-record.test.ts`

Expected: PASS with 3 tests.

- [ ] **Step 5: Commit**

```bash
git add src/content/experience/site-09 src/content/experience/index.ts
git commit -m "feat: add coherent Site 09 decision record"
```

### Task 2: Progressive consultation contract without breaking privacy or China

**Files:**
- Modify: `src/lib/diagnostic-schema.test.ts`
- Modify: `src/lib/diagnostic-schema.ts`
- Modify: `src/lib/diagnostic-client.test.ts`
- Modify: `src/lib/diagnostic-client.ts`
- Modify: `src/lib/diagnostic-delivery.server.test.ts`
- Modify: `src/lib/diagnostic-delivery.server.ts`
- Modify: `src/components/experience/shared/lead-form.test.tsx`
- Modify: `src/components/experience/shared/lead-form.tsx`
- Modify: `src/content/experience/canonical-public-facts.ts`
- Modify: `src/content/experience/agent-facts.ts`
- Modify: `src/lib/diagnostic-analytics-privacy.test.ts`
- Modify: `src/lib/diagnostic-analytics-privacy.ts`

**Interfaces:**
- Extends only the English `consultation` diagnostic lead with required `website` and `question` strings.
- Keeps English `privacy` and all Chinese leads at three visible identity/contact fields.
- Renames the anti-bot field to `verification` so a real `website` field is never treated as a honeypot.
- Produces a progressive `LeadFormView` in which website and question frame the review before the contact fields appear.

- [ ] **Step 1: Write failing schema, delivery, privacy, and form tests**

```ts
const consultation = parseDiagnosticLead({
  locale: "en",
  requestType: "consultation",
  website: "https://manufacturer.example",
  question: "Which industrial automation partner can modernize a production line without stopping output?",
  name: "Ava Chen",
  email: "ava@manufacturer.example",
  company: "Demonstration manufacturer",
  verification: "",
});
expect(consultation.success).toBe(true);

const privacy = parseDiagnosticLead({
  locale: "en",
  requestType: "privacy",
  name: "Ava Chen",
  email: "ava@manufacturer.example",
  company: "Demonstration manufacturer",
  verification: "",
});
expect(privacy.success).toBe(true);
```

Add assertions that the delivery body includes `Website` and `Buying question` only for consultation; analytics sanitization drops `website` and `question`; 503 retains all five user-entered values; privacy and Chinese markup still contain exactly three `data-lead-field` fields.

- [ ] **Step 2: Run focused tests and verify RED**

Run: `npm test -- src/lib/diagnostic-schema.test.ts src/lib/diagnostic-client.test.ts src/lib/diagnostic-delivery.server.test.ts src/lib/diagnostic-analytics-privacy.test.ts src/components/experience/shared/lead-form.test.tsx`

Expected: FAIL because the consultation union and form do not accept `website` or `question`.

- [ ] **Step 3: Implement the coordinated contract**

Use a discriminated union on both `locale` and `requestType`; normalize website URLs by requiring `http:` or `https:`; trim the buying question to 20–500 characters; keep name, work email, and company limits unchanged. The form’s first state contains `Website` and `One real buying question`, then an explicit `Continue to contact details` button; no network request occurs until the final five-field submit. Privacy intent and Chinese consultation bypass the framing state and remain the current three-field form.

The English exchange copy is:

- `You provide: your company website and one real buying question.`
- `Yonaris returns: a human-reviewed scope for a useful first decision review—not an instant automated score.`
- Submit label: `Request a scoped review`

- [ ] **Step 4: Run focused tests and verify GREEN**

Run: `npm test -- src/lib/diagnostic-schema.test.ts src/lib/diagnostic-client.test.ts src/lib/diagnostic-delivery.server.test.ts src/lib/diagnostic-analytics-privacy.test.ts src/components/experience/shared/lead-form.test.tsx`

Expected: PASS with no warnings.

- [ ] **Step 5: Commit**

```bash
git add src/lib/diagnostic-* src/components/experience/shared/lead-form.tsx src/components/experience/shared/lead-form.test.tsx src/content/experience/canonical-public-facts.ts src/content/experience/agent-facts.ts
git commit -m "feat: frame English consultation with a real question"
```

### Task 3: Site 09 shell, typography, and generation isolation

**Files:**
- Create: `src/components/experience/global/site-09/shell/site-09-shell.tsx`
- Create: `src/components/experience/global/site-09/scene-contract.ts`
- Create: `src/components/experience/global/site-09/site-09-foundation.test.tsx`
- Modify: `src/components/experience/global/global-shell.tsx`
- Modify: `src/components/experience/global/global-pages.tsx`
- Modify: `src/styles.css`
- Create: `src/styles/experience/site-09.css`
- Create: `src/styles/experience/site-09/shell.css`
- Create: `src/styles/experience/site-09/primitives.css`
- Create: `src/styles/experience/site-09/responsive.css`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

**Interfaces:**
- Produces `Site09Shell({ pageKey, tone, children })` with stable route exports, `data-generation="site-09"`, accessible skip link, Global navigation, Human/Agent reading controls, locale link, and footer.
- Produces `SITE_09_SCENE` constants so components and visual tests share selectors without duplicating strings.

- [ ] **Step 1: Write the failing shell isolation tests**

```tsx
const en = renderToStaticMarkup(<GlobalHomePage />);
const zh = renderToStaticMarkup(<ChinaHomePage />);
expect(en).toContain('data-generation="site-09"');
expect(en).toContain('class="site-09');
expect(en).not.toContain('data-generation="site-06"');
expect(zh).toContain('data-generation="site-06"');
expect(en.match(/<main/g)).toHaveLength(1);
expect(en.match(/<h1/g)).toHaveLength(1);
expect(en).toContain('href="/agent"');
expect(en).toContain('href="/zh"');
```

Add CSS assertions for `@fontsource-variable/newsreader`, `@fontsource/geist-sans`, `@fontsource/geist-mono`, visible `:focus-visible`, reduced-motion, 44px controls, and absence of Arial/Georgia/Consolas inside Site 09 declarations.

- [ ] **Step 2: Run focused tests and verify RED**

Run: `npm test -- src/components/experience/global/site-09/site-09-foundation.test.tsx src/styles.test.ts`

Expected: FAIL because Site 09 shell and styles do not exist.

- [ ] **Step 3: Install Newsreader Variable and implement the shell**

Run: `npm install @fontsource-variable/newsreader@5.3.0`

Use primary navigation labels `Product`, `Approach`, `Company`, and `Request a review`. Keep `/geo` as footer-only `Market context`. Use a dark blue-charcoal shell, warm mineral paper, orange only for active/provenance/primary action, and no section-number decoration.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run: `npm test -- src/components/experience/global/site-09/site-09-foundation.test.tsx src/styles.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml src/components/experience/global src/styles.css src/styles/experience/site-09*
git commit -m "feat: isolate the English Site 09 foundation"
```

### Task 4: Continuous Decision Replay and authored Home composition

**Files:**
- Create: `src/components/experience/global/site-09/interactions/use-decision-replay.ts`
- Create: `src/components/experience/global/site-09/interactions/use-decision-replay.test.ts`
- Create: `src/components/experience/global/site-09/scenes/decision-replay.tsx`
- Create: `src/components/experience/global/site-09/scenes/decision-replay.test.tsx`
- Create: `src/components/experience/global/site-09/pages/home-page.tsx`
- Create: `src/styles/experience/site-09/home.css`
- Modify: `src/styles/experience/site-09.css`
- Modify: `src/components/experience/global/global-pages.tsx`

**Interfaces:**
- Produces `ReplayPlaybackState = "idle" | "playing" | "paused" | "completed" | "manual"`.
- Produces `replayReducer(state, event)` for `PLAY`, `PAUSE`, `ADVANCE`, `SELECT_STAGE`, `REPLAY`, and `SET_REDUCED_MOTION`.
- Produces `<DecisionReplay scenario={SITE_09_SCENARIO} initialStage="scope" />` with stage buttons, previous, next, play/pause, replay, a persistent decision field, and SSR-visible content for all six stages.

- [ ] **Step 1: Write failing reducer and component tests**

```ts
expect(replayReducer(initial, { type: "PLAY" }).playback).toBe("playing");
expect(replayReducer({ ...initial, stageIndex: 5 }, { type: "ADVANCE" }).playback).toBe("completed");
expect(replayReducer(initial, { type: "SELECT_STAGE", stageId: "prove" })).toMatchObject({
  stageIndex: 3,
  playback: "manual",
});
expect(replayReducer(initial, { type: "SET_REDUCED_MOTION", value: true }).playback).toBe("paused");
```

Render the component and assert six tabs/buttons and six SSR stage summaries; a selected query highlights the corresponding answer phrase, citation, and possible action through shared `data-evidence-link` values; controls expose accessible names; there is no infinite interval and no automatic `aria-live` announcement.

- [ ] **Step 2: Run focused tests and verify RED**

Run: `npm test -- src/components/experience/global/site-09/interactions/use-decision-replay.test.ts src/components/experience/global/site-09/scenes/decision-replay.test.tsx`

Expected: FAIL because the replay modules do not exist.

- [ ] **Step 3: Implement the reducer, interaction hook, scene, and Home page**

The Home copy is:

- Eyebrow: `AI-native MarTech infrastructure`
- Headline: `Connect what buyers ask, what people and agents can verify, and what your marketing team changes next.`
- Explanation: `Yonaris connects buyer questions and company facts with public evidence, content and channels, market observation, customer behaviour, and the actions your team reviews next.`
- Context: `AI-answer observation is one input to Yonaris—not the whole system.`
- Primary CTA: `See the working record` → `/product`
- Secondary CTA: `Request a scoped review` → `/diagnostic`

Auto-play runs once after intentional visibility, pauses on document hidden, reduced motion, pointer/focus interaction, and after any manual stage selection. No autoplay resumes after manual control. Home then shows one connected-record editorial beat, one compact Evidence Lens preview, and one consultation close—never a feature-card or metrics grid.

- [ ] **Step 4: Run focused and composition tests and verify GREEN**

Run: `npm test -- src/components/experience/global/site-09/interactions/use-decision-replay.test.ts src/components/experience/global/site-09/scenes/decision-replay.test.tsx src/components/experience/global/global-experience.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/experience/global/site-09 src/components/experience/global/global-pages.tsx src/styles/experience/site-09*
git commit -m "feat: make the homepage replay one real decision"
```

### Task 5: Product Workbench and Approach evidence loop

**Files:**
- Create: `src/components/experience/global/site-09/scenes/product-workbench.tsx`
- Create: `src/components/experience/global/site-09/scenes/product-workbench.test.tsx`
- Create: `src/components/experience/global/site-09/scenes/casework-evidence-diff.tsx`
- Create: `src/components/experience/global/site-09/scenes/casework-evidence-diff.test.tsx`
- Create: `src/components/experience/global/site-09/pages/product-page.tsx`
- Create: `src/components/experience/global/site-09/pages/approach-page.tsx`
- Create: `src/styles/experience/site-09/product.css`
- Create: `src/styles/experience/site-09/approach.css`
- Modify: `src/styles/experience/site-09.css`
- Modify: `src/components/experience/global/global-pages.tsx`

**Interfaces:**
- Produces `<ProductWorkbench scenario={SITE_09_SCENARIO} />` with task views `scope`, `queries`, `answer`, `sources`, and `action`.
- Produces `ProductSelection` and a single reducer event `SELECT_RECORD` that atomically updates question, queries, answer, citations, evidence gap, and action.
- Produces `<CaseworkEvidenceDiff scenario={SITE_09_SCENARIO} />` whose steps are `Question fixed`, `Observation captured`, `Source gap identified`, `Action reviewed`, and `Conditions frozen`.

- [ ] **Step 1: Write failing Product and Approach interaction tests**

```tsx
expect(workbench).toContain("Recovered searches");
expect(workbench).toContain("Observed answer");
expect(workbench).toContain("Source roles");
expect(workbench).toContain("Evidence gap to review");
expect(workbench).toContain("Possible human-reviewed action");
expect(workbench).not.toMatch(/79%|35%|3,120|42 prompts|Share of Voice/i);
```

Assert ready, loading, empty, selected-source, and drawer-open states; Escape closes the source drawer and returns focus to its trigger. Assert Approach renders before and after in SSR, uses `<ins>`/`<del>` plus text labels, keeps the exact question and boundary fixed, and never claims improved ranking or revenue.

- [ ] **Step 2: Run focused tests and verify RED**

Run: `npm test -- src/components/experience/global/site-09/scenes/product-workbench.test.tsx src/components/experience/global/site-09/scenes/casework-evidence-diff.test.tsx`

Expected: FAIL because the scenes do not exist.

- [ ] **Step 3: Implement task-led Product and sticky Approach compositions**

Product begins with the workbench, not a marketing hero. The dominant left rail is the task flow; the persistent record updates on the right. Loading and empty states are explicit demo controls and never masquerade as live API activity. Approach keeps a sticky evidence record while the active method step changes, visually distinguishing fixed conditions from changed evidence.

Product value statement: `Trace one buying question from an observed AI answer to its sources, then turn the evidence gap into a marketing action your team can review.`

Approach value statement: `Fix the question and observation conditions, record the source-backed change, and repeat the review under the same conditions.`

- [ ] **Step 4: Run focused and global tests and verify GREEN**

Run: `npm test -- src/components/experience/global/site-09/scenes/product-workbench.test.tsx src/components/experience/global/site-09/scenes/casework-evidence-diff.test.tsx src/components/experience/global/global-experience.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/experience/global/site-09 src/components/experience/global/global-pages.tsx src/styles/experience/site-09*
git commit -m "feat: turn product proof into inspectable work"
```

### Task 6: Full Human/Agent evidence lens, Market Context, and page assembly

**Files:**
- Create: `src/content/experience/site-09/human-agent-map.ts`
- Create: `src/content/experience/site-09/human-agent-map.test.ts`
- Create: `src/components/experience/global/site-09/interactions/use-evidence-lens.ts`
- Create: `src/components/experience/global/site-09/scenes/human-agent-mapping.tsx`
- Create: `src/components/experience/global/site-09/scenes/human-agent-mapping.test.tsx`
- Create: `src/components/experience/global/site-09/pages/company-page.tsx`
- Create: `src/components/experience/global/site-09/pages/geo-page.tsx`
- Create: `src/components/experience/global/site-09/pages/diagnostic-page.tsx`
- Create: `src/components/experience/global/site-09/pages/privacy-page.tsx`
- Create: `src/components/experience/global/site-09/site-09-page-compositions.test.tsx`
- Create: `src/styles/experience/site-09/company.css`
- Create: `src/styles/experience/site-09/diagnostic.css`
- Modify: `src/styles/experience/site-09.css`
- Modify: `src/components/experience/global/global-pages.tsx`
- Modify: `src/content/experience/global-copy.ts`
- Modify: `src/components/experience/site-generation.test.tsx`
- Modify: `src/components/experience/site-06-interaction-integration.test.tsx`

**Interfaces:**
- Produces `HumanAgentMode = "human" | "evidence" | "agent"` and `HumanAgentMapping` records from canonical `EN_READING_RECORDS`.
- Produces `countPreservedFacts(humanMappings, agentFacts)`; `0 facts lost` is rendered only when every mapped canonical fact id is present exactly once in the Agent set.
- Produces all seven existing `Global*Page` exports and the unchanged `GLOBAL_PAGES` map from Site 09 page modules.

- [ ] **Step 1: Write failing mapping and page-composition tests**

```ts
expect(HUMAN_AGENT_MAPPINGS.map((item) => item.factId)).toEqual([
  "yonaris.category.ai-native-martech",
  "yonaris.purpose.decision-system",
  "yonaris.scope.martech-system",
]);
expect(countPreservedFacts(HUMAN_AGENT_MAPPINGS, EN_READING_RECORDS)).toEqual({
  human: 3,
  agent: 3,
  lost: 0,
});
```

Assert Human mode has three complete readable statements; Evidence mode shows fact id, source, owner, reviewed date, scope, and boundary for each statement; Agent mode contains every fact and source and links to `/agent/company` and `/agent/company.md`; mouse, keyboard, touch buttons, and ArrowLeft/ArrowRight switch modes. Assert `/geo` copy says `Market context`, is absent from primary navigation, and compares stable facts against market/language/alternative/source conditions without outbound/inbound expansion language. Assert every English page is Site 09, every Chinese page remains Site 06, and each page has one `main` and one `h1`.

- [ ] **Step 2: Run focused tests and verify RED**

Run: `npm test -- src/content/experience/site-09/human-agent-map.test.ts src/components/experience/global/site-09/scenes/human-agent-mapping.test.tsx src/components/experience/global/site-09/site-09-page-compositions.test.tsx`

Expected: FAIL because the mapping and page modules do not exist.

- [ ] **Step 3: Implement the signature lens and remaining independent page compositions**

Company value statement: `Keep one sourced company record consistent for people and agents, with the same facts, scope and stable identifiers.`

Market Context value statement: `Run the same evidence workflow across markets while keeping local language, category terms, alternatives and sources attached to each observation.`

The Evidence Lens may use three concentric interactive rings, but each ring must represent a real mapping depth: human statement, evidence metadata, canonical Agent fact. The Company page gives this interaction primary visual weight; it is not placed in a footer or secondary card. Contact reuses the real progressive `LeadForm`; Privacy keeps document semantics in the Site 09 shell.

- [ ] **Step 4: Run focused and compatibility tests and verify GREEN**

Run: `npm test -- src/content/experience/site-09/human-agent-map.test.ts src/components/experience/global/site-09/scenes/human-agent-mapping.test.tsx src/components/experience/global/site-09/site-09-page-compositions.test.tsx src/components/experience/site-generation.test.tsx src/components/experience/site-06-interaction-integration.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/content/experience src/components/experience src/styles/experience/site-09*
git commit -m "feat: complete the Site 09 Human Agent system"
```

### Task 7: Original evidence-studio imagery and responsive delivery

**Files:**
- Create: `public/brand/site-09/decision-table-original.jpg`
- Create: `public/brand/site-09/source-review-original.jpg`
- Create: `public/brand/site-09/public-threshold-original.jpg`
- Create: responsive 640, 1024, and 1440 pixel derivatives for all three masters
- Create: `scripts/generate-site-09-derivatives.py`
- Modify: `src/lib/brand-assets.ts`
- Modify: `src/lib/brand-assets.test.ts`
- Modify: `src/components/experience/original-imagery.test.tsx`
- Modify: Site 09 Home, Product, Approach, Market Context, and Contact page components to use intentional crops

**Interfaces:**
- Adds three Site 09 master assets and nine responsive derivatives to the existing brand-asset registry.
- Site 09 image rendering exposes intrinsic dimensions, `srcSet`, `sizes`, authored focal position, lazy loading below the first viewport, and no credit line.

- [ ] **Step 1: Write failing asset contract tests**

```ts
for (const name of ["decision-table", "source-review", "public-threshold"]) {
  expect(existsSync(asset(`${name}-original.jpg`))).toBe(true);
  for (const width of [640, 1024, 1440]) expect(existsSync(asset(`${name}-${width}.jpg`))).toBe(true);
}
expect(site09Markup).not.toMatch(/Unsplash|Pexels|Photo:/i);
expect(site09Markup.match(/data-responsive-site-09-image="true"/g)?.length).toBeGreaterThanOrEqual(3);
```

Add file-size assertions: each derivative is under 500 KB and each original is under 1.5 MB.

- [ ] **Step 2: Run focused tests and verify RED**

Run: `npm test -- src/lib/brand-assets.test.ts src/components/experience/original-imagery.test.tsx`

Expected: FAIL because the Site 09 files do not exist.

- [ ] **Step 3: Generate, inspect, crop, and integrate the three coherent assets**

All three images use the same fictional evidence studio: matte navy mineral surfaces, clear and smoked glass evidence sheets, cool late-afternoon daylight, restrained warm reflections, documentary architectural photography, 35–50mm lens language, subtle grain, no people except hands in the source-review asset. Generate each master separately, visually inspect it, and reject any screen-like fake UI, text, logo, watermark, executive, boardroom, or orange beam. Implement `scripts/generate-site-09-derivatives.py` with Pillow: preserve aspect ratio, resize to widths 640, 1024, and 1440 using LANCZOS, convert to sRGB RGB JPEG, save at quality 84 with optimization and progressive encoding, then run `python scripts/generate-site-09-derivatives.py`.

- [ ] **Step 4: Run focused tests and verify GREEN**

Run: `npm test -- src/lib/brand-assets.test.ts src/components/experience/original-imagery.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add public/brand/site-09 src/lib/brand-assets* src/components/experience/original-imagery.test.tsx src/components/experience/global/site-09
git commit -m "feat: add the original Site 09 image world"
```

### Task 8: Site 09 visual matrix, full verification, and production release

**Files:**
- Create: `scripts/visual-matrix/core.mjs`
- Create: `scripts/visual-matrix/site-09.config.mjs`
- Create: `scripts/site-09-visual-matrix.mjs`
- Create: `scripts/site-09-visual-matrix.test.mjs`
- Modify: `package.json`
- Modify: `scripts/smoke-marketing.mjs`
- Modify: `scripts/smoke-marketing.test.mjs`
- Modify: `src/components/experience/site-generation.test.tsx`
- Create: `tests/fixtures/site-09-reference/README.md`

**Interfaces:**
- Produces a data-driven matrix whose expected artifact count is derived from route × viewport × state, never hard-coded.
- Captures every English route at 1440, 1280, 390, and 360 pixels; reduced-motion variants; each replay stage; Product ready/loading/empty/source-drawer states; each Human/Agent mode; Approach diff; and Contact idle/validation/error/success with the API intercepted locally.
- Keeps `npm run visual:matrix` as the production matrix command.

- [ ] **Step 1: Write failing matrix configuration and smoke tests**

```js
assert.equal(expectedCaptureCount(config), config.routes.reduce(
  (sum, route) => sum + route.viewports.length * route.states.length,
  0,
));
assert.ok(config.routes.find((route) => route.path === "/").states.includes("verify"));
assert.ok(config.routes.find((route) => route.path === "/product").states.includes("source-open"));
assert.ok(config.routes.find((route) => route.path === "/company").states.includes("agent"));
```

Add a browser diagnostic test that intercepts `/api/diagnostic`, asserts the exact consultation body and idempotency header, returns 503 once and 202 on retry, proves values persist, and never sends a real production lead.

- [ ] **Step 2: Run script tests and verify RED**

Run: `npm run test:scripts`

Expected: FAIL because the Site 09 matrix modules do not exist.

- [ ] **Step 3: Implement the matrix and update smoke contracts**

The core runner must support `section > picture > img`, derive selectors from `SITE_09_SCENE`-equivalent config strings, wait for font readiness, disable transitions for deterministic screenshots unless the state itself is under test, and write captures to the git-ignored Site 09 artifact directory. Contact success/error states use Playwright route interception only.

- [ ] **Step 4: Run complete verification with fresh evidence**

Run in this order:

```bash
npm run check-types
npm test
npm run test:scripts
npm run build
npm run smoke:site
npm run visual:matrix
```

Expected: every command exits 0 with no failing tests. Inspect the 1440, 390, and reduced-motion screenshots for every English route. Confirm no horizontal overflow, no accidental five-line headings, no reused Site 06 stock-look imagery, no default card grids, no fake customer proof, and no state whose meaning depends only on animation or colour.

- [ ] **Step 5: Run production URL checks after release**

Push the verified `main` branch, wait for the Vercel production deployment, then run:

```bash
curl.exe -I -L https://www.yonaris.com/
curl.exe -I -L https://www.yonaris.com/product
curl.exe -I -L https://www.yonaris.com/agent/company
curl.exe -I -L https://www.yonaris.com/llms.txt
```

Expected: final HTTPS responses are 200 with the production certificate valid. Submit no real contact lead during release verification.

- [ ] **Step 6: Commit and publish**

```bash
git add package.json scripts src tests/fixtures/site-09-reference
git commit -m "test: verify the Site 09 production experience"
git push origin main
```
