'use client';
import { displayYear, yearOf } from '@/lib/graph';
import { useEffect, useRef, useState } from 'react';
import { landPath, project } from '@/lib/map';
import type { HistoricalEntity, HistoricalRelationship, Locale } from '@/types/history';
import { t, relationLabels } from '@/content/translations/ui';
import { ConnectionPreview, useConnectionPreview } from '@/components/ui/ConnectionPreview';
import { Icon } from '@/components/ui/Icon';
import { NodePreview, useNodePreview } from '@/components/ui/NodePreview';
import { useConnectionAnimation } from './useConnectionAnimation';
import MapLabels from './MapLabels';
import { ClusterPreview, useClusterPreview } from './ClusterPreview';
import { clusterMapCities, describeMapCluster, groupMapCities } from '@/lib/map-pins';
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
  const [animateConnections, setAnimateConnections] = useState(true);
  const [cityMode, setCityMode] = useState(true);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [showConnections, setShowConnections] = useState(true);
  const [clusterKey, setClusterKey] = useState<string | null>(null);
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
      note: 'Positions approximate associated locations, including publication cities. Crowded labels appear as you zoom. Use the city list to reach every discovery.',
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
      note: 'Positionen nähern zugehörige Orte einschließlich Erscheinungsorte an. Dichte Beschriftungen erscheinen beim Zoomen. Die Stadtliste erschließt alle Entdeckungen.',
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
      note: 'Las posiciones aproximan lugares asociados, incluidas ciudades de publicación. Las etiquetas próximas aparecen al ampliar. La lista de ciudades permite acceder a todos los descubrimientos.',
    },
  }[locale];
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const active = entities.find((e) => e.id === selected);
  const center = active?.locations[0];
  const [cx, cy] = center ? project(center.lon, center.lat) : [360, 180];
  const edges = relationships.filter(
    (e) =>
      (cityMode || e.source === selected || e.target === selected) &&
      entities.some((entity) => entity.id === e.source && entity.locations.length) &&
      entities.some((entity) => entity.id === e.target && entity.locations.length),
  );
  edges.sort((a, b) => {
    const date = (edge: HistoricalRelationship) =>
      Math.max(
        yearOf(entities.find((e) => e.id === edge.source)!),
        yearOf(entities.find((e) => e.id === edge.target)!),
      );
    return date(a) - date(b) || a.id.localeCompare(b.id);
  });
  useConnectionAnimation(
    mapElement,
    edges.map((e) => e.id).join('|'),
    showConnections && animateConnections,
  );
  const endpointIds = new Set(
    showConnections ? edges.flatMap((edge) => [edge.source, edge.target]) : [],
  );
  const clusterPreview = useClusterPreview();
  const lookup = new Map(entities.map((e) => [e.id, e]));
  const preview = useNodePreview();
  const connectionPreview = useConnectionPreview();
  const pins = entities
    .filter((entity) => entity.id === selected || endpointIds.has(entity.id))
    .flatMap((entity) =>
      entity.locations.map((location, locIndex) => {
        const [x, y] = project(location.lon, location.lat);
        return { entity, location, locIndex, x, y };
      }),
    );
  pins.sort((a, b) => Number(a.entity.id === selected) - Number(b.entity.id === selected));
  const pinPositions = pins;
  const markerScale = uiScale * (1 + 0.18 * (scale - 1));
  const cities = groupMapCities(entities);
  const chosenCity =
    cities.find((c) => c.key === cityKey) ??
    cities.find((c) => c.entities.some((e) => e.id === selected)) ??
    cities[0];
  const clusters = clusterMapCities(cities, project, (28 * markerScale) / scale);
  const chosenCluster = clusters.find((cluster) => cluster.key === clusterKey);
  const detailEntities = chosenCluster?.entities ?? chosenCity?.entities ?? [];
  const clusterByCity = new Map(
    clusters.flatMap((cluster) => cluster.cities.map((city) => [city.key, cluster] as const)),
  );
  const mapX = (scale === 1 ? 0 : 360 - cx * scale) + offset.x;
  const mapY = (scale === 1 ? 0 : 147 - cy * scale) + offset.y;
  const labelAnchors = cityMode
    ? clusters.map((cluster) => ({
        key: cluster.key,
        name:
          cluster.cities.length === 1
            ? cluster.cities[0].name
            : `${cluster.cities.length} ${{ en: 'cities', de: 'Städte', es: 'ciudades' }[locale]}`,
        x: cluster.x * scale + mapX,
        y: cluster.y * scale + mapY,
        radius: 12 * markerScale,
        priority:
          cluster.key === hoveredCity
            ? 3
            : cluster.cities.some((city) => city.key === chosenCity?.key)
              ? 2
              : 1,
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
            setClusterKey(null);
            clusterPreview.dismiss(true);
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
      {showConnections && (
        <button
          className="map-view-control"
          aria-pressed={animateConnections}
          onClick={() => setAnimateConnections((value) => !value)}
        >
          {
            { en: 'Animate chronology', de: 'Chronologie animieren', es: 'Animar cronología' }[
              locale
            ]
          }
        </button>
      )}
      {showConnections && (
        <p className="muted">
          {
            {
              en: 'Connections appear when both discoveries exist, in date order. Moving lights indicate relationship direction, not travel or proven influence. Turn off animation to see every connection.',
              de: 'Verbindungen erscheinen in zeitlicher Reihenfolge, sobald beide Entdeckungen existieren. Lichtpunkte zeigen die Beziehungsrichtung, keine Reisen oder belegten Einflüsse. Ohne Animation sind alle Verbindungen sichtbar.',
              es: 'Las conexiones aparecen por fecha cuando existen ambos descubrimientos. Las luces indican la dirección de la relación, no viajes ni influencias probadas. Desactive la animación para ver todas las conexiones.',
            }[locale]
          }
        </p>
      )}
      <svg
        ref={mapElement}
        viewBox="0 0 720 295"
        className="world-map"
        role="group"
        aria-label={t('mapAlt', locale)}
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          clusterPreview.dismiss();
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
              const ca = cityMode
                ? clusterByCity.get(a.name.trim().toLocaleLowerCase('en').replace(/\s+/g, ' '))
                : undefined;
              const cb = cityMode
                ? clusterByCity.get(b.name.trim().toLocaleLowerCase('en').replace(/\s+/g, ' '))
                : undefined;
              const [x1, y1] = ca ? [ca.x, ca.y] : project(a.lon, a.lat),
                [x2, y2] = cb ? [cb.x, cb.y] : project(b.lon, b.lat);
              const path =
                Math.hypot(x2 - x1, y2 - y1) < 1
                  ? `M${x1} ${y1} c${-35 / scale} ${-45 / scale} ${35 / scale} ${-45 / scale} 0 0`
                  : `M${x1} ${y1} Q${(x1 + x2) / 2} ${Math.min(y1, y2) - Math.min(80, Math.abs(x1 - x2) * 0.3)} ${x2} ${y2}`;
              const source = lookup.get(edge.source)!;
              const target = lookup.get(edge.target)!;
              const previewProps = connectionPreview.triggerProps(
                { edge, source, target, map: true },
                edge.id,
              );
              return (
                <g
                  key={edge.id}
                  className="map-edge"
                  data-source={edge.source}
                  data-target={edge.target}
                >
                  <path
                    className="map-connection-trail"
                    pathLength="1"
                    d={path}
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth={1.2 / scale}
                    opacity=".65"
                  />
                  <circle
                    className="map-connection-head"
                    r={3 / scale}
                    fill="var(--accent)"
                    opacity="0"
                    pointerEvents="none"
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
            clusters.map((cluster) => {
              const { x, y } = cluster;
              const isActive = cluster.cities.some((city) => city.key === chosenCity?.key);
              const props = clusterPreview.triggerProps(cluster, cluster.key);
              return (
                <g
                  key={cluster.key}
                  className="map-city"
                  data-cluster={cluster.key}
                  data-entities={cluster.entities.map((entity) => entity.id).join(' ')}
                  {...props}
                  onPointerEnter={(event) => {
                    setHoveredCity(cluster.key);
                    props.onPointerEnter(event);
                  }}
                  onPointerLeave={(event) => {
                    setHoveredCity(null);
                    props.onPointerLeave(event);
                  }}
                  transform={`translate(${x} ${y}) scale(${markerScale / scale})`}
                  role="button"
                  tabIndex={0}
                  aria-label={`${cluster.cities.map((city) => city.name).join(' · ')}: ${describeMapCluster(cluster, locale)}`}
                  aria-pressed={isActive}
                  onPointerDown={(event) => event.stopPropagation()}
                  onFocus={(event) => {
                    props.onFocus(event);
                    if (event.currentTarget.matches(':focus-visible')) {
                      setHoveredCity(cluster.key);
                      focusPoint(x, y);
                    }
                  }}
                  onClick={() => {
                    setCityKey(cluster.cities[0].key);
                    setClusterKey(cluster.key);
                  }}
                  onKeyDown={(event) => {
                    props.onKeyDown(event);
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setCityKey(cluster.cities[0].key);
                      setClusterKey(cluster.key);
                    }
                  }}
                >
                  <circle r="13" fill="transparent" />
                  <circle
                    r="11"
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
                    {cluster.entities.length}
                  </text>
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
                setClusterKey(null);
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
            <strong>{copy.sites}:</strong>{' '}
            {(chosenCluster
              ? [...new Set(chosenCluster.cities.flatMap((city) => city.institutions))]
              : chosenCity.institutions
            ).join(' · ')}
          </p>
          {chosenCluster && (
            <p>
              <strong>{describeMapCluster(chosenCluster, locale)}</strong>
              <br />
              {chosenCluster.cities.map((city) => city.name).join(' · ')}
            </p>
          )}
          <p>{copy.open}</p>
          <ul>
            {detailEntities.map((entity) => (
              <li key={entity.id}>
                <button aria-pressed={entity.id === selected} onClick={() => onSelect(entity.id)}>
                  <span>{displayYear(entity)}</span> {entity.title[locale]}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {entities.some((entity) => !entity.locations.length) && (
        <details className="map-city-details">
          <summary>
            {
              {
                en: 'Ideas without a recorded map location',
                de: 'Ideen ohne erfassten Kartenort',
                es: 'Ideas sin ubicación registrada',
              }[locale]
            }{' '}
            ({entities.filter((entity) => !entity.locations.length).length})
          </summary>
          <ul>
            {entities
              .filter((entity) => !entity.locations.length)
              .map((entity) => (
                <li key={entity.id}>
                  <button onClick={() => onSelect(entity.id)}>{entity.title[locale]}</button>
                </li>
              ))}
          </ul>
        </details>
      )}
      <div className="map-caption">
        <span>{copy.note}</span>
        <span>Natural Earth</span>
      </div>
      <ClusterPreview preview={clusterPreview} locale={locale} />
      <NodePreview preview={preview} locale={locale} />
      <ConnectionPreview preview={connectionPreview} locale={locale} />
    </section>
  );
}
