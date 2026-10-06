'use client';
import { PreviewCard, useOverlayPreview } from './OverlayPreview';
import { domains, t } from '@/content/translations/ui';
import type { HistoricalEntity, Locale, LocationReference } from '@/types/history';
import './node-preview.css';

const labels = {
  place: { en: 'Research location', de: 'Forschungsort', es: 'Lugar de investigación' },
  institution: { en: 'Institution', de: 'Institution', es: 'Institución' },
  country: { en: 'Country', de: 'Land', es: 'País' },
  coordinates: {
    en: 'Approximate coordinates',
    de: 'Ungefähre Koordinaten',
    es: 'Coordenadas aproximadas',
  },
  year: { en: 'At this location', de: 'An diesem Ort', es: 'En este lugar' },
  hint: {
    en: 'Select the discovery to read more. Esc closes this preview.',
    de: 'Entdeckung für weitere Details auswählen. Esc schließt die Vorschau.',
    es: 'Selecciona el descubrimiento para leer más. Esc cierra esta vista previa.',
  },
};

const countryCodes: Record<string, string> = {
  'United States': 'US',
  'United Kingdom': 'GB',
  Canada: 'CA',
  Italy: 'IT',
  Spain: 'ES',
  Japan: 'JP',
  Switzerland: 'CH',
  Germany: 'DE',
  France: 'FR',
};

export function useNodePreview() {
  const preview = useOverlayPreview<{ entity: HistoricalEntity; location?: LocationReference }>();
  return {
    ...preview,
    nodeProps(entity: HistoricalEntity, location?: LocationReference) {
      return preview.triggerProps(
        { entity, location },
        `${entity.id}:${location?.name ?? ''}:${location?.institution ?? ''}`,
      );
    },
  };
}

export function NodePreview({
  preview,
  locale,
}: {
  preview: ReturnType<typeof useNodePreview>;
  locale: Locale;
}) {
  const current = preview.current;
  if (!current) return null;
  const { entity, location } = current.item;

  const country = location?.name.includes(',')
    ? location.name.split(',').at(-1)!.trim()
    : undefined;
  const countryName =
    country && countryCodes[country]
      ? new Intl.DisplayNames([locale], { type: 'region' }).of(countryCodes[country])
      : country;
  const coordinate = (value: number, axis: 'lat' | 'lon') =>
    `${Math.abs(value).toLocaleString(locale, { maximumFractionDigits: 2 })}° ${axis === 'lat' ? (value < 0 ? 'S' : 'N') : value < 0 ? (locale === 'es' ? 'O' : 'W') : locale === 'de' ? 'O' : 'E'}`;

  return (
    <PreviewCard
      preview={preview}
      className={`domain-${entity.domain}`}
      forId={entity.id}
      kind={location ? 'map' : 'graph'}
    >
      <div className="node-preview-meta">
        <span>{entity.startDate.slice(0, 4)}</span>
        <span>{domains[entity.domain][locale]}</span>
      </div>
      <h3>{entity.title[locale]}</h3>
      <p className="node-preview-description">{entity.shortDescription[locale]}</p>
      {location && (
        <dl className="node-preview-geography">
          <div>
            <dt>{labels.place[locale]}</dt>
            <dd>{location.name}</dd>
          </div>
          <div>
            <dt>{labels.institution[locale]}</dt>
            <dd>{location.institution}</dd>
          </div>
          {countryName && (
            <div>
              <dt>{labels.country[locale]}</dt>
              <dd>{countryName}</dd>
            </div>
          )}
          <div>
            <dt>{labels.coordinates[locale]}</dt>
            <dd>
              {coordinate(location.lat, 'lat')}, {coordinate(location.lon, 'lon')}
            </dd>
          </div>
          {location.year && (
            <div>
              <dt>{labels.year[locale]}</dt>
              <dd>{location.year}</dd>
            </div>
          )}
        </dl>
      )}
      {location && entity.editorialNotes && (
        <p className="node-preview-note">
          <strong>{t('editorialNote', locale)}: </strong>
          {entity.editorialNotes[locale]}
        </p>
      )}
      <p className="node-preview-hint">{labels.hint[locale]}</p>
    </PreviewCard>
  );
}
