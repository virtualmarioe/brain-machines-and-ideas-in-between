import type { DistinctKind } from '@/types/history';
export function distinctValues(kind: DistinctKind, a: number, b = 0): number[] {
  switch (kind) {
    case 'arbor':
      return [2 ** a, 2 ** (a + 1) - 2];
    case 'synapse':
      return [a, a + 10, a + 20];
    case 'orientation':
      return [Math.sin((a * Math.PI) / 180) ** 2];
    case 'sharing':
      return [(a - 2) ** 2, 10 * (a - 2) ** 2];
    case 'rectifier':
      return [Math.max(0, a), a > 0 ? 1 : 0];
    case 'q-update':
      return [1 + 0.9 * Math.max(a, b)];
    case 'surprise':
      return [b - a];
    case 'tree-search':
      return [0.7 + (a * 0.6 * Math.sqrt(22)) / 21, 0.4 + (a * 0.4 * Math.sqrt(22)) / 3];
    case 'representations':
      return [1, 1 + a, Math.hypot(1, 1 + a)];
    default:
      return [];
  }
}
export const digitTemplates = ['0111010001100011000101110', '0010001100001000010001110'].map((s) =>
  [...s].map(Number),
);
export const digitDistances = (pixels: number[]) =>
  digitTemplates.map((t) => t.reduce((sum, v, i) => sum + Math.abs(v - pixels[i]), 0));
/** Deterministic shuffling makes the illustration repeatable and resettable. */
export function replaySample(round: number) {
  const pool = Array.from({ length: 12 }, (_, i) => i + 1);
  let seed = (round + 1) * 7919;
  for (let i = pool.length - 1; i > 0; i--) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const j = seed % (i + 1);
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, 4);
}
