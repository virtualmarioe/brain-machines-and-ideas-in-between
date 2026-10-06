'use client';
import { useEffect, useRef, useState } from 'react';
import type { HistoricalEntity, HistoricalRelationship, Locale } from '@/types/history';
import { chronological } from '@/lib/graph';
import { domains, relationLabels, t } from '@/content/translations/ui';
import { Icon } from '@/components/ui/Icon';
import GraphOverview from './GraphOverview';
import { graphBounds, fitGraph } from '@/lib/graph/viewport';
import { NodePreview, useNodePreview } from '@/components/ui/NodePreview';
import { ConnectionPreview, useConnectionPreview } from '@/components/ui/ConnectionPreview';
type Point = { x: number; y: number };
export default function IdeaGraph({
  entities,
  relationships,
  selected,
  locale,
  onSelect,
  onEdge,
  compact = false,
}: {
  compact?: boolean;
  entities: HistoricalEntity[];
  relationships: HistoricalRelationship[];
  selected: string;
  locale: Locale;
  onSelect: (id: string) => void;
  onEdge: (edge: HistoricalRelationship) => void;
}) {
  const [view, setView] = useState({ x: 0, y: 0, scale: 1 });
  const [positions, setPositions] = useState<Record<string, Point>>({});
  const preview = useNodePreview();
  const connectionPreview = useConnectionPreview();
  const drag = useRef<{ id: string; x: number; y: number; origin: Point; moved: boolean } | null>(
    null,
  );
  const svg = useRef<SVGSVGElement>(null);
  const [viewportWidth, setViewportWidth] = useState(compact ? 390 : 780);
  useEffect(() => {
    const canvas = svg.current?.parentElement;
    if (!canvas) return;
    const observer = new ResizeObserver(() => {
      const { width, height } = canvas.getBoundingClientRect();
      if (width > 0 && height > 0) setViewportWidth((width * 340) / height);
    });
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);
  const ordered = chronological(entities);
  const width = Math.max(viewportWidth, Math.ceil(ordered.length / 3) * 210 + 100);
  const nodes = new Map(
    ordered.map((node, index) => [
      node.id,
      positions[node.id] ?? {
        x: ordered.length <= 3 ? viewportWidth / 2 : 100 + Math.floor(index / 3) * 210,
        y: 68 + (index % 3) * 94,
      },
    ]),
  );
  function focusAtScale(scale: number) {
    return Math.max(
      0,
      Math.min(
        width * scale - viewportWidth,
        (nodes.get(selected)?.x ?? viewportWidth / 2) * scale - viewportWidth / 2,
      ),
    );
  }
  const focusX = focusAtScale(view.scale);
  const edges = relationships
    .filter((edge) => nodes.has(edge.source) && nodes.has(edge.target))
    .sort(
      (a, b) =>
        Number(a.source === selected || a.target === selected) -
        Number(b.source === selected || b.target === selected),
    );
  const bounds = graphBounds([...nodes.values()]);
  const related = new Set(
    edges
      .filter((edge) => edge.source === selected || edge.target === selected)
      .flatMap((edge) => [edge.source, edge.target]),
  );
  function point(event: React.PointerEvent) {
    const matrix = svg.current!.getScreenCTM();
    const p = new DOMPoint(event.clientX, event.clientY);
    return matrix ? p.matrixTransform(matrix.inverse()) : p;
  }
  function start(event: React.PointerEvent, id: string) {
    if (event.button !== 0) return;
    event.stopPropagation();
    preview.dismiss();
    connectionPreview.dismiss();
    const p = point(event);
    drag.current = {
      id,
      ...p,
      origin: id === 'canvas' ? { x: view.x, y: view.y } : nodes.get(id)!,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function move(event: React.PointerEvent) {
    if (!drag.current) return;
    const p = point(event),
      d = drag.current;
    const dx = p.x - d.x,
      dy = p.y - d.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) d.moved = true;
    if (d.id === 'canvas') setView((v) => ({ ...v, x: d.origin.x + dx, y: d.origin.y + dy }));
    else
      setPositions((old) => ({
        ...old,
        [d.id]: { x: d.origin.x + dx / view.scale, y: d.origin.y + dy / view.scale },
      }));
  }
  function end() {
    if (drag.current && !drag.current.moved && drag.current.id !== 'canvas')
      onSelect(drag.current.id);
    drag.current = null;
  }
  return (
    <section className="graph-section" aria-label={t('graph', locale)}>
      <div className="viz-heading">
        <div>
          <h2 className="eyebrow">01 / {t('graph', locale)}</h2>
          <p>{t('graphHint', locale)}</p>
        </div>
        <div className="zoom-tools">
          <button
            aria-label={t('zoomOut', locale)}
            onClick={() => setView((v) => ({ ...v, scale: Math.max(0.1, v.scale - 0.2) }))}
          >
            −
          </button>
          <button
            aria-label={t('resetView', locale)}
            onClick={() => {
              setView({ x: 0, y: 0, scale: 1 });
              setPositions({});
            }}
          >
            <Icon name="reset" size={14} />
          </button>
          <button
            aria-label={t('zoomIn', locale)}
            onClick={() => setView((v) => ({ ...v, scale: Math.min(3, v.scale + 0.2) }))}
          >
            +
          </button>
        </div>
      </div>
      <div className="graph-canvas">
        <svg
          ref={svg}
          viewBox={`0 0 ${viewportWidth} 340`}
          role="group"
          aria-label={t('graphAlt', locale)}
          onPointerDown={(event) => start(event, 'canvas')}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={() => {
            drag.current = null;
          }}
        >
          <defs>
            <pattern id="graph-dots" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r=".65" fill="var(--border)" />
            </pattern>
            <marker
              id="edge-arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M0 0 10 5 0 10z" fill="context-stroke" />
            </marker>
          </defs>
          <rect width="100%" height="100%" fill="url(#graph-dots)" />
          <g transform={`translate(${view.x - focusX} ${view.y}) scale(${view.scale})`}>
            {edges.map((edge) => {
              const a = nodes.get(edge.source)!,
                b = nodes.get(edge.target)!;
              const previewProps = connectionPreview.triggerProps(
                {
                  edge,
                  source: entities.find((e) => e.id === edge.source)!,
                  target: entities.find((e) => e.id === edge.target)!,
                },
                edge.id,
              );
              const active = edge.source === selected || edge.target === selected;
              const path = `M${a.x + 13},${a.y} C${a.x + (b.x - a.x) * 0.6},${a.y} ${b.x - (b.x - a.x) * 0.6},${b.y} ${b.x - 16},${b.y}`;
              return (
                <g key={edge.id} className={`graph-edge ${active ? 'is-active' : ''}`}>
                  <path
                    d={path}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={active ? 2 : 1}
                    strokeDasharray={
                      edge.type === 'conceptual-analogy' || edge.type === 'historical-context'
                        ? '5 5'
                        : undefined
                    }
                    markerEnd="url(#edge-arrow)"
                  />
                  <path
                    {...previewProps}
                    data-edge-id={edge.id}
                    d={path}
                    stroke="transparent"
                    strokeWidth="14"
                    fill="none"
                    tabIndex={0}
                    role="button"
                    aria-label={`${relationLabels[edge.type][locale]}: ${entities.find((e) => e.id === edge.source)?.title[locale]} → ${entities.find((e) => e.id === edge.target)?.title[locale]}`}
                    onFocus={(event) => {
                      previewProps.onFocus(event);
                      if (event.currentTarget.matches(':focus-visible'))
                        setView((v) => ({
                          ...v,
                          x: viewportWidth / 2 - ((a.x + b.x) / 2) * v.scale + focusX,
                          y: 170 - ((a.y + b.y) / 2) * v.scale,
                        }));
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => {
                      connectionPreview.dismiss();
                      onEdge(edge);
                    }}
                    onKeyDown={(e) => {
                      previewProps.onKeyDown(e);
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        connectionPreview.dismiss();
                        onEdge(edge);
                      }
                    }}
                  />
                </g>
              );
            })}
            {ordered.map((node) => {
              const p = nodes.get(node.id)!;
              const previewProps = preview.nodeProps(node);
              const active = node.id === selected;
              const title = node.title[locale];
              const words = title.length > 24 ? title.split(' ') : [title];
              let line1 = words[0],
                line2 = '';
              for (const word of words.slice(1)) {
                if ((line1 + ' ' + word).length < 25 && !line2) line1 += ' ' + word;
                else line2 += (line2 ? ' ' : '') + word;
              }
              return (
                <g
                  key={node.id}
                  {...previewProps}
                  data-node-id={node.id}
                  transform={`translate(${p.x} ${p.y})`}
                  className={`graph-node domain-${node.domain} ${active ? 'selected' : ''} ${related.has(node.id) ? 'related' : ''}`}
                  role="button"
                  tabIndex={0}
                  aria-label={`${node.title[locale]}, ${node.startDate.slice(0, 4)}, ${domains[node.domain][locale]}`}
                  aria-pressed={active}
                  onFocus={(event) => {
                    previewProps.onFocus(event);
                    if (event.currentTarget.matches(':focus-visible'))
                      setView((v) => ({
                        ...v,
                        x: viewportWidth / 2 - p.x * v.scale + focusX,
                        y: 170 - p.y * v.scale,
                      }));
                  }}
                  onPointerDown={(e) => start(e, node.id)}
                  onKeyDown={(event) => {
                    previewProps.onKeyDown(event);
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      onSelect(node.id);
                    }
                  }}
                >
                  {active && <circle r="25" className="node-halo" />}
                  <circle r={active ? 12 : 8} className="node-dot" />
                  <circle r="3" fill="var(--surface)" />
                  <text y="-19" className="node-year">
                    {node.startDate.slice(0, 4)}
                  </text>
                  <text y="31" className="node-label">
                    {line1}
                  </text>
                  {line2 && (
                    <text y="45" className="node-label">
                      {line2}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>
      <GraphOverview
        nodes={ordered.map((node) => ({
          id: node.id,
          ...nodes.get(node.id)!,
          domain: node.domain,
          year: node.startDate.slice(0, 4),
        }))}
        edges={edges}
        bounds={bounds}
        viewport={{
          left: (focusX - view.x) / view.scale,
          top: -view.y / view.scale,
          width: viewportWidth / view.scale,
          height: 340 / view.scale,
        }}
        selected={selected}
        locale={locale}
        onNavigate={(left) => {
          preview.dismiss();
          connectionPreview.dismiss();
          setView((v) => ({
            ...v,
            x: focusX - left * v.scale,
            y: 170 - ((bounds.top + bounds.bottom) / 2) * v.scale,
          }));
        }}
        onFit={() => {
          preview.dismiss();
          connectionPreview.dismiss();
          const fitted = fitGraph(bounds, viewportWidth, 340);
          setView({ ...fitted, x: fitted.x + focusAtScale(fitted.scale) });
        }}
      />
      <div className="graph-legend">
        <span>
          <i />
          {t('connection', locale)}
        </span>
        <span>
          <i className="dashed" />
          {relationLabels['conceptual-analogy'][locale]} /{' '}
          {relationLabels['historical-context'][locale]}
        </span>
      </div>
      <NodePreview preview={preview} locale={locale} />
      <ConnectionPreview preview={connectionPreview} locale={locale} />
    </section>
  );
}
