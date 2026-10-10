import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/i18n';
import { complexityCopy } from '@/lib/complexity';
import { researchCatalog, unresolvedResearchEdges } from '@/content/research';
import ResearchTable from '@/components/exploration/ResearchTable';
import sections from '@/content/research/sections.json';
import './research.css';
const headers: Record<string, string[]> = {
  concepts: [
    'ID',
    'Concept',
    'Dates',
    'Discipline / type',
    'Contributors',
    'Historical role',
    'Editorial importance scores',
  ],
  people: [
    'ID',
    'Person',
    'Life dates',
    'Disciplines',
    'Training / context',
    'Associated concepts',
  ],
  institutions: [
    'ID',
    'Institution',
    'Location',
    'Approximate coordinates',
    'Period',
    'Associated work',
  ],
  publications: ['ID', 'Publication', 'Year', 'Venue', 'Identifier / source', 'Source type'],
  edges: [
    'From',
    'To',
    'Relationship',
    'Date',
    'Editorial strength',
    'Dossier evidence class',
    'Interpretation',
  ],
};
function Reading({ body }: { body: string }) {
  return (
    <>
      {body.split(/\n\n+/).map((block, index) => {
        if (block.startsWith('|')) {
          const rows = block
            .split('\n')
            .filter((line) => line.startsWith('|') && !/^\|[\s:|-]+\|$/.test(line))
            .map((line) => line.split('|').slice(1, -1));
          return (
            <div
              className="research-table"
              key={index}
              tabIndex={0}
              role="region"
              aria-label="Research table"
            >
              <table>
                <tbody>
                  {rows.map((row, r) => (
                    <tr key={r}>
                      {row.map((cell, c) =>
                        r === 0 ? (
                          <th scope="col" key={c}>
                            {cell.replaceAll('**', '').replaceAll('`', '')}
                          </th>
                        ) : (
                          <td key={c}>{cell.replaceAll('**', '').replaceAll('`', '')}</td>
                        ),
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        if (block.startsWith('### ')) return <h3 key={index}>{block.replace(/^### /, '')}</h3>;
        if (block.startsWith('```'))
          return <pre key={index}>{block.replace(/^```[^\n]*\n|```$/g, '')}</pre>;
        return <p key={index}>{block.replaceAll('**', '').replaceAll('`', '')}</p>;
      })}
    </>
  );
}
export default async function Research({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = complexityCopy[locale];
  return (
    <main className="research-page">
      <Link href={`/${locale}?level=expert`}>
        ← {locale === 'de' ? 'Zum Atlas' : locale === 'es' ? 'Volver al atlas' : 'Return to atlas'}
      </Link>
      <h1>{copy.research}</h1>
      <p>{copy.notice}</p>
      <div lang="en">
        <p>
          This catalog expands the atlas with the supplied 8 October 2026 research. Existing sourced
          entries are retained. New entries remain under review: the dossier’s citation handles were
          not accompanied by resolvable links. Dates may represent periods, precursors, or later
          revivals. Scores and relationship classifications are the dossier’s editorial assessments.
        </p>
        <p>
          Institutions are listed with their supplied approximate coordinates. These are not
          automatically treated as discovery locations or evidence of historical influence. Original
          English text is preserved in all language versions.
        </p>
        <a href="/research/history-2026-10-08.md" download>
          Download the complete research dossier (.md)
        </a>
        <nav aria-label="Research sections">
          {Object.keys(headers).map((key) => (
            <a href={`#${key}`} key={key}>
              {key} (
              {
                researchCatalog[
                  key as 'concepts' | 'people' | 'institutions' | 'publications' | 'edges'
                ].length
              }
              )
            </a>
          ))}
          <a href="#discussion">Historical discussion</a>
        </nav>
        {(['concepts', 'people', 'institutions', 'publications', 'edges'] as const).map((key) => (
          <section id={key} key={key}>
            <h2>
              {key[0].toUpperCase() + key.slice(1)} <small>({researchCatalog[key].length})</small>
            </h2>
            {key === 'concepts' && (
              <p>
                Editorial scores (1–5): historical importance / influence on AI / current relevance
                / cross-disciplinary reach / theoretical importance / technological impact. These
                are judgments, not citation counts.
              </p>
            )}
            <ResearchTable
              kind={key}
              rows={researchCatalog[key]}
              headers={headers[key]}
              locale={locale}
            />
          </section>
        ))}
        {unresolvedResearchEdges.length > 0 && (
          <p role="note">
            {unresolvedResearchEdges.length} relationship(s) refer to a concept absent from the
            supplied concept table. They remain in this register but are excluded from graph
            rendering until resolved.
          </p>
        )}
        <section id="discussion">
          <h2>Historical discussion and research notes</h2>
          {sections
            .filter(
              (section) =>
                !/Core concept|Person nodes|Institution nodes|Publication nodes|Graph edges/i.test(
                  section.title,
                ),
            )
            .map((section, index) => (
              <details key={index}>
                <summary>{section.title}</summary>
                <Reading body={section.body} />
              </details>
            ))}
        </section>
      </div>
    </main>
  );
}
