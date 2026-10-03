'use client';

import { useId, type ReactNode } from 'react';
import type { Locale } from '../../types/history';
import type { DemoStrings } from '../../content/translations/demos';

export const number = (value: number, locale: Locale, digits = 2) =>
  new Intl.NumberFormat(locale, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Math.abs(value) < 0.5 * 10 ** -digits ? 0 : value);

export function Range({
  label,
  value,
  onChange,
  min = -2,
  max = 2,
  step = 0.05,
  locale,
  suffix = '',
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  locale: Locale;
  suffix?: string;
}) {
  const id = useId();
  return (
    <div className="scidemo-control">
      <div className="scidemo-control-label">
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id}>
          {number(value, locale, step >= 1 ? 0 : 2)}
          {suffix}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}

export function Frame({
  t,
  title,
  intro,
  onReset,
  children,
}: {
  t: DemoStrings;
  title: string;
  intro: string;
  onReset: () => void;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <section className="scidemo" aria-labelledby={id}>
      <header className="scidemo-header">
        <div>
          <p className="scidemo-eyebrow">{t.laboratory}</p>
          <h3 id={id}>{title}</h3>
        </div>
        <button className="scidemo-reset" onClick={onReset} type="button">
          ↺ {t.reset}
        </button>
      </header>
      <p className="scidemo-intro">{intro}</p>
      {children}
    </section>
  );
}
