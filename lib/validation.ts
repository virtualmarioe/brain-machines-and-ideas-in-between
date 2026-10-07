import {
  locales,
  demoKinds,
  type Claim,
  type HistoricalEntity,
  type HistoricalRelationship,
  type Reference,
} from '../types/history';

const entityTypes = new Set([
  'person',
  'concept',
  'publication',
  'experiment',
  'institution',
  'location',
  'dataset',
  'algorithm',
  'architecture',
  'technology',
  'event',
  'field',
  'award',
]);
const domains = new Set(['neuroscience', 'mathematics', 'computing', 'learning', 'neuroai']);
const relationshipTypes = new Set([
  'direct-inspiration',
  'mathematical-formalization',
  'biological-inspiration',
  'methodological-enabler',
  'implementation',
  'dataset-dependency',
  'conceptual-analogy',
  'historical-context',
  'extension',
  'challenge',
]);
const referenceTypes = new Set(['paper', 'book', 'archive', 'website', 'nobel', 'review']);
const licenses = new Set(['public-domain', 'cc0', 'cc-by', 'cc-by-sa', 'custom']);
const isText = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

function validUrl(value: unknown): boolean {
  if (!isText(value) || /\s/.test(value)) return false;
  try {
    const url = new URL(value);
    return (
      ['http:', 'https:'].includes(url.protocol) &&
      Boolean(url.hostname) &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}

/** Catalog dates preserve available precision: YYYY, YYYY-MM or YYYY-MM-DD. */
function validDate(value: unknown, full = false): value is string {
  if (
    typeof value !== 'string' ||
    !(full ? /^\d{4}-\d{2}-\d{2}$/ : /^\d{4}(?:-\d{2}(?:-\d{2})?)?$/).test(value)
  )
    return false;
  const [year, month = 1, day = 1] = value.split('-').map(Number);
  if (year < 1 || month < 1 || month > 12 || day < 1) return false;
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day <= days[month - 1];
}

const dateOrder = (value: string) => {
  const [year, month = 1, day = 1] = value.split('-').map(Number);
  return year * 10000 + month * 100 + day;
};

/** Structural publication gate. It validates source links, not historical truth or remote availability. */
export function validateContent(
  entities: HistoricalEntity[],
  relationships: HistoricalRelationship[],
  references: Reference[],
  claims: Claim[] = [],
): string[] {
  const errors: string[] = [];
  const demoOwners = new Map<string, string>();
  const text = (value: unknown, path: string) => {
    if (!isText(value)) errors.push(`${path} must be a nonempty string.`);
  };
  const localized = (value: unknown, path: string) => {
    for (const locale of locales)
      text(isRecord(value) ? value[locale] : undefined, `${path}.${locale}`);
  };
  const enumeration = (value: unknown, values: Set<string>, path: string) => {
    if (typeof value !== 'string' || !values.has(value))
      errors.push(`${path} has an unsupported value.`);
  };
  const stringArray = (value: unknown, path: string, required = false): string[] => {
    if (!Array.isArray(value)) {
      errors.push(`${path} must be an array.`);
      return [];
    }
    if (required && !value.length) errors.push(`${path} must contain at least one entry.`);
    const seen = new Set<string>();
    value.forEach((item, index) => {
      text(item, `${path}[${index}]`);
      if (typeof item === 'string') {
        if (seen.has(item)) errors.push(`${path} contains duplicate entry "${item}".`);
        seen.add(item);
      }
    });
    return value.filter(isText);
  };
  const catalogIds = (items: unknown[], kind: string, key = 'id') => {
    const result = new Set<string>();
    items.forEach((item, index) => {
      const value = isRecord(item) ? item[key] : undefined;
      text(value, `${kind}[${index}].${key}`);
      if (isText(value)) {
        if (result.has(value)) errors.push(`Duplicate ${kind} ${key}: "${value}".`);
        result.add(value);
      }
    });
    return result;
  };
  if (!entities.length) errors.push('The entity catalog must not be empty.');
  if (!references.length) errors.push('The reference catalog must not be empty.');
  const entityIds = catalogIds(entities, 'entity');
  catalogIds(entities, 'entity', 'slug');
  const referenceIds = catalogIds(references, 'reference');
  catalogIds(relationships, 'relationship');
  catalogIds(claims, 'claim');
  const linkedReferences = (value: unknown, path: string) => {
    for (const id of stringArray(value, path, true))
      if (!referenceIds.has(id)) errors.push(`${path} points to missing reference "${id}".`);
  };
  const year = (value: unknown, path: string) => {
    if (typeof value !== 'number' || !Number.isInteger(value) || value < 1 || value > 9999)
      errors.push(`${path} must be an integer year from 1 to 9999.`);
  };
  const mediaIds = new Set<string>();

  references.forEach((reference, index) => {
    const path = `Reference "${reference?.id ?? index}"`;
    if (!isRecord(reference)) {
      errors.push(`${path} must be an object.`);
      return;
    }
    text(reference.title, `${path}.title`);
    enumeration(reference.type, referenceTypes, `${path}.type`);
    stringArray(reference.authors, `${path}.authors`, true);
    year(reference.year, `${path}.year`);
    if (!validUrl(reference.url))
      errors.push(`${path}.url must be an absolute HTTP(S) URL without credentials or whitespace.`);
    if (
      reference.doi !== undefined &&
      (!isText(reference.doi) || !/^10\.\d{4,9}\/\S+$/i.test(reference.doi))
    )
      errors.push(`${path}.doi must use the identifier format 10.<registrant>/<suffix>.`);
    if (!validDate(reference.accessedAt, true))
      errors.push(`${path}.accessedAt must be a real date in YYYY-MM-DD format.`);
    if (reference.notes !== undefined) text(reference.notes, `${path}.notes`);
  });

  entities.forEach((entity, index) => {
    const path = `Entity "${entity?.id ?? index}"`;
    if (!isRecord(entity)) {
      errors.push(`${path} must be an object.`);
      return;
    }
    if (isText(entity.slug) && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entity.slug))
      errors.push(`${path}.slug must contain lowercase words separated by single hyphens.`);
    enumeration(entity.type, entityTypes, `${path}.type`);
    enumeration(entity.domain, domains, `${path}.domain`);
    enumeration(
      entity.status,
      new Set(['verified', 'needs-review', 'historically-disputed']),
      `${path}.status`,
    );
    for (const field of ['title', 'shortDescription', 'description', 'technical'])
      localized(entity[field], `${path}.${field}`);
    if (entity.editorialNotes !== undefined)
      localized(entity.editorialNotes, `${path}.editorialNotes`);
    if (!validDate(entity.startDate))
      errors.push(`${path}.startDate must be a real date in YYYY, YYYY-MM or YYYY-MM-DD format.`);
    if (entity.endDate !== undefined) {
      if (!validDate(entity.endDate))
        errors.push(`${path}.endDate must be a real date in YYYY, YYYY-MM or YYYY-MM-DD format.`);
      else if (
        validDate(entity.startDate) &&
        dateOrder(entity.endDate) < dateOrder(entity.startDate)
      )
        errors.push(`${path}.endDate must not precede startDate.`);
    }
    stringArray(entity.people, `${path}.people`);
    stringArray(entity.tags, `${path}.tags`);
    linkedReferences(entity.references, `${path}.references`);
    if (entity.demo !== undefined) {
      enumeration(entity.demo, new Set(demoKinds), `${path}.demo`);
      const owner = demoOwners.get(entity.demo);
      if (owner)
        errors.push(
          `${path}.demo reuses ${entity.demo} from ${owner}. Each discovery needs a distinct demo.`,
        );
      else demoOwners.set(entity.demo, entity.id);
    }
    if (!Array.isArray(entity.locations)) errors.push(`${path}.locations must be an array.`);
    else
      entity.locations.forEach((location: unknown, locationIndex: number) => {
        const locationPath = `${path}.locations[${locationIndex}]`;
        if (!isRecord(location)) {
          errors.push(`${locationPath} must be an object.`);
          return;
        }
        text(location.name, `${locationPath}.name`);
        text(location.institution, `${locationPath}.institution`);
        if (
          typeof location.lat !== 'number' ||
          !Number.isFinite(location.lat) ||
          Math.abs(location.lat) > 90
        )
          errors.push(`${locationPath}.lat must be finite and between -90 and 90.`);
        if (
          typeof location.lon !== 'number' ||
          !Number.isFinite(location.lon) ||
          Math.abs(location.lon) > 180
        )
          errors.push(`${locationPath}.lon must be finite and between -180 and 180.`);
        if (location.year !== undefined) year(location.year, `${locationPath}.year`);
      });
    if (entity.nobel !== undefined) {
      if (!isRecord(entity.nobel)) errors.push(`${path}.nobel must be an object.`);
      else {
        year(entity.nobel.year, `${path}.nobel.year`);
        localized(entity.nobel.label, `${path}.nobel.label`);
        linkedReferences([entity.nobel.reference], `${path}.nobel.reference`);
      }
    }
    if (entity.media !== undefined) {
      if (!Array.isArray(entity.media)) errors.push(`${path}.media must be an array.`);
      else
        entity.media.forEach((media: unknown, mediaIndex: number) => {
          const mediaPath = `${path}.media[${mediaIndex}]`;
          if (!isRecord(media)) {
            errors.push(`${mediaPath} must be an object.`);
            return;
          }
          text(media.id, `${mediaPath}.id`);
          if (isText(media.id)) {
            if (mediaIds.has(media.id)) errors.push(`Duplicate media id: "${media.id}".`);
            mediaIds.add(media.id);
          }
          enumeration(media.type, new Set(['image', 'diagram']), `${mediaPath}.type`);
          enumeration(media.license, licenses, `${mediaPath}.license`);
          localized(media.alt, `${mediaPath}.alt`);
          localized(media.caption, `${mediaPath}.caption`);
          text(media.creator, `${mediaPath}.creator`);
          if (!validUrl(media.src) && !(isText(media.src) && /^\/(?!\/)[^\s]+$/.test(media.src)))
            errors.push(
              `${mediaPath}.src must be an absolute HTTP(S) URL or a site-relative path.`,
            );
          if (media.sourceUrl !== undefined && !validUrl(media.sourceUrl))
            errors.push(`${mediaPath}.sourceUrl must be an absolute HTTP(S) URL.`);
          if (media.attribution !== undefined) text(media.attribution, `${mediaPath}.attribution`);
          if (media.license === 'cc-by' || media.license === 'cc-by-sa') {
            text(media.attribution, `${mediaPath}.attribution`);
            if (!validUrl(media.sourceUrl))
              errors.push(`${mediaPath}.sourceUrl is required for attribution-licensed media.`);
          }
        });
    }
  });

  const connected = new Set<string>();
  relationships.forEach((relationship, index) => {
    const path = `Relationship "${relationship?.id ?? index}"`;
    if (!isRecord(relationship)) {
      errors.push(`${path} must be an object.`);
      return;
    }
    for (const endpoint of ['source', 'target'] as const)
      if (!isText(relationship[endpoint]) || !entityIds.has(relationship[endpoint]))
        errors.push(`${path}.${endpoint} points to a missing entity.`);
    if (relationship.source === relationship.target)
      errors.push(`${path} must connect distinct entities.`);
    else if (entityIds.has(relationship.source) && entityIds.has(relationship.target)) {
      connected.add(relationship.source);
      connected.add(relationship.target);
    }
    enumeration(relationship.type, relationshipTypes, `${path}.type`);
    enumeration(relationship.confidence, new Set(['high', 'medium', 'low']), `${path}.confidence`);
    if (relationship.disputed !== undefined && typeof relationship.disputed !== 'boolean')
      errors.push(`${path}.disputed must be boolean.`);
    localized(relationship.description, `${path}.description`);
    linkedReferences(relationship.evidence, `${path}.evidence`);
  });
  for (const id of entityIds)
    if (!connected.has(id))
      errors.push(`Entity "${id}" is an orphan: it has no relationship to another catalog entity.`);

  claims.forEach((claim, index) => {
    const path = `Claim "${claim?.id ?? index}"`;
    if (!isRecord(claim)) {
      errors.push(`${path} must be an object.`);
      return;
    }
    if (!isText(claim.entityId) || !entityIds.has(claim.entityId))
      errors.push(`${path}.entityId points to a missing entity.`);
    localized(claim.claim, `${path}.claim`);
    linkedReferences(claim.references, `${path}.references`);
    enumeration(claim.status, new Set(['verified', 'needs-review', 'disputed']), `${path}.status`);
    if (claim.editorialNotes !== undefined) text(claim.editorialNotes, `${path}.editorialNotes`);
  });
  return errors;
}
