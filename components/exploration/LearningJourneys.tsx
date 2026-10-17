'use client';
import { useState } from 'react';
import { useHydrated } from '../navigation/useHydrated';
import { entities } from '@/content';
import { learningJourneys, learningCopy as copy } from '@/content/learning-journeys';
import type { Locale } from '@/types/history';
import './learning-journeys.css';
export default function LearningJourneys({
  locale,
  journeyId,
  step,
  selected,
  onVisit,
  onExit,
}: {
  locale: Locale;
  journeyId?: string;
  step: number;
  selected: string;
  onVisit: (journeyId: string, step: number) => void;
  onExit: () => void;
}) {
  const ready = useHydrated();
  const [complete, setComplete] = useState(false);
  const journey = learningJourneys.find((item) => item.id === journeyId);
  if (!journey)
    return (
      <details className="learning-journeys">
        <summary>{copy.title[locale]}</summary>
        <p>{copy.intro[locale]}</p>
        <div className="learning-journey-options">
          {learningJourneys.map((item) => (
            <article key={item.id}>
              <h2>{item.title[locale]}</h2>
              <p>{item.outcome[locale]}</p>
              <button
                disabled={!ready}
                onClick={() => {
                  setComplete(false);
                  onVisit(item.id, 0);
                }}
              >
                {copy.start[locale]} →
              </button>
            </article>
          ))}
        </div>
      </details>
    );
  const stop = journey.stops[step];
  const visit = (index: number) => {
    setComplete(false);
    onVisit(journey.id, index);
  };
  return (
    <section className="learning-journeys learning-journey-active" aria-label={copy.title[locale]}>
      <div className="learning-journey-heading">
        <h2>{journey.title[locale]}</h2>
        <button onClick={onExit}>{copy.exit[locale]} ×</button>
      </div>
      <p>
        <strong>{copy.outcome[locale]}:</strong> {journey.outcome[locale]}
      </p>
      <ol aria-label={copy.progress[locale]}>
        {journey.stops.map((item, index) => (
          <li key={item.entityId}>
            <button aria-current={index === step ? 'step' : undefined} onClick={() => visit(index)}>
              {index + 1}. {entities.find((entity) => entity.id === item.entityId)?.title[locale]}
            </button>
          </li>
        ))}
      </ol>
      {selected !== stop.entityId ? (
        <p>
          {copy.detour[locale]} <button onClick={() => visit(step)}>{copy.resume[locale]}</button>
        </p>
      ) : (
        <>
          <p>
            <strong>{copy.question[locale]}:</strong> {stop.question[locale]}
          </p>
          <details key={stop.entityId} className="journey-reflection">
            <summary>{copy.answer[locale]}</summary>
            <p>{stop.takeaway[locale]}</p>
          </details>
          {stop.entityId === 'ai-winters' && (
            <a href="#ai-winters-guide">{copy.winter[locale]} →</a>
          )}
        </>
      )}
      <div className="learning-journey-navigation">
        <button disabled={step === 0} onClick={() => visit(step - 1)}>
          ← {copy.previous[locale]}
        </button>
        <span>
          {step + 1} / {journey.stops.length}
        </span>
        {step < journey.stops.length - 1 ? (
          <button onClick={() => visit(step + 1)}>{copy.next[locale]} →</button>
        ) : (
          <button onClick={() => setComplete(true)}>{copy.finish[locale]}</button>
        )}
      </div>
      {complete && <p role="status">{copy.complete[locale]}</p>}
    </section>
  );
}
