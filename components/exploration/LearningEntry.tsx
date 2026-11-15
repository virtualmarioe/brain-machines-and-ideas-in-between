'use client';
import { experienceCopy as copy } from '@/content/translations/experience';
import type { Locale } from '@/types/history';
export default function LearningEntry({
  locale,
  onLibrary,
}: {
  locale: Locale;
  onLibrary: () => void;
}) {
  return (
    <nav className="learning-entry" aria-label={copy.entry[locale]}>
      <button
        onClick={() => {
          const paths = document.querySelector<HTMLDetailsElement>('details.learning-journeys');
          if (paths) paths.open = true;
          const target = document.querySelector<HTMLElement>('.learning-journeys');
          target?.scrollIntoView({ block: 'start' });
          target?.querySelector<HTMLElement>('summary, button')?.focus({ preventScroll: true });
        }}
      >
        <span className="entry-number" aria-hidden="true">
          01
        </span>
        <span>
          <strong>{copy.guided[locale]}</strong>
          <small>{copy.guidedHint[locale]}</small>
        </span>
        <span aria-hidden="true">→</span>
      </button>
      <button onClick={onLibrary}>
        <span className="entry-number" aria-hidden="true">
          02
        </span>
        <span>
          <strong>{copy.labs[locale]}</strong>
          <small>{copy.labsHint[locale]}</small>
        </span>
        <span aria-hidden="true">→</span>
      </button>
      <button
        onClick={() => document.querySelector<HTMLInputElement>('.search-field input')?.focus()}
      >
        <span className="entry-number" aria-hidden="true">
          03
        </span>
        <span>
          <strong>{copy.find[locale]}</strong>
          <small>{copy.findHint[locale]}</small>
        </span>
        <span aria-hidden="true">→</span>
      </button>
    </nav>
  );
}
