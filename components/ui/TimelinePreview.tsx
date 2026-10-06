'use client';
import type { HistoricalEntity, Locale } from '@/types/history';
import { entities, relationships } from '@/content';
import { text, t, relationLabels } from '@/content/translations/ui';
import { yearOf } from '@/lib/graph';
import { temporalConnections, yearGap } from '@/lib/temporal';
import { PreviewCard, useOverlayPreview } from './OverlayPreview';
export type TimelineItem = {
  entities: HistoricalEntity[];
  selected?: HistoricalEntity;
  awardYear?: number;
};
export function useTimelinePreview() {
  return useOverlayPreview<TimelineItem>();
}
const copy = {
  date: text('Recorded contribution', 'Verzeichneter Beitrag', 'Contribución registrada'),
  range: text(
    'Discoveries in this period',
    'Entdeckungen in diesem Zeitraum',
    'Descubrimientos de este período',
  ),
  context: text(
    'Dates describe contributions, not lifetimes. Chronology alone does not establish influence.',
    'Die Daten bezeichnen Beiträge, keine Lebenszeiten. Zeitliche Abfolge allein belegt keinen Einfluss.',
    'Las fechas corresponden a contribuciones, no a vidas. La cronología por sí sola no demuestra influencia.',
  ),
  group: text(
    'These markers are grouped for display. Select to inspect each discovery.',
    'Diese Markierungen sind für die Anzeige gruppiert. Auswählen, um jede Entdeckung zu prüfen.',
    'Estos marcadores se agrupan para mostrarlos. Selecciona para examinar cada descubrimiento.',
  ),
  comparison: text(
    'Relative to your selection',
    'Im Vergleich zur Auswahl',
    'En relación con tu selección',
  ),
  incoming: text(
    'Recorded incoming connections',
    'Verzeichnete eingehende Verbindungen',
    'Conexiones entrantes registradas',
  ),
  outgoing: text(
    'Recorded outgoing connections',
    'Verzeichnete ausgehende Verbindungen',
    'Conexiones salientes registradas',
  ),
  hint: text(
    'Select to read more. Esc closes this preview.',
    'Für weitere Details auswählen. Esc schließt die Vorschau.',
    'Selecciona para leer más. Esc cierra esta vista previa.',
  ),
};
export function TimelinePreview({
  preview,
  locale,
}: {
  preview: ReturnType<typeof useTimelinePreview>;
  locale: Locale;
}) {
  if (!preview.current) return null;
  const { entities: group, selected, awardYear } = preview.current.item;
  const entity = group[0];
  const connections = temporalConnections(entity, entities, relationships);
  const multiple = group.length > 1;
  return (
    <PreviewCard
      preview={preview}
      kind="timeline"
      forId={awardYear ? `award-${awardYear}` : group.map((e) => e.id).join(',')}
      className={`domain-${entity.domain}`}
    >
      <div className="node-preview-meta">
        <span>{awardYear ? t('nobel', locale) : copy.date[locale]}</span>
        <span>
          {awardYear ?? `${yearOf(entity)}${multiple ? `–${yearOf(group.at(-1)!)}` : ''}`}
        </span>
      </div>
      <h3>
        {awardYear
          ? `${awardYear} · ${t('nobel', locale)}`
          : multiple
            ? copy.range[locale]
            : entity.title[locale]}
      </h3>
      {multiple || awardYear ? (
        <>
          <ul className="preview-list">
            {group.map((item) => (
              <li key={item.id}>
                <strong>{yearOf(item)}</strong> · {item.title[locale]}
                {awardYear && (
                  <>
                    <br />
                    {yearGap(yearOf(item), awardYear, locale)}
                  </>
                )}
              </li>
            ))}
          </ul>
          <p className="node-preview-note">
            {awardYear ? t('nobelNote', locale) : copy.group[locale]}
          </p>
        </>
      ) : (
        <>
          <p className="node-preview-description">{entity.shortDescription[locale]}</p>
          {selected && selected.id !== entity.id && (
            <p className="node-preview-note">
              <strong>{copy.comparison[locale]}:</strong> {selected.title[locale]} (
              {yearOf(selected)}) · {yearGap(yearOf(selected), yearOf(entity), locale)}
            </p>
          )}
          {(['before', 'after'] as const).map((direction) => (
            <div key={direction}>
              <h4 className="preview-section-title">
                {copy[direction === 'before' ? 'incoming' : 'outgoing'][locale]}
              </h4>
              {connections[direction].length ? (
                <ul className="preview-list">
                  {connections[direction].map(({ entity: other, relationship }) => (
                    <li key={relationship.id}>
                      <strong>
                        {yearOf(other)} · {other.title[locale]}
                      </strong>
                      <br />
                      {relationLabels[relationship.type][locale]} ·{' '}
                      {yearGap(yearOf(entity), yearOf(other), locale)}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="node-preview-note">{t('noConnections', locale)}</p>
              )}
            </div>
          ))}
        </>
      )}
      <p className="node-preview-note">{copy.context[locale]}</p>
      <p className="node-preview-hint">{copy.hint[locale]}</p>
    </PreviewCard>
  );
}
