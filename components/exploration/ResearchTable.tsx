'use client';
import { useHydrated } from '../navigation/useHydrated';
import Link from 'next/link';
import { useState } from 'react';
import { entityById } from '@/content';
import { researchId } from '@/content/research';
function ConceptLink({ id, locale }: { id: string; locale: string }) {
  const entity = entityById.get(researchId(id));
  return entity ? (
    <Link href={`/${locale}/${entity.type}/${entity.slug}?level=expert`}>
      {entity.title[locale as 'en' | 'de' | 'es']}
    </Link>
  ) : (
    <span>{id} (unresolved)</span>
  );
}

export default function ResearchTable({
  kind: key,
  rows,
  headers,
  locale,
}: {
  kind: string;
  rows: string[][];
  headers: string[];
  locale: string;
}) {
  const ready = useHydrated();
  const [query, setQuery] = useState('');
  const normalize = (text: string) =>
    text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  const filtered = rows.filter((row) => normalize(row.join(' ')).includes(normalize(query)));
  return (
    <>
      <label className="research-filter">
        Search {key}
        <input
          disabled={!ready}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>
      <p role="status">
        {filtered.length} of {rows.length} records
      </p>
      <div className="research-table" role="region" aria-label={`${key} catalog`} tabIndex={0}>
        <table>
          <thead>
            <tr>
              {(key === 'edges' ? headers : headers.slice(1)).map((header) => (
                <th scope="col" key={header}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, r) => (
              <tr key={r} id={key === 'edges' ? undefined : row[0]}>
                {row.map((cell, c) =>
                  c === 0 && key !== 'edges' ? null : (
                    <td key={c}>
                      {key === 'concepts' && c === 1 ? (
                        <ConceptLink id={row[0]} locale={locale} />
                      ) : key === 'edges' && c < 2 ? (
                        <ConceptLink id={cell} locale={locale} />
                      ) : (
                        cell
                          .split(/(c_[a-z_]+)/g)
                          .map((part, i) =>
                            /^c_/.test(part) ? (
                              <ConceptLink key={i} id={part} locale={locale} />
                            ) : (
                              <SourceText key={i} text={part} />
                            ),
                          )
                      )}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function SourceText({ text }: { text: string }) {
  const doi = text.match(/10\.\d{4,9}\/[^\s;]+/);
  const arxiv = text.match(/(?:arXiv[: ]+)(\d{4}\.\d{4,5})/i);
  if (doi) return <a href={`https://doi.org/${doi[0]}`}>{text}</a>;
  if (arxiv) return <a href={`https://arxiv.org/abs/${arxiv[1]}`}>{text}</a>;
  return text;
}
