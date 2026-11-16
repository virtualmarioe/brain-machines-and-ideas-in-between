/** Regular calendar ticks with enough room for a date label, including BCE. */
export function timelineTicks(from: number, to: number, width: number) {
  if (!Number.isFinite(from) || !Number.isFinite(to) || to <= from) return [];
  const capacity = Math.max(2, Math.floor((Number.isFinite(width) ? width : 320) / 64));
  const span = to - from;
  const steps = [1, 2, 5, 10, 20, 25, 50, 100, 200, 500, 1000, 2000];
  const step = steps.find((value) => span / value <= capacity) ?? Math.ceil(span / capacity);
  const start = Math.ceil(from / step) * step;
  return Array.from(
    { length: Math.floor((to - start) / step) + 1 },
    (_, index) => start + index * step,
  ).filter((year) => year !== 0);
}
