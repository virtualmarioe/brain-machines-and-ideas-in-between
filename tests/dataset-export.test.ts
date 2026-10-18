import { describe, expect, it } from 'vitest';
import { csv, graphml, stableJson } from '../scripts/export-dataset';
import { entities, relationships } from '../content';

describe('archival serialization', () => {
  it('orders nested object keys without changing ordered arrays', () => {
    expect(stableJson({ z: [{ b: 2, a: 1 }], a: 'é' })).toBe('{"a":"é","z":[{"a":1,"b":2}]}');
  });
  it('preserves quotes, commas, newlines, Unicode, nested fields and optional columns', () => {
    expect(
      csv([
        { id: 'é,"\n', tags: ['a', 'b'] },
        { id: '2', optional: false },
      ]),
    ).toBe('"id","optional","tags"\r\n"é,""\n","","[""a"",""b""]"\r\n"2","false",""\r\n');
  });
  it('escapes payloads and retains distinct parallel relationships', () => {
    const node = { ...entities[0], id: 'a & <b>' };
    const edge = { ...relationships[0], source: node.id, target: entities[1].id };
    const result = graphml([node, entities[1]], [edge, { ...edge, id: 'second' }]);
    expect(result.match(/<edge /g)).toHaveLength(2);
    expect(result).toContain('&amp; &lt;b&gt;');
    expect(result).toContain(`source="n${Buffer.from(node.id).toString('hex')}"`);
    expect(result).toContain('edgedefault="directed"');
  });
});
