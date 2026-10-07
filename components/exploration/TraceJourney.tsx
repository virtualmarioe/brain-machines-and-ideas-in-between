'use client';
import { entities, relationships } from '@/content';
import { domains, relationLabels, t } from '@/content/translations/ui';
import { journeyText as copy } from '@/content/translations/journeys';
import { yearOf } from '@/lib/graph';
import { yearGap } from '@/lib/temporal';
import type { HistoricalEntity, HistoricalRelationship, Locale } from '@/types/history';
export default function TraceJourney({
  entity,
  locale,
  trail,
  onSelect,
  onEdge,
  focus,
  onFocus,
}: {
  entity: HistoricalEntity;
  locale: Locale;
  trail: string[];
  onSelect: (id: string) => void;
  onEdge: (edge: HistoricalRelationship) => void;
  focus: boolean;
  onFocus: (value: boolean) => void;
}) {
  const lookup = new Map(entities.map((e) => [e.id, e]));
  return (
    <section className="trace-journey" aria-label={copy.journey[locale]}>
      <div className="journey-heading">
        <div>
          <h2>{copy.journey[locale]}</h2>
          <p>{copy.journeyHelp[locale]}</p>
        </div>
        <label>
          <input type="checkbox" checked={focus} onChange={(e) => onFocus(e.target.checked)} />{' '}
          {copy.focus[locale]}
        </label>
      </div>
      <nav aria-label={copy.path[locale]} className="visited-path">
        {trail.map((id, index) => (
          <button
            key={id}
            aria-current={id === entity.id ? 'step' : undefined}
            onClick={() => onSelect(id)}
          >
            <span>{index + 1}</span> {lookup.get(id)?.title[locale]}
          </button>
        ))}
        {trail.length > 1 && (
          <button onClick={() => onSelect(trail[0])}>{copy.resetPath[locale]}</button>
        )}
      </nav>
      <p className="trace-contribution">
        <strong>
          {copy.contribution[locale]} · {yearOf(entity)}
        </strong>
        <br />
        {entity.shortDescription[locale]}
      </p>
      <div className="trace-branches">
        {(['incoming', 'outgoing'] as const).map((direction) => {
          const edges = relationships.filter(
            (r) => (direction === 'incoming' ? r.target : r.source) === entity.id,
          );
          return (
            <div key={direction}>
              <h3>{copy[direction][locale]}</h3>
              {!edges.length && <p className="muted">{t('noConnections', locale)}</p>}
              {edges.map((edge) => {
                const other = lookup.get(direction === 'incoming' ? edge.source : edge.target)!;
                return (
                  <article className={`trace-branch domain-${other.domain}`} key={edge.id}>
                    <div className="branch-meta">
                      {yearOf(other)} · {domains[other.domain][locale]} ·{' '}
                      {yearGap(yearOf(entity), yearOf(other), locale)}
                    </div>
                    <button className="branch-title" onClick={() => onSelect(other.id)}>
                      {other.title[locale]} <span aria-hidden="true">→</span>
                    </button>
                    <p>{edge.description[locale]}</p>
                    <div className="branch-meta">
                      {relationLabels[edge.type][locale]} · {t('confidence', locale)}:{' '}
                      {t(edge.confidence, locale)}
                      {edge.disputed && ` · ${t('disputed', locale)}`}
                    </div>
                    <button className="text-action" onClick={() => onEdge(edge)}>
                      {copy.evidence[locale]}
                    </button>
                  </article>
                );
              })}
            </div>
          );
        })}
      </div>
      <p className="small muted">{copy.notCause[locale]}</p>
    </section>
  );
}
