import { gebEntities, gebReferences, gebRelationships, gebClaims } from './geb';
import { initialEntities } from './entities/initial';
import { expansionEntities } from './entities/expansion';
import { initialReferences } from './references/initial';
import { expansionReferences } from './references/expansion';
import { initialRelationships } from './relationships/initial';
import { expansionRelationships } from './relationships/expansion';
import { claims as initialClaims } from './claims';
import { expansionClaims } from './expansion-claims';
export const entities = [...initialEntities, ...expansionEntities, ...gebEntities];
export const references = [...initialReferences, ...expansionReferences, ...gebReferences];
export const relationships = [
  ...initialRelationships,
  ...expansionRelationships,
  ...gebRelationships,
];
export const claims = [...initialClaims, ...expansionClaims, ...gebClaims];
export const entityById = new Map(entities.map((entity) => [entity.id, entity]));
export const referenceById = new Map(references.map((reference) => [reference.id, reference]));
