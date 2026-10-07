'use client';

import dynamic from 'next/dynamic';
import { useId, useState } from 'react';
import {
  distinctKinds,
  type DistinctKind,
  type ConceptDemoKind,
  type DemoKind,
  type Locale,
} from '../../types/history';
import { demoTranslations, type DemoStrings } from '../../content/translations/demos';
import {
  correlateValid,
  decisionBoundary,
  forwardAndBackward,
  lineFilters,
  lineStimulus,
  perceptron,
  trainStep,
  type FilterKind,
  type Matrix,
  type NetworkState,
} from '../../lib/simulations';
import { Frame, Range, number } from './DemoPrimitives';
import { ConceptDemo } from './ConceptDemo';
import { signedColor, textOn, scaleColor, sequential } from '../../lib/colors';
import { ColorLegend } from './ColorLegend';
import './demos.css';
const DistinctDemo = dynamic(() => import('./DistinctDemo'));
const SpatialReceptiveField = dynamic(() => import('./SpatialReceptiveField'));
function SpatialExtension({ locale }: DemoProps) {
  const [open, setOpen] = useState(false);
  return (
    <details className="spatial-extension" onToggle={(e) => setOpen(e.currentTarget.open)}>
      <summary>
        {
          {
            en: 'Explore receptive fields across layers',
            de: 'Rezeptive Felder über Schichten erkunden',
            es: 'Explorar campos receptivos entre capas',
          }[locale]
        }
      </summary>
      {open && <SpatialReceptiveField locale={locale} />}
    </details>
  );
}

interface DemoProps {
  locale: Locale;
}
function PerceptronDemo({ locale }: DemoProps) {
  const t = demoTranslations[locale];
  const initial = { x1: 0.55, x2: 0.35, w1: 1, w2: -0.7, bias: 0 };
  const [state, setState] = useState(initial);
  const update = (key: keyof typeof initial, value: number) =>
    setState((previous) => ({ ...previous, [key]: value }));
  const { x1, x2, w1, w2, bias } = state;
  const result = perceptron(x1, x2, w1, w2, bias);
  const boundary = decisionBoundary(w1, w2, bias);
  const px = (x: number) => 28 + (x + 1) * 112;
  const py = (y: number) => 246 - (y + 1) * 112;
  const titleId = useId();
  const descId = useId();
  return (
    <Frame
      t={t}
      title={t.perceptronTitle}
      intro={t.perceptronIntro}
      onReset={() => setState(initial)}
    >
      <div className="scidemo-two-column">
        <div className="scidemo-plot-panel">
          <svg
            className="scidemo-perceptron"
            viewBox="0 0 282 274"
            role="img"
            aria-labelledby={`${titleId} ${descId}`}
          >
            <title id={titleId}>{t.decisionBoundary}</title>
            <desc id={descId}>
              {t.perceptronGraphic} {t.selectedInput}: ({number(x1, locale)}, {number(x2, locale)}).{' '}
              {t.class}: {result.prediction}.
            </desc>
            {[-1, -0.5, 0, 0.5, 1].map((value) => (
              <g key={value}>
                <line className="scidemo-gridline" x1={px(value)} y1="22" x2={px(value)} y2="246" />
                <line className="scidemo-gridline" x1="28" y1={py(value)} x2="252" y2={py(value)} />
              </g>
            ))}
            <line className="scidemo-axis" x1="28" y1={py(0)} x2="252" y2={py(0)} />
            <line className="scidemo-axis" x1={px(0)} y1="22" x2={px(0)} y2="246" />
            {Array.from({ length: 81 }, (_, index) => {
              const x = (index % 9) / 4 - 1;
              const y = Math.floor(index / 9) / 4 - 1;
              const positive = perceptron(x, y, w1, w2, bias).prediction === 1;
              return positive ? (
                <rect
                  key={index}
                  x={px(x) - 3}
                  y={py(y) - 3}
                  width="6"
                  height="6"
                  className="scidemo-class-one"
                />
              ) : (
                <circle key={index} cx={px(x)} cy={py(y)} r="3" className="scidemo-class-zero" />
              );
            })}
            {boundary.length === 2 && (
              <line
                className="scidemo-boundary"
                x1={px(boundary[0].x)}
                y1={py(boundary[0].y)}
                x2={px(boundary[1].x)}
                y2={py(boundary[1].y)}
              />
            )}
            <path className="scidemo-selected-point" d={`M${px(x1)} ${py(x2) - 8}l8 8-8 8-8-8z`} />
            <text x="263" y="139">
              x₁
            </text>
            <text x="145" y="13">
              x₂
            </text>
            <text x="22" y="266">
              −1
            </text>
            <text x="137" y="266">
              0
            </text>
            <text x="246" y="266">
              1
            </text>
            <text x="9" y="27">
              1
            </text>
            <text x="4" y="247">
              −1
            </text>
          </svg>
          <div className="scidemo-legend">
            <span>
              <i className="scidemo-circle" />
              {t.class} 0
            </span>
            <span>
              <i className="scidemo-square" />
              {t.class} 1
            </span>
            <span>
              <i className="scidemo-diamond" />
              {t.selectedInput}
            </span>
          </div>
          {boundary.length < 2 && <p className="scidemo-small">{t.noBoundary}</p>}
        </div>
        <div className="scidemo-controls">
          <Range
            label={`${t.input} x₁`}
            value={x1}
            min={-1}
            max={1}
            onChange={(value) => update('x1', value)}
            locale={locale}
          />
          <Range
            label={`${t.input} x₂`}
            value={x2}
            min={-1}
            max={1}
            onChange={(value) => update('x2', value)}
            locale={locale}
          />
          <hr />
          <Range
            label={`${t.weight} w₁`}
            value={w1}
            onChange={(value) => update('w1', value)}
            locale={locale}
          />
          <Range
            label={`${t.weight} w₂`}
            value={w2}
            onChange={(value) => update('w2', value)}
            locale={locale}
          />
          <Range
            label={`${t.bias} b`}
            value={bias}
            onChange={(value) => update('bias', value)}
            locale={locale}
          />
        </div>
      </div>
      <div className="scidemo-result" aria-live="polite" aria-atomic="true">
        <div>
          <span>{t.activation}</span>
          <strong>w₁x₁ + w₂x₂ + b = {number(result.activation, locale, 3)}</strong>
        </div>
        <div className="scidemo-class-result">
          <span>{t.output}</span>
          <strong>
            {t.class} {result.prediction}
          </strong>
        </div>
      </div>
      <p className="scidemo-small">{t.threshold}</p>
      <p className="scidemo-note">{t.perceptronNote}</p>
    </Frame>
  );
}

function MatrixGraphic({
  values,
  title,
  description,
  selected,
  weights = false,
  locale,
}: {
  values: Matrix;
  title: string;
  description: string;
  selected?: { row: number; col: number };
  weights?: boolean;
  locale: Locale;
}) {
  const titleId = useId();
  const descId = useId();
  const size = values.length;
  const cell = 32;
  return (
    <svg
      className="scidemo-matrix"
      viewBox={`0 0 ${size * cell + 8} ${size * cell + 8}`}
      role="img"
      aria-labelledby={`${titleId} ${descId}`}
    >
      <title id={titleId}>{title}</title>
      <desc id={descId}>{description}</desc>
      <rect
        x="2"
        y="2"
        width={size * cell + 4}
        height={size * cell + 4}
        className={weights ? 'scidemo-kernel-bg' : 'scidemo-stimulus-bg'}
      />
      {values.flatMap((row, r) =>
        row.map((value, c) => (
          <g key={`${r}-${c}`}>
            <rect
              x={4 + c * cell}
              y={4 + r * cell}
              width={cell - 1}
              height={cell - 1}
              className={weights ? 'scidemo-filter-cell' : 'scidemo-pixel'}
              style={weights ? { fill: signedColor(value, 1 / 3) } : undefined}
              opacity={weights ? 1 : 0.08 + value * 0.92}
            />
            {weights && (
              <text
                style={{ fill: textOn(signedColor(value, 1 / 3)) }}
                x={4 + c * cell + cell / 2}
                y={4 + r * cell + cell / 2 + 3}
                textAnchor="middle"
              >
                {number(value, locale)}
              </text>
            )}
          </g>
        )),
      )}
      {selected && (
        <rect
          x={3 + selected.col * cell}
          y={3 + selected.row * cell}
          width={3 * cell}
          height={3 * cell}
          className="scidemo-patch-outline"
        />
      )}
    </svg>
  );
}

function NumericTable({
  values,
  caption,
  locale,
  t,
}: {
  values: Matrix;
  caption: string;
  locale: Locale;
  t: DemoStrings;
}) {
  return (
    <div className="scidemo-table-scroll" tabIndex={0} role="region" aria-label={caption}>
      <table className="scidemo-table">
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th scope="col">
              {t.row} / {t.column}
            </th>
            {values[0].map((_, col) => (
              <th scope="col" key={col}>
                {col + 1}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {values.map((row, r) => (
            <tr key={r}>
              <th scope="row">{r + 1}</th>
              {row.map((value, c) => (
                <td key={c}>{number(value, locale, 3)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ConvolutionDemo({ locale }: DemoProps) {
  const t = demoTranslations[locale];
  const [angle, setAngle] = useState(90);
  const [filter, setFilter] = useState<FilterKind>('vertical');
  const [selected, setSelected] = useState({ row: 2, col: 2 });
  const filterId = useId();
  const stimulus = lineStimulus(angle);
  const kernel = lineFilters[filter];
  const response = correlateValid(stimulus, kernel);
  const selectedResponse = response[selected.row][selected.col];
  const products = kernel.flatMap((row, r) =>
    row.map((weight, c) => stimulus[selected.row + r][selected.col + c] * weight),
  );
  return (
    <Frame
      t={t}
      title={t.convolutionTitle}
      intro={t.convolutionIntro}
      onReset={() => {
        setAngle(90);
        setFilter('vertical');
        setSelected({ row: 2, col: 2 });
      }}
    >
      <div className="scidemo-convolution-controls">
        <Range
          label={t.orientation}
          value={angle}
          onChange={setAngle}
          min={0}
          max={180}
          step={5}
          locale={locale}
          suffix="°"
        />
        <div className="scidemo-control">
          <label htmlFor={filterId}>{t.filter}</label>
          <select
            id={filterId}
            value={filter}
            onChange={(event) => setFilter(event.target.value as FilterKind)}
          >
            {(['horizontal', 'vertical', 'diagonal'] as const).map((kind) => (
              <option value={kind} key={kind}>
                {t[kind]}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="scidemo-convolution-grids">
        <figure>
          <figcaption>
            {t.stimulus} <span>7 × 7</span>
          </figcaption>
          <MatrixGraphic
            values={stimulus}
            title={t.stimulus}
            description={t.convolutionGraphic}
            selected={selected}
            locale={locale}
          />
        </figure>
        <figure>
          <figcaption>
            {t.filter} <span>3 × 3</span>
          </figcaption>
          <MatrixGraphic
            values={kernel}
            title={t.filter}
            description={t.filterGraphic}
            weights
            locale={locale}
          />
          <ColorLegend locale={locale} limit={1 / 3} signed />
        </figure>
        <figure>
          <figcaption>
            {t.responseMap} <span>5 × 5</span>
          </figcaption>
          <div className="scidemo-response-grid" role="group" aria-label={t.responseMap}>
            {response.flatMap((row, r) =>
              row.map((value, c) => (
                <button
                  type="button"
                  key={`${r}-${c}`}
                  className="scidemo-response-cell"
                  style={{
                    background: signedColor(value, 1),
                    color: textOn(signedColor(value, 1)),
                  }}
                  aria-pressed={selected.row === r && selected.col === c}
                  aria-label={`${t.row} ${r + 1}, ${t.column} ${c + 1}: ${number(value, locale, 3)}`}
                  onClick={() => setSelected({ row: r, col: c })}
                >
                  {number(value, locale, 2)}
                </button>
              )),
            )}
          </div>
          <ColorLegend locale={locale} signed />
        </figure>
      </div>
      <p className="scidemo-small">{t.patchHint}</p>
      <div className="scidemo-result" aria-live="polite" aria-atomic="true">
        <div>
          <span>{t.selectedPatch}</span>
          <strong>
            {t.row} {selected.row + 1}, {t.column} {selected.col + 1}
          </strong>
        </div>
        <div>
          <span>{t.response}</span>
          <strong>{number(selectedResponse, locale, 3)}</strong>
        </div>
      </div>
      <p className="scidemo-small">{t.operationNote}</p>
      <div className="scidemo-comparison">
        <div>
          <h4>{t.idealizedField}</h4>
          <p>
            {t.relativeResponse}:{' '}
            <strong>{number(Math.max(0, selectedResponse), locale, 3)}</strong>
          </p>
          <div
            className="scidemo-magnitude-meter"
            role="meter"
            aria-valuemin={0}
            aria-valuemax={1}
            aria-valuenow={Math.max(0, selectedResponse)}
            aria-label={t.relativeResponse}
          >
            <i
              style={{
                width: `${Math.max(0, selectedResponse) * 100}%`,
                background: scaleColor(sequential, Math.max(0, selectedResponse)),
              }}
            />
          </div>
          <ColorLegend locale={locale} label={t.relativeResponse} />
          <span>r = max(0, Σ IᵢKᵢ)</span>
        </div>
        <div>
          <h4>{t.computationalFilter}</h4>
          <p>
            {t.signedResponse}: <strong>{number(selectedResponse, locale, 3)}</strong>
          </p>
          <div
            className="scidemo-signed-meter"
            role="meter"
            aria-valuemin={-1}
            aria-valuemax={1}
            aria-valuenow={selectedResponse}
            aria-label={t.signedResponse}
          >
            <i style={{ left: `${(selectedResponse + 1) * 50}%` }} />
          </div>
          <ColorLegend locale={locale} signed />
          <span>z = Σ IᵢKᵢ</span>
        </div>
      </div>
      <p className="scidemo-small">{t.comparisonNote}</p>
      <details className="scidemo-details">
        <summary>{t.numericalValues}</summary>
        <NumericTable values={stimulus} caption={t.stimulus} locale={locale} t={t} />
        <NumericTable values={kernel} caption={t.filter} locale={locale} t={t} />
        <p className="scidemo-small">{t.sumOfProducts}</p>
        <p className="scidemo-equation">
          {products.map((value) => `(${number(value, locale, 3)})`).join(' + ')} ={' '}
          {number(selectedResponse, locale, 3)}
        </p>
      </details>
      <div className="scidemo-note">
        <strong>{t.cortexHeading}</strong>
        <p>{t.cortexNote}</p>
      </div>
    </Frame>
  );
}

const initialNetwork: NetworkState = { input: 0.8, target: 0.7, w1: 0.6, w2: -0.4 };

function BackpropagationDemo({ locale }: DemoProps) {
  const t = demoTranslations[locale];
  const [state, setState] = useState<NetworkState>(initialNetwork);
  const [rate, setRate] = useState(0.2);
  const [effectiveRate, setEffectiveRate] = useState<number | null>(null);
  const [losses, setLosses] = useState([forwardAndBackward(initialNetwork).loss]);
  const result = forwardAndBackward(state);
  const diagramId = useId().replaceAll(':', '');
  const update = (key: keyof NetworkState, value: number) => {
    const next = { ...state, [key]: value };
    setState(next);
    setLosses([forwardAndBackward(next).loss]);
    setEffectiveRate(null);
  };
  const train = (count: number) => {
    let next = state;
    let usedRate = rate;
    const nextLosses = [...losses];
    for (let index = 0; index < count; index += 1) {
      const step = trainStep(next, rate);
      next = step.state;
      usedRate = step.effectiveRate;
      nextLosses.push(step.after.loss);
    }
    setState(next);
    setLosses(nextLosses);
    setEffectiveRate(usedRate);
  };
  const reset = () => {
    setState(initialNetwork);
    setRate(0.2);
    setEffectiveRate(null);
    setLosses([forwardAndBackward(initialNetwork).loss]);
  };
  const maxLoss = Math.max(...losses, 0.001);
  const lossPoints = losses
    .map(
      (value, index) =>
        `${12 + (index / Math.max(1, losses.length - 1)) * 296},${74 - (value / maxLoss) * 60}`,
    )
    .join(' ');
  return (
    <Frame t={t} title={t.backpropagationTitle} intro={t.backpropagationIntro} onReset={reset}>
      <svg
        className="scidemo-network"
        viewBox="0 0 400 160"
        role="img"
        aria-labelledby={`${diagramId}-title ${diagramId}-desc`}
      >
        <title id={`${diagramId}-title`}>{t.forward}</title>
        <desc id={`${diagramId}-desc`}>
          {t.networkGraphic} {t.input}: {number(state.input, locale)}. {t.hidden}:{' '}
          {number(result.hidden, locale, 3)}. {t.prediction}: {number(result.prediction, locale, 3)}
          .
        </desc>
        <defs>
          <marker
            id={`${diagramId}-arrow`}
            markerWidth="6"
            markerHeight="6"
            refX="5"
            refY="3"
            orient="auto"
          >
            <path d="M0 0L6 3L0 6z" fill="currentColor" />
          </marker>
        </defs>
        <g className="scidemo-forward-path">
          <path d="M82 65H161M233 65H312" markerEnd={`url(#${diagramId}-arrow)`} />
          <text x="122" y="44" textAnchor="middle">
            w₁ = {number(state.w1, locale)}
          </text>
          <text x="272" y="44" textAnchor="middle">
            w₂ = {number(state.w2, locale)}
          </text>
        </g>
        {[
          { x: 49, label: 'x', value: state.input, title: t.input },
          { x: 198, label: 'tanh', value: result.hidden, title: t.hidden },
          { x: 347, label: 'ŷ', value: result.prediction, title: t.output },
        ].map((node) => (
          <g key={node.x}>
            <circle cx={node.x} cy="65" r="32" className="scidemo-network-unit" />
            <text x={node.x} y="61" textAnchor="middle" className="scidemo-node-symbol">
              {node.label}
            </text>
            <text x={node.x} y="80" textAnchor="middle">
              {number(node.value, locale, 2)}
            </text>
            <text x={node.x} y="16" textAnchor="middle" className="scidemo-node-title">
              {node.title}
            </text>
          </g>
        ))}
        <path
          d="M344 108C310 139 248 139 208 110M190 110C153 139 91 139 53 108"
          className="scidemo-backward-path"
          markerEnd={`url(#${diagramId}-arrow)`}
        />
        <text x="122" y="152" textAnchor="middle">
          ∂L/∂w₁ = {number(result.gradW1, locale, 3)}
        </text>
        <text x="273" y="152" textAnchor="middle">
          ∂L/∂w₂ = {number(result.gradW2, locale, 3)}
        </text>
      </svg>
      <div className="scidemo-network-controls">
        <Range
          label={`${t.input} x`}
          value={state.input}
          min={-1}
          max={1}
          onChange={(value) => update('input', value)}
          locale={locale}
        />
        <Range
          label={`${t.target} t`}
          value={state.target}
          min={-1}
          max={1}
          onChange={(value) => update('target', value)}
          locale={locale}
        />
        <Range
          label={`${t.weight} w₁`}
          value={state.w1}
          min={-Math.max(3, Math.ceil(Math.abs(state.w1)))}
          max={Math.max(3, Math.ceil(Math.abs(state.w1)))}
          onChange={(value) => update('w1', value)}
          locale={locale}
        />
        <Range
          label={`${t.weight} w₂`}
          value={state.w2}
          min={-Math.max(3, Math.ceil(Math.abs(state.w2)))}
          max={Math.max(3, Math.ceil(Math.abs(state.w2)))}
          onChange={(value) => update('w2', value)}
          locale={locale}
        />
      </div>
      <div className="scidemo-train-controls">
        <Range
          label={`${t.learningRate} η`}
          value={rate}
          min={0.01}
          max={1}
          step={0.01}
          onChange={(value) => {
            setRate(value);
            setEffectiveRate(null);
          }}
          locale={locale}
        />
        <div className="scidemo-actions">
          <button type="button" className="scidemo-primary" onClick={() => train(1)}>
            {t.step} →
          </button>
          <button type="button" onClick={() => train(10)}>
            {t.tenSteps}
          </button>
        </div>
      </div>
      <div className="scidemo-result" aria-live="polite" aria-atomic="true">
        <div>
          <span>
            {t.prediction} / {t.target}
          </span>
          <strong>
            {number(result.prediction, locale, 3)} / {number(state.target, locale, 3)}
          </strong>
        </div>
        <div>
          <span>{t.loss}</span>
          <strong>{number(result.loss, locale, 5)}</strong>
        </div>
        <div>
          <span>{t.steps}</span>
          <strong>{losses.length - 1}</strong>
        </div>
      </div>
      {result.gradW1 === 0 && result.gradW2 === 0 && (
        <p className="scidemo-small" role="status">
          {t.zeroGradient}
        </p>
      )}
      {losses.length > 1 && (
        <figure className="scidemo-loss-figure">
          <figcaption>{t.lossHistory}</figcaption>
          <svg
            viewBox="0 0 320 88"
            role="img"
            aria-label={`${t.startLoss}: ${number(losses[0], locale, 5)}. ${t.currentLoss}: ${number(result.loss, locale, 5)}.`}
          >
            <line x1="12" x2="308" y1="74" y2="74" className="scidemo-axis" />
            <polyline points={lossPoints} className="scidemo-loss-line" />
          </svg>
          <p className="scidemo-small">
            {t.startLoss}: {number(losses[0], locale, 5)} · {t.currentLoss}:{' '}
            {number(result.loss, locale, 5)} · {t.effectiveRate}:{' '}
            {number(effectiveRate ?? rate, locale, 5)}
          </p>
        </figure>
      )}
      <details className="scidemo-details">
        <summary>
          {t.forward} &amp; {t.backward}
        </summary>
        <p className="scidemo-equation">
          h = tanh(w₁x) = {number(result.hidden, locale, 4)}
          <br />ŷ = w₂h = {number(result.prediction, locale, 4)}
          <br />L = ½(ŷ − t)² = {number(result.loss, locale, 5)}
        </p>
        <p className="scidemo-equation">
          ∂L/∂w₂ = (ŷ − t)h = {number(result.gradW2, locale, 4)}
          <br />
          ∂L/∂w₁ = (ŷ − t)w₂(1 − h²)x = {number(result.gradW1, locale, 4)}
          <br />w ← w − η∂L/∂w
        </p>
        <p className="scidemo-small">{t.adaptiveNote}</p>
      </details>
      <p className="scidemo-note">{t.backpropagationNote}</p>
    </Frame>
  );
}

export default function ScientificDemo({ kind, locale }: { kind: DemoKind; locale: Locale }) {
  if (kind === 'perceptron') return <PerceptronDemo locale={locale} />;
  if (kind === 'convolution')
    return (
      <>
        <ConvolutionDemo locale={locale} />
        <SpatialExtension locale={locale} />
      </>
    );
  if (kind === 'backpropagation') return <BackpropagationDemo locale={locale} />;
  if ((distinctKinds as readonly string[]).includes(kind))
    return <DistinctDemo key={kind} kind={kind as DistinctKind} locale={locale} />;
  return <ConceptDemo key={kind} kind={kind as ConceptDemoKind} locale={locale} />;
}
