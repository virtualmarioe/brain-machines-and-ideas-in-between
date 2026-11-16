import { expect, it } from 'vitest';
import { atlasReturn } from '../lib/return-navigation';
it('preserves exploration state while adapting the return locale', () => {
  expect(
    atlasReturn('/en/architecture/transformers?level=connections&view=reading#reading-view', 'de'),
  ).toBe('/de/architecture/transformers?level=connections&view=reading#reading-view');
  expect(atlasReturn('/en?mode=story', 'es')).toBe('/es?mode=story');
});
it('rejects external URLs, non-atlas pages, and malformed destinations', () => {
  for (const path of [
    null,
    '//example.org/en',
    'https://example.org/en',
    '/en/about',
    '/en/research',
    '/en/research/other',
    '/xx',
    '/en/../../example',
    '/\\example.org',
    '/en/architecture/a/b',
  ])
    expect(atlasReturn(path, 'en')).toBe('/en');
});
