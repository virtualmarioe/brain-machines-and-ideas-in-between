# Visual and experience review

## Findings and implementation

| Area                  | Finding                                                                        | Shared improvement                                                                                                                                                                            |
| --------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Navigation            | Modes looked alike and their purpose was implicit.                             | Named mode introductions, book/globe/network icons, pressed states, and solid/double/dashed rules. All copy is available in English, German, and Spanish.                                     |
| Story                 | Narrative competed with visualizations.                                        | Reading comes before supporting maps in the desktop layout and document order. Chapter progress and previous/next controls make the sequence explicit.                                        |
| Explore               | Starting points were unclear.                                                  | A short introduction explains discovery, connections, and evidence. Search and connection depth remain available on phones.                                                                   |
| Trace                 | Genealogy needed a clearer frame.                                              | An explicit conceptual-genealogy introduction and prominent target selector distinguish tracing from open exploration.                                                                        |
| Typography            | Interface labels and citations frequently used 8–11px text.                    | Shared rem-based roles set ordinary metadata at 0.75rem or larger, body text at 1rem, and reading text at 1.125rem. The root grows gradually from 16px to 19px.                               |
| Reading               | Desktop panels were narrow and content was constrained by a short scroll area. | Wider proportional panels, larger leading, bounded paragraph measure, clearer evidence sections, and natural page flow in Story and tablet/phone layouts.                                     |
| Visualizations        | Small labels and controls became lost on large screens.                        | Larger graph labels, increased node separation, larger canvases, readable legends, and 2.75rem zoom and overview controls. SVG label sizes remain in logical units to preserve plot geometry. |
| Layout                | Breakpoint rules repeatedly shrank already small text.                         | Consolidated responsive rules reorganize filters, reading panels, and visualizations instead. Ultrawide width is bounded by a shared page token.                                              |
| Spacing               | Component rhythm relied on many independent values.                            | Shared spacing, page gutters, reading widths, control sizes, and radii coordinate sections, panels, metadata, and references.                                                                 |
| Color and interaction | A scientific palette already existed and needed continuity.                    | Category identities and signed scales are preserved. Mode identity also uses text, icons, structure, and line patterns. Hover, focus, and selected states remain distinct.                    |
| Demos and dialogs     | Small explanatory labels reduced readability.                                  | Shared type roles, larger controls, consistent modal padding, and responsive grids across all existing demonstration families.                                                                |

## Design-system locations

- `app/design-system.css`: typography, spacing, measure, page width, and control tokens.
- `app/globals.css`: shared components, mode treatments, and reorganized responsive layouts.
- `app/colors.css` and `lib/colors.ts`: semantic themes and scientific color scales.
- Component stylesheets retain specialized graph, preview, and simulation geometry.

Container breakpoints use rem units so layouts also reflow when text is enlarged. At approximately 1200px and below with the default text size, filters become a wrapping bar. At 950px and below, reading and visualizations stack, with a two-column reading layout where space permits. At 650px and below, the timeline moves earlier, reading becomes a single column, and visualizations use expandable sections. At larger widths, the interface uses the available space while keeping prose bounded to a comfortable measure.

## Validation coverage

The browser suite exercises all three modes at 375, 768, 1280, 1440, 1920, and 2560px, plus translated navigation at 320px. Existing visualization-boundary checks extend to 3440px. It checks readable type sizes, touch-sized primary navigation, reading order, horizontal overflow, mode changes, graph fitting, keyboard interaction, localized routes, and automated accessibility. Existing color tests cover both themes and print; demonstration tests cover all 22 lab families.

Screenshots accompany mode and viewport checks for visual review. Automated accessibility and layout checks supplement visual inspection; they do not constitute a full screen-reader or usability study.
