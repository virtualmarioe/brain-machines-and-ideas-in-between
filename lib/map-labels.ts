export function mapPlaceName(name: string) {
  const parts = name.split(',').map((part) => part.trim());
  const country = parts.length > 1 ? parts.pop()! : '';
  const codes: Record<string, string> = {
    'United States': 'USA',
    'United Kingdom': 'UK',
    Canada: 'CAN',
    Italy: 'ITA',
    Spain: 'ESP',
    Japan: 'JPN',
    Switzerland: 'CHE',
    Germany: 'DEU',
    France: 'FRA',
  };
  return { city: parts.join(', '), country: codes[country] ?? country };
}
export type MapLabelAnchor = {
  key: string;
  name: string;
  x: number;
  y: number;
  radius: number;
  priority: number;
};
export type LabelBox = { left: number; top: number; width: number; height: number };
const intersects = (a: LabelBox, b: LabelBox) =>
  a.left < b.left + b.width &&
  a.left + a.width > b.left &&
  a.top < b.top + b.height &&
  a.top + a.height > b.top;
/** Greedy placement prioritizes interaction, deduplicates cities, and reserves every marker. */
export function placeMapLabels(
  anchors: MapLabelAnchor[],
  widths: Record<string, number>,
  width = 720,
  height = 295,
) {
  const labels: (LabelBox & { key: string; anchor: MapLabelAnchor })[] = [];
  const names = new Set<string>();
  const markers = anchors.map((a) => ({
    left: a.x - a.radius - 3,
    top: a.y - a.radius - 3,
    width: 2 * (a.radius + 3),
    height: 2 * (a.radius + 3),
  }));
  for (const a of [...anchors].sort((a, b) => b.priority - a.priority)) {
    if (names.has(a.name) || a.x < 0 || a.x > width || a.y < 0 || a.y > height) continue;
    const w = widths[a.key] ?? Math.max(mapPlaceName(a.name).city.length * 9, 36) + 12;
    const h = 36;
    let placed = false;
    for (const gap of [5]) {
      const r = a.radius + gap;
      const candidates = [
        [a.x - w / 2, a.y - r - h],
        [a.x - w / 2, a.y + r],
        [a.x + r, a.y - h / 2],
        [a.x - r - w, a.y - h / 2],
      ];
      for (const [left, top] of candidates) {
        const box = { left, top, width: w, height: h };
        if (left < 6 || top < 6 || left + w > width - 6 || top + h > height - 6) continue;
        if (
          markers.some((m) => intersects(box, m)) ||
          labels.some((l) =>
            intersects(box, {
              left: l.left - 4,
              top: l.top - 4,
              width: l.width + 8,
              height: l.height + 8,
            }),
          )
        )
          continue;
        labels.push({ ...box, key: a.key, anchor: a });
        names.add(a.name);
        placed = true;
        break;
      }
      if (placed) break;
    }
  }
  return labels;
}
