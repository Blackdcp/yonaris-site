# Yonaris Site 09 Product-Truth Redesign

## Purpose

Site 09 moves the public website from a polished concept presentation to a credible first encounter with the Yonaris product. It keeps the strongest existing idea—the Human/Agent evidence lens—and rebuilds the English site around real product tasks, one coherent visual world, restrained editorial composition, and a clear consultation path.

The approved benchmark split is intentional:

- Bluefish is the benchmark for authorship, art direction, composition, and restraint.
- Scrunch is the benchmark for product proof, interaction causality, and conversion clarity.
- Yonaris must not reproduce either company's copy, page geometry, imagery, or signature effects.

## Product and Category Position

The canonical category remains:

> AI-native MarTech infrastructure built for decisions made by people and shaped by agents.

AI-answer observation is one visible entry point, not the category. The website must show a connected system spanning market questions, query fan-out, observed answers, citations and public evidence, comparison position, recommended action, and same-condition review. The result must not read as a single-purpose GEO company.

Global capability is expressed as a property of every record—market, language, engine, alternatives, and evidence conditions travel with the decision. It is not framed as a separate “China outbound” or “international companies entering China” service.

## Scope

This redesign covers the English human-facing routes:

- `/`
- `/product`
- `/approach`
- `/company`
- `/geo`
- `/diagnostic`

It also covers the shared Human/Agent transition and the corresponding English Agent records and machine-readable representations. `/privacy` keeps its document layout and receives only Site 09 shell and typography compatibility.

Chinese routes retain their existing localized information architecture during this implementation. Shared primitives and CSS changes must not regress them. English layouts must not be translated mechanically into Chinese layouts.

The site remains an independent Vercel project. It may copy small presentational patterns and deterministic, de-identified fixture shapes from the Portal repository, but it must not import Portal packages or create a runtime dependency on the LAS deployment.

## Non-Negotiable Truth Rules

1. Do not invent customer names, logos, quotes, rankings, revenue impact, citation lift, or deployment outcomes.
2. Product demonstrations use one plainly disclosed “Demonstration workspace.” The disclosure appears once at the workbench level, not as repetitive defensive labels on every card.
3. Do not use fake production URLs, precise hashes, exact customer timestamps, or pseudo-audit metadata to simulate authenticity.
4. Product structures and states must correspond to capabilities present in the Portal codebase: Overview, prompt observation, Query Fan-Out, citations, Share of Voice, opportunities, evidence snapshots, and review boundaries.
5. Contact submission continues to use the existing working `/api/diagnostic` flow and preserves input after recoverable errors.
6. Agent records keep explicit sources, scope, limitations, stable identifiers, and `noindex,follow` on Agent surfaces.

## Experience Model

### One State System

All public product demonstrations consume a single typed scenario model. A scenario contains:

- company label and market boundary;
- one buying question;
- recovered query fan-out;
- observed answer excerpt;
- citations and source roles;
- comparison position;
- one evidence gap;
- one recommended action;
- a review state under the same conditions.

Site 09 uses one primary industrial operating-continuity scenario across Home, Product, Approach, Company, and Across Markets. It replaces the repeated CRM example and lets the site go deeper without pretending to show several customer cases. The typed model remains capable of supporting additional scenarios later, but no second scenario is published until its question, searches, answer, citations, action, and review state are internally coherent.

Every visible number, sentence, source, and action is derived from the same scenario object. No drawer may show data that belongs to another question.

### Continuous Decision Replay

The homepage replay has six causally linked stages grounded in real Portal task structures:

1. **Scope** — establish the tracked buying question and observation boundary.
2. **Observe** — expose the selected answer run and its model, market, language, and time window.
3. **Explain** — reveal the query fan-out and word changes behind that answer.
4. **Prove** — identify the citations and the content gap shaping the comparison.
5. **Decide** — turn the evidence gap into one human-reviewed content or channel action.
6. **Verify** — freeze the protocol, capture the answer and sources, verify the evidence artefact, and accept the observation without implying that the market outcome has already improved.

The replay may run once automatically, but it must expose previous, next, pause/play, and replay controls. User interaction stops automatic advance. Stage changes update a persistent visual field rather than replacing an isolated paragraph. `prefers-reduced-motion` renders the same state transitions without animation.

### Human/Agent Evidence Lens

The lens is the signature Yonaris interaction and must operate on canonical record data rather than a decorative mask.

- Human mode presents three complete, readable statements.
- Evidence Lens mode maps each statement to its fact ID, source, owner, reviewed date, scope, and boundary.
- Human → Agent mode progressively removes presentational prose while preserving every fact and source.
- Full Agent Record shows all facts, not a partial sample, and links to the actual Agent and Markdown representations.
- Counts are computed from the record arrays. “0 facts lost” appears only when the rendered Agent set equals the Human fact set.
- Pointer, touch, keyboard, and explicit mode buttons provide equivalent access.

## Page Compositions

### Home — Decision Field

The first viewport contains one dominant event: the six-stage Decision Replay. The category line, headline, and one primary action support it; no four-column statistics rail competes with it.

Below the hero, the page has three quieter beats:

1. the product system expressed as one connected record, not a feature-card grid;
2. a compact Human/Agent lens preview;
3. a clear consultation CTA.

### Product — Working Record

The Product page is a real task surface, not a dashboard montage. It reuses the Portal’s actual information relationships in an editorial shell:

- select the question and observation boundary;
- expand recovered searches;
- inspect the exact answer and citations;
- compare position and evidence coverage;
- open the recommended action and review boundary.

The product surface includes authentic loading, ready, empty, and selected-source states. It does not claim that the public demo is connected to live customer data.

### Approach — Evidence Loop

Approach uses one sticky evidence record instead of four equal method cards. The question, observation boundary, answer, source, action, and retest remain visible while the current step changes. The interaction demonstrates what stays fixed and what changes, making the method inspectable rather than merely named.

### Company — Human/Agent Record

Company gives the evidence lens the full page and makes the machine-readable representations prominent. It explains the shared public truth without claiming that a special Agent page guarantees crawling, ranking, retrieval, or citation.

### Across Markets — Conditions, Not Geography Marketing

`/geo` shows how one stable company fact is evaluated under different market, language, alternatives, and evidence conditions. It is a capability demonstration and remains out of the primary navigation. It does not describe outbound or inbound market-entry packages.

### Contact — Review Intake

The contact page states the exchange before asking for data:

- **You provide:** company website and one real buying question.
- **Yonaris returns:** a human-reviewed scope for a useful first decision review, not an instant automated score.

Website and question appear first. Name, work email, and company appear after the review has been framed. Submission uses the existing diagnostic API, exposes pending, success, and recoverable error states, and never shows a fake success state.

## Visual System

### Typography

- Display serif: Newsreader Variable, used only for selected editorial statements.
- Primary sans: Geist Sans, used for product, navigation, body, and most headlines.
- Mono: Geist Mono, used only for functional metadata and machine fields.
- Remove Arial, Georgia, and Consolas from the English Site 09 surface.
- Functional text is at least 12px desktop and 14px mobile. Body text is at least 16px desktop and mobile.
- Headlines receive authored line breaks; container width must not create accidental five- or six-line text walls.

### Colour and Material

- Navy remains the base, but the surface range expands from near-black to blue-charcoal.
- Paper is warm mineral white rather than pure white.
- Orange is reserved for active state, provenance, and primary action. It is not a default eyebrow colour on every section.
- Borders and grid lines appear only where they explain structure.

### Original Image World

The image system uses three master assets from one fictional but physically coherent evidence studio:

1. a wide decision table with translucent evidence sheets and restrained projected marks;
2. a close view of hands comparing source material and operating constraints;
3. a quiet architectural threshold connecting the studio to a public city context.

The assets share materials, camera language, daylight temperature, and colour treatment. They avoid anonymous executives, luxury boardrooms, orange light beams, fake screens, logos, text, and watermarks. Pages reuse intentional crops of the three assets rather than generating one unrelated corporate scene per route.

Product UI is the primary proof. Photography creates pacing and a continuous world; it never carries product claims.

## Motion Rules

Motion must explain a state change. Approved uses are:

- the Decision Replay’s causal progression;
- cross-highlighting a query, answer phrase, citation, and action;
- the Human/Agent fact transformation;
- evidence-diff insertion and removal;
- pending, success, and error feedback on contact submission.

Decorative particles, universal scroll fades, autoplay carousels, cursor followers, and unrelated parallax are excluded. Reduced-motion mode must keep all information and controls while removing animated interpolation.

## Trust Without Invented Proof

Until approved customer material is supplied, trust comes from verifiable product and operating evidence:

- authentic Portal capability structure;
- explicit observation boundaries and limitations;
- inspectable canonical company records;
- real machine-readable routes;
- real contact delivery and privacy explanation;
- founder-led review language already supported by the operating model;
- clear distinction between demonstration data and customer results.

The design must leave a reserved, non-rendered data slot for future approved customer proof. No empty logo strip or “trusted by” placeholder appears publicly.

## Accessibility and Responsive Behaviour

- All interactive collections use buttons or links with correct tab, list, and region semantics.
- Keyboard users can select scenarios, step through the replay, inspect evidence, switch Human/Agent modes, and submit the form.
- Focus is always visible and meets colour contrast requirements.
- Mobile layouts are authored task views, not scaled desktop dashboards. The current task, essential result, and primary action remain visible before secondary metadata.
- Minimum touch target is 44px.
- No horizontal document overflow at 360px, 390px, 1280px, or 1440px.
- The full Agent record remains complete at every viewport.

## Verification and Acceptance

Site 09 is accepted only when all of the following are true:

1. Unit tests prove scenario changes update every dependent product field.
2. Interaction tests prove replay controls, keyboard navigation, evidence mapping, and computed fact preservation.
3. Contact integration tests prove real pending, success, and recoverable error behaviour.
4. Existing machine-document, SEO, privacy, locale, and Agent contracts remain green.
5. Visual capture covers English human routes at 1440, 1280, 390, and 360 pixels, plus reduced motion.
6. Desktop and mobile screenshots show a different task-led composition for Home, Product, Approach, Company, Across Markets, and Contact.
7. No English Site 09 surface uses Arial, Georgia, Consolas, copyrighted stock imagery, customer claims, fake hashes, or fake production metadata.
8. Build, type-check, Vitest, script tests, smoke tests, and the visual interaction matrix all pass.
