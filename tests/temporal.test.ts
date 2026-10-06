import { describe, expect, it } from 'vitest';
import { entities, relationships } from '../content';
import { temporalConnections, yearGap } from '../lib/temporal';

describe('temporal preview context', () => {
  it('expresses calendar gaps in both directions and preserves contemporaneous dates', () => {
    expect(yearGap(1962, 1980, 'en')).toBe('18 calendar years later');
    expect(yearGap(1980, 1962, 'en')).toBe('18 calendar years earlier');
    expect(yearGap(1980, 1980, 'en')).toBe('Same recorded year');
    expect(yearGap(1980, 1981, 'de')).toBe('1 Kalenderjahr später');
    expect(yearGap(1980, 1981, 'es')).toBe('1 año calendario después');
  });
  it('uses recorded links rather than inventing connections from adjacent dates', () => {
    const entity = entities.find((e) => e.id === 'neocognitron')!;
    const result = temporalConnections(entity, entities, relationships);
    expect(
      result.before.some((item) => item.entity.id === 'hubel-wiesel' && item.gap === -18),
    ).toBe(true);
    expect(result.after.some((item) => item.entity.id === 'lenet' && item.gap === 18)).toBe(true);
    expect(temporalConnections(entity, entities, [])).toEqual({ before: [], after: [] });
  });
});
