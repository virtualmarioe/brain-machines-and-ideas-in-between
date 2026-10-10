export type Rect = { left: number; top: number; width: number; height: number };
export type Point = { x: number; y: number };
const clamp = (n: number, low: number, high: number) => Math.max(low, Math.min(high, n));
/** Reserve the complete visible trigger bounds, including an edge's curve. */
export function placeBubble(
  anchor: Rect,
  size: { width: number; height: number },
  viewport: Rect,
  origin?: Point,
) {
  const margin = 12,
    gap = 20;
  const l = viewport.left + margin,
    t = viewport.top + margin;
  const r = viewport.left + viewport.width - margin,
    b = viewport.top + viewport.height - margin;
  const al = clamp(anchor.left, l, r),
    ar = clamp(anchor.left + anchor.width, l, r);
  const at = clamp(anchor.top, t, b),
    ab = clamp(anchor.top + anchor.height, t, b);
  const tip = origin ?? { x: (al + ar) / 2, y: (at + ab) / 2 };
  const candidates = [
    { side: 'bottom', left: l, top: ab + gap, width: r - l, height: b - ab - gap },
    { side: 'top', left: l, top: t, width: r - l, height: at - t - gap },
    { side: 'right', left: ar + gap, top: t, width: r - ar - gap, height: b - t },
    { side: 'left', left: l, top: t, width: al - l - gap, height: b - t },
  ].filter((c) => c.width >= Math.min(240, r - l) && c.height >= 64);
  const candidate = candidates.sort(
    (a, b) =>
      Math.min(b.width, size.width) * Math.min(b.height, size.height) -
      Math.min(a.width, size.width) * Math.min(a.height, size.height),
  )[0];
  if (!candidate) return null;
  const width = Math.min(candidate.width, size.width);
  const height = Math.min(candidate.height, size.height);
  const left =
    candidate.side === 'left'
      ? al - gap - width
      : candidate.side === 'right'
        ? ar + gap
        : clamp(tip.x - width / 2, l, r - width);
  const top =
    candidate.side === 'top'
      ? at - gap - height
      : candidate.side === 'bottom'
        ? ab + gap
        : clamp(tip.y - height / 2, t, b - height);
  const horizontal = candidate.side === 'top' || candidate.side === 'bottom';
  const base = horizontal
    ? {
        x: clamp(tip.x, left + 20, left + width - 20),
        y: candidate.side === 'top' ? top + height : top,
      }
    : {
        x: candidate.side === 'left' ? left + width : left,
        y: clamp(tip.y, top + 20, top + height - 20),
      };
  return {
    left,
    top,
    width,
    maxHeight: candidate.height,
    side: candidate.side,
    base,
    tip,
    horizontal,
  };
}

/** Open base avoids drawing a seam across the card; SVG still fills the wedge. */
export function bubbleTail(base: Point, tip: Point, side: string, halfWidth = 12) {
  const horizontal = side === 'top' || side === 'bottom';
  const normal =
    side === 'top'
      ? { x: 0, y: 1 }
      : side === 'bottom'
        ? { x: 0, y: -1 }
        : side === 'left'
          ? { x: 1, y: 0 }
          : { x: -1, y: 0 };
  const bend = Math.min(48, Math.hypot(tip.x - base.x, tip.y - base.y) * 0.45);
  const a = { x: base.x - (horizontal ? halfWidth : 0), y: base.y - (horizontal ? 0 : halfWidth) };
  const b = { x: base.x + (horizontal ? halfWidth : 0), y: base.y + (horizontal ? 0 : halfWidth) };
  return `M${a.x},${a.y} Q${a.x + normal.x * bend},${a.y + normal.y * bend} ${tip.x},${tip.y} Q${b.x + normal.x * bend},${b.y + normal.y * bend} ${b.x},${b.y}`;
}
