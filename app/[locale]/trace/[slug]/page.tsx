import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { t } from '@/content/translations/ui';
import Atlas from '@/components/Atlas';
import { entities } from '@/content';
import { isLocale } from '@/lib/i18n';
import { pageState } from '@/lib/page-state';
import { traceTargets } from '@/lib/traces';
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const entity = entities.find((e) => e.id === (traceTargets[slug] || slug));
  if (!isLocale(locale) || !entity) return {};
  const title = `${t('trace', locale)}: ${entity.title[locale]} | ${t('brand', locale)}`;
  return {
    title,
    description: entity.shortDescription[locale],
    alternates: {
      canonical: `/${locale}/trace/${slug}`,
      languages: Object.fromEntries(['en', 'de', 'es'].map((l) => [l, `/${l}/trace/${slug}`])),
    },
    openGraph: { title, description: entity.shortDescription[locale], locale },
  };
}
export default async function TracePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale, slug } = await params;
  const entity = entities.find((e) => e.id === (traceTargets[slug] || slug));
  if (!isLocale(locale) || !entity) notFound();
  return (
    <Atlas initialState={{ ...pageState(locale, await searchParams, entity.id), mode: 'trace' }} />
  );
}
