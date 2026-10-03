'use client';
import { useEffect } from 'react';
import { t } from '@/content/translations/ui';
import type { HistoricalEntity, Locale } from '@/types/history';
export function usePageMetadata(
  locale: Locale,
  entity: HistoricalEntity | undefined,
  mode: string,
) {
  useEffect(() => {
    const path = window.location.pathname;
    const isIndex = path === `/${locale}` || path === `/${locale}/`;
    const title =
      isIndex || !entity
        ? t('brand', locale)
        : `${path.split('/')[2] === 'trace' ? `${t('trace', locale)}: ` : ''}${entity.title[locale]} | ${t('brand', locale)}`;
    const description =
      isIndex || !entity ? t('introduction', locale) : entity.shortDescription[locale];
    document.title = title;
    for (const [name, content, property] of [
      ['description', description, false],
      ['og:title', title, true],
      ['og:description', description, true],
      ['og:locale', locale, true],
    ] as const) {
      const attribute = property ? 'property' : 'name';
      let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.append(element);
      }
      element.content = content;
    }
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.append(canonical);
    }
    canonical.href = new URL(path, window.location.origin).href;
    for (const language of ['en', 'de', 'es']) {
      let alternate = document.head.querySelector<HTMLLinkElement>(
        `link[rel="alternate"][hreflang="${language}"]`,
      );
      if (!alternate) {
        alternate = document.createElement('link');
        alternate.rel = 'alternate';
        alternate.hreflang = language;
        document.head.append(alternate);
      }
      alternate.href = new URL(
        path.replace(/^\/(en|de|es)(?=\/|$)/, `/${language}`),
        window.location.origin,
      ).href;
    }
    let structured = document.getElementById('atlas-structured-data');
    if (!structured) {
      structured = document.createElement('script');
      structured.id = 'atlas-structured-data';
      structured.setAttribute('type', 'application/ld+json');
      document.head.append(structured);
    }
    structured.textContent = JSON.stringify(
      isIndex || !entity
        ? {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: title,
            description,
            inLanguage: locale,
          }
        : {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: entity.title[locale],
            description,
            inLanguage: locale,
            about: entity.people.map((name) => ({ '@type': 'Person', name })),
          },
    );
  }, [locale, entity, mode]);
}
