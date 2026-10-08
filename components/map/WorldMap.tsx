'use client';
import { useEffect, useRef, useState } from 'react';
import { landPath, project } from '@/lib/map';
import type { HistoricalEntity, HistoricalRelationship, Locale } from '@/types/history';
import { t, relationLabels } from '@/content/translations/ui';
import { ConnectionPreview, useConnectionPreview } from '@/components/ui/ConnectionPreview';
import { Icon } from '@/components/ui/Icon';
import { NodePreview, useNodePreview } from '@/components/ui/NodePreview';
import MapLabels from './MapLabels';
import { groupMapCities } from '@/lib/map-pins';
export default function WorldMap({
  entities,
  relationships,
  selected,
  locale,
  onSelect,
  onEdge,
  nobel = false,
}: {
  entities: HistoricalEntity[];
  relationships: HistoricalRelationship[];
  selected: string;
  locale: Locale;
  onSelect: (id: string) => void;
  onEdge: (edge: HistoricalRelationship) => void;
  nobel?: boolean;
}) {
  const mapElement = useRef<SVGSVGElement>(null);
  const [uiScale, setUiScale] = useState(1);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width > 0)
        setUiScale(Math.max(1, Math.min(2, 720 / entry.contentRect.width)));
    });
    if (mapElement.current) observer.observe(mapElement.current);
    return () => observer.disconnect();
  }, []);
  const [cityMode, setCityMode] = useState(true);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [showConnections, setShowConnections] = useState(false);
  const [cityKey, setCityKey] = useState<string | null>(null);
  const copy = {
    en: {
      mode: 'Map view',
      discoveries: 'Discoveries',
      selected: 'Selected discovery',
      connections: 'Show intellectual connections',
      cities: 'By city',
      city: 'City',
      sites: 'Institutions',
      open: 'Select a discovery to explore it.',
      note: 'Antarctica omitted. City markers count distinct discoveries in the current view; positions approximate associated locations, including publication cities.',
    },
    de: {
      mode: 'Kartenansicht',
      discoveries: 'Entdeckungen',
      selected: 'Ausgewählte Entdeckung',
      connections: 'Ideenverbindungen anzeigen',
      cities: 'Nach Stadt',
      city: 'Stadt',
      sites: 'Institutionen',
      open: 'Wählen Sie eine Entdeckung, um sie zu erkunden.',
      note: 'Antarktis ausgeblendet. Stadtmarker zählen einzelne Entdeckungen der aktuellen Ansicht; Positionen nähern zugehörige Orte einschließlich Erscheinungsorte an.',
    },
    es: {
      mode: 'Vista del mapa',
      discoveries: 'Descubrimientos',
      selected: 'Descubrimiento seleccionado',
      connections: 'Mostrar conexiones intelectuales',
      cities: 'Por ciudad',
      city: 'Ciudad',
      sites: 'Instituciones',
      open: 'Seleccione un descubrimiento para explorarlo.',
      note: 'Antártida omitida. Los marcadores cuentan descubrimientos distintos de la vista actual; las posiciones aproximan lugares asociados, incluidas ciudades de publicación.',
    },
  }[locale];
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const active = entities.find((e) => e.id === selected);
  const center = active?.locations[0];
  const [cx, cy] = center ? project(center.lon, center.lat) : [360, 180];
  const edges = relationships.filter((e) => e.source === selected || e.target === selected);
  const lookup = new Map(entities.map((e) => [e.id, e]));
  const preview = useNodePreview();
  const connectionPreview = useConnectionPreview();
  const pins = entities
    .filter((entity) => entity.id === selected)
    .flatMap((entity) =>
      entity.locations.map((location, locIndex) => {
        const [x, y] = project(location.lon, location.lat);
        return { entity, location, locIndex, x, y };
      }),
    );
  const pinPositions = pins;
  const markerScale = uiScale * (1 + 0.18 * (scale - 1));
  const cities = groupMapCities(entities);
  const chosenCity =
    cities.find((c) => c.key === cityKey) ??
    cities.find((c) => c.entities.some((e) => e.id === selected)) ??
    cities[0];
  const cityPoints = cities.map((c) => {
    const [x, y] = project(c.lon, c.lat);
    return { x, y };
  });
  const cityPositions = cityPoints;
  const mapX = (scale === 1 ? 0 : 360 - cx * scale) + offset.x;
  const mapY = (scale === 1 ? 0 : 147 - cy * scale) + offset.y;
  const labelAnchors = cityMode
    ? cities.map((city, index) => ({
        key: city.key,
        name: city.name,
        x: cityPositions[index].x * scale + mapX,
        y: cityPositions[index].y * scale + mapY,
        radius: 10 * markerScale,
        priority: city.key === hoveredCity ? 3 : city.key === chosenCity?.key ? 2 : 1,
      }))
    : pins.map((pin, index) => ({
        key: `${pin.entity.id}-${pin.locIndex}`,
        name: pin.location.name,
        x: pinPositions[index].x * scale + mapX,
        y: pinPositions[index].y * scale + mapY,
        radius: 11 * markerScale,
        priority:
          preview.current?.item.entity.id === pin.entity.id &&
          preview.current.item.location === pin.location
            ? 3
            : pin.entity.id === selected
              ? 2
              : 1,
      }));

  const focusPoint = (x: number, y: number) =>
    setOffset({
      x: 360 - x * scale - (scale === 1 ? 0 : 360 - cx * scale),
      y: 147 - y * scale - (scale === 1 ? 0 : 147 - cy * scale),
    });
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
            onClick={() => setScale((v) => Math.min(12, v + 0.5))}
          >
            +
          </button>
        </div>
      </div>
      <label className="map-view-control">
        {copy.mode}
        <select
          value={cityMode ? 'cities' : 'discoveries'}
          onChange={(event) => {
            setCityMode(event.target.value === 'cities');
            setCityKey(null);
            preview.dismiss(true);
            connectionPreview.dismiss(true);
            setScale(1);
            setOffset({ x: 0, y: 0 });
          }}
        >
          <option value="discoveries">{copy.selected}</option>
          <option value="cities">{copy.cities}</option>
        </select>
      </label>
      <label className="map-view-control">
        <input
          type="checkbox"
          checked={showConnections}
          onChange={(event) => {
            setShowConnections(event.target.checked);
            connectionPreview.dismiss(true);
          }}
        />
        {copy.connections}
      </label>
      <svg
        ref={mapElement}
        viewBox="0 0 720 295"
        className="world-map"
        role="group"
        aria-label={t('mapAlt', locale)}
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          preview.dismiss();
          connectionPreview.dismiss();
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
          transform={`translate(${(scale === 1 ? 0 : 360 - cx * scale) + offset.x} ${(scale === 1 ? 0 : 147 - cy * scale) + offset.y}) scale(${scale})`}
        >
          <path d={landPath} fill="var(--land)" stroke="var(--land-border)" strokeWidth=".5" />
          {showConnections &&
            edges.map((edge) => {
              const a = lookup.get(edge.source)?.locations[0],
                b = lookup.get(edge.target)?.locations[0];
              if (!a || !b) return null;
              const [x1, y1] = project(a.lon, a.lat),
                [x2, y2] = project(b.lon, b.lat);
              const path = `M${x1} ${y1} Q${(x1 + x2) / 2} ${Math.min(y1, y2) - Math.min(80, Math.abs(x1 - x2) * 0.3)} ${x2} ${y2}`;
              const source = lookup.get(edge.source)!;
              const target = lookup.get(edge.target)!;
              const previewProps = connectionPreview.triggerProps(
                { edge, source, target, map: true },
                edge.id,
              );
              return (
                <g key={edge.id} className="map-edge">
                  <path
                    d={path}
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth={1.2 / scale}
                    strokeDasharray={`${4 / scale} ${4 / scale}`}
                    opacity=".65"
                  />
                  <path
                    {...previewProps}
                    data-edge-id={edge.id}
                    d={path}
                    fill="none"
                    stroke="transparent"
                    strokeWidth={14 / scale}
                    tabIndex={0}
                    role="button"
                    aria-label={`${relationLabels[edge.type][locale]}: ${source.title[locale]} → ${target.title[locale]}`}
                    onPointerDown={(event) => event.stopPropagation()}
                    onFocus={(event) => {
                      previewProps.onFocus(event);
                      if (event.currentTarget.matches(':focus-visible'))
                        setOffset({
                          x: 360 - ((x1 + x2) / 2) * scale - (scale === 1 ? 0 : 360 - cx * scale),
                          y: 147 - ((y1 + y2) / 2) * scale - (scale === 1 ? 0 : 147 - cy * scale),
                        });
                    }}
                    onClick={() => {
                      connectionPreview.dismiss();
                      onEdge(edge);
                    }}
                    onKeyDown={(event) => {
                      previewProps.onKeyDown(event);
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        connectionPreview.dismiss();
                        onEdge(edge);
                      }
                    }}
                  />
                </g>
              );
            })}
          {!cityMode &&
            pins.map(({ entity, location, locIndex }, index) => {
              const { x, y } = pinPositions[index];
              const isActive = entity.id === selected;
              const previewProps = preview.nodeProps(entity, location);
              return (
                <g key={`${entity.id}-${locIndex}`}>
                  <g
                    transform={`translate(${x} ${y}) scale(${markerScale / scale})`}
                    role="button"
                    tabIndex={0}
                    aria-label={`${entity.title[locale]} · ${location.name}`}
                    aria-pressed={isActive}
                    style={
                      { '--reveal-delay': `${Math.min(index, 8) * 20}ms` } as React.CSSProperties
                    }
                    className={`map-pin domain-${entity.domain}`}
                    {...previewProps}
                    onFocus={(event) => {
                      previewProps.onFocus(event);
                      if (event.currentTarget.matches(':focus-visible'))
                        setOffset({
                          x: 360 - x * scale - (scale === 1 ? 0 : 360 - cx * scale),
                          y: 147 - y * scale - (scale === 1 ? 0 : 147 - cy * scale),
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
                    {nobel && entity.nobel && (
                      <text x="12" y="5" fill="var(--gold)" fontSize="15" aria-hidden="true">
                        ◇
                      </text>
                    )}
                  </g>
                </g>
              );
            })}
          {cityMode &&
            cities.map((city, index) => {
              const { x, y } = cityPositions[index];
              const isActive = city.key === chosenCity?.key;
              return (
                <g key={city.key}>
                  <g
                    className="map-city"
                    onPointerEnter={() => setHoveredCity(city.key)}
                    onPointerLeave={() => setHoveredCity(null)}
                    onBlur={() => setHoveredCity(null)}
                    transform={`translate(${x} ${y}) scale(${markerScale / scale})`}
                    role="button"
                    tabIndex={0}
                    aria-label={`${city.name}: ${city.entities.length} ${copy.discoveries}`}
                    aria-pressed={isActive}
                    onPointerDown={(event) => event.stopPropagation()}
                    onFocus={(event) => {
                      if (event.currentTarget.matches(':focus-visible')) {
                        setHoveredCity(city.key);
                        focusPoint(x, y);
                      }
                    }}
                    onClick={() => setCityKey(city.key)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setCityKey(city.key);
                      }
                    }}
                  >
                    <circle r="12" fill="transparent" />
                    <circle
                      r="9"
                      fill={isActive ? 'var(--action-fill)' : 'var(--surface)'}
                      stroke="var(--accent)"
                      strokeWidth={isActive ? 2.5 : 1.5}
                    />
                    <text
                      className="city-count"
                      y="4"
                      textAnchor="middle"
                      fill={isActive ? 'var(--on-action)' : 'var(--text)'}
                    >
                      {city.entities.length}
                    </text>
                  </g>
                </g>
              );
            })}
        </g>
        <MapLabels anchors={labelAnchors} scale={uiScale} />
      </svg>
      {chosenCity && (
        <div className="map-city-details">
          <label>
            {copy.city}
            <select
              value={chosenCity.key}
              onChange={(event) => {
                setCityKey(event.target.value);
                const city = cities.find((item) => item.key === event.target.value);
                if (city) {
                  const [x, y] = project(city.lon, city.lat);
                  focusPoint(x, y);
                }
              }}
            >
              {cities.map((city) => (
                <option key={city.key} value={city.key}>
                  {city.name} ({city.entities.length})
                </option>
              ))}
            </select>
          </label>
          <p>
            <strong>{copy.sites}:</strong> {chosenCity.institutions.join(' · ')}
          </p>
          <p>{copy.open}</p>
          <ul>
            {chosenCity.entities.map((entity) => (
              <li key={entity.id}>
                <button aria-pressed={entity.id === selected} onClick={() => onSelect(entity.id)}>
                  <span>{entity.startDate.slice(0, 4)}</span> {entity.title[locale]}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="map-caption">
        <span>
          {t('mapNote', locale)} {copy.note}{' '}
          {
            {
              en: 'Markers stay at their geographic coordinates. Crowded labels appear as you zoom. Use the city list to reach every discovery.',
              de: 'Marker bleiben an ihren geografischen Koordinaten. Dichte Beschriftungen erscheinen beim Zoomen. Die Stadtliste erschließt alle Entdeckungen.',
              es: 'Los marcadores conservan sus coordenadas geográficas. Las etiquetas próximas aparecen al ampliar. La lista de ciudades permite acceder a todos los descubrimientos.',
            }[locale]
          }
        </span>
        <span>Natural Earth</span>
      </div>
      <NodePreview preview={preview} locale={locale} />
      <ConnectionPreview preview={connectionPreview} locale={locale} />
    </section>
  );
}
