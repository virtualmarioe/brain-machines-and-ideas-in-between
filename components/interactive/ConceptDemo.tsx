'use client';

import { useId, useState, type ComponentType, type ReactNode } from 'react';
import type { ConceptDemoKind, Locale } from '../../types/history';
import { conceptDemoCopy, conceptLabels } from '../../content/translations/concept-demos';
import { demoTranslations } from '../../content/translations/demos';
import {
  attentionWeights,
  binaryEntropy,
  discountedReturn,
  feedbackTrajectory,
  hingeDistance,
  membraneBalance,
  memoryEnergy,
  memoryWeights,
  recallSweep,
  temporalDifference,
} from '../../lib/concept-simulations';
import { Frame, Range, number } from './DemoPrimitives';
import { scaleColor, sequential } from '../../lib/colors';
import { ColorLegend } from './ColorLegend';

type Props = { locale: Locale; kind: ConceptDemoKind };
function Lab({
  locale,
  kind,
  onReset,
  children,
}: Props & { onReset: () => void; children: ReactNode }) {
  const copy = conceptDemoCopy[kind];
  return (
    <Frame
      t={demoTranslations[locale]}
      title={copy.title[locale]}
      intro={copy.intro[locale]}
      onReset={onReset}
    >
      {children}
      <p className="scidemo-note">{copy.note[locale]}</p>
    </Frame>
  );
}
function Results({ values }: { values: [string, ReactNode][] }) {
  return (
    <div className="scidemo-result" aria-live="polite">
      {values.map(([label, value]) => (
        <div key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  );
}
function Toggle({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" className="scidemo-toggle" aria-pressed={active} onClick={onClick}>
      {label}
    </button>
  );
}
function Bar({
  label,
  value,
  text,
  tone = 'model',
}: {
  label: string;
  value: number;
  text: string;
  tone?: 'model' | 'alternative' | 'reference' | 'magnitude';
}) {
  return (
    <div className="concept-bar">
      <div>
        <span>{label}</span>
        <strong>{text}</strong>
      </div>
      <span className="concept-bar-track" aria-hidden="true">
        <i
          data-tone={tone}
          style={{
            width: `${Math.max(0, Math.min(100, value * 100))}%`,
            ...(tone === 'magnitude' ? { background: scaleColor(sequential, value) } : {}),
          }}
        />
      </span>
    </div>
  );
}
function Staining(props: Props) {
  const [density, setDensity] = useState(3);
  const t = conceptLabels[props.locale];
  return (
    <Lab {...props} onReset={() => setDensity(3)}>
      <Range
        label={t.density}
        value={density}
        onChange={setDensity}
        min={1}
        max={24}
        step={1}
        locale={props.locale}
      />
      <svg
        viewBox="0 0 400 190"
        className="concept-stage"
        role="img"
        aria-label={`${t.density}: ${density} / 24`}
      >
        {Array.from({ length: density }, (_, i) => {
          const x = 35 + ((i * 73) % 335);
          const y = 38 + ((i * 43) % 113);
          return (
            <g
              key={i}
              transform={`translate(${x} ${y}) rotate(${((i * 37) % 90) - 45})`}
              className={i === 0 ? 'concept-neuron-selected' : 'concept-neuron'}
            >
              <circle r="5" />
              <path d="M0 0L-13 -17L-33 -29M-13 -17L-10 -37M0 0L18 -13L36 -12M18 -13L25 -34M0 0L-9 18L-29 31M-9 18L-3 40M0 0L23 26L42 49M23 26L39 26" />
            </g>
          );
        })}
      </svg>
      <p className="scidemo-small">
        {t.density}: {density} / 24
      </p>
    </Lab>
  );
}
function Logic(props: Props) {
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  const [gate, setGate] = useState<'and' | 'or'>('and');
  const t = conceptLabels[props.locale];
  const xor = props.kind === 'xor';
  const any = a || b;
  const both = a && b;
  const result = xor ? any && !both : gate === 'and' ? both : any;
  return (
    <Lab
      {...props}
      onReset={() => {
        setA(true);
        setB(false);
        setGate('and');
      }}
    >
      <div className="scidemo-actions">
        <Toggle label={`${t.inputA}: ${a ? 1 : 0}`} active={a} onClick={() => setA(!a)} />
        <Toggle label={`${t.inputB}: ${b ? 1 : 0}`} active={b} onClick={() => setB(!b)} />
      </div>
      {!xor && (
        <div className="scidemo-actions concept-spaced">
          <Toggle label={t.and} active={gate === 'and'} onClick={() => setGate('and')} />
          <Toggle label={t.or} active={gate === 'or'} onClick={() => setGate('or')} />
        </div>
      )}
      {xor ? (
        <Results
          values={[
            [t.hiddenOr, Number(any)],
            [t.hiddenAnd, Number(both)],
            ['XOR', Number(result)],
          ]}
        />
      ) : (
        <Results
          values={[
            [`${t.inputA} + ${t.inputB}`, Number(a) + Number(b)],
            [t.threshold, gate === 'and' ? 2 : 1],
            [t.result, Number(result)],
          ]}
        />
      )}
      <table className="scidemo-table">
        <caption>{xor ? 'XOR' : t[gate]}</caption>
        <thead>
          <tr>
            <th scope="col">A</th>
            <th scope="col">B</th>
            <th scope="col">{t.result}</th>
          </tr>
        </thead>
        <tbody>
          {[0, 1, 2, 3].map((i) => {
            const x = Math.floor(i / 2),
              y = i % 2;
            return (
              <tr
                key={i}
                className={Number(a) === x && Number(b) === y ? 'concept-current-row' : undefined}
              >
                <td>{x}</td>
                <td>{y}</td>
                <td>{xor ? Number(x !== y) : gate === 'and' ? x * y : Number(x + y > 0)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Lab>
  );
}
function Hebbian(props: Props) {
  const [pre, setPre] = useState(1);
  const [post, setPost] = useState(1);
  const [weight, setWeight] = useState(0.2);
  const t = conceptLabels[props.locale];
  return (
    <Lab
      {...props}
      onReset={() => {
        setPre(1);
        setPost(1);
        setWeight(0.2);
      }}
    >
      <div className="scidemo-network-controls">
        <Range
          label={t.activityPre}
          value={pre}
          onChange={setPre}
          min={0}
          max={1}
          locale={props.locale}
        />
        <Range
          label={t.activityPost}
          value={post}
          onChange={setPost}
          min={0}
          max={1}
          locale={props.locale}
        />
      </div>
      <svg
        viewBox="0 0 400 100"
        className="concept-stage"
        role="img"
        aria-label={`${t.connection}: ${number(weight, props.locale)}`}
      >
        <line
          x1="85"
          x2="315"
          y1="50"
          y2="50"
          className="scidemo-boundary"
          style={{ strokeWidth: 1 + weight * 15 }}
        />
        <circle cx="65" cy="50" r={15 + pre * 12} className="scidemo-network-unit" />
        <circle cx="335" cy="50" r={15 + post * 12} className="scidemo-network-unit" />
      </svg>
      <button onClick={() => setWeight((w) => Math.min(1, w + 0.1 * pre * post))}>{t.pair}</button>
      <Results
        values={[
          [t.connection, number(weight, props.locale)],
          ['Δw', number(Math.min(1 - weight, 0.1 * pre * post), props.locale)],
        ]}
      />
    </Lab>
  );
}
function Tape(props: Props) {
  const initial = [1, 0, 1, 1, 0, 0];
  const [bits, setBits] = useState(initial);
  const [head, setHead] = useState(0);
  const t = conceptLabels[props.locale];
  return (
    <Lab
      {...props}
      onReset={() => {
        setBits(initial);
        setHead(0);
      }}
    >
      <div className="concept-tape">
        {bits.map((bit, i) => (
          <button
            key={i}
            className={i === head ? 'concept-current' : undefined}
            aria-label={`${t.cell} ${i + 1}: ${bit}`}
            aria-current={i === head ? 'step' : undefined}
            onClick={() => {
              setBits(bits.map((v, j) => (j === i ? 1 - v : v)));
              setHead(0);
            }}
          >
            <span aria-hidden="true">{i === head ? '↓' : '·'}</span>
            {bit}
          </button>
        ))}
      </div>
      <button
        disabled={head === bits.length}
        onClick={() => {
          setBits(bits.map((v, i) => (i === head ? 1 - v : v)));
          setHead(head + 1);
        }}
      >
        {t.step}
      </button>
      <Results
        values={[
          [t.head, head === bits.length ? t.halted : head + 1],
          [t.result, bits.join(' ')],
        ]}
      />
    </Lab>
  );
}
function StoredProgram(props: Props) {
  const [multiply, setMultiply] = useState(false);
  const [pc, setPc] = useState(0);
  const t = conceptLabels[props.locale];
  const value = pc === 0 ? 0 : pc === 1 ? 3 : multiply ? 6 : 5;
  return (
    <Lab
      {...props}
      onReset={() => {
        setMultiply(false);
        setPc(0);
      }}
    >
      <div className="scidemo-actions">
        <Toggle
          label={t.add}
          active={!multiply}
          onClick={() => {
            setMultiply(false);
            setPc(0);
          }}
        />
        <Toggle
          label={t.multiply}
          active={multiply}
          onClick={() => {
            setMultiply(true);
            setPc(0);
          }}
        />
      </div>
      <ol className="concept-program" aria-label={t.memory}>
        {[t.load, multiply ? t.multiply : t.add, t.store].map((label, i) => (
          <li key={label} aria-current={pc === i ? 'step' : undefined}>
            {label} {pc === i ? '←' : ''}
          </li>
        ))}
      </ol>
      <button disabled={pc === 3} onClick={() => setPc(pc + 1)}>
        {t.step}
      </button>
      <Results
        values={[
          [t.accumulator, value],
          [t.output, pc === 3 ? value : t.pending],
        ]}
      />
    </Lab>
  );
}
function Entropy(props: Props) {
  const [p, setP] = useState(0.5);
  const t = conceptLabels[props.locale];
  const entropy = binaryEntropy(p);
  return (
    <Lab {...props} onReset={() => setP(0.5)}>
      <Range
        label={t.probability}
        value={p}
        min={0}
        max={1}
        step={0.01}
        onChange={setP}
        locale={props.locale}
      />
      <div className="concept-spaced">
        <Bar label="0" value={1 - p} text={`${number((1 - p) * 100, props.locale, 0)} %`} />
        <Bar
          tone="alternative"
          label="1"
          value={p}
          text={`${number(p * 100, props.locale, 0)} %`}
        />
      </div>
      <svg
        viewBox="0 0 360 160"
        className="concept-stage"
        role="img"
        aria-label={`${t.entropy}: ${number(entropy, props.locale)} ${t.bit}`}
      >
        <line x1="20" x2="340" y1="135" y2="135" className="scidemo-axis" />
        <polyline
          className="scidemo-loss-line"
          points={Array.from(
            { length: 101 },
            (_, i) => `${20 + i * 3.2},${135 - binaryEntropy(i / 100) * 110}`,
          ).join(' ')}
        />
        <circle
          cx={20 + p * 320}
          cy={135 - entropy * 110}
          r="5"
          className="scidemo-selected-point"
        />
        <text x="20" y="153">
          p = 0
        </text>
        <text x="304" y="153">
          p = 1
        </text>
        <text x="130" y="17">
          H = 1 bit
        </text>
      </svg>
      <Results values={[[t.entropy, `${number(entropy, props.locale)} ${t.bit}`]]} />
    </Lab>
  );
}
function Feedback(props: Props) {
  const [gain, setGain] = useState(0.5);
  const t = conceptLabels[props.locale];
  const values = feedbackTrajectory(gain);
  return (
    <Lab {...props} onReset={() => setGain(0.5)}>
      <Range
        label={t.gain}
        min={0}
        max={2}
        step={0.1}
        value={gain}
        onChange={setGain}
        locale={props.locale}
      />
      <svg
        viewBox="0 0 400 190"
        className="concept-stage"
        role="img"
        aria-label={`${t.target}: 1; ${t.measured}: ${number(values.at(-1)!, props.locale)}`}
      >
        <line x1="24" x2="375" y1="88" y2="88" className="scidemo-backward-path" />
        <text x="275" y="76">
          {t.target}: 1
        </text>
        <line x1="24" x2="375" y1="160" y2="160" className="scidemo-axis" />
        <polyline
          className="scidemo-loss-line"
          points={values.map((v, i) => `${24 + i * 29},${160 - v * 72}`).join(' ')}
        />
        <text x="24" y="180">
          0
        </text>
        <text x="335" y="180">
          12
        </text>
      </svg>
      <details className="scidemo-details">
        <summary>{demoTranslations[props.locale].numericalValues}</summary>
        <table className="scidemo-table">
          <thead>
            <tr>
              <th scope="col">{t.ordinalStep}</th>
              <th scope="col">{t.measured}</th>
            </tr>
          </thead>
          <tbody>
            {values.map((v, i) => (
              <tr key={i}>
                <td>{i}</td>
                <td>{number(v, props.locale, 3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </Lab>
  );
}
function Symbolic(props: Props) {
  const [rain, setRain] = useState(true);
  const [wet, setWet] = useState(false);
  const [round, setRound] = useState(0);
  const t = conceptLabels[props.locale];
  const inferredWet = wet || (rain && round > 0);
  const slippery = (wet && round > 0) || (rain && round > 1);
  return (
    <Lab
      {...props}
      onReset={() => {
        setRain(true);
        setWet(false);
        setRound(0);
      }}
    >
      <div className="scidemo-actions">
        <Toggle
          label={t.rain}
          active={rain}
          onClick={() => {
            setRain(!rain);
            setRound(0);
          }}
        />
        <Toggle
          label={t.wet}
          active={wet}
          onClick={() => {
            setWet(!wet);
            setRound(0);
          }}
        />
      </div>
      <ol className="concept-program">
        <li>
          {t.rain} → {t.wet}
        </li>
        <li>
          {t.wet} → {t.slippery}
        </li>
      </ol>
      <button disabled={round === 2} onClick={() => setRound(round + 1)}>
        {t.infer}
      </button>
      <Results
        values={[
          [t.rain, rain ? t.known : t.unknown],
          [t.wet, inferredWet ? t.known : t.unknown],
          [t.slippery, slippery ? t.known : t.unknown],
          [t.round, round],
        ]}
      />
    </Lab>
  );
}
const storedPattern = [1, -1, -1, 1, 1, -1, -1, 1, 1, 1, 1, 1, 1, -1, -1, 1];
const storedWeights = memoryWeights(storedPattern);
function Memory(props: Props) {
  const [cue, setCue] = useState(storedPattern.map((v, i) => (i === 5 || i === 12 ? -v : v)));
  const t = conceptLabels[props.locale];
  return (
    <Lab
      {...props}
      onReset={() => setCue(storedPattern.map((v, i) => (i === 5 || i === 12 ? -v : v)))}
    >
      <div className="concept-memory-pair">
        <figure>
          <figcaption>{t.stored}</figcaption>
          <div className="concept-pixels" role="img" aria-label={t.stored + ': H'}>
            {storedPattern.map((v, i) => (
              <span key={i} className={v === 1 ? 'is-on' : ''} />
            ))}
          </div>
        </figure>
        <figure>
          <figcaption>{t.cue}</figcaption>
          <div className="concept-pixels">
            {cue.map((v, i) => (
              <button
                key={i}
                aria-label={`${t.cell} ${i + 1}`}
                aria-pressed={v === 1}
                onClick={() => setCue(cue.map((p, j) => (j === i ? -p : p)))}
              />
            ))}
          </div>
        </figure>
      </div>
      <button className="concept-spaced" onClick={() => setCue(recallSweep(cue, storedWeights))}>
        {t.recall}
      </button>
      <Results
        values={[
          [t.errors, cue.filter((v, i) => v !== storedPattern[i]).length],
          [t.energy, number(memoryEnergy(cue, storedWeights), props.locale)],
        ]}
      />
    </Lab>
  );
}
function Sampling(props: Props) {
  const [share, setShare] = useState(90);
  const t = conceptLabels[props.locale];
  return (
    <Lab {...props} onReset={() => setShare(90)}>
      <Range
        label={t.share}
        value={share}
        onChange={setShare}
        min={1}
        max={99}
        step={1}
        suffix=" %"
        locale={props.locale}
      />
      <div className="concept-samples" aria-label={`${t.share}: ${share} %`}>
        {Array.from({ length: 100 }, (_, i) => (
          <span aria-hidden="true" key={i} className={i < share ? 'class-a' : 'class-b'}>
            {i < share ? 'A' : 'B'}
          </span>
        ))}
      </div>
      <Results
        values={[
          [t.accuracy, `${share} %`],
          [t.recallA, '100 %'],
          [t.recallB, '0 %'],
        ]}
      />
    </Lab>
  );
}
function Planning(props: Props) {
  const [discount, setDiscount] = useState(0.8);
  const t = conceptLabels[props.locale];
  const a = discountedReturn([2, 0], discount);
  const b = discountedReturn([0, 5], discount);
  return (
    <Lab {...props} onReset={() => setDiscount(0.8)}>
      <Range
        label={t.discount}
        value={discount}
        onChange={setDiscount}
        min={0}
        max={1}
        step={0.05}
        locale={props.locale}
      />
      <div className="scidemo-comparison">
        <div>
          <h4>{t.routeA}</h4>
          <p>
            {t.now}: +2 → {t.later}: 0
          </p>
          <Bar label={t.return} value={a / 5} text={number(a, props.locale)} />
        </div>
        <div>
          <h4>{t.routeB}</h4>
          <p>
            {t.now}: 0 → {t.later}: +5
          </p>
          <Bar tone="alternative" label={t.return} value={b / 5} text={number(b, props.locale)} />
        </div>
      </div>
      <Results values={[[t.best, Math.abs(a - b) < 1e-9 ? t.tie : a > b ? t.routeA : t.routeB]]} />
    </Lab>
  );
}
function Reward(props: Props) {
  const [reward, setReward] = useState(1);
  const [next, setNext] = useState(0);
  const [estimate, setEstimate] = useState(0.5);
  const t = conceptLabels[props.locale];
  const result = temporalDifference(estimate, reward, next, 0.9, 0.25);
  return (
    <Lab
      {...props}
      onReset={() => {
        setReward(1);
        setNext(0);
        setEstimate(0.5);
      }}
    >
      <div className="scidemo-network-controls">
        <Range
          label={t.reward}
          value={reward}
          onChange={setReward}
          min={-1}
          max={2}
          locale={props.locale}
        />
        <Range
          label={t.nextValue}
          value={next}
          onChange={setNext}
          min={0}
          max={2}
          locale={props.locale}
        />
      </div>
      <Results
        values={[
          [t.estimate, number(estimate, props.locale)],
          [t.target, number(result.target, props.locale)],
          [t.error, number(result.error, props.locale)],
        ]}
      />
      <p className="scidemo-equation">
        δ = {number(reward, props.locale)} + 0.9 × {number(next, props.locale)} −{' '}
        {number(estimate, props.locale)} = {number(result.error, props.locale)}
      </p>
      <button onClick={() => setEstimate(result.updated)}>{t.update}</button>
    </Lab>
  );
}
function Prediction(props: Props) {
  const [observed, setObserved] = useState(0.8);
  const [predicted, setPredicted] = useState(0.2);
  const t = conceptLabels[props.locale];
  return (
    <Lab
      {...props}
      onReset={() => {
        setObserved(0.8);
        setPredicted(0.2);
      }}
    >
      <Range
        label={t.observed}
        value={observed}
        onChange={setObserved}
        min={0}
        max={1}
        locale={props.locale}
      />
      <div className="concept-spaced">
        <Bar
          tone="reference"
          label={t.observed}
          value={observed}
          text={number(observed, props.locale)}
        />
        <Bar label={t.predicted} value={predicted} text={number(predicted, props.locale)} />
      </div>
      <button onClick={() => setPredicted(predicted + 0.5 * (observed - predicted))}>
        {t.revise}
      </button>
      <Results values={[[t.error, number(observed - predicted, props.locale, 3)]]} />
    </Lab>
  );
}
function Attention(props: Props) {
  const [scores, setScores] = useState([1, 2, 0]);
  const [temperature, setTemperature] = useState(1);
  const t = conceptLabels[props.locale];
  const weights = attentionWeights(scores, temperature);
  const values = [1, 0, -1];
  return (
    <Lab
      {...props}
      onReset={() => {
        setScores([1, 2, 0]);
        setTemperature(1);
      }}
    >
      <div className="scidemo-network-controls">
        {scores.map((score, i) => (
          <Range
            key={i}
            label={`${t.score} ${'ABC'[i]}`}
            min={-3}
            max={3}
            step={0.25}
            value={score}
            onChange={(v) => setScores(scores.map((s, j) => (i === j ? v : s)))}
            locale={props.locale}
          />
        ))}
        <Range
          label={t.temperature}
          value={temperature}
          onChange={setTemperature}
          min={0.25}
          max={3}
          step={0.25}
          locale={props.locale}
        />
      </div>
      <div className="concept-spaced">
        {weights.map((weight, i) => (
          <Bar
            key={i}
            tone="magnitude"
            label={`${'ABC'[i]} (${t.value}: ${values[i]})`}
            value={weight}
            text={`${number(weight * 100, props.locale, 1)} %`}
          />
        ))}
      </div>
      <ColorLegend locale={props.locale} percent />
      <Results
        values={[
          [
            t.mixture,
            number(
              weights.reduce((sum, w, i) => sum + w * values[i], 0),
              props.locale,
              3,
            ),
          ],
        ]}
      />
    </Lab>
  );
}
function Masking(props: Props) {
  const [selected, setSelected] = useState(5);
  const [revealed, setRevealed] = useState(false);
  const t = conceptLabels[props.locale];
  const words = t.sentence.split(' ');
  return (
    <Lab
      {...props}
      onReset={() => {
        setSelected(5);
        setRevealed(false);
      }}
    >
      <div className="concept-words">
        {words.map((word, i) => (
          <button
            key={i}
            aria-pressed={i === selected}
            aria-label={`${t.word} ${i + 1}: ${i === selected && !revealed ? '[?]' : word}`}
            onClick={() => {
              setSelected(i);
              setRevealed(false);
            }}
          >
            {selected === i && !revealed ? '[ ? ]' : word}
          </button>
        ))}
      </div>
      <button onClick={() => setRevealed(!revealed)}>{revealed ? t.hide : t.reveal}</button>
      <Results values={[[t.target, revealed ? words[selected] : '?']]} />
    </Lab>
  );
}
function Geometry(props: Props) {
  const [angle, setAngle] = useState(60);
  const t = conceptLabels[props.locale];
  const distance = hingeDistance(angle);
  const radians = (angle * Math.PI) / 180;
  const x = 200 + 100 * Math.cos(radians),
    y = 135 - 100 * Math.sin(radians);
  return (
    <Lab {...props} onReset={() => setAngle(60)}>
      <Range
        label={t.angle}
        value={angle}
        onChange={setAngle}
        min={10}
        max={170}
        step={1}
        suffix="°"
        locale={props.locale}
      />
      <svg
        className="concept-stage"
        viewBox="0 0 400 180"
        role="img"
        aria-label={`${t.distance}: ${number(distance, props.locale)}; ${t.target}: 1.5`}
      >
        <path d={`M300 135L200 135L${x} ${y}`} className="scidemo-loss-line" />
        <line x1="300" y1="135" x2={x} y2={y} className="scidemo-backward-path" />
        {[
          [300, 135],
          [200, 135],
          [x, y],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="7" className="scidemo-network-unit" />
        ))}
      </svg>
      <Results
        values={[
          [t.distance, number(distance, props.locale)],
          [t.target, number(1.5, props.locale)],
          [t.mismatch, number(Math.abs(distance - 1.5), props.locale)],
        ]}
      />
    </Lab>
  );
}
function Transfer(props: Props) {
  const [task, setTask] = useState<'size' | 'brightness'>('size');
  const t = conceptLabels[props.locale];
  const objects = [
    { size: 0, brightness: 0 },
    { size: 1, brightness: 0 },
    { size: 0, brightness: 1 },
    { size: 1, brightness: 1 },
  ];
  const id = useId();
  return (
    <Lab {...props} onReset={() => setTask('size')}>
      <div className="scidemo-control">
        <label htmlFor={id}>{t.task}</label>
        <select id={id} value={task} onChange={(e) => setTask(e.target.value as typeof task)}>
          <option value="size">{t.large}</option>
          <option value="brightness">{t.bright}</option>
        </select>
      </div>
      <div className="concept-object-grid">
        {objects.map((o, i) => (
          <div key={i} className={o[task] ? 'concept-object-selected' : ''}>
            <span
              className={`concept-object ${o.brightness ? 'concept-object-bright' : ''}`}
              style={{ width: o.size ? 42 : 22, height: o.size ? 42 : 22 }}
            />
            <strong>{'ABCD'[i]}</strong>
            <small>
              {t.size}: {o.size} · {t.brightness}: {o.brightness}
            </small>
            {o[task] ? <span>{t.selected} ✓</span> : <span aria-hidden="true">·</span>}
          </div>
        ))}
      </div>
    </Lab>
  );
}
function Membrane(props: Props) {
  const [na, setNa] = useState(0.1);
  const [k, setK] = useState(1);
  const t = conceptLabels[props.locale];
  const voltage = membraneBalance(na, k);
  return (
    <Lab
      {...props}
      onReset={() => {
        setNa(0.1);
        setK(1);
      }}
    >
      <div className="scidemo-network-controls">
        <Range
          label={t.sodium}
          value={na}
          onChange={setNa}
          min={0}
          max={3}
          step={0.1}
          locale={props.locale}
        />
        <Range
          label={t.potassium}
          value={k}
          onChange={setK}
          min={0}
          max={3}
          step={0.1}
          locale={props.locale}
        />
      </div>
      <svg
        viewBox="0 0 400 100"
        className="concept-stage"
        role="img"
        aria-label={`${t.voltage}: ${number(voltage, props.locale)} mV`}
      >
        <line x1="25" x2="375" y1="45" y2="45" className="scidemo-axis" />
        <circle
          cx={25 + ((voltage + 77) / 127) * 350}
          cy="45"
          r="7"
          className="scidemo-selected-point"
        />
        <text x="25" y="80">
          K: −77 mV
        </text>
        <text x="280" y="80">
          Na: +50 mV
        </text>
      </svg>
      <Results values={[[t.voltage, `${number(voltage, props.locale)} mV`]]} />
      <p className="scidemo-equation">V = (gNa × ENa + gK × EK + gL × EL) / (gNa + gK + gL)</p>
    </Lab>
  );
}
const demos: Record<ConceptDemoKind, ComponentType<Props>> = {
  staining: Staining,
  logic: Logic,
  hebbian: Hebbian,
  tape: Tape,
  'stored-program': StoredProgram,
  entropy: Entropy,
  feedback: Feedback,
  symbolic: Symbolic,
  xor: Logic,
  memory: Memory,
  sampling: Sampling,
  planning: Planning,
  reward: Reward,
  prediction: Prediction,
  attention: Attention,
  masking: Masking,
  geometry: Geometry,
  transfer: Transfer,
  membrane: Membrane,
};
export function ConceptDemo(props: Props) {
  const Demo = demos[props.kind];
  return <Demo {...props} />;
}
