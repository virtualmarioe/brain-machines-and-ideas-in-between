import type { HistoricalEntity, Locale, Reference } from '@/types/history';
export function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase();
}
export function searchEntities(
  entities: HistoricalEntity[],
  query: string,
  locale: Locale,
  references: Reference[] = [],
) {
  const sources = new Map(references.map((reference) => [reference.id, reference]));
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
  return entities.filter((entity) => {
    const text = normalize(
      [
        entity.title[locale],
        entity.title.en,
        entity.shortDescription[locale],
        entity.description[locale],
        entity.technical[locale],
        ...entity.tags,
        ...entity.people,
        ...entity.references.flatMap((id) => {
          const source = sources.get(id);
          return source ? [source.title, ...source.authors, source.doi ?? ''] : [];
        }),
        ...entity.locations.flatMap((location) => [location.name, location.institution]),
      ].join(' '),
    );
    return terms.every((term) => text.includes(term));
  });
}
