import { describe, expect, it } from 'vitest';
import { entities, relationships } from '../content';
import { chronological, neighbors, traverse, yearOf } from '../lib/graph';
import type { HistoricalRelationship } from '../types/history';

const edge = (source: string, target: string): HistoricalRelationship => ({
  id: `${source}-${target}`,
  source,
  target,
  type: 'extension',
  description: { en: 'Extends', de: 'Erweitert', es: 'Amplía' },
  evidence: ['source'],
  confidence: 'high',
});
const graph = [edge('a', 'b'), edge('b', 'c'), edge('c', 'a'), edge('b', 'd'), edge('x', 'y')];

describe('knowledge graph navigation', () => {
  it('distinguishes influences from descendants and undirected neighbors', () => {
    expect(neighbors('b', graph, 'before')).toEqual(new Set(['a']));
    expect(neighbors('b', graph, 'after')).toEqual(new Set(['c', 'd']));
    expect(neighbors('b', graph)).toEqual(new Set(['a', 'c', 'd']));
  });
  it('terminates on cycles and never leaks into disconnected components', () => {
    expect(traverse('a', graph)).toEqual(new Set(['a', 'b', 'c', 'd']));
    expect(traverse('a', graph, Infinity, 'before')).toEqual(new Set(['a', 'b', 'c']));
  });
  it('respects exact depth limits and includes the selected root', () => {
    expect(traverse('a', graph, 0)).toEqual(new Set(['a']));
    expect(traverse('a', graph, 1, 'after')).toEqual(new Set(['a', 'b']));
    expect(traverse('a', graph, 2, 'after')).toEqual(new Set(['a', 'b', 'c', 'd']));
  });
  it('deduplicates parallel relationships and handles unknown nodes', () => {
    expect(neighbors('a', [edge('a', 'b'), { ...edge('a', 'b'), id: 'second-edge' }])).toEqual(
      new Set(['b']),
    );
    expect(neighbors('missing', graph)).toEqual(new Set());
    expect(traverse('missing', graph)).toEqual(new Set(['missing']));
  });
  it('traces the catalog visual lineage in either direction', () => {
    const ancestors = traverse('alexnet', relationships, Infinity, 'before');
    const descendants = traverse('hubel-wiesel', relationships, Infinity, 'after');
    for (const id of ['hubel-wiesel', 'neocognitron', 'lenet', 'imagenet', 'backpropagation'])
      expect(ancestors.has(id)).toBe(true);
    for (const id of ['neocognitron', 'lenet', 'alexnet']) expect(descendants.has(id)).toBe(true);
  });
  it('sorts copies chronologically with stable id ordering for equal years', () => {
    const template = entities[0];
    const unsorted = [
      { ...template, id: 'later', startDate: '2000-05-03' },
      { ...template, id: 'b', startDate: '1900' },
      { ...template, id: 'a', startDate: '1900-02' },
    ];
    expect(yearOf(unsorted[0])).toBe(2000);
    expect(chronological(unsorted).map((item) => item.id)).toEqual(['a', 'b', 'later']);
    expect(unsorted.map((item) => item.id)).toEqual(['later', 'b', 'a']);
  });
});
