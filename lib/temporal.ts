import type { HistoricalEntity, HistoricalRelationship, Locale } from '@/types/history';
import { yearOf } from './graph';

export function yearGap(from: number, to: number, locale: Locale) {
  const gap = calendarGap(from, to);
  if (gap === 0)
    return {
      en: 'Same recorded year',
      de: 'Gleiches verzeichnetes Jahr',
      es: 'Mismo año registrado',
    }[locale];
  const count = Math.abs(gap).toLocaleString(locale);
  return locale === 'de'
    ? `${count} Kalenderjahr${Math.abs(gap) === 1 ? '' : 'e'} ${gap > 0 ? 'später' : 'früher'}`
    : locale === 'es'
      ? `${count} año${Math.abs(gap) === 1 ? '' : 's'} calendario ${gap > 0 ? 'después' : 'antes'}`
      : `${count} calendar year${Math.abs(gap) === 1 ? '' : 's'} ${gap > 0 ? 'later' : 'earlier'}`;
}
export function temporalConnections(
  entity: HistoricalEntity,
  entities: HistoricalEntity[],
  relationships: HistoricalRelationship[],
) {
  const lookup = new Map(entities.map((item) => [item.id, item]));
  const connections = (direction: 'before' | 'after') =>
    relationships
      .flatMap((relationship) => {
        const incoming = direction === 'before';
        if ((incoming ? relationship.target : relationship.source) !== entity.id) return [];
        const other = lookup.get(incoming ? relationship.source : relationship.target);
        return other
          ? [{ entity: other, relationship, gap: calendarGap(yearOf(entity), yearOf(other)) }]
          : [];
      })
      .sort((a, b) => Math.abs(a.gap) - Math.abs(b.gap) || a.entity.id.localeCompare(b.entity.id));
  return { before: connections('before'), after: connections('after') };
}

function calendarGap(from: number, to: number) {
  const gap = to - from;
  return from * to < 0 ? gap - Math.sign(gap) : gap;
}
