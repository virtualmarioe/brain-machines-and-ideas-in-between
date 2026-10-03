import { notFound } from 'next/navigation';
import Atlas from '@/components/Atlas';
import { isLocale } from '@/lib/i18n';
import { pageState } from '@/lib/page-state';
import { t } from '@/content/translations/ui';
import type { Metadata } from 'next';
type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: t('brand', locale),
    description: t('introduction', locale),
    alternates: { canonical: `/${locale}`, languages: { en: '/en', de: '/de', es: '/es' } },
    openGraph: { title: t('brand', locale), description: t('introduction', locale), locale },
  };
}
export default async function Page({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <Atlas initialState={pageState(locale, await searchParams)} />;
}
