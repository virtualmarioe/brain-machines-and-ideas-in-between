import { expect, it } from 'vitest';
import { mapPlaceName, placeMapLabels } from '../lib/map-labels';
it('splits city names and uses familiar country abbreviations', () => {
  expect(mapPlaceName('London, United Kingdom')).toEqual({ city: 'London', country: 'UK' });
  expect(mapPlaceName('Boston, United States')).toEqual({ city: 'Boston', country: 'USA' });
  expect(mapPlaceName('Tokyo, Japan')).toEqual({ city: 'Tokyo', country: 'JPN' });
});
it('keeps two-line labels apart, in bounds, and away from markers in dense layouts', () => {
  const anchors = Array.from({ length: 30 }, (_, i) => ({
    key: String(i),
    name: `City ${i}, United States`,
    x: 280 + (i % 6) * 25,
    y: 80 + Math.floor(i / 6) * 25,
    radius: 11,
    priority: i === 12 ? 3 : 1,
  }));
  const labels = placeMapLabels(anchors, Object.fromEntries(anchors.map((a) => [a.key, 95])));
  expect(labels.length).toBeGreaterThan(0);

  for (const a of labels) {
    expect(a.left).toBeGreaterThanOrEqual(6);
    expect(a.top).toBeGreaterThanOrEqual(6);
    expect(a.left + a.width).toBeLessThanOrEqual(714);
    expect(a.top + a.height).toBeLessThanOrEqual(289);
    for (const b of labels.filter((b) => b.key !== a.key))
      expect(
        a.left + a.width <= b.left ||
          b.left + b.width <= a.left ||
          a.top + a.height <= b.top ||
          b.top + b.height <= a.top,
      ).toBe(true);
    for (const p of anchors)
      expect(
        a.left + a.width <= p.x - p.radius ||
          a.left >= p.x + p.radius ||
          a.top + a.height <= p.y - p.radius ||
          a.top >= p.y + p.radius,
      ).toBe(true);
  }
});
it('labels a shared city only once, giving the active discovery priority', () => {
  const anchors = [
    { key: 'a', name: 'London, United Kingdom', x: 200, y: 100, radius: 11, priority: 1 },
    { key: 'b', name: 'London, United Kingdom', x: 230, y: 100, radius: 11, priority: 3 },
  ];
  const labels = placeMapLabels(anchors, {});
  expect(labels).toHaveLength(1);
  expect(labels[0].key).toBe('b');
});

it('hides crowded labels instead of sending them far from their coordinates', () => {
  const anchors = Array.from({ length: 12 }, (_, i) => ({
    key: String(i),
    name: `Town ${i}, Germany`,
    x: 350,
    y: 140,
    radius: 10,
    priority: i === 0 ? 3 : 1,
  }));
  const labels = placeMapLabels(anchors, {});
  expect(labels.length).toBeLessThan(anchors.length);
  expect(labels[0].key).toBe('0');
  for (const label of labels) {
    const dx = Math.max(label.left - label.anchor.x, 0, label.anchor.x - label.left - label.width);
    const dy = Math.max(label.top - label.anchor.y, 0, label.anchor.y - label.top - label.height);
    expect(Math.hypot(dx, dy)).toBeLessThanOrEqual((label.anchor.radius + 5) * Math.SQRT2);
  }
});
