# Editorial and development workflow

Historical content lives outside the interface. Edit the typed records in `content/`, then run validation before reviewing the result in the browser.

## Add a discovery

1. Find the original paper or an authoritative institutional archive. Verify authorship, publication date, the contribution represented by the node, and the relevant research location. Distinguish publication dates from later awards.
2. Add a `Reference` with a stable identifier, source title, authors, source type, year, URL, optional DOI, access date, and source-access notes. Use `yearKind: 'access'` when an undated webpage's year only records access.
3. Add a `HistoricalEntity`. Supply English, German, and Spanish titles, short descriptions, explanations, and technical notes. Stable IDs and slugs are separate from translated titles. Dates may be a year, month, or complete ISO date.
4. Use coordinates for a documented research location. Leave a location absent when it cannot be verified; do not substitute birthplace or the location of an unrelated later institution.
5. Connect the entity with at least one evidence-bearing relationship. Use biological inspiration only when a source supports that interpretation. Historical association and conceptual analogy do not establish direct causation. Cycles are supported by graph traversal.
6. Add concise claim records for important dates, results, and disputed interpretations. Use `needs-review` or `disputed` honestly and explain the reason. Entity references support the wider prose; claim records isolate assertions needing specific editorial tracking.
7. Attach media only with known provenance, permission, localized captions, and alt text. Unknown licenses are rejected by validation. The current schematic visualizations are original explanatory graphics, not reproductions of historical figures.
8. Run the checks below. Inspect the discovery in all three locales, follow its sources, and check its incoming and outgoing relationships.

```sh
npm run validate:content
npm run test
npm run typecheck
npm run lint
npm run test:e2e
npm run build
```

Reference notes preserve the original research-note language and are labelled as such. Source titles and scientific names remain in their original form. Translate interface labels through `content/translations/`, never inline in components.

## Scientific conventions

- A neuron is a biological cell. Artificial networks have units, nodes, or artificial units.
- Distinguish an explanatory simulation from a mechanistic biological model.
- Do not infer direct influence from shared vocabulary.
- Avoid single-inventor accounts of collective work or single-cause explanations of funding cycles.
- Nobel landmarks record recognition, not a ranking of scientific importance.
- Do not insert an unsourced claim merely to complete a visually attractive chain.

## Development conventions

Keep numerical models pure and independently testable. Keep historical content out of component markup. Use the semantic CSS variables for both themes, provide textual equivalents for scientific graphics, and preserve keyboard and touch access. Browser-only APIs belong in client components. Avoid adding a dependency when a native control or small utility suffices.

The URL is the shareable exploration state. Any new filter or mode should have a parser with invalid-input tests, a serializer, and a reload test. Local storage is only for device-local appearance preferences.

Repository changes must follow the user's source-control policy: do not push without explicit approval of both the commit messages and the push itself.
