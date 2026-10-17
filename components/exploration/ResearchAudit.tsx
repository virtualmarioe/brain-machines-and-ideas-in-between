'use client';
import { useState } from 'react';
import { useHydrated } from '../navigation/useHydrated';
import Link from 'next/link';
import { researchCatalog, researchId, unresolvedResearchEdges } from '@/content/research';
import { researchReviewById, researchReviews, reviewedEdges } from '@/content/research/reviews';
import type { Locale } from '@/types/history';
import { text } from '@/content/translations/ui';
import ResearchReview, { reviewCopy } from '@/components/content/ResearchReview';
const copy = {
  all: text(
    'All imported concepts',
    'Alle importierten Konzepte',
    'Todos los conceptos importados',
  ),
  checked: text('With a checked claim', 'Mit geprüfter Aussage', 'Con una afirmación comprobada'),
  pending: text(
    'Still awaiting a source check',
    'Noch ohne Quellenprüfung',
    'Pendientes de comprobación',
  ),
  filter: text('Verification filter', 'Prüfstatus filtern', 'Filtrar verificación'),
  note: text(
    'Counts describe narrow source checks, not fully verified historical entries. Unchecked claims keep their review status. A source supporting a method does not automatically prove its priority or influence.',
    'Die Zahlen zählen begrenzte Quellenprüfungen, keine vollständig geprüften historischen Einträge. Ungeprüfte Aussagen behalten ihren Status. Ein Beleg für eine Methode beweist nicht automatisch Priorität oder Einfluss.',
    'Las cifras cuentan comprobaciones limitadas, no entradas históricas completamente verificadas. Las afirmaciones pendientes conservan su estado. Una fuente sobre un método no demuestra automáticamente su prioridad o influencia.',
  ),
  counts: text(
    'concepts with a checked claim; reviewed relationships; unresolved relationship endpoints',
    'Konzepte mit geprüfter Aussage; geprüfte Beziehungen; ungeklärte Beziehungsendpunkte',
    'conceptos con una afirmación comprobada; relaciones revisadas; extremos de relaciones sin resolver',
  ),
};
export default function ResearchAudit({ locale }: { locale: Locale }) {
  const ready = useHydrated();
  const [filter, setFilter] = useState('all');
  const imported = researchCatalog.concepts.filter(([id]) => !(id in researchCatalog.aliases));
  const rows = imported.filter(
    ([id]) => filter === 'all' || (filter === 'checked') === researchReviewById.has(id),
  );
  return (
    <section id="verification" className="research-audit">
      <h2>{reviewCopy.coverage[locale]}</h2>
      <p>
        {researchReviews.length} / {imported.length} · {reviewedEdges.length} /{' '}
        {researchCatalog.edges.length} · {unresolvedResearchEdges.length}: {copy.counts[locale]}
      </p>
      <p>{copy.note[locale]}</p>
      <label>
        {copy.filter[locale]}{' '}
        <select
          disabled={!ready}
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <option value="all">{copy.all[locale]}</option>
          <option value="checked">{copy.checked[locale]}</option>
          <option value="pending">{copy.pending[locale]}</option>
        </select>
      </label>
      <p role="status">
        {rows.length} / {imported.length}
      </p>
      <ul>
        {rows.map(([id, title]) => (
          <li key={id}>
            <Link href={`/${locale}/concept/${researchId(id)}?level=expert`}>{title}</Link>
            <ResearchReview catalogId={id} locale={locale} />
          </li>
        ))}
      </ul>
    </section>
  );
}
