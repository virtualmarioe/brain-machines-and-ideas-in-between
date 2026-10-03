import { claims } from '@/content';
import { t } from '@/content/translations/ui';
import type { Locale } from '@/types/history';
import ReferenceList from './ReferenceList';
export default function ClaimList({ entityId, locale }: { entityId: string; locale: Locale }) {
  const assertions = claims.filter((claim) => claim.entityId === entityId);
  if (!assertions.length) return null;
  return (
    <details className="claim-list">
      <summary>
        {t('claims', locale)} <span>{assertions.length}</span>
      </summary>
      {assertions.map((claim) => (
        <div className="claim-record" key={claim.id}>
          <p>{claim.claim[locale]}</p>
          <span className="verification">
            {t(
              claim.status === 'verified'
                ? 'verified'
                : claim.status === 'disputed'
                  ? 'disputed'
                  : 'review',
              locale,
            )}
          </span>
          <ReferenceList ids={claim.references} locale={locale} />
        </div>
      ))}
    </details>
  );
}
