import type { Locale } from '../../types/history';
import { number } from './DemoPrimitives';

const labels = {
  en: { signed: 'Signed scale · centered on zero', magnitude: 'Attention weight' },
  de: { signed: 'Skala mit Vorzeichen · Null im Zentrum', magnitude: 'Aufmerksamkeitsgewicht' },
  es: { signed: 'Escala con signo · centrada en cero', magnitude: 'Peso de atención' },
};
export function ColorLegend({
  locale,
  limit = 1,
  signed = false,
  label,
  percent = false,
}: {
  locale: Locale;
  limit?: number;
  signed?: boolean;
  label?: string;
  percent?: boolean;
}) {
  return (
    <div className="scidemo-color-legend" data-scale={signed ? 'signed' : 'magnitude'}>
      <span>{label ?? labels[locale][signed ? 'signed' : 'magnitude']}</span>
      <i aria-hidden="true" />
      <div>
        {(signed ? [-limit, 0, limit] : [0, 0.5, 1]).map((value) => (
          <span key={value}>{percent ? `${value * 100} %` : number(value, locale, 2)}</span>
        ))}
      </div>
    </div>
  );
}
