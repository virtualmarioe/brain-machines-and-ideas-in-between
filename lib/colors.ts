/** Shared scientific palette. Category hues and data scales never depend on the UI theme. */
export const categorical = {
  blue: '#3267A8',
  teal: '#2F8F83',
  orange: '#E08B3E',
  violet: '#8064B2',
  coral: '#D45D61',
  green: '#65A765',
  gold: '#D8B343',
  azure: '#4C8BCB',
  magenta: '#C15A9D',
} as const;
export const neutral = {
  black: '#000000',
  text: '#252525',
  secondary: '#666666',
  reference: '#8A8A87',
  inactive: '#A7A7A4',
  light: '#D8D8D4',
  grid: '#E2E2DE',
  panel: '#F7F7F5',
  figure: '#FFFFFF',
  darkBackground: '#191919',
  darkSurface: '#222222',
  darkElevated: '#2C2C2C',
  darkBorder: '#555555',
} as const;
export const sequential = [
  '#EEF5F7',
  '#D5E9E9',
  '#B9DCDD',
  '#92CDC9',
  '#74BDB8',
  '#51A7A1',
  '#348F89',
  '#26767A',
  '#145E64',
] as const;
export const diverging = ['#2F6FB0', '#F3F3F1', '#D65F5F'] as const;
export const domainColors = {
  computing: categorical.blue,
  neuroscience: categorical.teal,
  mathematics: categorical.orange,
  learning: categorical.violet,
  neuroai: categorical.coral,
} as const;
const rgb = (hex: string) =>
  [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16) / 255);
const linear = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const encoded = (v: number) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);
const hex = (values: number[]) =>
  '#' +
  values
    .map((v) =>
      Math.round(Math.max(0, Math.min(1, v)) * 255)
        .toString(16)
        .padStart(2, '0'),
    )
    .join('');
export function luminance(color: string) {
  const [r, g, b] = rgb(color).map(linear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function contrast(a: string, b: string) {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + 0.05) / (values[1] + 0.05);
}
export function textOn(background: string) {
  if (contrast(neutral.text, background) >= 4.5) return neutral.text;
  return contrast(neutral.black, background) >= contrast(neutral.figure, background)
    ? neutral.black
    : neutral.figure;
}
export function readableInk(color: string, background: string) {
  const target = rgb(luminance(background) > 0.5 ? '#000000' : '#FFFFFF');
  const source = rgb(color);
  for (let step = 0; step <= 100; step++) {
    const candidate = hex(source.map((v, i) => v + ((target[i] - v) * step) / 100));
    if (contrast(candidate, background) >= 5) return candidate;
  }
  return hex(target);
}
function toOklab(color: string) {
  const [r, g, b] = rgb(color).map(linear);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}
function fromOklab([L, a, b]: number[]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return hex(
    [
      4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ].map(encoded),
  );
}
/** Piecewise interpolation in Oklab, clamped to the declared scale. */
export function scaleColor(stops: readonly string[], fraction: number) {
  const position =
    Math.max(0, Math.min(1, Number.isFinite(fraction) ? fraction : 0)) * (stops.length - 1);
  const index = Math.min(Math.floor(position), stops.length - 2);
  const t = position - index;
  if (t === 0) return stops[index];
  if (t === 1) return stops[index + 1];
  const a = toOklab(stops[index]);
  const b = toOklab(stops[index + 1]);
  return fromOklab(a.map((v, i) => v + (b[i] - v) * t));
}
export function signedColor(value: number, limit: number) {
  if (!(limit > 0) || !Number.isFinite(limit))
    throw new RangeError('A signed scale needs a finite positive limit.');
  return scaleColor(diverging, (value / limit + 1) / 2);
}
export const scientificColorVariables: Record<string, string> = Object.fromEntries([
  ...Object.entries(categorical).flatMap(([name, color]) => [
    [`--palette-${name}`, color],
    [
      `--ink-${name}`,
      `light-dark(${readableInk(color, '#EFEFED')}, ${readableInk(color, '#303030')})`,
    ],
  ]),
  ...Object.entries(domainColors).flatMap(([name, color]) => [
    [`--category-${name}`, color],
    [
      `--category-${name}-ink`,
      `light-dark(${readableInk(color, '#EFEFED')}, ${readableInk(color, '#303030')})`,
    ],
  ]),
  ...Object.entries(neutral).map(([name, color]) => [`--neutral-${name}`, color]),
  ['--signed-gradient', `linear-gradient(90deg in oklab, ${diverging.join(', ')})`],
  ['--magnitude-gradient', `linear-gradient(90deg in oklab, ${sequential.join(', ')})`],
]);
