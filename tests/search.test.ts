import { describe, expect, it } from 'vitest';
import { entities, references } from '../content';
import { normalize, searchEntities } from '../lib/search';
import type { HistoricalEntity } from '../types/history';

const sample: HistoricalEntity = {
  id: 'sample',
  slug: 'sample',
  type: 'concept',
  startDate: '1900',
  domain: 'neuroscience',
  status: 'verified',
  references: ['source'],
  title: { en: 'Cellular connections', de: 'Zelluläre Verbindungen', es: 'Conexiones celulares' },
  shortDescription: {
    en: 'Learning across cells',
    de: 'Lernen zwischen Zellen',
    es: 'Aprendizaje entre células',
  },
  description: {
    en: 'An anatomical account',
    de: 'Ein anatomischer Ansatz',
    es: 'Una explicación anatómica',
  },
  technical: { en: 'Spatial response', de: 'Räumliche Antwort', es: 'Respuesta espacial' },
  people: ['Santiago Ramón y Cajal'],
  locations: [{ name: 'Zürich', institution: 'Universität Zürich', lat: 47.37, lon: 8.54 }],
  tags: ['neuron-doctrine'],
};

describe('multilingual search', () => {
  it('normalizes accents, combining characters and case', () => {
    expect(normalize('RAMÓN')).toBe('ramon');
    expect(normalize('Ramo\u0301n')).toBe('ramon');
    expect(normalize('Zürich')).toBe('zurich');
  });
  it('matches the active locale and preserves canonical English title lookup', () => {
    expect(searchEntities([sample], 'zellulare', 'de')).toEqual([sample]);
    expect(searchEntities([sample], 'conexiones', 'es')).toEqual([sample]);
    expect(searchEntities([sample], 'cellular connections', 'de')).toEqual([sample]);
    expect(searchEntities([sample], 'cellular connections', 'es')).toEqual([sample]);
  });
  it('searches localized descriptions and technical text', () => {
    expect(searchEntities([sample], 'explicacion anatomica', 'es')).toEqual([sample]);
    expect(searchEntities([sample], 'raumliche antwort', 'de')).toEqual([sample]);
  });
  it('matches people, institutions, geographic names and tags', () => {
    for (const query of ['ramon cajal', 'universitat zurich', 'ZÜRICH', 'neuron-doctrine'])
      expect(searchEntities([sample], query, 'en')).toEqual([sample]);
  });
  it('requires every search term, even when terms span different fields', () => {
    expect(searchEntities([sample], 'Cajal  anatomica', 'es')).toEqual([sample]);
    expect(searchEntities([sample], 'Cajal absent', 'es')).toEqual([]);
  });
  it('returns all entities for empty input without mutating source order', () => {
    const source = [sample, { ...sample, id: 'other', slug: 'other' }];
    expect(searchEntities(source, ' \n\t ', 'en')).toEqual(source);
    expect(source.map((item) => item.id)).toEqual(['sample', 'other']);
  });
  it('finds people and institutions in the real catalog without accents', () => {
    expect(searchEntities(entities, 'ramon cajal', 'en').map((item) => item.id)).toContain('cajal');
    expect(searchEntities(entities, 'barcelona', 'es').map((item) => item.id)).toContain('cajal');
    expect(searchEntities(entities, 'perzeptron', 'de').map((item) => item.id)).toContain(
      'perceptron',
    );
  });
});

it('finds discoveries through original publication titles and DOI metadata', () => {
  const source = references.find((reference) => reference.id === 'fukushima-1980')!;
  expect(
    searchEntities(entities, source.doi!, 'en', references).some(
      (entity) => entity.id === 'neocognitron',
    ),
  ).toBe(true);
});

it('finds GEB through its people, themes, and publication city in every locale', () => {
  for (const locale of ['en', 'de', 'es'] as const)
    for (const query of [
      'GEB',
      'Godel',
      'Escher',
      'Johann Sebastian Bach',
      'strange loops',
      'New York',
    ])
      expect(
        searchEntities(entities, query, locale, references).map((entity) => entity.id),
      ).toContain('godel-escher-bach');
  expect(searchEntities(entities, 'Douglas Hofstadter', 'en').map((entity) => entity.id)).toContain(
    'douglas-hofstadter',
  );
});
