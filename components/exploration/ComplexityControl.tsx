import { useHydrated } from '../navigation/useHydrated';
import Link from 'next/link';
import { entities } from '@/content';
import { atComplexity, complexityCopy, complexityLevels, type Complexity } from '@/lib/complexity';
import type { Locale } from '@/types/history';
import './complexity.css';
export default function ComplexityControl({
  level,
  locale,
  onChange,
}: {
  level: Complexity;
  locale: Locale;
  onChange: (level: Complexity) => void;
}) {
  const ready = useHydrated();
  const copy = complexityCopy[locale];
  return (
    <section className="complexity-control" aria-labelledby="complexity-title">
      <div className="complexity-heading">
        <div>
          <h2 id="complexity-title">{copy.title}</h2>
          <p>{copy.intro}</p>
        </div>
        <Link href={`/${locale}/research`}>{copy.research} ↗</Link>
      </div>
      <div className="complexity-options" role="group" aria-label={copy.title}>
        {complexityLevels.map((value, index) => (
          <button
            disabled={!ready}
            key={value}
            aria-pressed={level === value}
            onClick={() => onChange(value)}
            data-level={value}
          >
            <span className="complexity-current" aria-hidden="true">
              ✓ {{ en: 'Selected', de: 'Ausgewählt', es: 'Seleccionado' }[locale]}
            </span>
            <span className="complexity-steps" aria-hidden="true">
              {[0, 1, 2].map((step) => (
                <i key={step} data-filled={step <= index} />
              ))}
            </span>
            <strong>
              {index + 1}. {copy.names[index]}
            </strong>
            <span>
              {entities.filter((entity) => atComplexity(entity, value)).length} {copy.nodes}
            </span>
            <small>{copy.descriptions[index]}</small>
          </button>
        ))}
      </div>
    </section>
  );
}
