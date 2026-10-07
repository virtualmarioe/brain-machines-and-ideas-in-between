'use client';
import { relationships } from '@/content';
import { domains } from '@/content/translations/ui';
import { journeyText as copy } from '@/content/translations/journeys';
import { yearOf } from '@/lib/graph';
import type { HistoricalEntity, Locale } from '@/types/history';
export default function SearchResults({
  results,
  locale,
  onSelect,
  onTrace,
  onQuery,
}: {
  results: HistoricalEntity[];
  locale: Locale;
  onSelect: (id: string) => void;
  onTrace: (id: string) => void;
  onQuery: (query: string) => void;
}) {
  const groups = [
    { key: 'people', items: results.filter((e) => e.type === 'person') },
    { key: 'concepts', items: results.filter((e) => e.type === 'concept' || e.type === 'field') },
    {
      key: 'discoveries',
      items: results.filter((e) => !['person', 'concept', 'field'].includes(e.type)),
    },
  ] as const;
  const researchers = [...new Set(results.slice(0, 6).flatMap((e) => e.people))].slice(0, 6);
  return (
    <section className="search-results" aria-label={copy.searchTitle[locale]}>
      <h2>{copy.searchTitle[locale]}</h2>
      <div className="search-groups">
        {groups
          .filter((g) => g.items.length)
          .map((group) => (
            <div key={group.key}>
              <h3>
                {copy[group.key][locale]} <span>{group.items.length}</span>
              </h3>
              {group.items.slice(0, 3).map((entity) => (
                <article key={entity.id} className={`search-result domain-${entity.domain}`}>
                  <p className="branch-meta">
                    {yearOf(entity)} · {domains[entity.domain][locale]} ·{' '}
                    {
                      relationships.filter((r) => r.source === entity.id || r.target === entity.id)
                        .length
                    }{' '}
                    {copy.links[locale]}
                  </p>
                  <button className="branch-title" onClick={() => onSelect(entity.id)}>
                    {entity.title[locale]}
                  </button>
                  <p>{entity.shortDescription[locale]}</p>
                  <button className="text-action" onClick={() => onTrace(entity.id)}>
                    {copy.trace[locale]} →
                  </button>
                </article>
              ))}
            </div>
          ))}
      </div>
      {researchers.length > 0 && (
        <div className="researcher-results">
          <strong>{copy.researchers[locale]}</strong>
          <div>
            {researchers.map((person) => (
              <button key={person} onClick={() => onQuery(person)}>
                {person}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
