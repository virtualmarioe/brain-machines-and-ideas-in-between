import catalog from './catalog.json' with { type: 'json' };
import type {
  HistoricalEntity,
  HistoricalRelationship,
  LocalizedText,
  Reference,
  Domain,
} from '@/types/history';
const localized = (text: string): LocalizedText => ({ en: text, de: text, es: text });
export const researchCatalog = catalog;
export const researchId = (id: string) =>
  (catalog.aliases as Record<string, string>)[id] ?? id.replace(/^c_/, '').replaceAll('_', '-');
export const researchReferences: Reference[] = [
  {
    id: 'research-dossier-2026',
    type: 'archive',
    title: 'Historical research dossier, 8 October 2026',
    authors: ['Research compilation'],
    year: 2026,
    yearKind: 'access',
    accessedAt: '2026-10-10',
    url: '/research/history-2026-10-08.md',
    notes:
      'Supplied research compilation. Original citation handles could not be resolved to source URLs. Imported claims require source verification; importance scores are editorial judgments.',
  },
];
function domain(text: string): Domain {
  if (/neuro|biolog|physiol|percept|condition|psychol/i.test(text)) return 'neuroscience';
  if (/logic|math|probab|statist|formal|optimi/i.test(text)) return 'mathematics';
  if (/learning|neural|representation|generative/i.test(text)) return 'learning';
  if (/embodied|cognit/i.test(text)) return 'neuroai';
  return 'computing';
}
export const researchEntities: HistoricalEntity[] = catalog.concepts
  .filter(([id]) => !(id in catalog.aliases))
  .map(([id, title, date, discipline, people, role]) => ({
    id: researchId(id),
    slug: researchId(id),
    type: 'concept',
    title: localized(title),
    shortDescription: localized(role),
    description: localized(role),
    technical: localized(
      `Research context: ${discipline}. Associated contributors: ${people}. Dating in the source: ${date}. See the research catalog for the wider historical discussion and publication register.`,
    ),
    startDate: researchYear(date),
    domain: domain(discipline),
    people: [people],
    locations: [],
    references: ['research-dossier-2026'],
    tags: [discipline, title, people],
    status: 'needs-review',
    research: { originalLanguage: 'en', dateLabel: date, catalogId: id },
    editorialNotes: localized(
      `Imported research, pending primary-source verification. English original. The timeline uses a representative year from “${date}”, not necessarily an exact origin date. Ancient dates use approximate mid-century anchors. Geographic locations are omitted unless established for the discovery.`,
    ),
  }));
const known = new Set(catalog.concepts.map(([id]) => id));
export const unresolvedResearchEdges = catalog.edges.filter(
  ([source, target]) => !known.has(source) || !known.has(target),
);
export const researchRelationships: HistoricalRelationship[] = catalog.edges
  .filter(
    ([source, target]) =>
      known.has(source) && known.has(target) && researchId(source) !== researchId(target),
  )
  .map(([source, target, relation, date, , evidence, interpretation], index) => ({
    id: `research-edge-${index}`,
    source: researchId(source),
    target: researchId(target),
    type: /ANALOG/.test(relation)
      ? 'conceptual-analogy'
      : /BIOLOG/.test(relation)
        ? 'biological-inspiration'
        : /MATHEMATIC|FORMALIZES/.test(relation)
          ? 'mathematical-formalization'
          : /EXTEND|GENERALIZ/.test(relation)
            ? 'extension'
            : /CHALLENG|CRITI/.test(relation)
              ? 'challenge'
              : /ENABLES/.test(relation)
                ? 'methodological-enabler'
                : relation === 'IMPLEMENTS'
                  ? 'implementation'
                  : 'historical-context',
    description: localized(
      `${interpretation} Dossier relation: ${relation.replaceAll('_', ' ').toLowerCase()}; date: ${date}; dossier evidence classification: ${evidence.replaceAll('_', ' ')}. Pending independent source verification.`,
    ),
    evidence: ['research-dossier-2026'],
    confidence: 'low',
  }));

function researchYear(date: string): string {
  if (date.includes('4th c. BCE')) return '-0350';
  if (date.includes('3rd c. BCE')) return '-0250';
  const year = date.match(/\d{4}/)?.[0];
  if (!year) throw new Error(`Research date needs an explicit timeline anchor: ${date}`);
  return year;
}
