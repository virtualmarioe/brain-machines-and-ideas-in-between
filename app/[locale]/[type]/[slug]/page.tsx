import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Atlas from '@/components/Atlas';
import { entities } from '@/content';
import { isLocale } from '@/lib/i18n';
import { pageState } from '@/lib/page-state';
import { t } from '@/content/translations/ui';
type Props = {
  params: Promise<{ locale: string; type: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, type, slug } = await params;
  const entity = entities.find((e) => e.slug === slug && e.type === type);
  if (!isLocale(locale) || !entity) return {};
  return {
    title: `${entity.title[locale]} | ${t('brand', locale)}`,
    description: entity.shortDescription[locale],
    alternates: {
      canonical: `/${locale}/${type}/${slug}`,
      languages: Object.fromEntries(['en', 'de', 'es'].map((l) => [l, `/${l}/${type}/${slug}`])),
    },
    openGraph: {
      title: entity.title[locale],
      description: entity.shortDescription[locale],
      locale,
    },
  };
}
export default async function EntityPage({ params, searchParams }: Props) {
  const { locale, type, slug } = await params;
  const entity = entities.find((e) => e.slug === slug && e.type === type);
  if (!isLocale(locale) || !entity) notFound();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: entity.title[locale],
    description: entity.shortDescription[locale],
    inLanguage: locale,
    about: entity.people.map((name) => ({ '@type': 'Person', name })),
  };
  return (
    <>
      <script
        id="atlas-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <Atlas initialState={pageState(locale, await searchParams, entity.id)} />
    </>
  );
}
