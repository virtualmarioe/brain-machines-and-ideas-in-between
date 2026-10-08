import { entities } from '@/content';
import { geography, project } from '@/lib/map';
import { describe, expect, it } from 'vitest';
import { groupMapCities } from '@/lib/map-pins';

describe('city clusters and map extent', () => {
  it('retains every discovery once per city and keeps countries separate', () => {
    const groups = groupMapCities(entities);
    for (const city of groups) {
      expect(new Set(city.entities.map((e) => e.id)).size).toBe(city.entities.length);
      expect(city.entities.length).toBeGreaterThan(0);
      expect(Number.isFinite(city.lat) && Number.isFinite(city.lon)).toBe(true);
    }
    for (const entity of entities)
      for (const location of entity.locations) {
        expect(
          groups.find((c) => c.name === location.name)?.entities.some((e) => e.id === entity.id),
        ).toBe(true);
      }
    const sample = entities[0];
    const variants = [
      {
        ...sample,
        id: 'one',
        locations: [{ ...sample.locations[0], name: 'Cambridge, United Kingdom' }],
      },
      {
        ...sample,
        id: 'two',
        locations: [{ ...sample.locations[0], name: 'Cambridge, United States' }],
      },
    ];
    expect(groupMapCities(variants)).toHaveLength(2);
  });
  it('counts filtered discoveries only', () => {
    const sample = entities.filter((e) =>
      e.locations.some((l) => l.name === 'London, United Kingdom'),
    );
    const city = groupMapCities(sample.slice(0, 1)).find(
      (c) => c.name === 'London, United Kingdom',
    );
    expect(city?.entities).toHaveLength(1);
  });
  it('excludes Antarctic polygons and keeps recorded sites inside the map', () => {
    expect(geography.geometry.coordinates.every((p) => p[0].some(([, lat]) => lat > -60))).toBe(
      true,
    );
    for (const entity of entities)
      for (const site of entity.locations) {
        const [x, y] = project(site.lon, site.lat);
        expect(x).toBeGreaterThanOrEqual(0);
        expect(x).toBeLessThanOrEqual(720);
        expect(y).toBeGreaterThanOrEqual(0);
        expect(y).toBeLessThanOrEqual(295);
      }
  });
});
