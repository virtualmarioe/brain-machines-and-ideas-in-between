'use client';
import { useId, useState } from 'react';
import { experimentChallenges } from '@/content/experiment-challenges';
import { experienceCopy as copy } from '@/content/translations/experience';
import type { DemoKind, Locale } from '@/types/history';
export default function PredictionCheckpoint({ kind, locale }: { kind: DemoKind; locale: Locale }) {
  const challenge = experimentChallenges[kind];
  const id = useId();
  const [choice, setChoice] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  if (!challenge) return null;
  return (
    <details className="prediction-checkpoint">
      <summary>{copy.predict[locale]}</summary>
      <fieldset>
        <legend>{challenge.question[locale]}</legend>
        {challenge.options.map((option, index) => (
          <label key={index}>
            <input
              type="radio"
              name={id}
              checked={choice === index}
              onChange={() => {
                setChoice(index);
                setChecked(false);
              }}
            />
            {option[locale]}
          </label>
        ))}
      </fieldset>
      <button disabled={choice === null} onClick={() => setChecked(true)}>
        {copy.check[locale]}
      </button>
      {checked && (
        <div className="prediction-feedback" role="status">
          <strong>
            {choice === challenge.answer ? copy.correct[locale] : copy.rethink[locale]}
          </strong>
          <p>{challenge.explanation[locale]}</p>
          <p>{challenge.experiment[locale]}</p>
          <button
            onClick={() => {
              setChoice(null);
              setChecked(false);
            }}
          >
            {copy.retry[locale]}
          </button>
        </div>
      )}
    </details>
  );
}
