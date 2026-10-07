'use client';
import { useState } from 'react';
import type { Locale } from '@/types/history';
import { text } from '@/content/translations/ui';
import { projectField, receptiveWidth } from '@/lib/receptive-field';
const copy = {
  title: text(
    'From one unit to a wider field',
    'Von einer Einheit zu einem größeren Feld',
    'De una unidad a un campo más amplio',
  ),
  intro: text(
    'An output unit combines nearby units in the preceding layer. Repeating that operation expands the input region that can affect it. Compare the footprint with the separated layers.',
    'Eine Ausgabeeinheit kombiniert benachbarte Einheiten der vorherigen Schicht. Wiederholung erweitert den Eingabebereich, der sie beeinflussen kann. Vergleiche den Bereich mit den getrennten Schichten.',
    'Una unidad de salida combina unidades cercanas de la capa anterior. Repetir la operación amplía la región de entrada que puede afectarla. Compara la huella con las capas separadas.',
  ),
  flat: text('2D footprint', '2D-Eingabebereich', 'Huella 2D'),
  spatial: text('Spatial layers', 'Räumliche Schichten', 'Capas espaciales'),
  layers: text('Convolution layers', 'Faltungsschichten', 'Capas de convolución'),
  kernel: text('Kernel width', 'Filterbreite', 'Ancho del filtro'),
  angle: text('Viewing angle', 'Blickwinkel', 'Ángulo de vista'),
  input: text('Input', 'Eingabe', 'Entrada'),
  output: text('Output', 'Ausgabe', 'Salida'),
  layer: text('Layer', 'Schicht', 'Capa'),
  width: text('Cells across', 'Zellen in der Breite', 'Celdas de ancho'),
  note: text(
    'Schematic geometry, not anatomy. This theoretical receptive field assumes square kernels, stride 1, dilation 1, and no pooling. It shows possible input dependence, not learned weights or the effective receptive field.',
    'Schematische Geometrie, keine Anatomie. Dieses theoretische rezeptive Feld nimmt quadratische Filter, Schrittweite 1, Dilatation 1 und kein Pooling an. Es zeigt mögliche Eingabeabhängigkeit, keine gelernten Gewichte oder das effektive rezeptive Feld.',
    'Geometría esquemática, no anatomía. Este campo receptivo teórico supone filtros cuadrados, paso 1, dilatación 1 y sin agrupamiento. Muestra la posible dependencia de la entrada, no pesos aprendidos ni el campo receptivo efectivo.',
  ),
  axes: text(
    'Horizontal planes: spatial positions. Vertical separation: successive computation layers, not physical distance.',
    'Horizontale Ebenen: räumliche Positionen. Vertikaler Abstand: aufeinanderfolgende Rechenschichten, keine physische Entfernung.',
    'Planos horizontales: posiciones espaciales. Separación vertical: capas de cálculo sucesivas, no distancia física.',
  ),
  reset: text(
    'Reset spatial explanation',
    'Räumliche Erklärung zurücksetzen',
    'Restablecer explicación espacial',
  ),
};
export default function SpatialReceptiveField({ locale }: { locale: Locale }) {
  const [layers, setLayers] = useState(3),
    [kernel, setKernel] = useState(3),
    [angle, setAngle] = useState(-25),
    [spatial, setSpatial] = useState(false);
  const width = receptiveWidth(layers, kernel);
  const project = (x: number, y: number, z: number) =>
    spatial ? projectField(x, y, z, angle) : { x: 300 + x * 15, y: 205 + y * 15 };
  const corners = (r: number, z: number) =>
    [
      [-r, -r],
      [r, -r],
      [r, r],
      [-r, r],
    ].map(([x, y]) => project(x, y, z));
  const polygons = Array.from({ length: layers + 1 }, (_, layer) => ({
    layer,
    width: receptiveWidth(layers - layer, kernel),
  }));
  return (
    <section className="spatial-lab" aria-label={copy.title[locale]}>
      <h3>{copy.title[locale]}</h3>
      <p>{copy.intro[locale]}</p>
      <div className="spatial-controls">
        <button aria-pressed={!spatial} onClick={() => setSpatial(false)}>
          {copy.flat[locale]}
        </button>
        <button aria-pressed={spatial} onClick={() => setSpatial(true)}>
          {copy.spatial[locale]}
        </button>
        <label>
          {copy.layers[locale]}: {layers}
          <input
            aria-label={copy.layers[locale]}
            type="range"
            min="1"
            max="4"
            value={layers}
            onChange={(e) => setLayers(+e.target.value)}
          />
        </label>
        <label>
          {copy.kernel[locale]}
          <select value={kernel} onChange={(e) => setKernel(+e.target.value)}>
            <option value="3">3 × 3</option>
            <option value="5">5 × 5</option>
          </select>
        </label>
        {spatial && (
          <label>
            {copy.angle[locale]}: {angle}°
            <input
              aria-label={copy.angle[locale]}
              type="range"
              min="-60"
              max="60"
              value={angle}
              onChange={(e) => setAngle(+e.target.value)}
            />
          </label>
        )}
      </div>
      <div className="spatial-comparison">
        <figure>
          <svg
            viewBox="0 0 600 440"
            role="img"
            aria-label={`${copy.input[locale]}: ${width} × ${width}. ${copy.output[locale]}: 1 × 1.`}
          >
            {polygons.map(({ layer, width: w }) => {
              const pts = corners(w / 2, layer);
              const next = polygons[layer + 1];
              return (
                <g key={layer}>
                  <polygon
                    points={pts.map((p) => `${p.x},${p.y}`).join(' ')}
                    fill="var(--palette-blue)"
                    fillOpacity={0.08 + layer * 0.04}
                    stroke="var(--accent)"
                    strokeWidth="1.5"
                  />
                  {Array.from({ length: w - 1 }, (_, i) => i + 1 - w / 2).map((v) => {
                    const a = project(v, -w / 2, layer),
                      b = project(v, w / 2, layer),
                      c = project(-w / 2, v, layer),
                      d = project(w / 2, v, layer);
                    return (
                      <path
                        key={v}
                        d={`M${a.x},${a.y} L${b.x},${b.y} M${c.x},${c.y} L${d.x},${d.y}`}
                        stroke="var(--accent)"
                        strokeOpacity=".25"
                        fill="none"
                      />
                    );
                  })}
                  {spatial &&
                    next &&
                    corners(next.width / 2, layer + 1).map((p, i) => (
                      <line
                        key={i}
                        x1={pts[i].x}
                        y1={pts[i].y}
                        x2={p.x}
                        y2={p.y}
                        stroke="var(--accent)"
                        strokeDasharray="4 4"
                        opacity=".6"
                      />
                    ))}
                  {spatial && (
                    <text x="12" y={325 - layer * 60} fill="var(--text)" fontSize="14">
                      {layer === 0 ? copy.input[locale] : `${copy.layer[locale]} ${layer}`} · {w}×
                      {w}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
          <figcaption>
            {spatial
              ? copy.axes[locale]
              : `${copy.input[locale]}: ${width} × ${width} → ${copy.output[locale]}: 1 × 1`}
          </figcaption>
        </figure>
        <table>
          <caption>{copy.width[locale]}</caption>
          <thead>
            <tr>
              <th>{copy.layer[locale]}</th>
              <th>{copy.width[locale]}</th>
            </tr>
          </thead>
          <tbody>
            {polygons.map((p) => (
              <tr key={p.layer}>
                <th>{p.layer === 0 ? copy.input[locale] : p.layer}</th>
                <td>
                  {p.width} × {p.width}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="spatial-result" aria-live="polite">
        1 + {layers} × ({kernel} − 1) = <strong>{width}</strong>
      </p>
      <p className="small">{copy.note[locale]}</p>
      <button
        className="text-action"
        onClick={() => {
          setLayers(3);
          setKernel(3);
          setAngle(-25);
          setSpatial(false);
        }}
      >
        {copy.reset[locale]}
      </button>
    </section>
  );
}
