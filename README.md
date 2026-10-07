# The Intelligence Atlas

An interactive, trilingual atlas of the connected histories of neuroscience, computation, and machine learning. The working application follows the staged implementation in `Prompt_Implementation.md`.

## Run locally

Use Node.js 22.13 or newer and npm. No API keys, database, external map tiles, or account are required.

```sh
npm ci
npm run dev
```

Open [the English atlas](http://127.0.0.1:3000/en), [German](http://127.0.0.1:3000/de), or [Spanish](http://127.0.0.1:3000/es).

```sh
npm run build
npm start
```

The production server uses the same port as the development server, so stop the development process first. `PORT` can be set to use another port. Neither command publishes the site. For a public deployment, set `NEXT_PUBLIC_SITE_URL` to the canonical HTTPS origin as shown in `.env.example`.

## Implemented experience

- Synchronized idea graph, research-location map, timeline, and discovery panel.
- Search across localized descriptions, people, concepts, tags, institutions, source titles, and DOIs.
- Domain and date filters, responsive timeline clustering, graph pan/zoom/drag, direct/two-step neighborhoods, and ancestry tracing.
- A draggable graph overview strip, keyboard navigation, and a fit-all view for long historical lineages.
- Glass previews on hover or keyboard focus across graph nodes, graph and map connections, and timeline markers. Map cards include institutions, countries, coordinates, and recorded location years. Connection cards show evidence and confidence; timeline cards show recorded temporal relationships and calendar-year gaps. Nearby map markers are separated with lines to their recorded sites.
- A shareable People filter exposes the existing person category independently of scientific domains. Person dates identify contributions, not lifetimes.
- Story chapters with shareable return bookmarks, exploration mode, and a Trace journey with branch explanations, evidence, backtracking, and optional path emphasis.
- Ranked conceptual search with grouped previews, associated researchers, and direct trace actions. Active filter chips and view links preserve orientation.
- Speech-bubble previews reserve their source node or edge, share a 68% glass surface, and appear with a brief anchored expansion. Bounded node staggering and fades respect reduced-motion preferences.
- An optional, lazy-loaded receptive-field explanation compares a 2D footprint with spatial computation layers and an equivalent data table.
- English, German, and Spanish content and interface labels from the first implementation.
- Shareable entity routes that restore the selected discovery, filters, time range, and mode.
- Light, dark, and operating-system themes, with persistent preferences and pre-paint initialization.
- Twenty-two interactive demonstration types across 33 discoveries, including sparse staining, logic, memory, feedback, information entropy, reward learning, attention, and the original perceptron, convolution, and backpropagation labs. Each includes controls, a reset, and an explanation of its simplifications. Historical event nodes remain text-only.
- Evidence-bearing relationship types, source links, explicit disputed interpretations, and Nobel landmarks.
- Mobile reading view with an early timeline and expandable, focused visualizations.
- Keyboard-operable visualizations, textual relationships, visible focus, reduced-motion support, and responsive layouts.

The current corpus contains 35 discoveries, 45 documented relationships, 55 references, and 46 individually tracked claims.

A discovery date identifies the specific contribution, not a person's lifetime. Geographic curves represent documented relationships between research locations, not personal travel itineraries. Artificial-network components are called units; a neuron is a biological cell.

## Visual design system

Shared typography, spacing, reading measures, and control tokens live in `app/design-system.css`. Story emphasizes the narrative with chapter progress, Explore supports open discovery, and Trace frames each selection as a genealogy. All three share the same scientific palette and component language. Responsive layouts reorganize filters, text, and visualizations from phones through ultrawide displays.

See [the interaction review](docs/ATLAS_INTERACTION_REVIEW.md) for priorities, the spatial prototype decision, and journey coverage. See [the visual review](docs/VISUAL_REVIEW.md) for findings, implementation decisions, and validation coverage.

## Scientific color system

The palette is centralized in `lib/colors.ts`, with UI and print roles in `app/colors.css`. Computing uses blue, neuroscience teal, mathematics orange, learning violet, and NeuroAI coral across the graph, map, timeline, and discovery cards. White and neutral gray surfaces keep the data prominent. Contrast-adjusted text variants preserve category identity in light and dark themes.

Binary demonstrations use blue/orange with labels, open/filled markers, or solid/dashed borders. Attention weights use the blue–teal sequential scale over 0–100%. Filter weights and responses use blue–neutral–coral with fixed symmetric limits of ±⅓ and ±1 respectively; zero always receives the neutral midpoint. Continuous colors interpolate in Oklab. Numeric labels and explicit scale legends remain available without color, and physical stimulus brightness stays constant across themes. Print styling forces light surfaces.

## Quality checks

```sh
npm run check
npx playwright install chromium
npm run test:e2e
npm run build
```

`check` runs content validation, numerical and domain tests, TypeScript, and ESLint. Playwright covers desktop and phone layouts, routing, localization, themes, synchronized interactions, demonstrations, and automated accessibility scans. The first Playwright run downloads a browser; subsequent runs do not need it again.

Content validation checks localized fields, references, identifiers, relationship endpoints and evidence, dates, coordinates, orphan nodes, media licensing, and claim references. DOI and URL validation is structural; it is not a guarantee that a publisher currently permits access. Source-access qualifications are recorded with references.

## Architecture

| Area                                     | Responsibility                                                               |
| ---------------------------------------- | ---------------------------------------------------------------------------- |
| `app/`                                   | Next.js App Router, locale/entity routes, metadata, and shared design tokens |
| `components/Atlas.tsx`                   | Shared exploration state and synchronization                                 |
| `components/graph/`, `map/`, `timeline/` | Independent SVG views of the same typed data                                 |
| `components/content/`                    | Progressive descriptions, sources, and relationship navigation               |
| `components/interactive/`                | Lazy-loaded scientific demonstrations                                        |
| `content/`                               | Typed historical entities, relationships, sources, claims, and translations  |
| `lib/`                                   | Graph traversal, search, URL state, numerical models, and validation         |
| `tests/`                                 | Unit, content-integrity, integration, and browser tests                      |

Next.js and React provide routing and rendering. Native controls and SVG keep the visualization stack small. D3 geographic projection and TopoJSON decoding handle coastlines and the date line correctly without a mapping service. The content layer is independent of the views and can later be replaced by a CMS or relational database without redesigning the interaction model. There is no backend editorial service in this release.

## Editorial scope and remaining work

This is a working MVP, not the complete historical corpus. Content provides concise introductions and technical explanations with source links. The longer 300–700 word essays envisioned by the PRD, broader geographical representation, individual institutional and publication entities, documented career itineraries, and additional simulations remain editorial and product expansion work. The map is an overview, not a street map. The graph uses a deterministic chronological layout suitable for this corpus; large-corpus virtualization is not yet needed.

Historical content needs ongoing scholarly review, particularly claims of direct influence. An accessible interface and passing automated scans do not replace a full assistive-technology audit. Public deployment, analytics, authentication, and a database are not configured.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the editorial workflow and [content/RESEARCH.md](content/RESEARCH.md) for initial verification notes.

## Map provenance

The bundled land outline is World Atlas 2 `land-110m.json`, derived from Natural Earth. Natural Earth map data is public domain. The application does not load remote map tiles or send visitor coordinates to a map service.

- [World Atlas](https://github.com/topojson/world-atlas)
- [Natural Earth terms](https://www.naturalearthdata.com/about/terms-of-use/)
