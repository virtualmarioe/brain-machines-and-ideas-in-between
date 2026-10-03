'use client';

import { useRef } from 'react';
import type { Domain, Locale } from '@/types/history';
import { text } from '@/content/translations/ui';
import { clampGraphLeft, type GraphBounds } from '@/lib/graph/viewport';
import './overview.css';

const copy = {
  title: text('Explore the full graph', 'Das ganze Netz erkunden', 'Explora el grafo completo'),
  hint: text(
    'Drag the window or click the strip. Arrow keys move it too.',
    'Fenster ziehen oder in die Leiste klicken. Auch Pfeiltasten bewegen es.',
    'Arrastra la ventana o pulsa la franja. También puedes usar las flechas.',
  ),
  position: text('Graph position', 'Position im Netz', 'Posición en el grafo'),
  fit: text('Show all ideas', 'Alle Ideen zeigen', 'Mostrar todas las ideas'),
  earlier: text(
    'Pan graph left',
    'Netz nach links verschieben',
    'Desplazar el grafo a la izquierda',
  ),
  later: text('Pan graph right', 'Netz nach rechts verschieben', 'Desplazar el grafo a la derecha'),
  view: text('of the graph visible', 'des Netzes sichtbar', 'del grafo visible'),
};

type Node = { id: string; x: number; y: number; domain: Domain; year: string };
export default function GraphOverview({
  nodes,
  edges,
  bounds,
  viewport,
  selected,
  locale,
  onNavigate,
  onFit,
}: {
  nodes: Node[];
  edges: { source: string; target: string }[];
  bounds: GraphBounds;
  viewport: { left: number; top: number; width: number; height: number };
  selected: string;
  locale: Locale;
  onNavigate: (left: number) => void;
  onFit: () => void;
}) {
  const strip = useRef<HTMLDivElement>(null);
  const drag = useRef<{ grabOffset: number } | null>(null);
  const width = bounds.right - bounds.left;
  const height = bounds.bottom - bounds.top;
  const maxLeft = Math.max(bounds.left, bounds.right - viewport.width);
  const left = clampGraphLeft(viewport.left, viewport.width, bounds);
  const fraction = Math.min(1, viewport.width / width);
  const value = maxLeft === bounds.left ? 0 : (left - bounds.left) / (maxLeft - bounds.left);
  const lookup = new Map(nodes.map((node) => [node.id, node]));
  const x = (world: number) => ((world - bounds.left) / width) * 1000;
  const y = (world: number) => 7 + ((world - bounds.top) / height) * 44;
  const windowLeft = Math.max(0, x(viewport.left));
  const windowRight = Math.min(1000, x(viewport.left + viewport.width));
  const windowTop = Math.max(2, y(viewport.top));
  const windowBottom = Math.min(56, y(viewport.top + viewport.height));
  function worldX(clientX: number) {
    const rect = strip.current!.getBoundingClientRect();
    return bounds.left + ((clientX - rect.left) / rect.width) * width;
  }
  function navigate(left: number) {
    onNavigate(clampGraphLeft(left, viewport.width, bounds));
  }
  return (
    <div className="graph-overview">
      <div className="graph-overview-heading">
        <span>{copy.title[locale]}</span>
        <button onClick={onFit}>{copy.fit[locale]}</button>
      </div>
      <div className="graph-overview-controls">
        <button
          aria-label={copy.earlier[locale]}
          disabled={fraction === 1 || left <= bounds.left}
          onClick={() => navigate(left - viewport.width * 0.75)}
        >
          ‹
        </button>
        <div
          ref={strip}
          className="graph-overview-strip"
          role="slider"
          tabIndex={0}
          aria-label={copy.position[locale]}
          aria-orientation="horizontal"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(value * 100)}
          aria-valuetext={`${Math.round(value * 100)}% · ${Math.round(fraction * 100)}% ${copy.view[locale]}`}
          aria-describedby="graph-overview-hint"
          onPointerDown={(event) => {
            if (event.button !== 0) return;
            const p = worldX(event.clientX);
            const inWindow = p >= viewport.left && p <= viewport.left + viewport.width;
            drag.current = { grabOffset: inWindow ? p - viewport.left : viewport.width / 2 };
            event.currentTarget.setPointerCapture(event.pointerId);
            event.currentTarget.focus({ preventScroll: true });
            navigate(p - drag.current.grabOffset);
          }}
          onPointerMove={(event) => {
            if (drag.current) navigate(worldX(event.clientX) - drag.current.grabOffset);
          }}
          onPointerUp={() => {
            drag.current = null;
          }}
          onPointerCancel={() => {
            drag.current = null;
          }}
          onLostPointerCapture={() => {
            drag.current = null;
          }}
          onKeyDown={(event) => {
            const step = viewport.width * (event.shiftKey ? 0.75 : 0.15);
            const targets: Record<string, number> = {
              ArrowLeft: left - step,
              ArrowRight: left + step,
              PageUp: left - viewport.width * 0.75,
              PageDown: left + viewport.width * 0.75,
              Home: bounds.left,
              End: maxLeft,
            };
            if (event.key in targets) {
              event.preventDefault();
              navigate(targets[event.key]);
            }
          }}
        >
          <svg viewBox="0 0 1000 58" preserveAspectRatio="none" aria-hidden="true">
            {edges.map((edge, index) => {
              const a = lookup.get(edge.source),
                b = lookup.get(edge.target);
              return a && b ? (
                <line
                  key={index}
                  x1={x(a.x)}
                  y1={y(a.y)}
                  x2={x(b.x)}
                  y2={y(b.y)}
                  className="overview-edge"
                />
              ) : null;
            })}
            <rect
              className="overview-window"
              x={Math.min(994, windowLeft)}
              y={Math.min(50, windowTop)}
              width={Math.max(6, windowRight - windowLeft)}
              height={Math.max(6, windowBottom - windowTop)}
              rx="3"
            />
            {nodes.map((node) => (
              <circle
                key={node.id}
                cx={x(node.x)}
                cy={y(node.y)}
                r={node.id === selected ? 4.5 : 2.8}
                className={`overview-node domain-${node.domain} ${node.id === selected ? 'is-selected' : ''}`}
              />
            ))}
          </svg>
        </div>
        <button
          aria-label={copy.later[locale]}
          disabled={fraction === 1 || left >= maxLeft}
          onClick={() => navigate(left + viewport.width * 0.75)}
        >
          ›
        </button>
      </div>
      <div className="graph-overview-caption">
        <span>{nodes[0]?.year}</span>
        <span id="graph-overview-hint">{copy.hint[locale]}</span>
        <span>{nodes.at(-1)?.year}</span>
      </div>
    </div>
  );
}
