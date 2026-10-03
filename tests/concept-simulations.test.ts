import { describe, expect, it } from 'vitest';
import { entities } from '../content';
import { conceptDemoKinds, demoKinds, locales } from '../types/history';
import { conceptDemoCopy, conceptLabels } from '../content/translations/concept-demos';
import {
  attentionWeights,
  binaryEntropy,
  discountedReturn,
  feedbackTrajectory,
  hingeDistance,
  membraneBalance,
  memoryEnergy,
  memoryWeights,
  recallSweep,
  temporalDifference,
} from '../lib/concept-simulations';

describe('concept simulation mathematics', () => {
  it('has maximum binary uncertainty for balanced outcomes and none at the endpoints', () => {
    expect(binaryEntropy(0)).toBe(0);
    expect(binaryEntropy(1)).toBe(0);
    expect(binaryEntropy(0.5)).toBe(1);
    expect(binaryEntropy(0.2)).toBeCloseTo(binaryEntropy(0.8), 12);
    expect(binaryEntropy(0.1)).toBeLessThan(binaryEntropy(0.4));
    expect(() => binaryEntropy(1.1)).toThrow();
  });
  it('normalizes attention stably and approaches a flatter mixture with higher temperature', () => {
    const sharp = attentionWeights([1000, 1001, 999], 0.25);
    const soft = attentionWeights([1000, 1001, 999], 3);
    expect(sharp.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 12);
    expect(sharp[1]).toBeGreaterThan(soft[1]);
    expect(attentionWeights([1, 2, 0], 1)).toEqual(attentionWeights([1000, 1001, 999], 1));
    expect(attentionWeights([7, 7, 7], 1)).toEqual([1 / 3, 1 / 3, 1 / 3]);
    expect(() => attentionWeights([1, 2], 0)).toThrow();
  });
  it('updates value toward the target for positive and negative reward errors', () => {
    expect(temporalDifference(0.5, 1, 0, 0.9, 0.25)).toEqual({
      target: 1,
      error: 0.5,
      updated: 0.625,
    });
    expect(temporalDifference(0.5, -1, 0, 0.9, 0.25)).toEqual({
      target: -1,
      error: -1.5,
      updated: 0.125,
    });
    expect(temporalDifference(0.5, 0, 2, 0.9, 0.25).target).toBeCloseTo(1.8);
    let estimate = 0.5;
    for (let i = 0; i < 100; i++) estimate = temporalDifference(estimate, 1, 0, 0.9, 0.25).updated;
    expect(estimate).toBeCloseTo(1, 10);
  });
  it('changes the preferred route when future outcomes are discounted', () => {
    expect(discountedReturn([2, 0], 0.1)).toBeGreaterThan(discountedReturn([0, 5], 0.1));
    expect(discountedReturn([2, 0], 0.8)).toBeLessThan(discountedReturn([0, 5], 0.8));
    expect(discountedReturn([2, 0], 0.4)).toEqual(discountedReturn([0, 5], 0.4));
  });
  it('corrects gently, overshoots, or oscillates according to feedback gain', () => {
    const gentle = feedbackTrajectory(0.5);
    expect(gentle.at(-1)).toBeCloseTo(1, 3);
    expect(gentle.every((value, i) => i === 0 || value >= gentle[i - 1])).toBe(true);
    expect(feedbackTrajectory(1.5)[1]).toBeGreaterThan(1);
    expect(feedbackTrajectory(2, 1, 4)).toEqual([0, 2, 0, 2, 0]);
    expect(feedbackTrajectory(0, 1, 3)).toEqual([0, 0, 0, 0]);
  });
  it('preserves Hopfield symmetry, restores a lightly corrupted cue and never raises energy', () => {
    const pattern = [1, -1, -1, 1, 1, -1, -1, 1, 1, 1, 1, 1, 1, -1, -1, 1];
    const weights = memoryWeights(pattern);
    weights.forEach((row, i) => row.forEach((w, j) => expect(w).toBe(weights[j][i])));
    weights.forEach((row, i) => expect(row[i]).toBe(0));
    const cue = pattern.map((v, i) => (i === 5 || i === 12 ? -v : v));
    expect(recallSweep(cue, weights)).toEqual(pattern);
    for (let mask = 0; mask < 256; mask++) {
      const damaged = pattern.map((v, i) => (i < 8 && mask & (1 << i) ? -v : v));
      const recalled = recallSweep(damaged, weights);
      expect(memoryEnergy(recalled, weights)).toBeLessThanOrEqual(
        memoryEnergy(damaged, weights) + 1e-10,
      );
    }
    expect(
      recallSweep(
        pattern.map((v) => -v),
        weights,
      ),
    ).toEqual(pattern.map((v) => -v));
  });
  it('satisfies simple geometry and conductance balance', () => {
    expect(hingeDistance(0)).toBeCloseTo(0, 12);
    expect(hingeDistance(60)).toBeCloseTo(1, 12);
    expect(hingeDistance(180)).toBeCloseTo(2, 12);
    expect(membraneBalance(0, 0)).toBeCloseTo(-54.4, 10);
    expect(membraneBalance(3, 0)).toBeGreaterThan(membraneBalance(0.1, 0));
    expect(membraneBalance(0, 3)).toBeLessThan(membraneBalance(0, 0.1));
    for (const na of [0, 0.1, 1, 3])
      for (const k of [0, 0.1, 1, 3]) {
        const voltage = membraneBalance(na, k);
        expect(na * (voltage - 50) + k * (voltage + 77) + 0.3 * (voltage + 54.4)).toBeCloseTo(
          0,
          10,
        );
      }
  });
});

describe('published demonstration coverage', () => {
  it('connects every registered lab to an entity and leaves historical events unforced', () => {
    expect(new Set(entities.flatMap((e) => (e.demo ? [e.demo] : [])))).toEqual(new Set(demoKinds));
    expect(entities.filter((e) => e.demo)).toHaveLength(33);
    expect(
      entities
        .filter((e) => !e.demo)
        .map((e) => e.id)
        .sort(),
    ).toEqual(['ai-winters', 'dartmouth']);
  });
  it('provides complete localized explanations and control labels', () => {
    for (const kind of conceptDemoKinds)
      for (const locale of locales) {
        expect(conceptDemoCopy[kind].title[locale].length).toBeGreaterThan(5);
        expect(conceptDemoCopy[kind].intro[locale].length).toBeGreaterThan(20);
        expect(conceptDemoCopy[kind].note[locale].length).toBeGreaterThan(20);
      }
    for (const locale of locales) {
      expect(Object.keys(conceptLabels[locale]).sort()).toEqual(
        Object.keys(conceptLabels.en).sort(),
      );
      expect(Object.values(conceptLabels[locale]).every((s) => s.trim().length > 0)).toBe(true);
      expect(conceptLabels[locale].sentence.split(' ')).toHaveLength(6);
    }
  });
});
