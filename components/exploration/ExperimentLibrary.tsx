'use client';
import { useState } from 'react';
import { entities, references } from '@/content';
import { searchEntities } from '@/lib/search';
import { domains } from '@/content/translations/ui';
import { experienceCopy as copy } from '@/content/translations/experience';
import type { HistoricalEntity, Locale } from '@/types/history';
export default function ExperimentLibrary({
  locale,
  onOpen,
}: {
  locale: Locale;
  onOpen: (entity: HistoricalEntity) => void;
}) {
  const [query, setQuery] = useState('');
  const results = searchEntities(
    entities.filter((entity) => entity.demo),
    query,
    locale,
    references,
  );
  return (
    <section className="experiment-library">
      <p>{copy.libraryHint[locale]}</p>
      <label className="library-search">
        {copy.searchLabs[locale]}
        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>
      <p role="status">
        {results.length} / {entities.filter((entity) => entity.demo).length}
      </p>
      <div className="experiment-grid">
        {results.map((entity) => (
          <article key={entity.id} className={`domain-${entity.domain}`}>
            <span className="domain-tag">{domains[entity.domain][locale]}</span>
            <h3>{entity.title[locale]}</h3>
            <p>{entity.shortDescription[locale]}</p>
            <button
              onClick={() => onOpen(entity)}
              aria-label={`${copy.open[locale]}: ${entity.title[locale]}`}
            >
              {copy.open[locale]} →
            </button>
          </article>
        ))}
      </div>
      {!results.length && <p>{copy.none[locale]}</p>}
    </section>
  );
}
