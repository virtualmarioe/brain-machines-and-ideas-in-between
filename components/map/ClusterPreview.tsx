'use client';
import { PreviewCard, useOverlayPreview } from '@/components/ui/OverlayPreview';
import { domains } from '@/content/translations/ui';
import { describeMapCluster, type MapCluster } from '@/lib/map-pins';
import type { Locale } from '@/types/history';
export function useClusterPreview() {
  return useOverlayPreview<MapCluster>();
}
export function ClusterPreview({
  preview,
  locale,
}: {
  preview: ReturnType<typeof useClusterPreview>;
  locale: Locale;
}) {
  if (!preview.current) return null;
  const cluster = preview.current.item;
  return (
    <PreviewCard preview={preview} kind="map-cluster" forId={cluster.key} splitCards>
      <p className="cluster-preview-intro">
        {cluster.cities.map((city) => city.name).join(' · ')}
        <br />
        <strong>{describeMapCluster(cluster, locale)}</strong>
        <br />
        {
          {
            en: 'Scroll to read each card. Esc closes.',
            de: 'Scrollen zeigt alle Karten. Esc schließt.',
            es: 'Desplácese para leer cada tarjeta. Esc cierra.',
          }[locale]
        }
      </p>
      {cluster.entities.map((entity) => (
        <article
          key={entity.id}
          data-bubble-card={entity.id}
          className={`glass-surface domain-${entity.domain}`}
        >
          <div className="node-preview-meta">
            <span>{entity.startDate.slice(0, 4)}</span>
            <span>{domains[entity.domain][locale]}</span>
          </div>
          <h3>{entity.title[locale]}</h3>
          <p className="node-preview-description">{entity.shortDescription[locale]}</p>
          <p className="node-preview-hint">
            {cluster.cities
              .filter((city) => city.entities.some((item) => item.id === entity.id))
              .map(
                (city) =>
                  `${city.name} · ${entity.locations
                    .filter((location) => location.name === city.name)
                    .map((location) => location.institution)
                    .join(' · ')}`,
              )
              .join(' / ')}
          </p>
        </article>
      ))}
    </PreviewCard>
  );
}
