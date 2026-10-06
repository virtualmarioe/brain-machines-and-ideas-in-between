import { describe, expect, it } from 'vitest';
import {
  categorical,
  contrast,
  diverging,
  luminance,
  readableInk,
  scaleColor,
  sequential,
  signedColor,
  textOn,
} from '../lib/colors';

describe('scientific color scales', () => {
  it('keeps zero neutral and fixed limits symmetric even for asymmetric observations', () => {
    expect(signedColor(0, 1)).toBe(diverging[1]);
    expect(signedColor(-1, 1)).toBe(diverging[0]);
    expect(signedColor(1, 1)).toBe(diverging[2]);
    expect(signedColor(-0.2, 1)).toBe(signedColor(-0.4, 2));
    expect(signedColor(-3, 1)).toBe(diverging[0]);
    expect(signedColor(3, 1)).toBe(diverging[2]);
    expect(() => signedColor(1, 0)).toThrow(RangeError);
  });
  it('preserves monotonic luminance across the interpolated magnitude scale', () => {
    let previous = 1;
    for (let i = 0; i <= 100; i++) {
      const current = luminance(scaleColor(sequential, i / 100));
      expect(current).toBeLessThanOrEqual(previous);
      previous = current;
    }
  });
  it('keeps every category label readable on light and dark panels', () => {
    for (const color of Object.values(categorical)) {
      for (const background of ['#EFEFED', '#303030']) {
        expect(contrast(readableInk(color, background), background)).toBeGreaterThanOrEqual(5);
      }
    }
  });
  it('keeps numeric values readable across signed and sequential fills', () => {
    for (const scale of [diverging, sequential]) {
      for (let i = 0; i <= 100; i++) {
        const color = scaleColor(scale, i / 100);
        expect(contrast(textOn(color), color)).toBeGreaterThanOrEqual(4.5);
      }
    }
  });
});
