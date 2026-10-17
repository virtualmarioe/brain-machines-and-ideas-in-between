'use client';
import { useEffect, useId, useRef, useState } from 'react';
import type { HistoricalEntity, Locale } from '@/types/history';
import { chronological, yearOf, displayYear, formatYear } from '@/lib/graph';
import { t } from '@/content/translations/ui';
import WinterGuide from './WinterGuide';
import { winterCopy, winterCards } from '@/content/ai-winters';
import type { Complexity } from '@/lib/complexity';
import { Icon } from '@/components/ui/Icon';
import Modal from '@/components/ui/Modal';
import { PreviewCard, useOverlayPreview } from '@/components/ui/OverlayPreview';
import { TimelinePreview, useTimelinePreview } from '@/components/ui/TimelinePreview';
export const MIN_YEAR = -400,
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
  level,
}: {
  entities: HistoricalEntity[];
  selected: string;
  range: YearRange;
  onRange: (range: YearRange) => void;
  onSelect: (id: string) => void;
  locale: Locale;
  nobel: boolean;
  level: Complexity;
}) {
  const cycleGradientId = useId();
  const [guideOpen, setGuideOpen] = useState(false);
  useEffect(() => {
    const openLinkedGuide = () => {
      if (window.location.hash === '#ai-winters-guide') setGuideOpen(true);
    };
    openLinkedGuide();
    window.addEventListener('hashchange', openLinkedGuide);
    return () => window.removeEventListener('hashchange', openLinkedGuide);
  }, []);
  const preview = useTimelinePreview();
  const winterPreview = useOverlayPreview<{ title: string; activated: boolean }>();
  const dismissWinter = winterPreview.dismiss;
  const minYear = entities.length
    ? Math.max(MIN_YEAR, Math.floor(Math.min(...entities.map(yearOf)) / 10) * 10)
    : MIN_YEAR;
  useEffect(() => {
    if (range[0] < minYear) onRange([minYear, Math.max(minYear + 4, range[1])]);
  }, [minYear, range, onRange]);
  const dismissPreview = preview.dismiss;
  const [from, to] = range;
  useEffect(() => dismissPreview(), [entities, selected, from, to, dismissPreview]);
  useEffect(() => dismissWinter(), [from, to, locale, level, dismissWinter]);
  const span = range[1] - range[0];
  const step =
    span > 1000 ? 500 : span > 300 ? 100 : span > 100 ? 20 : span > 30 ? 10 : span > 12 ? 5 : 1;
  const ticks = Array.from(
    { length: Math.floor(span / step) + 2 },
    (_, i) => Math.ceil(range[0] / step) * step + i * step,
  ).filter((y) => y !== 0 && y <= range[1]);
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
    <section id="timeline-view" className="timeline-section" aria-label={t('timeline', locale)}>
      <div className="timeline-heading">
        <span className="eyebrow">03 / {t('timeline', locale)}</span>
        <div className="timeline-controls">
          <span className="range-value">
            {formatYear(range[0])} <span>→</span> {formatYear(range[1])}
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
            onClick={() => onRange([minYear, MAX_YEAR])}
          >
            <Icon name="reset" size={14} />
          </button>
        </div>
      </div>
      <div ref={track} className="time-track">
        <svg
          className="time-climate"
          aria-hidden="true"
          width="100%"
          height="100%"
          viewBox={`0 0 ${span} 1`}
          preserveAspectRatio="none"
        >
          <defs>
            {/* The buildup anchors are illustrative; winter boundaries are approximate. */}
            <linearGradient
              id={cycleGradientId}
              gradientUnits="userSpaceOnUse"
              x1={1945 - from}
              x2={MAX_YEAR - from}
              y1="0"
              y2="0"
            >
              {[
                [1945, 'warm', 0],
                [1956, 'warm', 0.025],
                [1965, 'warm', 0.065],
                [1973, 'warm', 0.11],
                [1973, 'cold', 0.11],
                [1980, 'cold', 0],
                [1980, 'warm', 0],
                [1984, 'warm', 0.05],
                [1987, 'warm', 0.11],
                [1987, 'cold', 0.11],
                [1993, 'cold', 0],
                [1993, 'warm', 0],
                [MAX_YEAR, 'warm', 0.11],
              ].map(([year, phase, opacity], index) => (
                <stop
                  key={index}
                  offset={`${((Number(year) - 1945) / (MAX_YEAR - 1945)) * 100}%`}
                  stopColor={phase === 'warm' ? '#d85c52' : '#69bce8'}
                  stopOpacity={opacity}
                />
              ))}
            </linearGradient>
          </defs>
          <rect width={span} height="1" fill={`url(#${cycleGradientId})`} />
        </svg>
        {[
          { start: 1973, end: 1980, label: 'firstAIWinter' as const },
          { start: 1987, end: 1993, label: 'secondAIWinter' as const },
        ].map((winter, index) => {
          if (winter.end < from || winter.start > to) return null;
          const anchor = ((Math.max(from, winter.start) - from) / span) * 100;
          return (
            <div
              key={winter.start}
              className="time-winter"
              style={{ left: `${anchor}%`, top: 105 + index * 34, width: `${100 - anchor}%` }}
            >
              <button
                type="button"
                {...winterPreview.triggerProps(
                  { title: t(winter.label, locale), activated: false },
                  String(winter.start),
                )}
                onClick={(event) => {
                  winterPreview.open(
                    { title: t(winter.label, locale), activated: true },
                    String(winter.start),
                    event.currentTarget,
                  );
                }}
              >
                <span data-preview-anchor>
                  {t(winter.label, locale)} · ≈ {winter.start}–{winter.end}
                </span>
              </button>
            </div>
          );
        })}
        <div className="time-line" />
        {ticks.map((year) => (
          <div
            key={year}
            className="time-tick"
            style={{ left: `${((year - range[0]) / span) * 100}%` }}
          >
            <span>{formatYear(year)}</span>
          </div>
        ))}
        {groups.map((group, index) => {
          const entity = group.entities[0];
          const active = group.entities.some((e) => e.id === selected);
          const multiple = group.entities.length > 1;
          const label = multiple
            ? `${t('cluster', locale)}: ${group.entities.map((e) => `${displayYear(e)} · ${e.title[locale]}`).join('; ')}`
            : `${displayYear(entity)} · ${entity.title[locale]}`;
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
              style={
                {
                  left: `clamp(12px, ${(group.x / width) * 100}%, calc(100% - 12px))`,
                  top: 22,
                  '--reveal-delay': `${Math.min(index, 8) * 20}ms`,
                } as React.CSSProperties
              }
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
            min={minYear}
            max={MAX_YEAR - 4}
            value={Math.max(minYear, range[0])}
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
      {winterPreview.current && (
        <PreviewCard
          preview={winterPreview}
          kind="winter"
          forId={winterPreview.current.key}
          className="winter-preview"
          role="dialog"
          label={winterPreview.current.item.title}
          autoFocus={winterPreview.current.item.activated}
        >
          <div className="winter-snow" aria-hidden="true">
            {Array.from({ length: 28 }, (_, index) => (
              <span
                key={index}
                className="winter-flake"
                style={
                  {
                    left: `${(index * 37 + 11) % 100}%`,
                    '--flake-size': `${1.5 + (index % 5) * 0.65}px`,
                    '--flake-opacity': (0.25 + (index % 4) * 0.12) * 1.1 ** 3,
                    '--fall-duration': `${9 + ((index * 7) % 17)}s`,
                    '--fall-delay': `${-((index * 13) % 29)}s`,
                    '--sway-duration': `${3 + (index % 5)}s`,
                    '--drift': `${8 + (index % 4) * 5}px`,
                    '--flake-blur': index % 5 === 0 ? '0.7px' : '0.15px',
                  } as React.CSSProperties
                }
              >
                <i />
              </span>
            ))}
            {[false, true].flatMap((large) =>
              Array.from({ length: large ? 14 : 28 }, (_, index) => (
                <span
                  key={`${large ? 'large' : 'regular'}-${index}`}
                  className={`winter-flake winter-crystal${large ? ' winter-crystal-large' : ''}`}
                  style={
                    {
                      left: `${(index * 37 + (large ? 47 : 29)) % 100}%`,
                      '--flake-size': `${(1.5 + (index % 5) * 0.65) * (large ? 4 : 1)}px`,
                      '--flake-opacity': (0.25 + (index % 4) * 0.12) * 1.1 ** 3,
                      '--fall-duration': `${9 + ((index * 7) % 17)}s`,
                      '--fall-delay': `${-((index * 13) % 29)}s`,
                      '--sway-duration': `${3 + (index % 5)}s`,
                      '--drift': `${8 + (index % 4) * 5}px`,
                      '--flake-blur': index % 5 === 0 ? '0.7px' : '0.15px',
                      ...(large
                        ? {
                            '--fall-duration': `${18 + ((index * 7) % 19)}s`,
                            '--sway-duration': `${6 + (index % 5)}s`,
                            '--drift': `${(index % 2 ? -1 : 1) * (12 + (index % 4) * 7)}px`,
                            '--flutter': `${4 + (index % 4) * 2}px`,
                            '--spin-duration': `${13 + ((index * 5) % 17)}s`,
                            '--spin-start': `${index * 47}deg`,
                            '--spin-end': `${index * 47 + (index % 2 ? -65 : 80)}deg`,
                            '--flake-blur': index % 5 === 0 ? '0.35px' : '0px',
                          }
                        : {}),
                    } as React.CSSProperties
                  }
                >
                  <i>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={large ? 0.8 : 1.8}
                      strokeLinecap="round"
                    >
                      {large ? (
                        <>
                          <path
                            d="M12 8.6l2.94 1.7v3.4L12 15.4l-2.94-1.7v-3.4Z"
                            fill="currentColor"
                            fillOpacity="0.12"
                          />
                          {[0, 60, 120, 180, 240, 300].map((angle) => (
                            <path
                              key={angle}
                              transform={`rotate(${angle} 12 12)`}
                              d={
                                index % 3 === 0
                                  ? 'M12 12V1 M12 4L9.8 2.5 M12 4l2.2-1.5 M12 7L8.5 4.5 M12 7l3.5-2.5 M12 9L9.5 7.3 M12 9l2.5-1.7'
                                  : 'M12 12V1.4 M12 4.5L10 2.8 M12 4.5l2-1.7 M12 8L8.3 5.2 M12 8l3.7-2.8 M9.7 6.3V4.6 M14.3 6.3V4.6'
                              }
                            />
                          ))}
                        </>
                      ) : (
                        [0, 60, 120].map((angle) => (
                          <path
                            key={angle}
                            transform={`rotate(${angle} 12 12)`}
                            d="M12 1v22 M8 4l4 4 4-4 M8 20l4-4 4 4"
                          />
                        ))
                      )}
                    </svg>
                  </i>
                </span>
              )),
            )}
          </div>
          <div className="node-preview-meta">{t('aiWintersTitle', locale)}</div>
          <h3>{winterPreview.current.item.title}</h3>
          <p className="node-preview-description">
            {winterCards[level][winterPreview.current.key === '1973' ? 'first' : 'second'][locale]}
          </p>
          <p className="node-preview-note">{t('aiWintersKey', locale)}</p>
          <a
            className="winter-learn-more"
            href="#ai-winters-guide"
            onClick={() => {
              setGuideOpen(true);
              winterPreview.dismiss(true);
              requestAnimationFrame(() => document.getElementById('winter-guide-heading')?.focus());
            }}
          >
            {winterCopy.learn[locale]} →
          </a>
        </PreviewCard>
      )}
      <WinterGuide locale={locale} level={level} open={guideOpen} onOpen={setGuideOpen} />
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
                <span>{displayYear(entity)}</span>
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
