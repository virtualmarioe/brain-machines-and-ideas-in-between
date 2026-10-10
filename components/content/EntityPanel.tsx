'use client';
import Link from 'next/link';
import { complexityCopy } from '@/lib/complexity';
import { displayYear } from '@/lib/graph';
import { useState } from 'react';
import { entities, relationships } from '@/content';
import { domains, relationLabels, t, typeLabels } from '@/content/translations/ui';
import type { HistoricalEntity, Locale } from '@/types/history';
import { Icon } from '@/components/ui/Icon';
import ReferenceList from './ReferenceList';
import ClaimList from './ClaimList';
export default function EntityPanel({
  entity,
  locale,
  onSelect,
  onDemo,
  nobel,
}: {
  entity: HistoricalEntity;
  locale: Locale;
  onSelect: (id: string) => void;
  onDemo: (kind: NonNullable<HistoricalEntity['demo']>) => void;
  nobel: boolean;
}) {
  const [depth, setDepth] = useState<'why' | 'understand' | 'deeper'>('why');
  const before = relationships.filter((r) => r.target === entity.id),
    after = relationships.filter((r) => r.source === entity.id);
  return (
    <aside
      className={`entity-panel domain-${entity.domain}`}
      aria-label={t('selected', locale)}
      data-entity-id={entity.id}
    >
      <div className="entity-heading">
        <div className="entity-meta">
          <span className="domain-tag">
            <i />
            {domains[entity.domain][locale]}
          </span>
          <span>{typeLabels[entity.type][locale]}</span>
        </div>
        <div className="entity-year">
          {displayYear(entity)}
          <span className="year-rule" />
        </div>
        <h2>{entity.title[locale]}</h2>
        <p className="entity-location">
          <Icon name="globe" size={13} />
          {entity.locations.map((l) => l.name).join(' · ')}
        </p>
      </div>
      {entity.research && (
        <div className="research-notice">
          <strong>{complexityCopy[locale].notice}</strong>
          <p>{entity.research.dateLabel}</p>
          <Link href={`/${locale}/research#${entity.research.catalogId}`}>
            {complexityCopy[locale].research} ↗
          </Link>
        </div>
      )}
      <div className="depth-tabs" role="tablist" aria-label={t('understand', locale)}>
        {(['why', 'understand', 'deeper'] as const).map((tab) => (
          <button
            id={`depth-${tab}`}
            key={tab}
            role="tab"
            aria-selected={depth === tab}
            aria-controls="entity-reading"
            tabIndex={depth === tab ? 0 : -1}
            onKeyDown={(event) => {
              const tabs = ['why', 'understand', 'deeper'] as const;
              const index = tabs.indexOf(tab);
              const next =
                event.key === 'ArrowRight'
                  ? (index + 1) % 3
                  : event.key === 'ArrowLeft'
                    ? (index + 2) % 3
                    : event.key === 'Home'
                      ? 0
                      : event.key === 'End'
                        ? 2
                        : -1;
              if (next >= 0) {
                event.preventDefault();
                setDepth(tabs[next]);
                document.getElementById(`depth-${tabs[next]}`)?.focus();
              }
            }}
            onClick={() => setDepth(tab)}
          >
            {t(tab, locale)}
          </button>
        ))}
      </div>
      <div
        key={depth}
        className="entity-reading"
        id="entity-reading"
        role="tabpanel"
        aria-labelledby={`depth-${depth}`}
      >
        {(depth === 'why'
          ? entity.shortDescription[locale]
          : depth === 'understand'
            ? entity.description[locale]
            : entity.technical[locale]
        )
          .split('\n\n')
          .map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        {entity.editorialNotes && (
          <div className="editorial-note">
            <strong>
              {t(entity.status === 'historically-disputed' ? 'disputed' : 'editorialNote', locale)}
            </strong>
            <p>{entity.editorialNotes[locale]}</p>
          </div>
        )}
        {depth === 'deeper' && (
          <>
            <ReferenceList ids={entity.references} locale={locale} />
            <ClaimList entityId={entity.id} locale={locale} />
          </>
        )}
        {entity.demo && (
          <button className="demo-button" onClick={() => onDemo(entity.demo!)}>
            <span className="demo-symbol">ƒ</span>
            <span>{t('experiment', locale)}</span>
            <Icon name="arrow" size={16} />
          </button>
        )}
        {nobel && entity.nobel && (
          <div className="nobel-note">
            <span>◇ {entity.nobel.year}</span>
            <p>{entity.nobel.label[locale]}</p>
            <small>{t('nobelNote', locale)}</small>
            <ReferenceList ids={[entity.nobel.reference]} locale={locale} />
          </div>
        )}
        <div className="people-line">
          <h3>{t('people', locale)}</h3>
          <p>{entity.people.join(' · ')}</p>
        </div>
        <div className="entity-connections">
          {(
            [
              { label: 'before', edges: before },
              { label: 'after', edges: after },
            ] as const
          ).map((group) => (
            <div key={group.label}>
              <h3>
                {t(group.label, locale)}{' '}
                <span>{group.edges.length.toString().padStart(2, '0')}</span>
              </h3>
              {group.edges.map((edge) => {
                const other = entities.find(
                  (e) => e.id === (group.label === 'before' ? edge.source : edge.target),
                );
                return (
                  other && (
                    <button key={edge.id} onClick={() => onSelect(other.id)}>
                      <span>
                        <small>{relationLabels[edge.type][locale]}</small>
                        {other.title[locale]}
                      </span>
                      <Icon name="arrow" size={14} />
                    </button>
                  )
                );
              })}
              {!group.edges.length && <p className="muted small">{t('noConnections', locale)}</p>}
            </div>
          ))}
        </div>
        {depth !== 'deeper' && (
          <details className="sources-disclosure">
            <summary>
              {t('sources', locale)} <span>{entity.references.length}</span>
            </summary>
            <ReferenceList ids={entity.references} locale={locale} />
          </details>
        )}
        <span className={`verification ${entity.status !== 'verified' ? 'needs-review' : ''}`}>
          ●{' '}
          {t(
            entity.status === 'verified'
              ? 'verified'
              : entity.status === 'needs-review'
                ? 'review'
                : 'disputed',
            locale,
          )}
        </span>
      </div>
    </aside>
  );
}
