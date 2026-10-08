'use client';
import { useLayoutEffect, useRef, useState } from 'react';
import { mapPlaceName, placeMapLabels, type MapLabelAnchor } from '@/lib/map-labels';
export default function MapLabels({
  anchors,
  scale = 1,
}: {
  anchors: MapLabelAnchor[];
  scale?: number;
}) {
  const measure = useRef<SVGGElement>(null);
  const [widths, setWidths] = useState<Record<string, number>>({});
  const signature = anchors.map((a) => `${a.key}:${a.name}:${a.priority > 1}`).join('|');
  useLayoutEffect(() => {
    const texts = [...(measure.current?.querySelectorAll<SVGTextElement>('text') ?? [])];
    const observer = new ResizeObserver(() => {
      const next: Record<string, number> = {};
      for (const text of texts) next[text.dataset.key!] = Math.ceil(text.getBBox().width) + 12;
      setWidths((previous) =>
        JSON.stringify(previous) === JSON.stringify(next) ? previous : next,
      );
    });
    for (const text of texts) observer.observe(text);
    return () => observer.disconnect();
  }, [signature]);
  const labels = placeMapLabels(
    anchors.map((anchor) => ({
      ...anchor,
      x: anchor.x / scale,
      y: anchor.y / scale,
      radius: anchor.radius / scale,
    })),
    widths,
    720 / scale,
    295 / scale,
  );
  return (
    <g
      transform={`scale(${scale})`}
      className="map-label-layer"
      aria-hidden="true"
      pointerEvents="none"
    >
      <g ref={measure} visibility="hidden">
        {anchors.map((a) => {
          const place = mapPlaceName(a.name);
          return (
            <text
              key={a.key}
              data-key={a.key}
              className={a.priority > 1 ? 'active-place' : 'place-label'}
            >
              <tspan x="0" y="0">
                {place.city}
              </tspan>
              <tspan x="0" y="15" className="map-country">
                {place.country}
              </tspan>
            </text>
          );
        })}
      </g>
      {labels.map((box) => {
        const place = mapPlaceName(box.anchor.name);
        return (
          <g key={box.key} data-map-label={box.key}>
            <text
              x={box.left + box.width / 2}
              y={box.top + 15}
              textAnchor="middle"
              className={box.anchor.priority > 1 ? 'active-place' : 'place-label'}
            >
              <tspan x={box.left + box.width / 2}>{place.city}</tspan>
              <tspan x={box.left + box.width / 2} dy="14" className="map-country">
                {place.country}
              </tspan>
            </text>
          </g>
        );
      })}
    </g>
  );
}
