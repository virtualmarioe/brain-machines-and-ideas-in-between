import { referenceById } from '@/content';
import { sourceLabels, t } from '@/content/translations/ui';
import type { Locale } from '@/types/history';
import { Icon } from '@/components/ui/Icon';
export default function ReferenceList({ ids, locale }: { ids: string[]; locale: Locale }) {
  return (
    <ol className="reference-list">
      {[...new Set(ids)].map((id) => {
        const source = referenceById.get(id);
        return source ? (
          <li key={id}>
            <a href={source.url} target="_blank" rel="noopener noreferrer">
              <span>{source.title}</span>
              <Icon name="external" size={13} />
            </a>
            <p>
              {source.authors.join(', ')}
              {source.yearKind !== 'access' && ` · ${source.year}`}
            </p>
            {source.doi && <small>DOI: {source.doi}</small>}
            <span className="source-type">{sourceLabels[source.type][locale]}</span>
            <small>
              {t('accessed', locale)}: {source.accessedAt}
            </small>
            {source.notes && (
              <details className="source-note">
                <summary>{t('sourceNotes', locale)}</summary>
                <p lang="en">{source.notes}</p>
              </details>
            )}
            <span className="sr-only">{t('source', locale)}</span>
          </li>
        ) : null;
      })}
    </ol>
  );
}
