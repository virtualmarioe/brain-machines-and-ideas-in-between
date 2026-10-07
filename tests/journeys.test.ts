import { describe, expect, it } from 'vitest';
import { placeBubble } from '../lib/overlay-placement';
import { extendTrail } from '../lib/traces';
import { projectField, receptiveWidth } from '../lib/receptive-field';
import { searchEntities } from '../lib/search';
import { explorationUrl, parseExploration } from '../lib/exploration';
import { entities, references, relationships } from '../content';
describe('bubble placement', () => {
  for (const width of [360, 390, 768, 1024, 1366, 1440, 1920, 3440]) {
    it(`reserves trigger bounds and stays inside a ${width}px viewport`, () => {
      for (const anchor of [
        { left: 12, top: 12, width: 28, height: 28 },
        { left: width / 2 - 12, top: 400, width: 24, height: 24 },
        { left: 40, top: 200, width: width - 80, height: 120 },
        { left: width - 60, top: 740, width: 40, height: 28 },
      ]) {
        const card = placeBubble(
          anchor,
          { width: 384, height: 650 },
          { left: 0, top: 0, width, height: 800 },
        )!;
        expect(card).not.toBeNull();
        const h = Math.min(650, card.maxHeight);
        expect(card.left >= 12 && card.top >= 12).toBe(true);
        expect(card.left + card.width <= width - 12 && card.top + h <= 788).toBe(true);
        expect(
          card.left + card.width <= anchor.left ||
            card.left >= anchor.left + anchor.width ||
            card.top + h <= anchor.top ||
            card.top >= anchor.top + anchor.height,
        ).toBe(true);
      }
    });
  }
});
it('traces only recorded connections and supports backtracking without inventing a path', () => {
  expect(extendTrail(['hubel-wiesel'], 'neocognitron', relationships)).toEqual([
    'hubel-wiesel',
    'neocognitron',
  ]);
  expect(extendTrail(['hubel-wiesel', 'neocognitron'], 'hubel-wiesel', relationships)).toEqual([
    'hubel-wiesel',
  ]);
  expect(extendTrail(['hubel-wiesel'], 'turing', relationships)).toEqual(['turing']);
});
it('ranks title matches before passing mentions', () => {
  const result = searchEntities(entities, 'perceptron', 'en', references);
  expect(result[0].id).toBe('perceptron');
  expect(searchEntities(entities, 'ramon cajal', 'en', references)[0].id).toBe('cajal');
});
it('preserves story bookmarks and visited paths in shareable routes', () => {
  const state = {
    ...parseExploration(new URLSearchParams(), 'en', entities),
    mode: 'trace' as const,
    story: 'cajal',
    selected: 'neocognitron',
    trail: ['hubel-wiesel', 'neocognitron'],
  };
  const url = new URL(explorationUrl(state, entities), 'https://example.test');
  expect(parseExploration(url.searchParams, 'en', entities, 'neocognitron')).toEqual(state);
});
it('represents receptive fields across layers with bounded spatial geometry', () => {
  expect(receptiveWidth(0, 3)).toBe(1);
  expect(receptiveWidth(3, 3)).toBe(7);
  expect(receptiveWidth(4, 5)).toBe(17);
  for (const angle of [-60, 0, 60])
    for (const x of [-8.5, 8.5])
      for (const y of [-8.5, 8.5]) {
        const p = projectField(x, y, 0, angle);
        expect(p.x).toBeGreaterThan(0);
        expect(p.x).toBeLessThan(600);
        expect(p.y).toBeGreaterThan(0);
        expect(p.y).toBeLessThan(440);
      }
});
