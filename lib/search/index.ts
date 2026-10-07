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
  return entities
    .map((entity, index) => {
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
      if (!terms.every((term) => text.includes(term))) return { entity, score: -1, index };
      const title = normalize(entity.title[locale] + ' ' + entity.title.en);
      const people = normalize(entity.people.join(' '));
      const tags = normalize(entity.tags.join(' '));
      const score = terms.reduce(
        (sum, term) =>
          sum +
          (title.includes(term) ? 10 : 0) +
          (people.includes(term) ? 6 : 0) +
          (tags.includes(term) ? 4 : 0),
        0,
      );
      return { entity, score, index };
    })
    .filter((result) => result.score >= 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((result) => result.entity);
}
