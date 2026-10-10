import { describe, expect, it } from 'vitest';
import { entities, relationships } from '../content';
import {
  researchCatalog,
  researchEntities,
  researchId,
  unresolvedResearchEdges,
} from '../content/research';
import { atComplexity, complexityLevels } from '../lib/complexity';
import { parseExploration, explorationUrl } from '../lib/exploration';
import { yearOf, displayYear } from '../lib/graph';
describe('research integration and progressive complexity', () => {
  it('retains all source concepts without duplicating existing records', () => {
    expect(researchCatalog.concepts).toHaveLength(142);
    for (const [id] of researchCatalog.concepts)
      expect(entities.filter((e) => e.id === researchId(id))).toHaveLength(1);
    expect(researchCatalog.people).toHaveLength(48);
    expect(researchCatalog.institutions).toHaveLength(23);
    expect(researchCatalog.publications).toHaveLength(36);
    expect(unresolvedResearchEdges).toHaveLength(1);
    for (const edge of relationships) {
      expect(entities.some((e) => e.id === edge.source)).toBe(true);
      expect(entities.some((e) => e.id === edge.target)).toBe(true);
    }
  });
  it('preserves uncertainty and does not invent geographic coordinates or reuse demos', () => {
    for (const entity of researchEntities) {
      expect(entity.status).toBe('needs-review');
      expect(entity.research?.dateLabel).toBeTruthy();
      expect(entity.locations).toEqual([]);
      expect(entity.demo).toBeUndefined();
    }
  });
  it('provides strictly nested levels with a small default', () => {
    const levels = complexityLevels.map((level) => entities.filter((e) => atComplexity(e, level)));
    expect(levels[0].length).toBeLessThanOrEqual(22);
    expect(levels[1].length).toBeGreaterThan(levels[0].length);
    expect(levels[2].length).toBe(entities.length);
    for (let i = 0; i < 2; i++)
      for (const entity of levels[i]) expect(levels[i + 1]).toContain(entity);
  });
  it('opens deep links at an appropriate level and persists explicit selections', () => {
    const parse = (query: string, id?: string) =>
      parseExploration(new URLSearchParams(query), 'de', entities, id);
    expect(parse('').level).toBe('essentials');
    expect(parse('node=hubel-wiesel', 'aristotelian-syllogistic').level).toBe('expert');
    expect(parse('', 'aristotelian-syllogistic')).toMatchObject({ level: 'expert', from: -400 });
    const explicit = parse('level=connections', 'aristotelian-syllogistic');
    expect(explicit.level).toBe('connections');
    expect(explicit.selected).not.toBe('aristotelian-syllogistic');
    expect(explorationUrl(explicit, entities)).toContain('level=connections');
  });
  it('keeps ancient dates distinct from positive years', () => {
    const ancient = entities.find((e) => e.id === 'aristotelian-syllogistic')!;
    expect(yearOf(ancient)).toBe(-350);
    expect(displayYear(ancient)).toBe('350 BCE');
  });
});
