import { describe, expect, it } from 'vitest';
import { entities } from '../content';
import { experimentChallenges } from '../content/experiment-challenges';
import { recentIds } from '../components/exploration/RecentDiscoveries';
import { explorationUrl, parseExploration } from '../lib/exploration';
import { attentionWeights, binaryEntropy } from '../lib/concept-simulations';
import { forwardAndBackward, perceptron } from '../lib/simulations';

describe('learning experience state', () => {
  it('round trips focused reading alongside filters and journey progress', () => {
    const state = parseExploration(
      new URLSearchParams('view=reading&level=expert&journey=neurons-to-networks&step=2&q=hebb'),
      'de',
      entities,
      'hebb',
    );
    const url = new URL(explorationUrl(state, entities), 'https://atlas.example');
    expect(parseExploration(url.searchParams, 'de', entities, 'hebb')).toEqual(state);
    expect(
      parseExploration(new URLSearchParams('view=unknown'), 'en', entities).view,
    ).toBeUndefined();
  });
  it('restores lab links only for discoveries with an existing demonstration', () => {
    const state = parseExploration(new URLSearchParams('lab=1'), 'en', entities, 'perceptron');
    expect(state.lab).toBe(true);
    expect(explorationUrl(state, entities)).toContain('lab=1');
    const textOnly = entities.find((entity) => !entity.demo)!;
    expect(
      parseExploration(new URLSearchParams('lab=1'), 'en', entities, textOnly.id).lab,
    ).toBeUndefined();
  });
  it('rejects malformed persisted history and bounds valid unique records', () => {
    for (const value of ['null', '{', '{}', '42', '"perceptron"'])
      expect(recentIds(value)).toEqual([]);
    expect(recentIds('["perceptron",null,4,"missing","perceptron","hebb"]')).toEqual([
      'perceptron',
      'hebb',
    ]);
    expect(recentIds(JSON.stringify(entities.map((entity) => entity.id)))).toHaveLength(6);
  });
  it('only offers complete localized challenges for existing experiments', () => {
    for (const [kind, challenge] of Object.entries(experimentChallenges)) {
      expect(entities.some((entity) => entity.demo === kind)).toBe(true);
      expect(challenge.answer).toBeGreaterThanOrEqual(0);
      expect(challenge.answer).toBeLessThan(challenge.options.length);
      for (const locale of ['en', 'de', 'es'] as const) {
        for (const value of [
          challenge.question,
          challenge.explanation,
          challenge.experiment,
          ...challenge.options,
        ])
          expect(value[locale].trim().length).toBeGreaterThan(0);
      }
    }
  });
  it('supports checkpoint explanations with actual model behavior', () => {
    const weights = attentionWeights([0, 0, 0], 1);
    weights.forEach((weight) => expect(weight).toBeCloseTo(1 / 3));
    expect(weights[0] - weights[2]).toBeCloseTo(0);
    expect(binaryEntropy(0.5)).toBe(1);
    expect(binaryEntropy(0.1)).toBeCloseTo(binaryEntropy(0.9));
    const result = forwardAndBackward({ input: 0, target: 1, w1: 2, w2: 3 });
    expect(result.prediction).toBe(0);
    expect(Math.abs(result.gradW1)).toBe(0);
    expect(Math.abs(result.gradW2)).toBe(0);
    expect(perceptron(0.55, 0.35, 1, -0.7, -1).prediction).toBe(0);
    expect(perceptron(0.55, 0.35, 1, -0.7, 1).prediction).toBe(1);
  });
});
