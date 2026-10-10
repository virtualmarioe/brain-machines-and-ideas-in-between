'use client';
import type { HistoricalEntity, HistoricalRelationship, Locale } from '@/types/history';
import { referenceById } from '@/content';
import { relationLabels, t, text } from '@/content/translations/ui';
import { yearOf, displayYear } from '@/lib/graph';
import { yearGap } from '@/lib/temporal';
import { PreviewCard, useOverlayPreview } from './OverlayPreview';

export type ConnectionItem = {
  edge: HistoricalRelationship;
  source: HistoricalEntity;
  target: HistoricalEntity;
  map?: boolean;
};
export function useConnectionPreview() {
  return useOverlayPreview<ConnectionItem>();
}
const copy = {
  interval: text('Recorded interval', 'Verzeichneter Abstand', 'Intervalo registrado'),
  evidence: text('Supporting sources', 'Belegende Quellen', 'Fuentes de respaldo'),
  hint: text(
    'Select the connection to inspect its evidence. Esc closes this preview.',
    'Verbindung auswählen, um die Belege zu prüfen. Esc schließt die Vorschau.',
    'Selecciona la conexión para examinar la evidencia. Esc cierra esta vista previa.',
  ),
};
export function ConnectionPreview({
  preview,
  locale,
}: {
  preview: ReturnType<typeof useConnectionPreview>;
  locale: Locale;
}) {
  if (!preview.current) return null;
  const { edge, source, target, map } = preview.current.item;
  return (
    <PreviewCard preview={preview} kind={map ? 'map-edge' : 'edge'} forId={edge.id}>
      <div className="node-preview-meta">
        <span>{relationLabels[edge.type][locale]}</span>
        <span>
          {t('confidence', locale)}: {t(edge.confidence, locale)}
        </span>
      </div>
      <h3>
        {source.title[locale]} → {target.title[locale]}
      </h3>
      <p className="node-preview-description">{edge.description[locale]}</p>
      <dl className="node-preview-geography">
        <div>
          <dt>{copy.interval[locale]}</dt>
          <dd>
            {displayYear(source)} → {displayYear(target)}
            <br />
            {yearGap(yearOf(source), yearOf(target), locale)}
          </dd>
        </div>
      </dl>
      {edge.disputed && (
        <p className="node-preview-note">
          <strong>{t('disputed', locale)}</strong>
        </p>
      )}
      <h4 className="preview-section-title">{copy.evidence[locale]}</h4>
      <ul className="preview-list">
        {edge.evidence.map((id) => {
          const ref = referenceById.get(id);
          return ref ? (
            <li key={id}>
              {ref.title} ({ref.year})
            </li>
          ) : null;
        })}
      </ul>
      {map && <p className="node-preview-note">{t('mapNote', locale)}</p>}
      <p className="node-preview-hint">{copy.hint[locale]}</p>
    </PreviewCard>
  );
}
