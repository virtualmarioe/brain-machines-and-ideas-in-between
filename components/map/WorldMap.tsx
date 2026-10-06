'use client';
import { useRef, useState } from 'react';
import { landPath, project } from '@/lib/map';
import type { HistoricalEntity, HistoricalRelationship, Locale } from '@/types/history';
import { t } from '@/content/translations/ui';
import { Icon } from '@/components/ui/Icon';
import { NodePreview, useNodePreview } from '@/components/ui/NodePreview';
import { separateMapPins } from '@/lib/map-pins';
export default function WorldMap({
  entities,
  relationships,
  selected,
  locale,
  onSelect,
  nobel = false,
}: {
  entities: HistoricalEntity[];
  relationships: HistoricalRelationship[];
  selected: string;
  locale: Locale;
  onSelect: (id: string) => void;
  nobel?: boolean;
}) {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const active = entities.find((e) => e.id === selected);
  const center = active?.locations[0];
  const [cx, cy] = center ? project(center.lon, center.lat) : [360, 180];
  const edges = relationships.filter((e) => e.source === selected || e.target === selected);
  const lookup = new Map(entities.map((e) => [e.id, e]));
  const preview = useNodePreview();
  const pins = entities.flatMap((entity) =>
    entity.locations.map((location, locIndex) => {
      const [x, y] = project(location.lon, location.lat);
      return { entity, location, locIndex, x, y };
    }),
  );
  const pinPositions = separateMapPins(pins, 24 / scale);
  return (
    <section className="map-section" aria-label={t('map', locale)} data-selected={selected}>
      <div className="viz-heading">
        <div>
          <h2 className="eyebrow">02 / {t('map', locale)}</h2>
          <p>{center ? `${center.name} · ${center.institution}` : t('noLocation', locale)}</p>
        </div>
        <div className="zoom-tools">
          <button
            aria-label={`${t('map', locale)}: ${t('zoomOut', locale)}`}
            onClick={() => setScale((v) => Math.max(1, v - 0.5))}
          >
            −
          </button>
          <button
            aria-label={`${t('map', locale)}: ${t('resetView', locale)}`}
            onClick={() => {
              setScale(1);
              setOffset({ x: 0, y: 0 });
            }}
          >
            <Icon name="reset" size={14} />
          </button>
          <button
            aria-label={`${t('map', locale)}: ${t('zoomIn', locale)}`}
            onClick={() => setScale((v) => Math.min(5, v + 0.5))}
          >
            +
          </button>
        </div>
      </div>
      <svg
        viewBox="0 0 720 295"
        className="world-map"
        role="group"
        aria-label={t('mapAlt', locale)}
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          preview.dismiss();
          const matrix = e.currentTarget.getScreenCTM();
          if (!matrix) return;
          const point = new DOMPoint(e.clientX, e.clientY).matrixTransform(matrix.inverse());
          drag.current = { x: point.x, y: point.y, ox: offset.x, oy: offset.y };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          const matrix = e.currentTarget.getScreenCTM();
          if (!matrix) return;
          const point = new DOMPoint(e.clientX, e.clientY).matrixTransform(matrix.inverse());
          setOffset({
            x: drag.current.ox + point.x - drag.current.x,
            y: drag.current.oy + point.y - drag.current.y,
          });
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
      >
        <defs>
          <pattern id="map-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M60 0H0V60" fill="none" stroke="var(--map-grid)" strokeWidth=".7" />
          </pattern>
        </defs>
        <rect width="720" height="295" fill="url(#map-grid)" />
        <g
          transform={`translate(${(scale === 1 ? 0 : 360 - cx * scale) + offset.x} ${(scale === 1 ? -10 : 147 - cy * scale) + offset.y}) scale(${scale})`}
        >
          <path d={landPath} fill="var(--land)" stroke="var(--land-border)" strokeWidth=".5" />
          {edges.map((edge) => {
            const a = lookup.get(edge.source)?.locations[0],
              b = lookup.get(edge.target)?.locations[0];
            if (!a || !b) return null;
            const [x1, y1] = project(a.lon, a.lat),
              [x2, y2] = project(b.lon, b.lat);
            return (
              <path
                key={edge.id}
                d={`M${x1} ${y1} Q${(x1 + x2) / 2} ${Math.min(y1, y2) - Math.min(80, Math.abs(x1 - x2) * 0.3)} ${x2} ${y2}`}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="1.2"
                strokeDasharray="4 4"
                opacity=".65"
              />
            );
          })}
          {pins.map(({ entity, location, locIndex, x: actualX, y: actualY }, index) => {
            const { x, y } = pinPositions[index];
            const isActive = entity.id === selected;
            const previewProps = preview.nodeProps(entity, location);
            const displaced = Math.hypot(x - actualX, y - actualY) > 1;
            return (
              <g key={`${entity.id}-${locIndex}`}>
                {displaced && (
                  <g aria-hidden="true" pointerEvents="none">
                    <line
                      x1={actualX}
                      y1={actualY}
                      x2={x}
                      y2={y}
                      stroke="var(--muted)"
                      strokeWidth={0.65 / scale}
                      opacity=".65"
                    />
                    <circle cx={actualX} cy={actualY} r={1.4 / scale} fill="var(--muted)" />
                  </g>
                )}
                <g
                  transform={`translate(${x} ${y}) scale(${1 / scale})`}
                  role="button"
                  tabIndex={0}
                  aria-label={`${entity.title[locale]} · ${location.name}`}
                  aria-pressed={isActive}
                  className={`map-pin domain-${entity.domain}`}
                  {...previewProps}
                  onFocus={(event) => {
                    previewProps.onFocus(event);
                    if (event.currentTarget.matches(':focus-visible'))
                      setOffset({
                        x: 360 - x * scale - (scale === 1 ? 0 : 360 - cx * scale),
                        y: 147 - y * scale - (scale === 1 ? -10 : 147 - cy * scale),
                      });
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => onSelect(entity.id)}
                  onKeyDown={(e) => {
                    previewProps.onKeyDown(e);
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelect(entity.id);
                    }
                  }}
                >
                  <circle r="11" fill="transparent" />
                  <circle
                    r={isActive ? 10 : 5}
                    fill={isActive ? 'var(--accent-soft)' : 'var(--surface)'}
                    stroke="var(--domain-ink)"
                    strokeWidth={isActive ? 1.5 : 1}
                  />
                  <circle r={isActive ? 4 : 2} fill="var(--domain)" />
                  {(isActive || index % 5 === 0) && (
                    <text
                      y={isActive ? -16 : 14}
                      textAnchor="middle"
                      className={isActive ? 'active-place' : 'place-label'}
                    >
                      {location.name}
                    </text>
                  )}
                  {nobel && entity.nobel && (
                    <text x="12" y="5" fill="var(--gold)" fontSize="15" aria-hidden="true">
                      ◇
                    </text>
                  )}
                </g>
              </g>
            );
          })}
        </g>
      </svg>
      <div className="map-caption">
        <span>
          {t('mapNote', locale)}{' '}
          {
            {
              en: 'Nearby pins are separated; fine lines locate their sites.',
              de: 'Nahe Punkte sind versetzt; feine Linien zeigen ihre Orte.',
              es: 'Los puntos cercanos se separan; las líneas finas señalan sus lugares.',
            }[locale]
          }
        </span>
        <span>Natural Earth</span>
      </div>
      <NodePreview preview={preview} locale={locale} />
    </section>
  );
}
