# Task 6B report — English Company image aperture

## RED evidence

- Added the dedicated Company route/page behavior suite before implementation.
- Focused RED: 1 file, 9 failed / 0 passed. The old route rendered Site 06, legacy metadata, no approved six-module composition, no responsive Company asset, no canonical verified-fact projection, no aperture geometry and no Product/Contact close.
- Failures independently covered SSR modules, typed metadata/JSON-LD, local imagery, canonical identity, five distinct geometries, pointer, touch, Enter, Space, directional keys, reduced motion, no autoplay, unsupported claims and close paths.

## Implementation

- Migrated only `/company` to `EnglishSiteShell pageKey="company"` and central `buildPageHead` metadata/JSON-LD using `GLOBAL_EN_COMPANY_PAGE.metadata`.
- Added typed Company-only Site 1.0 labels; the Chinese record remains explicitly unmigrated with `siteV1: null`.
- Built one near-full-screen architectural aperture around the original manifest-owned `company-light-corridor` PNG/AVIF/WebP asset, preserving focal point, mobile crop, dimensions and informative alt text.
- Five staggered native button controls are a spatial principle rail, not tabs, cards or a values grid. Each selection changes the real image clip path plus light position, width and skew, and replaces the attached evidence/boundary composition.
- Pointer, touch, Enter, Space, Arrow keys, Home and End are supported without autoplay. Global reduced-motion CSS removes transition/animation movement while direct selection remains available.
- SSR/no-JS renders all five approved factual principle modules in order; hydration progressively focuses one without losing direct controls. Verified public facts remain a sixth SSR module.
- Verified facts project the canonical category plus manifest-backed public name, official domain, Contact and Privacy routes, including canonical IDs, source, scope, review date and boundaries. No second hard-coded category truth or verification badge was introduced.
- Human judgement and non-promises remain explicit. No biographies, address, legal entity, award, certification, investor/funding claim, autonomous-execution promise, ranking/citation guarantee, causal proof or commercial-result promise was added.
- The close stays limited to the typed Product and Contact actions.
- Added `scripts/company-aperture-layout.mjs` as the reproducible 1440x1000 / 390x844 production probe.

## Review fix

- Review RED reproduced the P1: the focused suite failed because the five principle articles exposed only two distinct canonical evidence payloads while the principle-specific approved copy remained in the heading area.
- Tightened the regression test to inspect only `[data-company-attached-evidence]` and `[data-company-attached-boundary]`; whole-article headings can no longer create a false uniqueness result.
- Moved each exact approved principle body into its typed attached-evidence composition and removed that body from the header. The canonical fact ID, source, scope, review date and accurate boundary remain attached as applicable, while all five evidence payloads are now materially distinct without new claims or fabricated identifiers.
- The change only re-composes existing text inside the same responsive principle panel; no new visual probe or deployment was performed.

## Production visual evidence

- Artifacts: `.superpowers/sdd/2026-08-30-yonaris-site-1-0-production/visual-task-6b/final/`.
- Captured 12 screenshots: first viewport plus all five principles at 1440x1000 and 390x844.
- Desktop and mobile each exposed five unique clip-path/light geometry combinations and one pressed/visible principle at a time.
- Desktop document width 1425/1425 and mobile 375/375 (viewport scrollbar excluded): no horizontal overflow. Active panels and controls stayed inside the aperture horizontally; the image loaded in every state.
- Mobile first viewport retained the full headline, Company body, meaningful corridor image and direct principle entry. State captures kept evidence and boundary readable without overlap.
- Desktop pointer clicks and mobile direct controls were exercised; the automated suite independently covers touch, Enter, Space and both directional-key axes. Mobile screenshots were captured at 390x844; reduced-motion behavior is covered by the focused real-DOM test and the reproducible probe configuration.
- Browser console warnings/errors: 0 at both sizes. No page or image load failure was observed.
- The local production preview was stopped after the bounded check; no deployment was performed.

## Verification

- Focused GREEN: 1 file / 9 tests passed.
- Affected: 7 files / 40 tests passed.
- Final full: 53 files / 381 tests passed.
- `pnpm.cmd check-types`: exit 0.
- `pnpm.cmd build`: exit 0 for client, SSR and Nitro; only the existing large-chunk advisory remains.
- `node --check scripts/company-aperture-layout.mjs`: exit 0.
- `git diff --check`: exit 0.

## Commit

- The clean task commit SHA is reported in the handoff (a commit cannot contain its own SHA).
