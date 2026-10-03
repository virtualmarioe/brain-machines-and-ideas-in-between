import { describe, expect, it } from 'vitest';
import { entities, references, relationships, claims } from '../content';
import { validateContent } from '../lib/validation';
import type {
  Claim,
  HistoricalEntity,
  HistoricalRelationship,
  LocalizedText,
  MediaAsset,
  Reference,
} from '../types/history';

const t = (text: string): LocalizedText => ({
  en: text,
  de: `${text} Deutsch`,
  es: `${text} español`,
});
const entity = (id: string): HistoricalEntity => ({
  id,
  slug: id,
  type: 'concept',
  title: t('Title'),
  shortDescription: t('Summary'),
  description: t('Description'),
  technical: t('Technical'),
  startDate: '1950',
  domain: 'learning',
  locations: [{ name: 'Berlin', institution: 'University', lat: 52.52, lon: 13.4 }],
  people: ['A researcher'],
  references: ['source'],
  tags: ['learning'],
  status: 'verified',
});
const reference = (): Reference => ({
  id: 'source',
  type: 'paper',
  title: 'A publication',
  authors: ['An author'],
  year: 1950,
  url: 'https://example.org/paper',
  doi: '10.1234/example.1950',
  accessedAt: '2026-10-02',
});
const edge = (): HistoricalRelationship => ({
  id: 'a-b',
  source: 'a',
  target: 'b',
  type: 'extension',
  description: t('A documented extension'),
  evidence: ['source'],
  confidence: 'high',
});
const claim = (): Claim => ({
  id: 'claim',
  entityId: 'a',
  claim: t('A claim'),
  references: ['source'],
  status: 'verified',
});
const media = (): MediaAsset => ({
  id: 'diagram',
  type: 'diagram',
  src: '/images/diagram.svg',
  alt: t('Diagram of a unit'),
  caption: t('Conceptual diagram'),
  creator: 'Atlas editorial team',
  license: 'custom',
});
const fixture = (): [HistoricalEntity[], HistoricalRelationship[], Reference[], Claim[]] => [
  [entity('a'), entity('b')],
  [edge()],
  [reference()],
  [claim()],
];

describe('published catalog', () => {
  it('has complete translations and structurally traceable entities, relationships and claims', () => {
    expect(validateContent(entities, relationships, references, claims)).toEqual([]);
  });
  it('includes all three required scientific demonstrations', () => {
    const demos = new Set(entities.flatMap((item) => (item.demo ? [item.demo] : [])));
    for (const kind of ['perceptron', 'convolution', 'backpropagation'] as const)
      expect(demos.has(kind)).toBe(true);
  });
});

describe('content publication gate', () => {
  it('accepts a complete catalog and known-license original media', () => {
    const data = fixture();
    data[0][0].media = [media()];
    expect(validateContent(...data)).toEqual([]);
  });
  it('accepts partial date precision and real leap days', () => {
    const data = fixture();
    data[0][0].startDate = '2000-02-29';
    data[0][0].endDate = '2001-03';
    data[0][1].startDate = '1900-02';
    expect(validateContent(...data)).toEqual([]);
  });
  it.each(['entity', 'slug', 'reference', 'relationship', 'claim'] as const)(
    'rejects duplicate %s identifiers',
    (kind) => {
      const data = fixture();
      if (kind === 'entity') data[0][1].id = 'a';
      if (kind === 'slug') data[0][1].slug = 'a';
      if (kind === 'reference') data[2].push(reference());
      if (kind === 'relationship') data[1].push(edge());
      if (kind === 'claim') data[3].push(claim());
      expect(validateContent(...data).some((error) => error.startsWith('Duplicate'))).toBe(true);
    },
  );
  it('rejects missing and whitespace-only translated fields', () => {
    const data = fixture();
    data[0][0].description.de = '   ';
    delete (data[0][0].title as Partial<LocalizedText>).es;
    expect(validateContent(...data)).toEqual(
      expect.arrayContaining([
        expect.stringContaining('description.de'),
        expect.stringContaining('title.es'),
      ]),
    );
  });
  it('validates translated relationship, claim and award text', () => {
    const data = fixture();
    data[1][0].description.es = '';
    data[3][0].claim.de = '';
    data[0][0].nobel = { year: 1906, reference: 'source', label: { ...t('Prize'), en: '' } };
    expect(validateContent(...data)).toEqual(
      expect.arrayContaining([
        expect.stringContaining('description.es'),
        expect.stringContaining('claim.de'),
        expect.stringContaining('nobel.label.en'),
      ]),
    );
  });
  it('rejects empty references and dangling entity/edge/claim citations', () => {
    const data = fixture();
    data[0][0].references = [];
    data[0][1].references = ['missing-entity-source'];
    data[1][0].evidence = ['missing-edge-source'];
    data[3][0].references = ['missing-claim-source'];
    const errors = validateContent(...data);
    expect(errors).toEqual(
      expect.arrayContaining([
        expect.stringContaining('at least one entry'),
        expect.stringContaining('missing-entity-source'),
        expect.stringContaining('missing-edge-source'),
        expect.stringContaining('missing-claim-source'),
      ]),
    );
  });
  it('rejects duplicate citation entries and missing edge evidence', () => {
    const data = fixture();
    data[0][0].references = ['source', 'source'];
    data[1][0].evidence = [];
    expect(validateContent(...data)).toEqual(
      expect.arrayContaining([
        expect.stringContaining('duplicate entry'),
        expect.stringContaining('.evidence must contain'),
      ]),
    );
  });
  it.each([
    'not-a-url',
    'javascript:alert(1)',
    'https://example.org/a b',
    'https://user:password@example.org',
  ])('rejects unsafe or malformed reference URL %s', (url) => {
    const data = fixture();
    data[2][0].url = url;
    expect(validateContent(...data).some((error) => error.includes('.url'))).toBe(true);
  });
  it.each(['https://doi.org/10.1234/example', '10.1/example', '10.1234/', '10.1234/white space'])(
    'rejects malformed DOI %s',
    (doi) => {
      const data = fixture();
      data[2][0].doi = doi;
      expect(validateContent(...data).some((error) => error.includes('.doi'))).toBe(true);
    },
  );
  it.each(['1900-02-29', '2001-04-31', '2000-13', '0000', '02/01/1950', '1950-00-01'])(
    'rejects impossible or ambiguous historical date %s',
    (date) => {
      const data = fixture();
      data[0][0].startDate = date;
      expect(validateContent(...data).some((error) => error.includes('.startDate'))).toBe(true);
    },
  );
  it('rejects reversed date intervals and incomplete source access dates', () => {
    const data = fixture();
    data[0][0].endDate = '1949';
    data[2][0].accessedAt = '2026-10';
    expect(validateContent(...data)).toEqual(
      expect.arrayContaining([
        expect.stringContaining('endDate must not precede'),
        expect.stringContaining('.accessedAt'),
      ]),
    );
  });
  it('rejects out-of-range and nonfinite geographic coordinates', () => {
    const data = fixture();
    data[0][0].locations[0].lat = 91;
    data[0][0].locations[0].lon = Number.NaN;
    data[0][1].locations[0].lon = -181;
    const errors = validateContent(...data);
    expect(errors.filter((error) => error.includes('.lat') || error.includes('.lon'))).toHaveLength(
      3,
    );
  });
  it('rejects unresolved edge endpoints and orphan nodes', () => {
    const data = fixture();
    data[1][0].target = 'absent';
    expect(validateContent(...data)).toEqual(
      expect.arrayContaining([
        expect.stringContaining('.target points to a missing entity'),
        expect.stringContaining('Entity "a" is an orphan'),
        expect.stringContaining('Entity "b" is an orphan'),
      ]),
    );
  });
  it('does not mistake a self-edge for a connection to the catalog', () => {
    const data = fixture();
    data[1][0].target = 'a';
    expect(validateContent(...data)).toEqual(
      expect.arrayContaining([
        expect.stringContaining('must connect distinct entities'),
        expect.stringContaining('Entity "a" is an orphan'),
      ]),
    );
  });
  it('rejects unknown media licenses, empty alt text and missing attribution', () => {
    const data = fixture();
    const first = media();
    first.license = 'unknown';
    first.alt.de = '';
    const second = { ...media(), id: 'licensed-image', license: 'cc-by' as const };
    data[0][0].media = [first, second];
    expect(validateContent(...data)).toEqual(
      expect.arrayContaining([
        expect.stringContaining('.license'),
        expect.stringContaining('.alt.de'),
        expect.stringContaining('.attribution'),
        expect.stringContaining('.sourceUrl'),
      ]),
    );
  });
  it('rejects missing claim entities and unsupported editorial states', () => {
    const data = fixture();
    data[3][0].entityId = 'absent';
    data[3][0].status = 'approved' as Claim['status'];
    expect(validateContent(...data)).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Claim "claim".entityId'),
        expect.stringContaining('Claim "claim".status'),
      ]),
    );
  });
  it('reports malformed nested objects without throwing', () => {
    const data = fixture();
    data[0][0].locations = [null] as unknown as HistoricalEntity['locations'];
    data[0][0].title = null as unknown as LocalizedText;
    data[0][0].media = [null] as unknown as MediaAsset[];
    expect(() => validateContent(...data)).not.toThrow();
    expect(validateContent(...data).length).toBeGreaterThanOrEqual(5);
  });
});
