# The Intelligence Atlas Knowledge Base

`content/` is the canonical scholarly source. Edit records here, never in an
export. The application imports `content/index.ts` directly; archival exports
are optional release artifacts and are not inputs to the application build.

## Ontology and provenance

`../types/history.ts` defines the shared ontology and field types.
`index.ts` assembles entities, relationships, references, and claims from the
initial, expansion, GEB, and research collections. IDs are stable identifiers
within each collection; slugs provide application routes. Relationships are
directed, typed interpretations with source/target entity IDs, evidence reference
IDs, confidence, and optional dispute flags. Claims link an entity to supporting
references and an explicit review status. Entity `people` entries are names,
not foreign keys. Dates retain their original precision, including BCE years.

Preserve English, German, and Spanish text, citation details, access dates,
editorial qualifications, media credits, and source links. Imported research
records retain their labeled English original and review status. Structural
validation does not establish historical truth. Review influence claims against
sources; distinguish conceptual analogy from documented direct influence.
See RESEARCH.md and ../docs/RESEARCH_CATALOG.md for review context.

## Licensing

Original scholarly text, data, translations, and annotations are CC BY 4.0 under
LICENSE. Attribute Mario E. Archila-Meléndez and contributors, cite the dataset
version, link the license, and identify modifications. Assembly/helper software
remains Apache-2.0 under ../LICENSE. Third-party quotations, publications, and
media retain their own terms; links and citations confer no additional rights.

## Releases and exports

Run `npm run export:dataset` from the repository root. It validates the canonical
catalog and writes `exports/intelligence-atlas-knowledge-base-0.1.0/`.
The four catalog collections are exported in full, including optional fields
and all localized text, as JSON and CSV. GraphML represents entity nodes and
relationship edges with complete JSON payloads. Research review status is not
filtered out. Auxiliary UI copy, guided journeys, research working documents,
and media binaries are outside this catalog snapshot; source links remain
unchanged and site-relative paths resolve against the application's public URL.

The package includes citation, licenses, the existing TypeScript schema, and a
manifest of counts and SHA-256 checksums. Identical input files produce identical
output bytes; no wall-clock timestamp is added. Generated packages are ignored
by Git.

Archive the approved GitHub software release through Zenodo's GitHub integration.
Separately deposit the generated package as The Intelligence Atlas Knowledge Base,
version 0.1.0, resource type dataset, with CC BY 4.0 for original content. Generate
it from the tagged software revision and record the commit in the deposit metadata.
Link both records with reciprocal related identifiers using their actual version
DOIs. Cite the software for application use and the dataset for corpus reuse.
No DOI is assigned by the exporter; preserve deposited files and checksums.
