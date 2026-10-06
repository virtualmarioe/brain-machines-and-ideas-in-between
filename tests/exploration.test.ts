import { describe, expect, it } from 'vitest';
import { entities } from '../content';
import { explorationUrl, localeFromPath, parseExploration } from '../lib/exploration';
import { clampRange, clusterTimeline } from '../components/timeline/Timeline';

const parse = (query = '', routeId?: string) =>
  parseExploration(new URLSearchParams(query), 'en', entities, routeId);

describe('exploration URL and time state', () => {
  it('defaults to the visual-neuroscience entry and the full historical range', () => {
    expect(parse()).toEqual({
      selected: 'hubel-wiesel',
      locale: 'en',
      mode: 'explore',
      query: '',
      domain: 'all',
      category: 'all',
      from: 1870,
      to: 2026,
      scope: 'all',
      nobel: false,
      context: false,
    });
  });
  it('restores the People category and selects an existing person node', () => {
    const state = parse('category=person');
    expect(entities.find((e) => e.id === state.selected)?.type).toBe('person');
    const url = new URL(explorationUrl(state, entities), 'https://atlas.example');
    expect(url.searchParams.get('category')).toBe('person');
    expect(parse('category=unknown').category).toBe('all');
  });
  it('prioritizes a valid entity route over a node query parameter', () => {
    expect(parse('node=alexnet', 'cajal').selected).toBe('cajal');
    expect(parse('node=alexnet', 'missing').selected).toBe('alexnet');
    expect(parse('node=missing', 'also-missing').selected).toBe('hubel-wiesel');
  });
  it('falls back to the first entity when a catalog has no default entry', () => {
    const subset = entities.filter((entity) => entity.id === 'cajal');
    expect(parseExploration(new URLSearchParams(), 'es', subset).selected).toBe('cajal');
  });
  it.each([
    'from=NaN&to=2000',
    'from=1950&to=Infinity',
    'from=1869&to=2000',
    'from=2000&to=2027',
    'from=2000&to=1990',
    'from=2000&to=2003',
    'from=&to=2000',
  ])('rejects invalid or too narrow time ranges: %s', (query) => {
    expect(parse(query)).toMatchObject({ from: 1870, to: 2026 });
  });
  it('accepts the minimum four-year interval and rounds valid decimal endpoints', () => {
    expect(parse('from=1900&to=1904')).toMatchObject({ from: 1900, to: 1904 });
    expect(parse('from=1900.2&to=1950.4')).toMatchObject({ from: 1900, to: 1950 });
  });
  it('sanitizes unsupported modes, domains, graph scopes and boolean flags', () => {
    expect(parse('mode=unknown&domain=unknown&scope=999&nobel=true&context=false')).toMatchObject({
      mode: 'explore',
      domain: 'all',
      category: 'all',
      scope: 'all',
      nobel: false,
      context: false,
    });
    expect(parse('mode=trace&domain=neuroscience&scope=ancestry&nobel=1&context=1')).toMatchObject({
      mode: 'trace',
      domain: 'neuroscience',
      scope: 'ancestry',
      nobel: true,
      context: true,
    });
  });
  it('caps search input and safely round-trips special characters and localization', () => {
    expect(parse(`q=${'x'.repeat(250)}`).query).toHaveLength(200);
    const original = {
      ...parse(
        'node=alexnet&mode=trace&domain=learning&from=1900&to=2020&scope=2&nobel=1&context=1',
      ),
      locale: 'de' as const,
      query: 'Cajal & Wörter / memoria?',
    };
    const url = new URL(explorationUrl(original, entities), 'https://atlas.example');
    expect(url.pathname).toBe('/de/architecture/alexnet');
    expect(parseExploration(url.searchParams, 'de', entities, 'alexnet')).toEqual(original);
  });
  it('produces canonical clean URLs for the default exploration state', () => {
    expect(explorationUrl(parse(), entities)).toBe('/en/experiment/hubel-wiesel');
    expect(localeFromPath('/de/architecture/alexnet')).toBe('de');
    expect(localeFromPath('/es')).toBe('es');
    expect(localeFromPath('/fr')).toBe('en');
    expect(localeFromPath('/')).toBe('en');
  });
});

describe('responsive timeline clustering', () => {
  const sample = (id: string, year: number) => ({
    ...entities[0],
    id,
    slug: id,
    startDate: String(year),
  });
  it('merges nearby dates while keeping every discovery independently represented in the group', () => {
    const milestones = [
      sample('b', 1901),
      sample('middle', 1950),
      sample('a', 1900),
      sample('end', 2000),
    ];
    const groups = clusterTimeline(milestones, [1900, 2000], 200);
    expect(groups.map((group) => group.entities.map((entity) => entity.id))).toEqual([
      ['a', 'b'],
      ['middle'],
      ['end'],
    ]);
    expect(groups.map((group) => group.x)).toEqual([12, 100, 188]);
    expect(milestones.map((entity) => entity.id)).toEqual(['b', 'middle', 'a', 'end']);
  });
  it('separates dates again when there is enough room and groups identical years deterministically', () => {
    const milestones = [sample('b', 1950), sample('a', 1950), sample('later', 1960)];
    expect(
      clusterTimeline(milestones, [1900, 2000], 200).map((group) => group.entities.length),
    ).toEqual([3]);
    const wide = clusterTimeline(milestones, [1900, 2000], 1000);
    expect(wide.map((group) => group.entities.map((entity) => entity.id))).toEqual([
      ['a', 'b'],
      ['later'],
    ]);
  });
  it('excludes dates outside the visible range and keeps 24px hit areas inside the track', () => {
    const groups = clusterTimeline(
      [
        sample('too-early', 1899),
        sample('start', 1900),
        sample('end', 2000),
        sample('too-late', 2001),
      ],
      [1900, 2000],
      120,
    );
    expect(groups.flatMap((group) => group.entities.map((entity) => entity.id))).toEqual([
      'start',
      'end',
    ]);
    expect(groups.every((group) => group.x >= 12 && group.x <= 108)).toBe(true);
  });
  it('leaves at least 28px between distinct group centers for the full catalog', () => {
    for (const width of [280, 390, 720, 1300]) {
      const groups = clusterTimeline(entities, [1870, 2026], width);
      for (let i = 1; i < groups.length; i += 1)
        expect(groups[i].x - groups[i - 1].x).toBeGreaterThanOrEqual(28);
      expect(groups.flatMap((group) => group.entities)).toHaveLength(entities.length);
    }
  });
  it('clamps panning and zooming to the supported range with a four-year minimum', () => {
    expect(clampRange(1800, 1900)).toEqual([1870, 1970]);
    expect(clampRange(2000, 2100)).toEqual([1926, 2026]);
    expect(clampRange(1900, 1901)).toEqual([1900, 1904]);
    expect(clampRange(1800, 2200)).toEqual([1870, 2026]);
  });
});
