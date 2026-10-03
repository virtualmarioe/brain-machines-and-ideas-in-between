import { describe, expect, it } from 'vitest';
import { separateMapPins } from '@/lib/map-pins';

describe('map marker separation', () => {
  it('keeps isolated research sites at their recorded position', () => {
    const points = [
      { x: 10, y: 20 },
      { x: 120, y: 140 },
    ];
    expect(separateMapPins(points, 24)).toEqual(points);
  });

  it('gives each coincident or nearby discovery its own pointer target', () => {
    const points = Array.from({ length: 30 }, (_, index) => ({
      x: 330 + (index % 3),
      y: 100 + (index % 2),
    }));
    const placed = separateMapPins(points, 24);
    expect(placed).toHaveLength(points.length);
    for (let a = 0; a < placed.length; a++) {
      for (let b = a + 1; b < placed.length; b++) {
        expect(
          Math.hypot(placed[a].x - placed[b].x, placed[a].y - placed[b].y),
        ).toBeGreaterThanOrEqual(24);
      }
    }
    expect(separateMapPins(points, 24)).toEqual(placed);
    expect(points[0]).toEqual({ x: 330, y: 100 });
  });

  it('brings displaced pins closer to their anchor as the map zooms in', () => {
    const points = [
      { x: 330, y: 100 },
      { x: 330, y: 100 },
    ];
    const wide = separateMapPins(points, 24);
    const zoomed = separateMapPins(points, 24 / 4);
    expect(Math.hypot(zoomed[1].x - 330, zoomed[1].y - 100)).toBeCloseTo(
      Math.hypot(wide[1].x - 330, wide[1].y - 100) / 4,
    );
  });
});
