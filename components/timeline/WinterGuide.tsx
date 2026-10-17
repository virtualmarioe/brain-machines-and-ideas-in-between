'use client';
import { useState } from 'react';
import type { Locale } from '@/types/history';
import { complexityCopy, complexityLevels, type Complexity } from '@/lib/complexity';
import {
  winterCopy as copy,
  winterCards,
  winterPressures,
  winterSources,
  winterTriggers,
} from '@/content/ai-winters';
import './winter-guide.css';

export default function WinterGuide({
  locale,
  level,
  open,
  onOpen,
}: {
  locale: Locale;
  level: Complexity;
  open: boolean;
  onOpen: (open: boolean) => void;
}) {
  const [choices, setChoices] = useState(3);
  const [depth, setDepth] = useState(4);
  const paths = choices ** depth;
  const format = new Intl.NumberFormat(locale);
  const advanced = level !== 'essentials';
  return (
    <details
      className="winter-guide"
      id="ai-winters-guide"
      open={open}
      onToggle={(event) => onOpen(event.currentTarget.open)}
    >
      <summary>
        <span>{copy.title[locale]}</span>
        <small>{complexityCopy[locale].names[complexityLevels.indexOf(level)]}</small>
      </summary>
      <div className="winter-guide-body">
        <h2 id="winter-guide-heading" tabIndex={-1}>
          {copy.title[locale]}
        </h2>
        <p className="winter-guide-lead">{copy.intro[locale]}</p>
        <p className="winter-guide-caveat">{copy.caveat[locale]}</p>
        <section aria-labelledby="winter-cycle-heading">
          <h3 id="winter-cycle-heading">{copy.cycleTitle[locale]}</h3>
          <ol className="winter-cycle">
            {copy.cycle.map((step, index) => (
              <li key={index}>{step[locale]}</li>
            ))}
          </ol>
          <p>{copy.color[locale]}</p>
        </section>
        <div className="winter-guide-comparison">
          <section>
            <span className="eyebrow">≈ 1973–1980</span>
            <h3>{copy.first[locale]}</h3>
            <p>{winterCards.essentials.first[locale]}</p>
            {advanced && <p>{copy.firstBody[locale]}</p>}
          </section>
          <section>
            <span className="eyebrow">≈ 1987–1993</span>
            <h3>{copy.second[locale]}</h3>
            <p>{winterCards.essentials.second[locale]}</p>
            {advanced && <p>{copy.secondBody[locale]}</p>}
          </section>
        </div>
        {advanced && (
          <>
            <section aria-labelledby="winter-triggers-heading">
              <h3 id="winter-triggers-heading">{copy.turningPoints[locale]}</h3>
              <p>{copy.triggersIntro[locale]}</p>
              <ol className="winter-turning-points">
                {winterTriggers.map((trigger) => (
                  <li key={trigger.title}>
                    <strong>
                      {trigger.year === '1970s'
                        ? { en: '1970s', de: '1970er', es: 'Década de 1970' }[locale]
                        : trigger.year}{' '}
                      · {trigger.title}
                    </strong>
                    <p>
                      {trigger.body[locale]}{' '}
                      <a href={winterSources.find((source) => source.id === trigger.source)!.url}>
                        {copy.sources[locale]} ↗
                      </a>
                    </p>
                  </li>
                ))}
              </ol>
            </section>
            <section className="winter-search-demo" aria-labelledby="winter-demo-heading">
              <h3 id="winter-demo-heading">{copy.demoTitle[locale]}</h3>
              <p>{copy.demoIntro[locale]}</p>
              <div className="winter-demo-controls">
                <label>
                  {copy.choices[locale]}: <strong>{choices}</strong>
                  <input
                    type="range"
                    min="2"
                    max="8"
                    value={choices}
                    onChange={(event) => setChoices(Number(event.target.value))}
                  />
                </label>
                <label>
                  {copy.depth[locale]}: <strong>{depth}</strong>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={depth}
                    onChange={(event) => setDepth(Number(event.target.value))}
                  />
                </label>
              </div>
              <div className="winter-demo-result" aria-live="polite" aria-atomic="true">
                <p>
                  <strong>{format.format(paths)}</strong> {copy.paths[locale]}{' '}
                  <span>
                    ({choices}
                    <sup>{depth}</sup>)
                  </span>
                </p>
                <div className="winter-search-bars" aria-hidden="true">
                  <i style={{ width: `${100 / choices}%` }} />
                  <i />
                </div>
                <p>
                  {copy.next[locale]}: <strong>{format.format(paths * choices)}</strong> (×{choices}
                  )
                </p>
              </div>
              <p className="winter-demo-note">{copy.demoNote[locale]}</p>
            </section>
          </>
        )}
        {level === 'expert' && (
          <>
            <section>
              <h3 id="winter-pressure-heading">{copy.comparison[locale]}</h3>
              <div
                className="winter-table-scroll"
                tabIndex={0}
                role="region"
                aria-label={copy.comparison[locale]}
              >
                <table>
                  <thead>
                    <tr>
                      <th scope="col">{copy.factor[locale]}</th>
                      <th scope="col">{copy.firstShort[locale]}</th>
                      <th scope="col">{copy.secondShort[locale]}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {winterPressures.map(([factor, first, second]) => (
                      <tr key={factor.en}>
                        <th scope="row">{factor[locale]}</th>
                        <td>{first[locale]}</td>
                        <td>{second[locale]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <section>
              <h3>{copy.interpretation[locale]}</h3>
              <p>{copy.interpretationBody[locale]}</p>
            </section>
          </>
        )}
        <section className="winter-guide-sources">
          <h3>{copy.sources[locale]}</h3>
          <ul>
            {winterSources.map((source) => (
              <li key={source.id}>
                <a href={source.url}>{source.title} ↗</a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </details>
  );
}
