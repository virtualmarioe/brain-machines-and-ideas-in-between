# Learning experience validation

## Baseline

Content validation, 135 unit tests, TypeScript, and ESLint passed before implementation. Desktop browser inspection established the existing setup hierarchy, hidden journey selector, lab discovery through individual records, and simultaneous graph/map/reading layout.

## Final checks

- `npm run check`: passed. Content integrity, 140 unit tests across 17 files, TypeScript, and ESLint.
- `npm run build`: passed with the existing application routes and no new dependencies.
- Broad Playwright regression selection: 141 passed, 7 intentionally skipped. Covers all 33 existing demonstrations, desktop/phone layouts, all three locales, themes, guided paths, research notices, routing, keyboard controls, reset behavior, and automated accessibility.
- Final targeted navigation/layout suite: 59 passed, 7 intentionally skipped. The clean rerun includes the final URL, layout, and empty-search changes.
- The empty-search exit from focused reading passed on both desktop and phone.
- One phone convolution test timed out in an intermediate run while development work was ongoing. A concurrent test invocation also removed its trace artifacts. Six isolated repetitions passed; the final regression run uses one invocation with stable source. No numerical model changes were required.
- `git diff --check`: passed.

New regression coverage verifies guided-entry focus, full-catalog recovery, library filtering and empty states, correct/incorrect prediction feedback, parameter reset, modal focus restoration, focused reading URLs/history, local-history deletion, unavailable storage, advanced trace target selection, shareable lab reload/Back/Forward, and focused-search recovery. Unit checks reject malformed history and unsupported view/lab state, and verify checkpoint statements against the actual numerical functions.

## Accessibility and visual review

The existing suite scans light/dark atlas views and scientific dialogs against WCAG-related axe rules. New entry controls and library dialogs passed axe scans in English, German, and Spanish. A separate scan of the production desktop page reported no violations. Browser tests cover 320px translated layouts, 375px through 2560px layouts, phone touch-sized controls, 200% text, reduced motion, keyboard navigation, and visible focus. Production inspection reported no uncaught page errors.

Inspected the actual rendered desktop, phone, focused-reading, and experiment-library screens. Corrected the compact complexity badge overlap found during visual review. Preserved the existing scientific color palette and typography rather than introducing another design system. Native fieldsets, radio groups, live feedback, and details disclosures keep checkpoints keyboard accessible. The textual reading and relationship views remain alternatives to the graph.

Automated checks are not a complete WCAG certification. No screen-reader user study or representative learner evaluation was performed.

## Performance observations

A single unthrottled Chromium visit to the local production server at 1440 × 1000 with reduced motion reported first contentful paint at 92 ms, an observed largest contentful paint at 212 ms, and cumulative layout shift of 0 at capture time. These are local diagnostic observations, not field Core Web Vitals or a baseline comparison. Interaction-to-next-paint was not measured.

The same page contained 1,167 DOM elements in atlas view and 753 after entering focused reading, with zero mounted visualization columns. This confirms removal of the graph/map rendering work in reading mode; it does not quantify a user-perceived speed improvement. Initial visualization code remains part of the existing client bundle. Map-edge filtering uses a memoized ID set. Demonstrations remain lazy-loaded. No dependency was added.

## Remaining limitations

The learning benefits are heuristic expectations, not experimentally demonstrated outcomes. Imported research retains its existing translation and scholarly-review limitations. Only five labs have the new prediction checkpoints. Reading depth remains coupled to catalog complexity. Recent discovery history is device-local and stores visited IDs, not mastery. Local metrics should be complemented by deployed field measurements. No deployment, commit, or push was performed.

## Visual evidence

- [Original desktop](screenshots/before-desktop.png)
- [Updated desktop](screenshots/after-desktop.png)
- [Focused reading](screenshots/focused-reading.png)
- [Experiment library on a phone](screenshots/experiment-library-phone.png)

The original capture used the development server; final captures used the production build. Screenshots demonstrate layout and available interactions, not measured learning outcomes.

## Reproduce

```sh
npm run check
npm run build
npx playwright test tests/e2e/learning-experience.spec.ts tests/e2e/atlas.spec.ts tests/e2e/design-system.spec.ts
```

The broader selection also included `learning-journeys.spec.ts`, `complexity.spec.ts`, `concept-demos.spec.ts`, and `distinct-demos.spec.ts`. Skips avoid duplicating explicit viewport checks in the phone project and a phone-only assertion in the desktop project. The final targeted rerun completed in 45.8 seconds. Formatting checks on the new and modified implementation files passed.
