# Atlas interaction review

## Architecture and scope

The application is Next.js App Router with React and TypeScript. Locale and entity routes initialize a shared exploration state; subsequent changes use browser history without losing the synchronized graph, map, timeline, and reading panel. The content layer has 35 typed entities, 45 evidence-bearing relationships, 55 references, and three complete locales. People are already an entity type.

Genealogy and timeline are native SVG/HTML. The geographic view uses D3 geographic projection and bundled TopoJSON. Scientific demonstrations are lazy-loaded. There is no WebGL, Canvas renderer, 3D engine, or animation dependency. Shared typography, spacing, scientific colors, container breakpoints, and reduced-motion behavior already provide a sound foundation. The corpus is small enough that graph virtualization would add complexity without a demonstrated benefit.

## Priorities and implemented changes

| Priority | Friction                                                                            | Change                                                                                                                                                                                                                                                         |
| -------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P0       | Floating previews could cover their own trigger.                                    | A shared placement solver reserves the visible trigger bounds, chooses a side, constrains long content to available space, and draws a speech-bubble tail.                                                                                                     |
| P0       | Different overlays could acquire different material opacity.                        | One radial glass material controls cards and dialogs: 45% opacity at the edges and 65% at the center. Header surfaces remain transparent to avoid stacking opacity. Reduced transparency and forced colors keep an opaque fallback.                                                                                  |
| P0       | Keyboard reading tabs did not implement arrow-key navigation.                       | Arrow, Home, and End keys select and focus the corresponding reading level.                                                                                                                                                                                    |
| P1       | Returning to Story restarted the sequence.                                          | Current chapters are bookmarked in the URL. A detour into Explore or Trace offers a return to that chapter, including after reload.                                                                                                                            |
| P1       | Trace exposed ancestors without recording a navigable journey.                      | A visited path, backtracking, a return-to-start action, branch descriptions, evidence buttons, date differences, domain labels, and optional path emphasis explain each step. Only recorded connections extend the path; unrelated selections begin a new one. |
| P1       | Search provided matching labels with little context.                                | Title, researcher, and tag matches rank above passing mentions. Grouped previews show descriptions, dates, domains, connection counts, associated researchers, and direct Trace actions.                                                                       |
| P1       | Active constraints and view location were easy to lose.                             | Removable filter chips and a selected-discovery orientation strip expose context and link directly to genealogy, geography, and time.                                                                                                                          |
| P2       | Abrupt appearances weakened continuity.                                             | Anchored previews use a short expanding entrance and fading exit. Nodes appear in a bounded sequence; reading levels, mode introductions, and dialogs have restrained transitions. Reduced motion disables travel and staggering.                              |
| P2       | Preview placement ran an animation frame loop while idle.                           | Resize, scroll, and geometry-change observers schedule a single positioning frame only when needed.                                                                                                                                                            |
| P3       | A whole-atlas 3D scene risked adding occlusion without a meaningful third variable. | Retain the 2D graph. Prototype spatial receptive-field layers inside the convolution lab, where depth explicitly represents successive computation layers.                                                                                                     |

## Spatial prototype decision

The isolated receptive-field explanation compares a flat input footprint with projected spatial layers. Kernel width and layer count determine the theoretical receptive field under explicitly stated assumptions: unit stride, unit dilation, square kernels, and no pooling. A viewing-angle slider changes the projection without changing the values. A table always exposes the same information.

The 2D view remains the default because it makes the footprint easiest to read. Spatial separation is optional and useful for seeing which successive layer contributes to expansion. The module loads only when its disclosure is opened and uses existing SVG, avoiding an additional rendering engine or persistent animation loop. Touch users use ordinary sliders and buttons. This is an explanatory prototype, not a validated claim that 3D improves learning; comparative learner testing remains future research.

## Retained strengths and deliberate boundaries

- Story, Explore, Trace, direct links, browser history, and locale switching remain views over the same entities and relationships.
- The 33 assigned demonstrations are distinct, including 11 new concept-specific exercises; they remain available from discovery and Story reading panels.
- Existing progressive reading levels, primary references, claim qualifications, disputed relationships, and geographic caveats remain intact.
- The timeline already supports direct date brushing, zooming, panning, discipline filters, grouped events, and recognition dates. Automatic playback was not added because manual comparison gives users control without introducing a competing clock.
- Geography continues to show documented research sites and relationships, not invented personal travel or geographic causality.
- No new historical claims, speculative influence links, decorative particles, autoplay cameras, or additional visualization libraries were introduced.

## Verification

Unit checks cover placement without trigger overlap at mobile through ultrawide widths, valid trace steps and backtracking, ranked search, bookmark and path URL round trips, and receptive-field geometry. Browser journeys cover Story detours, scientist search, branch evidence, reload/back navigation, reduced motion, bubble origin visibility, spatial controls, and textual alternatives. The existing regression suite continues to cover all demonstrations, themes, translated content, graph navigation, timeline filters, accessibility, and responsive layouts.

Automated tests and visual inspection cannot establish learner comprehension or replace a full assistive-technology study. The spatial view remains an optional enhancement with a simpler default.

## Demo refinement

Repeated exercises were replaced with dendritic branching, contact timing, orientation tuning, weight sharing, rectification, editable digit templates, action-value updates, reward surprise, replay sampling, prior-guided search, and response-space geometry. Each states its assumptions and limits; none claims to reproduce a historical experiment or train a full architecture. Shared controls and frames remain reusable, while assignments and scientific interactions are distinct.
