import { describe, expect, it } from 'vitest';
import {
  correlateValid,
  decisionBoundary,
  forwardAndBackward,
  lineFilters,
  lineStimulus,
  perceptron,
  trainStep,
} from '../lib/simulations';

describe('threshold unit', () => {
  it('uses the weighted sum and consistently assigns the threshold to class 1', () => {
    expect(perceptron(0.5, -0.5, 2, 1, -0.5)).toEqual({ activation: 0, prediction: 1 });
    expect(perceptron(0.5, -0.5, 2, 1, -0.6).prediction).toBe(0);
  });
  it('clips vertical and horizontal boundaries without division by zero', () => {
    expect(decisionBoundary(1, 0, -0.5)).toEqual([
      { x: 0.5, y: -1 },
      { x: 0.5, y: 1 },
    ]);
    expect(decisionBoundary(0, 1, 0.5)).toEqual([
      { x: -1, y: -0.5 },
      { x: 1, y: -0.5 },
    ]);
    expect(decisionBoundary(0, 0, 0)).toEqual([]);
    expect(decisionBoundary(1, 1, 3)).toEqual([]);
  });
  it('returns endpoints on the actual decision boundary', () => {
    for (const point of decisionBoundary(0.7, -1.2, 0.3))
      expect(0.7 * point.x - 1.2 * point.y + 0.3).toBeCloseTo(0, 12);
  });
});

describe('filtering and orientation', () => {
  it('computes actual valid cross-correlation without reversing the kernel', () => {
    expect(
      correlateValid(
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
        ],
        [
          [1, 0],
          [0, -1],
        ],
      ),
    ).toEqual([
      [-4, -4],
      [-4, -4],
    ]);
  });
  it('rejects malformed or oversized kernels', () => {
    expect(() => correlateValid([[1], [1, 2]], [[1]])).toThrow();
    expect(() => correlateValid([[1]], [[1, 2]])).toThrow();
    expect(() => correlateValid([], [[1]])).toThrow();
  });
  it('rejects uniform brightness and responds most strongly to the matching line', () => {
    const uniform = Array.from({ length: 7 }, () => Array(7).fill(1));
    for (const kernel of Object.values(lineFilters))
      for (const row of correlateValid(uniform, kernel))
        for (const value of row) expect(value).toBeCloseTo(0, 12);
    const vertical = lineStimulus(90);
    const horizontal = lineStimulus(0);
    expect(correlateValid(vertical, lineFilters.vertical)[2][2]).toBeGreaterThan(
      correlateValid(horizontal, lineFilters.vertical)[2][2],
    );
    expect(correlateValid(vertical, lineFilters.vertical)[2][2]).toBeCloseTo(
      correlateValid(horizontal, lineFilters.horizontal)[2][2],
      12,
    );
    expect(correlateValid(lineStimulus(45), lineFilters.diagonal)[2][2]).toBeGreaterThan(
      correlateValid(lineStimulus(135), lineFilters.diagonal)[2][2],
    );
  });
  it('produces a five-by-five output from a seven-by-seven stimulus and three-by-three kernel', () => {
    const result = correlateValid(lineStimulus(20), lineFilters.horizontal);
    expect(result).toHaveLength(5);
    expect(result.every((row) => row.length === 5)).toBe(true);
  });
});

describe('backpropagation', () => {
  it('matches both analytic gradients against an independent finite-difference derivative', () => {
    const state = { input: 0.8, target: 0.7, w1: 0.6, w2: -0.4 };
    const result = forwardAndBackward(state);
    const epsilon = 1e-6;
    for (const [weight, gradient] of [
      ['w1', result.gradW1],
      ['w2', result.gradW2],
    ] as const) {
      const positive = forwardAndBackward({ ...state, [weight]: state[weight] + epsilon }).loss;
      const negative = forwardAndBackward({ ...state, [weight]: state[weight] - epsilon }).loss;
      expect(gradient).toBeCloseTo((positive - negative) / (2 * epsilon), 8);
    }
  });
  it('reduces loss with repeated steps from the displayed default state', () => {
    let state = { input: 0.8, target: 0.7, w1: 0.6, w2: -0.4 };
    const initialLoss = forwardAndBackward(state).loss;
    for (let i = 0; i < 100; i += 1) {
      const step = trainStep(state, 0.2);
      expect(step.after.loss).toBeLessThanOrEqual(step.before.loss);
      state = step.state;
    }
    expect(forwardAndBackward(state).loss).toBeLessThan(initialLoss / 100);
  });
  it('backtracks an overly large step and reports the step size actually used', () => {
    const step = trainStep({ input: 1, target: -1, w1: 0.5, w2: 3 }, 100);
    expect(step.effectiveRate).toBeLessThan(100);
    expect(step.after.loss).toBeLessThan(step.before.loss);
    expect(step.state.w1).toBeCloseTo(0.5 - step.effectiveRate * step.before.gradW1, 12);
  });
  it('keeps a zero-gradient network stable and rejects invalid learning rates', () => {
    const state = { input: 1, target: 1, w1: 0, w2: 0 };
    expect(trainStep(state, 1).state).toEqual(state);
    expect(() => trainStep(state, 0)).toThrow();
  });
});
