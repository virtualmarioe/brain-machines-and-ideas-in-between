'use client';
import { useState, type ReactNode } from 'react';
import type { DistinctKind, Locale } from '@/types/history';
import { distinctCopy, local } from '@/content/translations/distinct-demos';
import { demoTranslations } from '@/content/translations/demos';
import { Frame, Range, number } from './DemoPrimitives';
import {
  distinctValues,
  digitTemplates,
  digitDistances,
  replaySample,
} from '@/lib/distinct-simulations';

export default function DistinctDemo({ kind, locale }: { kind: DistinctKind; locale: Locale }) {
  const defaults: Record<DistinctKind, [number, number]> = {
    arbor: [2, 0],
    synapse: [3, 0],
    orientation: [45, 0],
    sharing: [5, 0],
    rectifier: [-1, 0],
    digits: [0, 0],
    'q-update': [1, 2],
    surprise: [0.5, 1],
    replay: [0, 0],
    'tree-search': [0.5, 0],
    representations: [0, 0],
  };
  const [a, setA] = useState(defaults[kind][0]);
  const [b, setB] = useState(defaults[kind][1]);
  const [value, setValue] = useState(0);
  const [pixels, setPixels] = useState([...digitTemplates[0]]);
  const c = distinctCopy[kind];
  const l = (en: string, de: string, es: string) => local([en, de, es], locale);
  const n = (x: number) => number(x, locale);
  const slider = (
    label: string,
    v: number,
    change: (v: number) => void,
    min: number,
    max: number,
    step = 1,
  ) => (
    <Range
      label={label}
      value={v}
      onChange={change}
      min={min}
      max={max}
      step={step}
      locale={locale}
    />
  );
  const bars = (rows: [string, number][], max = 1) => (
    <div className="distinct-bars">
      {rows.map(([label, v]) => (
        <div key={label}>
          <span>{label}</span>
          <div className="distinct-bar-track">
            <div style={{ width: `${Math.min(100, (Math.abs(v) / max) * 100)}%` }} />
          </div>
          <output>{n(v)}</output>
        </div>
      ))}
    </div>
  );
  const values = distinctValues(kind, a, b);
  let content: ReactNode;
  switch (kind) {
    case 'arbor': {
      const branches: ReactNode[] = [];
      function branch(x: number, y: number, depth: number, spread: number) {
        if (depth > a) return;
        for (const sign of [-1, 1]) {
          const nx = x + sign * spread,
            ny = y - 38;
          branches.push(<line key={`${depth}-${nx}`} x1={x} y1={y} x2={nx} y2={ny} />);
          branch(nx, ny, depth + 1, spread / 2);
        }
      }
      branch(200, 190, 1, 85);
      content = (
        <>
          {slider(
            l('Branching levels', 'Verzweigungsebenen', 'Niveles de ramificación'),
            a,
            setA,
            1,
            4,
          )}
          <svg
            viewBox="0 0 400 220"
            className="distinct-diagram"
            role="img"
            aria-label={`${2 ** a} ${l('tips', 'Spitzen', 'puntas')}`}
          >
            <g>{branches}</g>
            <circle cx="200" cy="190" r="9" />
          </svg>
          <p aria-live="polite">
            {l('Tips / segments', 'Spitzen / Segmente', 'Puntas / segmentos')}:{' '}
            <strong>{values.join(' / ')}</strong>
          </p>
        </>
      );
      break;
    }
    case 'synapse':
      content = (
        <>
          {slider(
            l('Contact delay (ms)', 'Kontaktverzögerung (ms)', 'Retraso del contacto (ms)'),
            a,
            setA,
            1,
            8,
          )}
          <svg
            viewBox="0 0 400 130"
            className="distinct-diagram"
            role="img"
            aria-label={`A: 0, 10, 20 ms; B: ${a}, ${a + 10}, ${a + 20} ms`}
          >
            <text x="5" y="34">
              A
            </text>
            <text x="5" y="94">
              B
            </text>
            {[0, 10, 20].map((t) => (
              <g key={t}>
                <path d={`M${40 + t * 10} 45v-25v25 M${40 + (t + a) * 10} 105v-25v25`} />
                <line
                  className="distinct-guide"
                  x1={40 + t * 10}
                  y1="45"
                  x2={40 + (t + a) * 10}
                  y2="80"
                />
              </g>
            ))}
            <text x="240" y="125">
              0 → 30 ms
            </text>
          </svg>
          <p aria-live="polite">
            A: 0, 10, 20 ms → B: {a}, {a + 10}, {a + 20} ms
          </p>
        </>
      );
      break;
    case 'orientation':
      content = (
        <>
          {slider(
            l('Stimulus angle (°)', 'Reizwinkel (°)', 'Ángulo del estímulo (°)'),
            a,
            setA,
            0,
            180,
            5,
          )}
          <svg
            viewBox="0 0 400 150"
            className="distinct-diagram"
            role="img"
            aria-label={`${a}°; ${n(values[0])}`}
          >
            <circle cx="100" cy="75" r="55" className="distinct-guide" />
            <line x1="55" y1="75" x2="145" y2="75" transform={`rotate(${-a} 100 75)`} />
            <path className="distinct-guide" d="M210 125H390M210 125V20" />
            <text x="205" y="145">
              0°
            </text>
            <text x="290" y="145">
              90°
            </text>
            <text x="365" y="145">
              180°
            </text>
            <polyline
              points={Array.from(
                { length: 37 },
                (_, i) => `${210 + i * 5},${125 - Math.sin((i * 5 * Math.PI) / 180) ** 2 * 100}`,
              ).join(' ')}
            />
            <circle cx={210 + a} cy={125 - values[0] * 100} r="5" />
          </svg>
          {bars([
            [l('Normalized response', 'Normierte Antwort', 'Respuesta normalizada'), values[0]],
          ])}
        </>
      );
      break;
    case 'sharing':
      content = (
        <>
          {slider(
            l('Image width (pixels)', 'Bildbreite (Pixel)', 'Ancho de imagen (píxeles)'),
            a,
            setA,
            3,
            12,
          )}
          <div className="distinct-kernels" aria-hidden="true">
            {Array.from({ length: values[0] }, (_, i) => (
              <span key={i}>3×3</span>
            ))}
          </div>
          <p>
            {l('Filter positions', 'Filterpositionen', 'Posiciones del filtro')}: {values[0]}
          </p>
          {bars(
            [
              [l('Shared parameters', 'Geteilte Parameter', 'Parámetros compartidos'), 10],
              [
                l('Unshared parameters', 'Ungeteilte Parameter', 'Parámetros no compartidos'),
                values[1],
              ],
            ],
            1000,
          )}
          <p>
            3 × 3 + 1 = 10; 10 × ({a} − 2)² = {values[1]}
          </p>
        </>
      );
      break;
    case 'rectifier':
      content = (
        <>
          {slider(l('Input', 'Eingang', 'Entrada'), a, setA, -2, 2, 0.1)}
          <svg
            viewBox="0 0 300 190"
            className="distinct-diagram"
            role="img"
            aria-label={`ReLU(${n(a)}) = ${n(values[0])}`}
          >
            <path className="distinct-guide" d="M20 150H280M150 175V20" />
            <path d="M30 150H150L270 30" />
            <circle cx={150 + a * 60} cy={150 - values[0] * 60} r="6" />
            <text x="250" y="172">
              x
            </text>
          </svg>
          {bars(
            [
              [l('Output', 'Ausgabe', 'Salida'), values[0]],
              [l('Local gradient', 'Lokaler Gradient', 'Gradiente local'), values[1]],
            ],
            2,
          )}
        </>
      );
      break;
    case 'digits': {
      const distances = digitDistances(pixels);
      content = (
        <>
          <div className="scidemo-actions">
            {[0, 1].map((d) => (
              <button key={d} onClick={() => setPixels([...digitTemplates[d]])}>
                {l('Load', 'Laden', 'Cargar')} {d}
              </button>
            ))}
          </div>
          <div
            className="distinct-pixels"
            role="group"
            aria-label={l('Editable pixels', 'Bearbeitbare Pixel', 'Píxeles editables')}
          >
            {pixels.map((p, i) => (
              <button
                key={i}
                aria-label={`${l('Row', 'Zeile', 'Fila')} ${Math.floor(i / 5) + 1}, ${l('column', 'Spalte', 'columna')} ${(i % 5) + 1}`}
                aria-pressed={!!p}
                onClick={() => setPixels((ps) => ps.map((v, j) => (i === j ? 1 - v : v)))}
              />
            ))}
          </div>
          {bars(
            [
              [l('Mismatches with 0', 'Abweichungen von 0', 'Diferencias con 0'), distances[0]],
              [l('Mismatches with 1', 'Abweichungen von 1', 'Diferencias con 1'), distances[1]],
            ],
            25,
          )}
          <p aria-live="polite">
            {l('Closest template', 'Nächste Vorlage', 'Plantilla más cercana')}:{' '}
            <strong>
              {distances[0] === distances[1]
                ? l('Tie', 'Gleichstand', 'Empate')
                : distances[0] < distances[1]
                  ? '0'
                  : '1'}
            </strong>
          </p>
        </>
      );
      break;
    }
    case 'q-update':
      content = (
        <>
          {slider('Q(A)', a, setA, -2, 3, 0.1)}
          {slider('Q(B)', b, setB, -2, 3, 0.1)}
          <p>
            1 + 0.9 × max({n(a)}, {n(b)}) = {n(values[0])}
          </p>
          <button
            className="scidemo-primary"
            onClick={() => setValue((v) => v + 0.25 * (values[0] - v))}
          >
            {l('Apply one update', 'Einmal aktualisieren', 'Aplicar una actualización')}
          </button>
          <p aria-live="polite">
            Q = <strong>{n(value)}</strong>; {l('target', 'Ziel', 'objetivo')} = {n(values[0])}
          </p>
        </>
      );
      break;
    case 'surprise':
      content = (
        <>
          {slider(
            l('Expected reward', 'Erwartete Belohnung', 'Recompensa esperada'),
            a,
            setA,
            0,
            2,
            0.1,
          )}
          {slider(
            l('Delivered reward', 'Erhaltene Belohnung', 'Recompensa recibida'),
            b,
            setB,
            0,
            2,
            0.1,
          )}
          <svg
            viewBox="0 0 400 130"
            className="distinct-diagram"
            role="img"
            aria-label={`δ = ${n(values[0])}`}
          >
            <path className="distinct-guide" d="M20 65H380" />
            <path d={`M60 65H185L200 ${65 - values[0] * 25}L215 65H340`} />
            <text x="10" y="20">
              +
            </text>
            <text x="10" y="118">
              −
            </text>
          </svg>
          <p aria-live="polite">
            δ = {n(b)} − {n(a)} = <strong>{n(values[0])}</strong>
          </p>
        </>
      );
      break;
    case 'replay': {
      const sample = replaySample(a);
      content = (
        <>
          <p>
            {l(
              'Buffer: time indices 1–12',
              'Puffer: Zeitindizes 1–12',
              'Búfer: índices temporales 1–12',
            )}
          </p>
          <div className="distinct-buffer">
            {Array.from({ length: 12 }, (_, i) => (
              <span key={i} data-active={sample.includes(i + 1)}>
                {i + 1}
              </span>
            ))}
          </div>
          <button className="scidemo-primary" onClick={() => setA((v) => v + 1)}>
            {l('Draw another sample', 'Neue Stichprobe ziehen', 'Extraer otra muestra')}
          </button>
          <p>{l('Consecutive', 'Aufeinanderfolgend', 'Consecutivas')}: 9, 10, 11, 12</p>
          <p aria-live="polite">
            {l('Replay sample', 'Replay-Stichprobe', 'Muestra replay')}:{' '}
            <strong>{sample.join(', ')}</strong>
          </p>
          <p>
            {l('Time span', 'Zeitspanne', 'Intervalo temporal')}:{' '}
            {Math.max(...sample) - Math.min(...sample)} (
            {l('consecutive', 'aufeinanderfolgend', 'consecutivas')}: 3)
          </p>
        </>
      );
      break;
    }
    case 'tree-search':
      content = (
        <>
          {slider(
            l('Exploration strength c', 'Explorationsstärke c', 'Intensidad de exploración c'),
            a,
            setA,
            0,
            3,
            0.1,
          )}
          <p>A: Q=0.7, P=0.6, n=20; B: Q=0.4, P=0.4, n=2; N=22</p>
          {bars(
            [
              ['A', values[0]],
              ['B', values[1]],
            ],
            3,
          )}
          <p aria-live="polite">
            {l('Investigate next', 'Als Nächstes untersuchen', 'Investigar a continuación')}:{' '}
            <strong>
              {Math.abs(values[0] - values[1]) < 1e-9 ? 'A = B' : values[0] > values[1] ? 'A' : 'B'}
            </strong>
          </p>
          <p>Q + cP√N / (1 + n)</p>
        </>
      );
      break;
    case 'representations': {
      const points = [
        [0, 0],
        [1, 0],
        [0, 1 + a],
      ];
      const pairs = [
        [0, 1],
        [0, 2],
        [1, 2],
      ];
      content = (
        <>
          {slider(
            l('Distort stimulus C', 'Reiz C verzerren', 'Distorsionar estímulo C'),
            a,
            setA,
            0,
            2,
            0.1,
          )}
          <button aria-pressed={!!b} onClick={() => setB(b ? 0 : 1)}>
            {l('Swap model units', 'Modelleinheiten vertauschen', 'Intercambiar unidades')}
          </button>
          <svg
            viewBox="0 0 400 190"
            className="distinct-diagram"
            role="img"
            aria-label={l(
              'Response spaces: reference and model',
              'Antworträume: Referenz und Modell',
              'Espacios de respuesta: referencia y modelo',
            )}
          >
            {[0, 1].map((space) => (
              <g key={space} transform={`translate(${space * 200 + 25} 20)`}>
                <text x="10" y="-5">
                  {space
                    ? l('Model', 'Modell', 'Modelo')
                    : l('Reference', 'Referenz', 'Referencia')}
                </text>
                <path className="distinct-guide" d="M0 0V150H150" />
                {(space
                  ? points
                  : [
                      [0, 0],
                      [1, 0],
                      [0, 1],
                    ]
                ).map((p, i) => {
                  const x = space && b ? p[1] : p[0],
                    y = space && b ? p[0] : p[1];
                  return (
                    <g key={i}>
                      <circle cx={10 + x * 40} cy={140 - y * 40} r="5" />
                      <text x={18 + x * 40} y={140 - y * 40}>
                        {'ABC'[i]}
                      </text>
                    </g>
                  );
                })}
              </g>
            ))}
          </svg>
          <table className="scidemo-table">
            <caption>
              {l('Pairwise distances', 'Paarweise Abstände', 'Distancias por pares')}
            </caption>
            <thead>
              <tr>
                <th scope="col">{l('Pair', 'Paar', 'Par')}</th>
                <th scope="col">{l('Reference', 'Referenz', 'Referencia')}</th>
                <th scope="col">{l('Model', 'Modell', 'Modelo')}</th>
              </tr>
            </thead>
            <tbody>
              {pairs.map(([i, j], k) => (
                <tr key={k}>
                  <th scope="row">
                    {'ABC'[i]}–{'ABC'[j]}
                  </th>
                  <td>{n([1, 1, Math.SQRT2][k])}</td>
                  <td>{n(values[k])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      );
      break;
    }
  }
  return (
    <Frame
      t={demoTranslations[locale]}
      title={local(c.title, locale)}
      intro={local(c.intro, locale)}
      onReset={() => {
        setA(defaults[kind][0]);
        setB(defaults[kind][1]);
        setValue(0);
        setPixels([...digitTemplates[0]]);
      }}
    >
      <div className="distinct-demo" data-demo-kind={kind}>
        {content}
      </div>
      <p className="scidemo-note">{local(c.note, locale)}</p>
    </Frame>
  );
}
