import type { HistoricalEntity, HistoricalRelationship } from '@/types/history';
export function neighbors(
  id: string,
  relationships: HistoricalRelationship[],
  direction: 'both' | 'before' | 'after' = 'both',
): Set<string> {
  const ids = new Set<string>();
  for (const edge of relationships) {
    if (edge.target === id && direction !== 'after') ids.add(edge.source);
    if (edge.source === id && direction !== 'before') ids.add(edge.target);
  }
  return ids;
}
export function traverse(
  id: string,
  relationships: HistoricalRelationship[],
  depth = Infinity,
  direction: 'both' | 'before' | 'after' = 'both',
): Set<string> {
  const visited = new Set([id]);
  let frontier = [id];
  let step = 0;
  while (frontier.length && step < depth) {
    const next: string[] = [];
    for (const current of frontier)
      for (const adjacent of neighbors(current, relationships, direction))
        if (!visited.has(adjacent)) {
          visited.add(adjacent);
          next.push(adjacent);
        }
    frontier = next;
    step++;
  }
  return visited;
}
export function yearOf(entity: HistoricalEntity) {
  return Number(entity.startDate.match(/^-?\d+/)?.[0]);
}
export function chronological(entities: HistoricalEntity[]) {
  return [...entities].sort((a, b) => yearOf(a) - yearOf(b) || a.id.localeCompare(b.id));
}

export function displayYear(entity: HistoricalEntity) {
  return formatYear(yearOf(entity));
}

export function formatYear(year: number) {
  return year < 0 ? `${Math.abs(year)} BCE` : String(year);
}
