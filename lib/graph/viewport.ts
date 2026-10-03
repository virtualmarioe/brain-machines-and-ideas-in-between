export type GraphPoint = { x: number; y: number };
export type GraphBounds = { left: number; right: number; top: number; bottom: number };

export function graphBounds(points: GraphPoint[]): GraphBounds {
  if (!points.length) return { left: 0, right: 780, top: 0, bottom: 340 };
  return {
    left: Math.min(...points.map((p) => p.x)) - 105,
    right: Math.max(...points.map((p) => p.x)) + 105,
    top: Math.min(...points.map((p) => p.y)) - 38,
    bottom: Math.max(...points.map((p) => p.y)) + 60,
  };
}

export function clampGraphLeft(left: number, visibleWidth: number, bounds: GraphBounds) {
  const width = bounds.right - bounds.left;
  if (visibleWidth >= width) return bounds.left - (visibleWidth - width) / 2;
  return Math.max(bounds.left, Math.min(bounds.right - visibleWidth, left));
}

export function fitGraph(bounds: GraphBounds, width: number, height: number) {
  const scale = Math.min(
    1,
    width / (bounds.right - bounds.left),
    height / (bounds.bottom - bounds.top),
  );
  return {
    scale,
    x: width / 2 - ((bounds.left + bounds.right) / 2) * scale,
    y: height / 2 - ((bounds.top + bounds.bottom) / 2) * scale,
  };
}
