import { createHash } from 'node:crypto';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { entities, relationships, references, claims } from '../content';
import { validateContent } from '../lib/validation';

const root = fileURLToPath(new URL('../', import.meta.url));
const compare = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);
export function stableJson(value: unknown): string {
  return JSON.stringify(value, (_key, item) =>
    item && typeof item === 'object' && !Array.isArray(item)
      ? Object.fromEntries(
          Object.keys(item)
            .sort(compare)
            .map((key) => [key, item[key]]),
        )
      : item,
  );
}
export function csv(rows: object[]): string {
  const records = rows as Record<string, unknown>[];
  const columns = [...new Set(records.flatMap(Object.keys))].sort(compare);
  const cell = (value: unknown) => {
    const text =
      value === undefined ? '' : typeof value === 'object' ? stableJson(value) : String(value);
    return `"${text.replaceAll('"', '""')}"`;
  };
  return (
    [
      columns.map(cell).join(','),
      ...records.map((row) => columns.map((key) => cell(row[key])).join(',')),
    ].join('\r\n') + '\r\n'
  );
}
const xml = (text: string) =>
  text.replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[char]!,
  );
export function graphml(nodes: typeof entities, edges: typeof relationships): string {
  // Prefix hex-encoded UTF-8 IDs to meet XML identifier rules without collisions.
  const id = (value: string) => `n${Buffer.from(value).toString('hex')}`;
  return `<?xml version="1.0" encoding="UTF-8"?>\n<graphml xmlns="http://graphml.graphdrawing.org/xmlns">\n<key id="record" for="all" attr.name="record" attr.type="string"/>\n<graph id="atlas" edgedefault="directed">\n${nodes.map((node) => `<node id="${id(node.id)}"><data key="record">${xml(stableJson(node))}</data></node>`).join('\n')}\n${edges.map((edge) => `<edge id="e${Buffer.from(edge.id).toString('hex')}" source="${id(edge.source)}" target="${id(edge.target)}"><data key="record">${xml(stableJson(edge))}</data></edge>`).join('\n')}\n</graph>\n</graphml>\n`;
}

async function main() {
  const errors = validateContent(entities, relationships, references, claims);
  if (errors.length) throw new Error(`Export refused:\n${errors.join('\n')}`);
  const { version } = JSON.parse(await readFile(`${root}package.json`, 'utf8'));
  if (!/^\d+\.\d+\.\d+$/.test(version)) throw new Error('Invalid dataset version');
  const citation = await readFile(`${root}CITATION.cff`, 'utf8');
  if (!citation.includes(`version: "${version}"`))
    throw new Error('Software citation version differs from package.json');
  const collections = { entities, relationships, references, claims };
  const files: Record<string, string> = {};
  for (const [name, records] of Object.entries(collections)) {
    const sorted = [...records].sort((a, b) => compare(a.id, b.id));
    files[`${name}.json`] = stableJson(sorted) + '\n';
    files[`${name}.csv`] = csv(sorted);
  }
  files['graph.graphml'] = graphml(
    JSON.parse(files['entities.json']),
    JSON.parse(files['relationships.json']),
  );
  files['LICENSE'] = await readFile(`${root}content/LICENSE`, 'utf8');
  files['SOFTWARE-LICENSE'] = await readFile(`${root}LICENSE`, 'utf8');
  files['NOTICE'] = await readFile(`${root}NOTICE`, 'utf8');
  files['schema.ts'] = await readFile(`${root}types/history.ts`, 'utf8');
  files['CITATION.cff'] = citation
    .replace(
      /^message:.*$/m,
      'message: "Please cite this dataset when reusing the scholarly corpus."',
    )
    .replace('type: software', 'type: dataset')
    .replace('title: "The Intelligence Atlas"', 'title: "The Intelligence Atlas Knowledge Base"')
    .replace('license: Apache-2.0', 'license: CC-BY-4.0');
  files['README.md'] =
    `# The Intelligence Atlas Knowledge Base\n\nVersion ${version}. Generated with npm run export:dataset.\n\n` +
    (await readFile(`${root}content/README.md`, 'utf8')) +
    `\n## Package format\n\nJSON files contain complete records sorted by ID. CSV columns are the sorted union\nof fields, with nested objects and arrays encoded as JSON, absent optional values\nas empty cells, UTF-8 encoding, and CRLF rows. Import cells as text to preserve\ndates and prevent spreadsheet formula interpretation. GraphML is directed and\npreserves parallel edges; record data contains complete JSON objects. XML IDs\nare prefixed hex-encoded UTF-8 IDs; original IDs remain in record payloads.\n\nschema.ts is a verbatim copy of types/history.ts (Apache-2.0; SOFTWARE-LICENSE).\nIts interfaces define fields rather than a second independently maintained schema.\nManifest checksums cover all package files except the manifest itself.\nRelative documentation links above refer to the source repository. Media binaries\nand linked publications are not bundled. Resolve site-relative data URLs against\nhttps://brain-machines-and-ideas-in-between.vercel.app.\n`;
  files['manifest.json'] =
    stableJson({
      title: 'The Intelligence Atlas Knowledge Base',
      version,
      formatVersion: 1,
      source: 'https://github.com/virtualmarioe/brain-machines-and-ideas-in-between',
      canonicalEntry: 'content/index.ts',
      schema: 'schema.ts',
      license: 'CC-BY-4.0',
      counts: Object.fromEntries(
        Object.entries(collections).map(([name, records]) => [name, records.length]),
      ),
      files: Object.fromEntries(
        Object.keys(files)
          .sort(compare)
          .map((name) => [
            name,
            { sha256: createHash('sha256').update(files[name]).digest('hex') },
          ]),
      ),
    }) + '\n';
  const output = `${root}exports/intelligence-atlas-knowledge-base-${version}`;
  const staging = `${output}.tmp-${process.pid}`;
  await mkdir(staging, { recursive: true });
  try {
    for (const name of Object.keys(files).sort(compare))
      await writeFile(`${staging}/${name}`, files[name]);
    await rm(output, { recursive: true, force: true });
    await rename(staging, output);
  } finally {
    await rm(staging, { recursive: true, force: true });
  }
  console.log(`Exported validated dataset to ${output}`);
}
if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
