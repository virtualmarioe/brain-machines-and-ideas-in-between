import { entities, relationships, references, claims } from '../content';
import { validateContent } from '../lib/validation';

const errors = validateContent(entities, relationships, references, claims);
if (errors.length) {
  console.error(`Content validation failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(
    `Content valid: ${entities.length} entities, ${relationships.length} relationships, ${references.length} references, ${claims.length} claims; all locale fields populated (${entities.filter((entity) => entity.research).length} research records retain their labeled English original).`,
  );
}
