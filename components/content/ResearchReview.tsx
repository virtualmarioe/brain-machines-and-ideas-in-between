import { researchReviewById } from '@/content/research/reviews';
import type { Locale } from '@/types/history';
import { text } from '@/content/translations/ui';
export const reviewCopy = {
  title: text('Source check', 'Quellenprüfung', 'Comprobación de fuentes'),
  scoped: text(
    'One claim checked; broader history still under review.',
    'Eine Aussage geprüft; der weitere historische Kontext bleibt in Prüfung.',
    'Una afirmación comprobada; el contexto histórico sigue en revisión.',
  ),
  pending: text(
    'No claim-level primary-source check recorded yet.',
    'Noch keine Prüfung einzelner Aussagen anhand von Primärquellen dokumentiert.',
    'Todavía no se ha registrado una comprobación de afirmaciones con fuentes primarias.',
  ),
  original: text(
    'Review notes: English original',
    'Prüfnotizen: englisches Original',
    'Notas de revisión: original en inglés',
  ),
  coverage: text('Verification coverage', 'Umfang der Quellenprüfung', 'Cobertura de verificación'),
  scope: text(
    'Checked claim and limits',
    'Geprüfte Aussage und Grenzen',
    'Afirmación comprobada y límites',
  ),
};
export default function ResearchReview({
  catalogId,
  locale,
}: {
  catalogId: string;
  locale: Locale;
}) {
  const review = researchReviewById.get(catalogId);
  return (
    <details className="research-source-check">
      <summary>
        {reviewCopy.title[locale]} ·{' '}
        {review ? reviewCopy.scoped[locale] : reviewCopy.pending[locale]}
      </summary>
      {review && (
        <>
          <p>{reviewCopy.original[locale]}</p>
          <div lang="en">
            <p>{review.claim}</p>
            <p>{review.limitation}</p>
            <small>
              {review.locator} · {review.reviewedAt}
            </small>
          </div>
          <p>
            <a href={review.reference.url}>{review.reference.title} ↗</a>
          </p>
        </>
      )}
    </details>
  );
}
