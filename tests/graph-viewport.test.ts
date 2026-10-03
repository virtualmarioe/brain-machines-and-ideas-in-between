import { describe, expect, it } from 'vitest';
import { graphBounds, clampGraphLeft, fitGraph } from '@/lib/graph/viewport';

describe('graph overview navigation', () => {
  const bounds = graphBounds([
    { x: 80, y: 68 },
    { x: 2005, y: 256 },
  ]);
  it('includes the labels of every node, including dragged nodes', () => {
    expect(bounds).toEqual({ left: -25, right: 2110, top: 30, bottom: 316 });
    expect(graphBounds([{ x: -400, y: -100 }]).left).toBe(-505);
  });
  it('keeps either end reachable without panning beyond the graph', () => {
    expect(clampGraphLeft(-1000, 780, bounds)).toBe(bounds.left);
    expect(clampGraphLeft(5000, 780, bounds)).toBe(bounds.right - 780);
    expect(clampGraphLeft(500, 780, bounds)).toBe(500);
  });
  it('centers small graphs when the whole corpus fits in the viewport', () => {
    const small = graphBounds([{ x: 80, y: 68 }]);
    expect(clampGraphLeft(2000, 780, small)).toBe(80 - 390);
  });
  it('fits all nodes and their labels in both dimensions', () => {
    for (const width of [390, 780]) {
      const view = fitGraph(bounds, width, 340);
      expect(bounds.left * view.scale + view.x).toBeGreaterThanOrEqual(-0.001);
      expect(bounds.right * view.scale + view.x).toBeLessThanOrEqual(width + 0.001);
      expect(bounds.top * view.scale + view.y).toBeGreaterThanOrEqual(0);
      expect(bounds.bottom * view.scale + view.y).toBeLessThanOrEqual(340);
    }
  });
});
