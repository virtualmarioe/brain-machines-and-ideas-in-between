'use client';
import { useEffect, useRef, useState } from 'react';
import type { HistoricalEntity, Locale } from '@/types/history';
import { chronological, yearOf } from '@/lib/graph';
import { t } from '@/content/translations/ui';
import { Icon } from '@/components/ui/Icon';
import Modal from '@/components/ui/Modal';
import { TimelinePreview, useTimelinePreview } from '@/components/ui/TimelinePreview';
export const MIN_YEAR = 1870,
  MAX_YEAR = 2026;
export type YearRange = [number, number];
export function clampRange(start: number, end: number): YearRange {
  const width = Math.max(4, Math.min(MAX_YEAR - MIN_YEAR, end - start));
  const from = Math.max(MIN_YEAR, Math.min(MAX_YEAR - width, start));
  return [Math.round(from), Math.round(from + width)];
}
export function clusterTimeline(entities: HistoricalEntity[], range: YearRange, width: number) {
  const groups: { x: number; entities: HistoricalEntity[] }[] = [];
  for (const entity of chronological(entities)) {
    const year = yearOf(entity);
    if (year < range[0] || year > range[1]) continue;
    const x = Math.max(
      12,
      Math.min(width - 12, ((year - range[0]) / (range[1] - range[0])) * width),
    );
    const previous = groups.at(-1);
    if (previous && x - previous.x < 28) previous.entities.push(entity);
    else groups.push({ x, entities: [entity] });
  }
  return groups;
}
export default function Timeline({
  entities,
  selected,
  range,
  onRange,
  onSelect,
  locale,
  nobel,
}: {
  entities: HistoricalEntity[];
  selected: string;
  range: YearRange;
  onRange: (range: YearRange) => void;
  onSelect: (id: string) => void;
  locale: Locale;
  nobel: boolean;
}) {
  const preview = useTimelinePreview();
  const dismissPreview = preview.dismiss;
  const [from, to] = range;
  useEffect(() => dismissPreview(), [entities, selected, from, to, dismissPreview]);
  const span = range[1] - range[0];
  const step = span > 100 ? 20 : span > 30 ? 10 : span > 12 ? 5 : 1;
  const ticks = Array.from(
    { length: Math.floor(span / step) + 2 },
    (_, i) => Math.ceil(range[0] / step) * step + i * step,
  ).filter((y) => y <= range[1]);
  const track = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(720);
  const [cluster, setCluster] = useState<HistoricalEntity[] | null>(null);
  useEffect(() => {
    const observer = new ResizeObserver((entries) => setWidth(entries[0].contentRect.width));
    if (track.current) observer.observe(track.current);
    return () => observer.disconnect();
  }, []);
  const groups = clusterTimeline(entities, range, width);
  const awards = entities.filter(
    (e) => e.nobel && e.nobel.year >= range[0] && e.nobel.year <= range[1],
  );
  const awardYears = [...new Set(awards.map((e) => e.nobel!.year))];
  return (
    <section className="timeline-section" aria-label={t('timeline', locale)}>
      <div className="timeline-heading">
        <span className="eyebrow">03 / {t('timeline', locale)}</span>
        <div className="timeline-controls">
          <span className="range-value">
            {range[0]} <span>→</span> {range[1]}
          </span>
          <button
            aria-label={t('panLeft', locale)}
            onClick={() => onRange(clampRange(range[0] - span / 4, range[1] - span / 4))}
          >
            ←
          </button>
          <button
            aria-label={`${t('timeline', locale)}: ${t('zoomOut', locale)}`}
            onClick={() => onRange(clampRange(range[0] - span * 0.25, range[1] + span * 0.25))}
          >
            −
          </button>
          <button
            aria-label={`${t('timeline', locale)}: ${t('zoomIn', locale)}`}
            onClick={() => onRange(clampRange(range[0] + span * 0.2, range[1] - span * 0.2))}
          >
            +
          </button>
          <button
            aria-label={t('panRight', locale)}
            onClick={() => onRange(clampRange(range[0] + span / 4, range[1] + span / 4))}
          >
            →
          </button>
          <button
            aria-label={`${t('timeline', locale)}: ${t('resetView', locale)}`}
            onClick={() => onRange([MIN_YEAR, MAX_YEAR])}
          >
            <Icon name="reset" size={14} />
          </button>
        </div>
      </div>
      <div ref={track} className="time-track">
        <div className="time-line" />
        {ticks.map((year) => (
          <div
            key={year}
            className="time-tick"
            style={{ left: `${((year - range[0]) / span) * 100}%` }}
          >
            <span>{year}</span>
          </div>
        ))}
        {groups.map((group) => {
          const entity = group.entities[0];
          const active = group.entities.some((e) => e.id === selected);
          const multiple = group.entities.length > 1;
          const label = multiple
            ? `${t('cluster', locale)}: ${group.entities.map((e) => `${yearOf(e)} · ${e.title[locale]}`).join('; ')}`
            : `${yearOf(entity)} · ${entity.title[locale]}`;
          return (
            <button
              key={entity.id}
              {...preview.triggerProps(
                { entities: group.entities, selected: entities.find((e) => e.id === selected) },
                group.entities.map((e) => e.id).join(','),
              )}
              aria-label={label}
              aria-pressed={active}
              className={`time-event domain-${entity.domain} ${active ? 'selected' : ''} ${multiple ? 'clustered' : ''}`}
              style={{ left: group.x, top: 22 }}
              onClick={() => {
                preview.dismiss();
                if (multiple) setCluster(group.entities);
                else onSelect(entity.id);
              }}
            >
              {multiple && <span className="cluster-count">{group.entities.length}</span>}
            </button>
          );
        })}
        {nobel &&
          awardYears.map((year) => (
            <button
              key={`nobel-${year}`}
              {...preview.triggerProps(
                { entities: awards.filter((e) => e.nobel!.year === year), awardYear: year },
                `award-${year}`,
              )}
              className="nobel-event"
              style={{ left: `${((year - range[0]) / span) * 100}%`, top: 74 }}
              onClick={() => {
                preview.dismiss();
                setCluster(awards.filter((e) => e.nobel!.year === year));
              }}
              aria-label={`${year} · ${t('nobel', locale)}`}
            >
              ◇
            </button>
          ))}
      </div>
      <div className="range-inputs">
        <label>
          {t('from', locale)}
          <input
            aria-label={t('from', locale)}
            type="range"
            min={MIN_YEAR}
            max={MAX_YEAR - 4}
            value={range[0]}
            onChange={(e) => onRange([Math.min(Number(e.target.value), range[1] - 4), range[1]])}
          />
        </label>
        <label>
          {t('to', locale)}
          <input
            aria-label={t('to', locale)}
            type="range"
            min={MIN_YEAR + 4}
            max={MAX_YEAR}
            value={range[1]}
            onChange={(e) => onRange([range[0], Math.max(Number(e.target.value), range[0] + 4)])}
          />
        </label>
      </div>
      <TimelinePreview preview={preview} locale={locale} />
      {cluster && (
        <Modal title={t('cluster', locale)} locale={locale} onClose={() => setCluster(null)}>
          <p>{t('clusterHelp', locale)}</p>
          <div className="cluster-discoveries">
            {cluster.map((entity) => (
              <button
                key={entity.id}
                className={`domain-${entity.domain}`}
                onClick={() => {
                  onSelect(entity.id);
                  setCluster(null);
                }}
              >
                <span>{yearOf(entity)}</span>
                {entity.title[locale]}
                <Icon name="arrow" size={16} />
              </button>
            ))}
          </div>
          <button
            className="primary-button"
            onClick={() => {
              const years = cluster.map(yearOf);
              onRange(clampRange(Math.min(...years) - 2, Math.max(...years) + 2));
              setCluster(null);
            }}
          >
            {t('zoomPeriod', locale)}
          </button>
        </Modal>
      )}
    </section>
  );
}
