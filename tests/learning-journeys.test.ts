import { describe, expect, it } from 'vitest';
import { entities, references, claims, relationships } from '../content';
import { learningJourneys } from '../content/learning-journeys';
import { researchReviews, reviewedEdges } from '../content/research/reviews';
import { researchCatalog } from '../content/research';
import { explorationUrl, parseExploration } from '../lib/exploration';

describe('curated learning journeys', () => {
  it('uses real discoveries and complete localized teaching prompts', () => {
    expect(new Set(learningJourneys.map((journey) => journey.id)).size).toBe(3);
    for (const journey of learningJourneys) {
      expect(journey.stops).toHaveLength(5);
      for (const stop of journey.stops) {
        expect(entities.some((entity) => entity.id === stop.entityId)).toBe(true);
        for (const locale of ['en', 'de', 'es'] as const) {
          expect(stop.question[locale].length).toBeGreaterThan(20);
          expect(stop.takeaway[locale].length).toBeGreaterThan(20);
        }
      }
    }
  });
  it('roundtrips progress and rejects invalid journey IDs and steps', () => {
    const state = parseExploration(
      new URLSearchParams('journey=rules-and-learning&step=3&level=connections'),
      'es',
      entities,
      'backpropagation',
    );
    expect(state).toMatchObject({ journey: 'rules-and-learning', journeyStep: 3 });
    const url = explorationUrl(state, entities);
    expect(
      parseExploration(new URLSearchParams(url.split('?')[1]), 'es', entities, state.selected),
    ).toMatchObject({ journey: state.journey, journeyStep: 3 });
    expect(
      parseExploration(new URLSearchParams('journey=unknown&step=99'), 'en', entities).journey,
    ).toBeUndefined();
    for (const [step, expected] of [
      ['-7', 0],
      ['999', 4],
      ['NaN', 0],
      ['1.4', 0],
    ]) {
      expect(
        parseExploration(
          new URLSearchParams(`journey=rules-and-learning&step=${step}`),
          'en',
          entities,
        ).journeyStep,
      ).toBe(expected);
    }
  });
});

describe('scoped source reviews', () => {
  it('attaches specific evidence and preserves uncertainty outside reviewed claims', () => {
    for (const review of researchReviews) {
      expect(researchCatalog.concepts.some(([id]) => id === review.catalogId)).toBe(true);
      expect(review.locator).toBeTruthy();
      expect(review.limitation.length).toBeGreaterThan(30);
      expect(references.some((reference) => reference.id === review.reference.id)).toBe(true);
      const claim = claims.find((item) => item.id === `review-claim-${review.catalogId}`)!;
      expect(claim.status).toBe('verified');
      const entity = entities.find((item) => item.id === claim.entityId)!;
      expect(entity.references).toContain(review.reference.id);
      expect(entity.status).toBe('needs-review');
    }
    for (const review of reviewedEdges) {
      const edge = relationships.find((item) => item.description.en === review.claim)!;
      expect(edge.confidence).toBe('medium');
      expect(edge.evidence).not.toContain('research-dossier-2026');
    }
  });
});
