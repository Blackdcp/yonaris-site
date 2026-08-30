# Yonaris English Website 1.0 — Buyer-Clarity Design

**Status:** Approved for production implementation; interaction standard amended 30 Aug 2026

**Date:** 2026-08-29

**Scope:** English public website 1.0. Chinese 1.0 will be designed separately from Chinese buyer logic after the English experience is locked; both editions remain required for the 1.0 public release.

## 1. Decision

Yonaris English 1.0 will no longer organise the site around internal categories such as Product, Approach, Results, GEO, and Human/Agent as equal concepts. It will organise the experience around the sequence a first-time buyer needs:

1. understand why this matters;
2. understand exactly what Yonaris does;
3. see how the product turns observation into useful work;
4. inspect a credible example and the operating boundary;
5. continue with minimal commitment.

The site must make Yonaris legible before it makes Yonaris sophisticated.

The approved public category remains:

> **AI-Native MarTech Infrastructure**

The category is an eyebrow and an investor-level classification. It is not expected to explain the product by itself.

The approved buyer-facing proposition is:

> **Know what buyers are being told—and what to change.**

Supporting definition:

> Yonaris shows marketing teams what AI and digital channels are telling buyers, which evidence is shaping the shortlist, what action can change it, and what actually changed afterwards.

The internal operating model remains:

> Observe → Interpret → Execute → Outcome → Learn

That model may structure product behaviour and deeper explanation, but it must not require visitors to learn Yonaris terminology before understanding the product.

## 2. What This Replaces

This design supersedes the Site 09 public-site narrative and interaction architecture. The Site 09 prototype remains a source of approved visual qualities and technical experiments, not the page structure to publish.

The following ideas are removed from the English 1.0 primary experience:

- a `Market Decision Field` as a named hero concept;
- a five-stage `MarTech Control Point` as the dominant product interaction;
- separate top-level `Approach`, `Results`, `GEO`, or `Human/Agent` navigation;
- abstract `Evidence-to-Action Workbench` language;
- repeated framework copy such as Product Truth, Evidence Grade, Outcome Spec, and Decision Signals in buyer-facing prose;
- a high-friction `Bring us one market question` site-wide CTA;
- misleading product theatre: invented scores presented as real, fake customer results, fake live state, or capabilities outside the verified Yonaris product boundary.

The following approved Site 09 qualities remain:

- deep navy, warm ivory, restrained orange signal, mature enterprise tone;
- original cinematic imagery rather than stock-photo attribution;
- explanatory motion that reveals causality, supported by authored atmospheric motion and purely visual motifs that create depth, rhythm and brand memory;
- the three-layer evidence lens as a signature interaction;
- product theatre may be more composed than Portal, while every capability and causal relationship remains inside the verified product boundary;
- same-condition review, explicit human judgement, and visible unchanged limitations.

## 3. Goals and Non-Goals

### 3.1 Goals

English 1.0 must:

1. let a first-time visitor explain what Yonaris does after the first screen;
2. show that AI-answer observation is one input in a broader marketing operating system, not the company category;
3. demonstrate concrete inputs, system actions, user outputs, human boundaries, and verification;
4. make Human/Agent differentiation prominent without turning it into the site taxonomy;
5. let curious visitors experience value without submitting information;
6. let lightly interested visitors contact Yonaris with only a work email;
7. preserve production-grade SSR, SEO, machine-readable documents, lead delivery, accessibility, and bilingual foundations already present in the repository;
8. publish no copyrighted stock imagery, fictional customer proof, unsupported performance claims, or fake real-time product state.

### 3.2 Non-Goals for 1.0

English 1.0 will not add:

- a pricing architecture;
- a Resources, Journal, FAQ, or content-growth hub;
- role-based or industry solution libraries;
- a full Trust Center or security documentation suite;
- live Portal data or public Portal authentication;
- an instant audit or AI-generated result;
- customer logos, testimonials, percentages, rankings, or attributed outcomes until approved customer material exists;
- a production connection between the Vercel marketing site and the LAS Portal;
- a global-markets landing page framed as outbound China business or inbound China business.

These are 2.0 candidates. Their absence must not prevent 1.0 from being clear, credible, and complete.

## 4. Information Architecture

### 4.1 Primary Navigation

The English 1.0 header contains:

```text
Product
Casework
Company
Talk to Yonaris
```

The Yonaris wordmark links to Home. The locale control remains a utility, not a narrative item.

`Talk to Yonaris` is visually distinct from the informational links but must not look like an aggressive enterprise-demo button.

### 4.2 Footer

The footer contains:

```text
Human / Agent
Agent documents
Markets & languages
Privacy
Contact
```

`Markets & languages` links to the relevant Product section in 1.0. It does not require a standalone route.

### 4.3 Canonical Routes

| Route | Visible label | Responsibility |
|---|---|---|
| `/` | Home | Establish the buyer problem, show the first causal interaction, preview the product, demonstrate Human/Agent, preview Casework, and offer low-friction continuation. |
| `/product` | Product | Explain exactly what enters Yonaris, what the system does, what teams receive, and how one buyer question moves through real product views. |
| `/casework` | Casework | Show one representative question from situation through observation, evidence, reviewed action, re-observation, and unchanged limitations. |
| `/company` | Company | Explain why Yonaris exists, whom it serves, how it works across markets, what it does not claim, and verified company/contact information. |
| `/human-agent` | Human / Agent | Provide a deep, directly linkable explanation of one shared fact for human and machine readers. It is not in primary navigation. |
| `/contact` | Talk to Yonaris | Provide a one-required-field contact path with optional progressive context. |
| `/privacy` | Privacy | Explain form data and privacy handling. |
| `/agent/*` | Agent documents | Serve stable machine-first topic records derived from canonical public facts. |

Legacy routes remain functional through permanent redirects or compatibility handlers:

| Legacy route | Destination |
|---|---|
| `/platform` | `/product` |
| `/approach` | `/product#how-it-works` |
| `/results` | `/casework` |
| `/geo` | `/product#markets-languages` |
| `/diagnostic` | `/contact` |

Legacy Agent documents must map to the new canonical topic model without breaking existing machine links.

## 5. One Narrative Thread

The entire English experience is organised around one representative buyer question. The question is a narrative thread, not a fake personalised audit and not a cross-page gimmick that requires user data.

Every page reveals a different part of the same relationship:

```text
What buyers ask
→ what AI and digital channels tell them
→ which evidence shapes comparison
→ what a marketing team can change
→ what changed when the same conditions were reviewed again
```

The English 1.0 representative question is:

> **Which analytics partner can support an enterprise marketing team across several markets without losing local context or evidence?**

The assessed company is labelled `Your company`; comparison entities are labelled `Alternative A` and `Alternative B`. They are not presented as real customers or competitors. The question is commercially consequential, naturally carries market and language conditions, and demonstrates evidence, action, and verification beyond a narrow GEO score.

## 6. Home

### 6.1 Hero Copy

Eyebrow:

> AI-Native MarTech Infrastructure

Headline:

> **Know what buyers are being told—and what to change.**

Body:

> Yonaris shows marketing teams what AI and digital channels are telling buyers, which evidence is shaping the shortlist, what action can change it, and what actually changed afterwards.

Actions:

- Primary: `See Yonaris in action`
- Secondary: `Talk to Yonaris`

`See Yonaris in action` moves directly to the live Home product preview. It never opens a form.

### 6.2 Hero Event: One Question, Several Market Answers

The dominant visual starts with one concrete buyer question and exposes how the answer is formed across several information environments:

- AI answers;
- search;
- editorial and review sources;
- company-owned public content.

The interaction must show:

1. the observed answer or comparison statement;
2. which brands or alternatives are considered;
3. the reason attached to an inclusion or exclusion;
4. the source, company fact, contradiction, or missing context behind that reason.

Selecting a phrase or comparison reason traces it back to the relevant evidence. The experience resolves to:

> **This is what the market is telling buyers before the sales conversation begins.**

The hero does not claim comprehensive market coverage, causal proof, live data, or a changed outcome.

### 6.3 Product Preview

Headline:

> **From one buyer question to the next market action.**

The same question remains visible while the visitor can inspect five customer-language views:

```text
What buyers ask
What they hear
Why they hear it
What your team can change
What changed afterwards
```

This is a compact preview of Product, not five marketing cards and not an autoplay carousel. Every view changes the central record, not merely a title.

### 6.4 Human / Agent Signature Section

This section appears only after the product has been made understandable. It receives near-full-viewport visual weight but does not become a primary-navigation destination.

Headline:

> **One fact. Two readers. No conflicting versions.**

The same fact appears as:

- a human conclusion with context and a useful next action;
- an Agent fact with claim, source, scope, timestamp, and boundary.

The approved three-layer evidence lens maps:

```text
Answer
Evidence
Machine-readable fact
```

The lens must operate on canonical data, support pointer and keyboard input, and link to the corresponding `/human-agent` and `/agent/*` records.

### 6.5 Casework Preview

The preview shows:

- the buyer question;
- the answer observed initially;
- the information gap or contradiction that mattered;
- the reviewed action;
- what changed and what remained unchanged after review.

It is labelled:

> **Representative casework — not a customer performance claim.**

### 6.6 Closing Conversion

Headline:

> **Curious where Yonaris could fit?**

Body:

> You don’t need a brief—or even a clearly defined problem.

Action:

> **Talk to Yonaris**

## 7. Product

### 7.1 First-Screen Requirement

Product must answer four questions without requiring interaction:

1. What does Yonaris observe?
2. What does the system produce?
3. What does a customer team do with it?
4. How is subsequent change reviewed?

Headline:

> **From a buyer question to a clear next move.**

### 7.2 What Enters Yonaris

Use buyer language:

- the markets and audiences that matter;
- the questions buyers ask;
- approved company and product facts;
- relevant content, channel, source, language, and comparison context.

### 7.3 What Yonaris Does

Yonaris:

- observes how selected AI and digital channels answer;
- compares the reasons brands enter or leave consideration;
- traces those reasons to sources, company facts, missing context, and contradictions;
- turns observed gaps into possible marketing, content, evidence, or channel actions for human review;
- records approved work and reviews the same buyer question under visible comparison conditions;
- keeps commercial or customer signals beside the observation when such signals are available and authorised.

The public experience must never describe these actions as autonomous execution, guaranteed uplift, exhaustive coverage, or causal proof.

### 7.4 What the Team Receives

The product produces four tangible outcomes:

1. a view of what buyers are being told;
2. an explanation of what is shaping the comparison;
3. a prioritised, human-reviewed action programme;
4. a record of what changed, what did not, and what should be reviewed next.

### 7.5 Main Product Event

The page uses one continuous product surface, visually elevated beyond Portal but derived from real product relationships. The buyer question stays fixed while visitors open five work views:

| View | Question answered for the visitor | Required product evidence |
|---|---|---|
| `Buyer questions` | What are customers actually asking when they compare this category? | tracked prompt, market, language, audience or intent context, query fan-out where relevant |
| `Current answers` | What are AI and selected digital channels telling them? | observed answer, alternatives, comparison reason, observation boundary |
| `Sources and gaps` | Why is that answer taking shape? | citations, public sources, company facts, contradictions, missing context, evidence status |
| `Actions under review` | What can the team responsibly change next? | proposed action, target judgement or evidence relationship, owner/channel, human approval boundary |
| `Outcome review` | What changed when the same question was reviewed again? | frozen review conditions, before and after observations, changed and unchanged items, authorised commercial signal if available |

This event must look like one coherent product, not a process diagram, tabbed feature catalogue, or imitation of the Portal chrome.

### 7.6 Markets and Languages

Global capability is a property of every record. Market, language, category terms, alternatives, sources, and observation conditions stay attached to the buyer question.

The site must not reduce this capability to Chinese companies going abroad or international companies entering China.

## 8. Casework

Casework replaces the need for separate public Approach and Results narratives.

Headline:

> **See one buyer question worked all the way through.**

The 1.0 page contains one complete representative walkthrough:

1. **The situation** — why the team needed a decision;
2. **The buyer question** — the exact natural-language question;
3. **What buyers were being told** — the selected initial observations;
4. **What shaped the answer** — relevant source and evidence relationships;
5. **What was missing or misleading** — the concrete decision gap;
6. **What the team changed or validated** — the reviewed content, evidence, channel, or operating action;
7. **What was observed afterwards** — the same-condition review;
8. **What still could not be claimed** — unchanged limitations, unknown attribution, or absent commercial proof.

Required disclosure:

> **Representative casework — not a customer performance claim.**

Fixture source labels may explain a source relationship, but no `representative://` or invented third-party URL may be presented as externally verifiable evidence.

When the user supplies approved customer material, the representative record may be replaced through the same content contract without redesigning the page.

## 9. Company

Headline:

> **We build for the moment before the sales conversation.**

Company is concise and factual. It answers:

- why Yonaris exists;
- which marketing and commercial teams it serves;
- what decision those teams are trying to make;
- how global capability appears through market, language, source, and category context;
- where human judgement remains required;
- what Yonaris does not promise;
- the verified Yonaris name, domain, contact path, and privacy information already used in production.

Team biographies, a street address, legal-entity details, awards, certifications, and investor claims remain omitted until the user supplies and approves them. The page must not use placeholders to simulate organisational maturity.

Company is not a second product page, an Agent-document tutorial, or a collection of unsupported ambition statements.

## 10. Human / Agent

Human/Agent is a signature product principle, not a primary business category.

It is placed in three locations:

1. a near-full-screen signature interaction on Home after Product is understood;
2. a shorter Product section tied to the same buyer-question record;
3. a deep `/human-agent` page linked from those sections and the footer.

Machine discovery is supported independently through `/agent/*`, `llms.txt`, Markdown negotiation, sitemap entries, canonical/hreflang metadata, and structured public facts. Agent discoverability must not depend on a human-facing navigation label.

The Agent presentation is not a code-themed skin. It must expose the same stable fact identity, source, scope, timestamp, and boundary as the human presentation.

## 11. Conversion

### 11.1 Anonymous Curiosity

`See Yonaris in action` always provides an ungated product experience. It never requires an email and never opens Contact automatically.

### 11.2 Low-Intent Contact

The global conversion label is:

> **Talk to Yonaris**

The Contact page requires only:

```text
Work email *
```

Optional visible fields:

```text
Name
Company or website
What are you curious about?
```

Supporting copy:

> You don’t need a brief. Leave a work email and we’ll start with what you’re curious about.

Submission label:

> **Start a conversation**

Success message:

> **Thanks. Someone from Yonaris will reply personally.**

### 11.3 High-Intent Expansion

The optional control:

> **I already have a market question**

reveals:

- the market question;
- market or language context;
- buyer or commercial context.

These fields remain optional. They do not block a curious visitor from submitting only a work email.

The site never promises an instant audit, automated score, report, meeting slot, or response SLA that operations cannot guarantee.

## 12. Interaction and Visual System

### 12.1 Three-Layer Experience

The experience has three equally legitimate layers:

1. **Information** — concise copy establishes what Yonaris does and the decision being examined.
2. **Explanation** — product theatre uses transformation, tracing, reordering, compression, comparison and review states to make the operating mechanism visible.
3. **Atmosphere** — particles, rings, light, shadow, parallax, masking, depth, image movement, typographic motion and other authored visual devices create tension, rhythm and brand memory.

Not every visual element must perform a product function. Aesthetic quality is itself a valid contribution when it strengthens the composition and does not obscure meaning, accessibility or truth.

### 12.2 Core Interaction Rule

Every major interaction must reveal a causal relationship:

- selecting a buyer question or channel changes the visible answer;
- selecting a comparison reason reveals the evidence behind it;
- selecting an evidence gap changes the possible reviewed action;
- selecting a review state reveals both changed and unchanged observations;
- selecting a layer in the evidence lens changes the representation without changing the underlying fact.

Each core page owns one memorable visual event. Supporting motion may be decorative, atmospheric or transitional; it does not need to change information every time.

### 12.3 Product Theatre

Product theatre may be more cinematic, compressed and visually sophisticated than Portal. It may use stylised interfaces, animated evidence flows, dynamic dashboards, particles, masks, spatial transitions and composed data states. It must preserve the real input, system action, human boundary, output and review relationship.

Product theatre must never imply that representative data is live customer data, that a suggested action was executed autonomously, or that an observed change proves commercial causation.

### 12.4 Allowed Visual and Motion Language

The following are explicitly allowed when authored for Yonaris and used with hierarchy:

- particles and data fragments;
- decorative or interactive rings, including the three-ring evidence lens;
- controlled glow, light bloom, shadow, grain, blur and depth;
- scroll reveals, parallax, masking, scene transitions and typographic motion;
- automatic previews and rotating states that pause on interaction and expose user controls;
- stylised dashboards and diagrams that are clearly representative product theatre;
- visual sequences whose primary purpose is atmosphere rather than explanation.

These devices should vary by page and scene. They are not a shared template to repeat unchanged across the site.

### 12.5 Rejected Patterns

The rejection criterion is not the presence of a particular visual device. It is generic execution, repetition, obstruction or misrepresentation:

- off-the-shelf effects that could accept any company logo without redesign;
- one animation pattern repeated as the dominant idea across every page;
- fake metrics, fake customer outcomes, fake live states or unsupported capabilities;
- an automated cursor, scan or loading sequence presented as real product activity;
- autoplay that cannot be paused;
- large empty scrollytelling corridors;
- desktop-only hover dependencies;
- a generic card grid repeated across pages.

### 12.6 Motion Behaviour

A choreographed first-view sequence may establish the full scene, not merely a short utility preview. Any pointer, keyboard or touch input transfers control to the user. Autoplay must be pausable and must not prevent direct inspection. Reduced-motion mode renders the same meaningful states without requiring motion.

### 12.7 Visual Direction

The approved world remains editorial, cinematic, and enterprise-grade:

- deep navy and warm ivory fields;
- orange as a controlled signal that may bloom or glow at focal moments without becoming a site-wide neon wash;
- large, controlled typography;
- lines, apertures, evidence attachment, and the three-ring lens as Yonaris-specific motifs;
- original imagery from one coherent fictional evidence environment;
- interface theatre integrated with the composition rather than floating generic dashboard cards.

The visual benchmark is not restraint for its own sake. It is an authored, cinematic and technically confident experience whose copy, motion and interaction work as one composition.

No Scrunch, Bluefish, or DeepLumen page geometry, copy, imagery, feature sequence, or signature effect may be reproduced pixel-for-pixel.

## 13. Content and Data Model

All public demonstrations derive from one typed representative record. A conceptual contract is:

```ts
interface BuyerQuestionRecord {
  id: string;
  question: string;
  audience: string;
  market: string;
  language: string;
  observationConditions: ObservationConditions;
  channelAnswers: readonly ChannelAnswer[];
  comparisonReasons: readonly ComparisonReason[];
  evidence: readonly EvidenceItem[];
  gaps: readonly EvidenceGap[];
  proposedActions: readonly ReviewedAction[];
  review: OutcomeReview;
  disclosure: RepresentativeDisclosure;
}
```

The same IDs and facts feed:

- Home interaction states;
- Product work views;
- Casework narrative;
- Human and Agent representations;
- page metadata and structured public facts where appropriate.

Human and Agent copy may differ in presentation, but they may not contradict each other or invent separate facts.

The representative record is static, server-renderable, and disclosed. It does not make live Portal or third-party API requests.

## 14. Production Architecture

The implementation stays in the existing `yonaris-site` repository and production framework:

- React 19;
- TanStack Start/Router;
- server-side rendering;
- Vite/Nitro build and Vercel deployment;
- existing metadata, canonical, hreflang, OG, sitemap, robots, llms, and Agent-document infrastructure;
- existing server-side Cloudflare lead delivery.

The standalone Site 09 vanilla prototype must not be copied into production as a second application. Approved visual and interaction ideas will be rebuilt as focused, typed React components inside the existing production shell.

Required logical component boundaries (exact filenames may follow existing repository conventions):

```text
EnglishSiteShell
BuyerQuestionProvider
HomeAnswerField
ProductQuestionWorkspace
CaseworkWalkthrough
EvidenceLens
HumanAgentProjection
LowFrictionLeadForm
```

Each component owns one event and consumes the canonical record through an explicit interface. No page-level monolith should own all interaction state.

Portal remains deployed and operated separately on LAS. The public site must not import Portal runtime code, secrets, authentication, or live customer data.

## 15. Progressive Enhancement and Failure Behaviour

All core claims, page headings, representative disclosures, and Casework steps are present in SSR HTML.

If JavaScript is unavailable or an interaction fails:

- Home renders a readable channel-answer and source summary;
- Product renders all five views as semantic sections;
- Casework renders the full ordered walkthrough;
- Human/Agent exposes direct human and machine links;
- Contact remains server-validatable and does not lose submitted values on recoverable errors.

Contact behaviour:

- validation is performed client-side for guidance and server-side for authority;
- server secrets remain server-only;
- duplicate submission protection, bot mitigation, and current delivery safeguards are preserved;
- on failure, entered data stays visible, the error is explained in plain language, and retry is available;
- no failure state claims a lead was delivered when it was not.

The demonstration never uses a fake loading state to imply live analysis.

## 16. Accessibility, Responsive Behaviour, and Performance

Required interaction support:

- keyboard, pointer, and touch parity;
- visible focus states;
- meaningful control names and state announcements;
- no `role="application"` around ordinary content exploration;
- reduced-motion alternatives;
- source/evidence relationships understandable without colour alone;
- no horizontal overflow at 360, 390, 1024, 1280, and 1440-pixel test widths.

Images use responsive derivatives, intrinsic dimensions, appropriate lazy loading, and local or approved font delivery. Decorative media must not delay the first meaningful product statement.

Production-like verification targets:

- no unexpected layout shift;
- no console errors or failed asset requests;
- no blocking remote stock-photo dependency;
- the median of three Lighthouse mobile runs against Vercel Preview reaches Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, and SEO ≥ 95, with LCP ≤ 2.5 seconds and CLS ≤ 0.1;
- accessible and semantic content remains available before interaction hydration.

## 17. SEO and Machine Readability

Every canonical page requires:

- unique title and description;
- canonical URL;
- English/Chinese hreflang relationship when the Chinese page exists;
- OG/Twitter metadata;
- sitemap inclusion;
- semantic heading order;
- crawlable body copy;
- representative-demo disclosure where applicable.

Agent topics must expose stable direct records. Human pages, Agent records, Markdown representations, structured data, and `llms` directories all derive from the canonical fact source.

Human/Agent UI does not claim that a dedicated Agent page guarantees crawling, retrieval, ranking, recommendation, or citation.

## 18. English-Then-Chinese Sequence

The approved bilingual public copy is defined in:

`docs/superpowers/specs/2026-08-30-yonaris-site-1-0-bilingual-copy.md`

Work proceeds in this order:

1. lock the English content and interaction system;
2. implement and visually verify English in the production stack;
3. design Chinese 1.0 from Chinese buyer anxieties, language, and content expectations rather than translating the English page structure word-for-word;
4. implement Chinese using shared infrastructure where appropriate but separate authored content and page logic;
5. perform bilingual, routing, and hreflang verification;
6. switch the public 1.0 only when both required editions pass their launch gates.

Chinese is separately authored rather than translated. It uses the same verified product facts and truth boundaries while leading with recognisable business friction, concrete team actions and local CTA language.

## 19. Acceptance Criteria

### 19.1 Buyer Clarity

- Without interaction, the Home first screen states who Yonaris helps, what it observes, what it reveals, what action follows, and that change is reviewed.
- A five-second review cannot reasonably classify Yonaris as only a GEO visibility tracker.
- Product answers input, system action, customer output, and review in its first meaningful viewport.

### 19.2 Interaction

- Home answer selection changes the displayed channel answer and attached evidence.
- Product work views operate on one canonical buyer question and cause coherent record changes.
- Casework exposes the initial observation, reviewed action, re-observation, unchanged limits, and disclosure.
- The evidence lens maps one stable fact through human, evidence, and machine-readable representations.
- All interactions work with keyboard, touch, and reduced motion.
- Every core page has one authored visual event rather than a repeated generic module pattern.
- Product capability is explained primarily through cinematic state transformation, not long feature prose.
- Decorative particles, rings, light, dashboards and scroll motion may be present when they strengthen hierarchy and remain visually authored.
- The experience includes information, explanatory motion and atmospheric motion; decorative motion is not inherently invalid.
- Autoplay pauses or transfers control on interaction, and reduced-motion preserves the same meaningful states.

### 19.3 Conversion

- `See Yonaris in action` is completely ungated.
- Contact can be submitted with only a valid work email.
- Market-question fields appear only after optional expansion.
- Form errors preserve input and focus the relevant guidance.
- One production-preview submission and one public-production submission are confirmed through the real lead-delivery path before launch.

### 19.4 Truth and Trust

- No stock-photo credits or unapproved external image assets remain.
- No customer, competitor, result, ranking, source URL, or performance metric is fabricated.
- Representative experiences are disclosed wherever they appear.
- Changed and unchanged outcomes are both visible.
- Human-review and product boundaries are explicit.

### 19.5 Production

- Build, typecheck, unit tests, route tests, metadata tests, machine-document parity tests, and lead-delivery tests pass.
- Playwright covers all canonical pages at desktop, tablet, and mobile widths.
- Visual QA covers initial, active, error, success, reduced-motion, Human, Evidence, and Agent states.
- No canonical route or legacy redirect produces a broken link.
- No console error, unexpected failed request, missing asset, or horizontal overflow remains.
- Vercel Preview passes before the public domain is promoted.

## 20. 1.0 Completion Boundary

English work is complete when the approved English experience is implemented and verified in the production stack. Yonaris website 1.0 is complete only after the separately designed Chinese edition is also implemented, bilingual routing is verified, and both editions are published on the Vercel production domain.
