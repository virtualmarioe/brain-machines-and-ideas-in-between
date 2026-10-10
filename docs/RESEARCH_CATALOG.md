# Research catalog and atlas complexity

The October 2026 research expansion preserves 142 supplied concepts, 48 people, 23 institutions, 36 publications, and 63 proposed relationships in `content/research/catalog.json`. The full reading copy is available at `/research/history-2026-10-08.md`, with a searchable reader at `/en/research` (also reachable through the German and Spanish interfaces).

## Integration

Existing entries take precedence. An explicit alias table maps 22 supplied concepts to existing records, including two information-theory concepts that map to the Shannon record. The adapter adds 120 distinct concept nodes, bringing the atlas to 157 nodes. Supplied relationships preserve their direction and explanatory text. One relationship references `c_causal_graphical_models`, which has no corresponding concept row. It remains visible in the research register but is excluded from graph rendering.

The source file supplied citation handles without resolvable source URLs. Imported concepts are therefore marked `needs-review`, and imported edges have low confidence pending verification. The register preserves supplied DOI and arXiv identifiers as outbound links. Original English text is explicitly labeled in every language version. Do not interpret populated language fields as completed translations.

Some research concepts have no supplied edges. They remain searchable isolated nodes rather than acquiring invented connections to satisfy catalog connectivity. The validation exception is limited to imported records awaiting review. Institution coordinates are retained in the register, not automatically assigned as discovery locations. Dates retain the source wording; graph positions use the first stated year or an approximate mid-century anchor for ancient entries. These positions must not be presented as precise origin dates.

## Nested complexity levels

`lib/complexity.ts` defines three cumulative levels:

- Essentials: 20 nodes, including every Story chapter, major biological/computational bridges, Bayesian inference, and Boolean algebra. This is the default.
- Connections: 61 nodes, including the existing catalog and selected foundations across logic, probability, computation, and learning.
- Expert: all 157 nodes, including ancient precursors and research awaiting verification.

Counts derive from the catalog rather than UI constants. The `level` URL parameter preserves the chosen level across reloads, mode changes, language changes, and history. A direct entity link without an explicit level opens at its minimum supported level. Selecting a related discovery can raise the level. Choosing a lower level resets filters and selects an included discovery if necessary. Map, graph, search results, and timeline use the same level filter; the map includes only entries with established locations.

The three levels encode reading scope, not historical importance, scientific certainty, or a canonical ranking of disciplines. New research records must not receive reused demonstrations solely to fill a coverage quota.
