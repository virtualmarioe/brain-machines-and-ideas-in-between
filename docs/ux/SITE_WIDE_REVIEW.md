# Site-wide experience review

Reviewed 16 November 2026 after the map refinements. This is an implementation-focused heuristic audit, not a learner study.

## Current strengths

The synchronized atlas, evidence-bearing relationships, 33 deterministic experiments, four guided paths, three interface languages, reading-depth tabs, local history, and shareable views provide a strong foundation. The map now has direct zoom, region shortcuts, search, keyboard navigation, and visual hierarchy. Preserve these systems and the current scientific caveats.

## Findings and priorities

| Priority | Observed barrier | Implementation | Benefit / effort / risk |
| --- | --- | --- | --- |
| 1 | At 390px, searching “learning” at expert level produces 61 discoveries but only seven preview cards; the complete sidebar is hidden. | Incrementally reveal every group of search results and add a compact discovery selector for smaller layouts. | High access benefit; moderate effort; low scientific risk. |
| 1 | Search or relationship selection changes content far away from the initiating control. | Move focus and viewport to the reading panel for explicit reading actions. Keep graph and map selection spatially stable. | Broad orientation benefit; small effort; focus regression risk. |
| 1 | About has no theme control; Research lacks shared language and theme navigation. Return links restart exploration. | A shared secondary-page header with theme, languages, section links, and a device-session resume link. | Broad consistency benefit; moderate effort; state restoration risk. |
| 2 | Mobile setup is long and lacks a complete direct topic selector. | Compact complexity choices and a responsive topic picker; retain explanatory text and all levels. | Broad mobile benefit; small effort; reflow risk. |
| 2 | Guided paths have uneven card density and no visible stop count; readers must scroll back to locate the selected topic. | Consistent path cards, stop counts, position progress, and an explicit read-stop action. | High beginner benefit; small effort; no new scientific content. |
| 2 | Sharing is available only through the browser address bar. | A reading-panel copy-link action with clear success/failure feedback. | Small usability improvement; small effort; clipboard permissions may vary. |

## Baseline evidence

A Chromium phone inspection at 390 × 844 recorded 61 matches for `q=learning&level=expert`, seven preview cards, and a hidden complete sidebar. The About page had no theme selector. Baseline screenshots were captured locally before changes. Existing validation previously passed 140 unit tests and the map regression selection. These observations establish interface limitations, not measured learning outcomes.

## Boundaries

Reuse current controls, colors, type tokens, and URL state. Do not create another graph, add guessed prerequisite relationships, or change research verification status. The session resume link must accept only local atlas routes and tolerate unavailable storage. Clipboard denial needs visible recovery. Prioritize regression tests for access, history, focus, reflow, and shared navigation.

## Implemented improvements

- `SearchResults` reveals additional results in batches of six within each group, preserving ranked order and allowing every matching record to be reached. A test expands all groups and verifies the rendered total against the search function.
- `Atlas` exposes a full discovery picker at smaller widths. Selecting a search result, picker option, or related reading concept moves the viewport and keyboard focus to the updated reading panel. Graph and map selections keep their spatial exploration behavior.
- `SectionHeader` supplies consistent brand navigation, native-language links, current-page indicators, and the existing theme selector on About and Research. Both the header and body return links restore the same session-local exploration URL, adapted to the chosen language. Storage denial falls back to the locale home page; external and malformed destinations are rejected.
- `ShareView` copies the current view URL and reports success or clipboard failure. Its state resets when changing discoveries.
- Guided-path cards now use a consistent two-column desktop layout, one-column phone layout, serif headings, visible stop counts, and aligned actions. Active paths expose position progress and a read-current-stop action. Position is not a mastery score.
- Timeline date labels now use regular calendar intervals chosen from available track width. Phone and tablet tests check actual rendered label separation; event markers and time ranges retain their existing behavior.
- Mobile complexity choices fit side by side; their explanations remain available in a native disclosure. Visualization columns and headings reflow at 320px without stretching the page.
- `site-experience.css` extends the shared design tokens for navigation, reading actions, path cards, and secondary-page surfaces. No new dependency was added.

## Validation

- `npm run check`: content validation, 144 unit tests across 19 files, TypeScript, and ESLint passed.
- `npm run build`: passed.
- The final site-specific browser run passed all 14 tests, including the responsive timeline refinement.
- The integration regression run passed 52 tests with two intentional skips. It covers synchronized graph/map/timeline selection, URL history, scientist search, trace backtracking, scientific dialogs, and map controls.
- The clean learning/navigation regression run passed 81 tests with seven intentional skips. Browser regressions cover complete search access, mobile topic selection, reading focus, session return through About/Research and language changes, theme persistence, clipboard success and denial, unavailable storage, guided reading, layout and reading-tab stability, and existing demonstrations.
- Narrow translated layouts are checked at 320px; the established design suite covers widths through 2560px and 200% text.
- Automated accessibility scans passed on the production About page and dark Research header. The regression suite scans atlas layouts, path controls, and shared navigation. Production browser inspection recorded no uncaught page errors.
- An existing integration test used an unnamed search-box selector that became ambiguous after the earlier map search addition. It now targets the named atlas search box.
- The first browser run found a 320px visualization overflow and obsolete language-link test selectors. The layout and selectors were corrected before the clean rerun.
- No production field performance measurements or learner study were performed. These changes improve demonstrated access and navigation behavior; comprehension and retention benefits remain hypotheses.

## Visual evidence

Production screenshots were inspected at actual desktop and phone sizes:

- [Compact mobile entry](screenshots/site-wide/mobile-entry.png)
- [Guided-path cards](screenshots/site-wide/guided-paths.png)
- [About navigation and reading surface](screenshots/site-wide/about.png)
- [Research navigation in dark theme](screenshots/site-wide/research-dark.png)

## Further opportunities

1. Test beginner, undergraduate, graduate, and expert tasks with representative learners, including explaining a relationship after using the atlas.
2. Evaluate whether catalog coverage and reading depth should become independent preferences, with migration of existing complexity URLs.
3. Add further prediction checkpoints only where a specific misconception and useful experiment are identified.
4. Continue scholarly review and full translation of imported research, retaining provenance and uncertainty labels.
5. Perform a screen-reader audit and collect deployed performance measurements before considering additional navigation or rendering frameworks.

## Reproduce

```sh
npm run check
npm run build
npx playwright test tests/e2e/site-experience.spec.ts
```

Additional regression selections included `learning-experience`, `learning-journeys`, `design-system`, `reading-tabs`, `complexity`, `distinct-demos`, `atlas`, `map-navigation`, and `journeys`. Skips cover explicit viewport checks already exercised by the other project and a phone-only assertion. Formatting and `git diff --check` passed. The local production preview was refreshed on port 3001. No commit, push, or deployment was performed.
