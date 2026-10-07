import { describe, expect, it } from 'vitest';
import { entities, relationships, references, claims } from '../content';
import {
  distinctValues,
  digitTemplates,
  digitDistances,
  replaySample,
} from '../lib/distinct-simulations';
import { validateContent } from '../lib/validation';
import { distinctKinds, locales } from '../types/history';
import { distinctCopy, local } from '../content/translations/distinct-demos';
describe('distinct educational demonstrations', () => {
  it('assigns each demo once and rejects accidental reuse', () => {
    const assigned = entities.flatMap((e) => (e.demo ? [e.demo] : []));
    expect(new Set(assigned).size).toBe(assigned.length);
    const changed = entities.map((e, i) => (i === 1 ? { ...e, demo: entities[0].demo } : e));
    expect(
      validateContent(changed, relationships, references, claims).some((e) => e.includes('reuses')),
    ).toBe(true);
  });
  it('explains each exercise and its limitations in all locales', () => {
    for (const kind of distinctKinds)
      for (const locale of locales)
        for (const field of ['title', 'intro', 'note'] as const)
          expect(local(distinctCopy[kind][field], locale).length).toBeGreaterThan(10);
  });
  it('preserves the intended geometry and edge cases', () => {
    expect(distinctValues('arbor', 4)).toEqual([16, 30]);
    expect(distinctValues('synapse', 8)).toEqual([8, 18, 28]);
    expect(distinctValues('orientation', 0)[0]).toBe(0);
    expect(distinctValues('orientation', 90)[0]).toBe(1);
    expect(distinctValues('sharing', 12)).toEqual([100, 1000]);
    expect(distinctValues('rectifier', -2)).toEqual([0, 0]);
    expect(distinctValues('rectifier', 0)).toEqual([0, 0]);
    expect(distinctValues('rectifier', 2)).toEqual([2, 1]);
    expect(distinctValues('q-update', 1, 3)[0]).toBeCloseTo(3.7);
    expect(distinctValues('surprise', 2, 0)).toEqual([-2]);
    const noSearch = distinctValues('tree-search', 0),
      search = distinctValues('tree-search', 3);
    expect(noSearch[0]).toBeGreaterThan(noSearch[1]);
    expect(search[1]).toBeGreaterThan(search[0]);
    expect(distinctValues('representations', 0)).toEqual([1, 1, Math.SQRT2]);
    expect(distinctValues('representations', 1)[2]).toBeCloseTo(Math.sqrt(5));
  });
  it('matches templates exactly and counts changed pixels', () => {
    for (const [i, template] of digitTemplates.entries()) {
      expect(template).toHaveLength(25);
      expect(digitDistances(template)[i]).toBe(0);
      const edited = [...template];
      edited[0] = 1 - edited[0];
      expect(digitDistances(edited)[i]).toBe(1);
    }
  });
  it('samples without replacement and resets reproducibly', () => {
    for (let round = 0; round < 100; round++) {
      const sample = replaySample(round);
      expect(new Set(sample).size).toBe(4);
      expect(sample.every((i) => i >= 1 && i <= 12)).toBe(true);
    }
    expect(replaySample(0)).toEqual(replaySample(0));
    expect(replaySample(1)).not.toEqual(replaySample(0));
  });
});
