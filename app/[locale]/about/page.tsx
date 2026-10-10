import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isLocale } from '@/lib/i18n';
import { t } from '@/content/translations/ui';
import './about.css';
const copy = {
  en: {
    title: 'About the atlas',
    back: 'Return to the atlas',
    intro:
      'An interactive atlas of the connected histories of neuroscience, computation, and machine learning. It follows ideas that travelled from biological cells to artificial systems and back again, through linked discoveries, timelines, idea graphs, and scientific demonstrations, in English, German, and Spanish.',
    accompanies: 'The Intelligence Atlas is a work in progress accompanying a',
    lead: 'led by Mario Archila',
    universityIntro: 'at the',
    university: 'University of Jena',
    country: 'Germany',
    course: 'Neuro-AI course',
    researchIntro: 'and the research topic',
    research: 'Natural and artificial intelligence in medicine',
    evidence:
      'Relationships link to supporting sources and distinguish documented influence from analogy and interpretation. Interactive demos are simplified explanations, not reproductions of historical experiments.',
    source: 'Source code',
    cite: 'Archive and citation',
    pending: 'Zenodo DOI: pending deposit',
    note: 'A DOI will be added here when an archived release is available.',
  },
  de: {
    title: 'Über den Atlas',
    back: 'Zurück zum Atlas',
    intro:
      'Ein interaktiver Atlas der miteinander verbundenen Geschichte von Neurowissenschaften, Informatik und maschinellem Lernen. Er verfolgt Ideen, die von biologischen Zellen zu künstlichen Systemen und wieder zurück wanderten, anhand verknüpfter Entdeckungen, Zeitachsen, Ideengraphen und wissenschaftlicher Demonstrationen, auf Englisch, Deutsch und Spanisch.',
    accompanies: 'The Intelligence Atlas wird laufend weiterentwickelt und begleitet einen',
    lead: 'unter der Leitung von Mario Archila',
    universityIntro: 'an der',
    university: 'Universität Jena',
    country: 'Deutschland',
    course: 'Neuro-AI-Kurs',
    researchIntro: 'und das Forschungsthema',
    research: 'Natürliche und künstliche Intelligenz in der Medizin',
    evidence:
      'Verbindungen verweisen auf Quellen und unterscheiden belegten Einfluss von Analogie und Interpretation. Interaktive Demos sind vereinfachte Erklärungen, keine Reproduktionen historischer Experimente.',
    source: 'Quellcode',
    cite: 'Archiv und Zitierung',
    pending: 'Zenodo-DOI: Veröffentlichung ausstehend',
    note: 'Eine DOI wird ergänzt, sobald eine archivierte Version verfügbar ist.',
  },
  es: {
    title: 'Acerca del atlas',
    back: 'Volver al atlas',
    intro:
      'Un atlas interactivo de las historias conectadas de la neurociencia, la computación y el aprendizaje automático. Sigue ideas que viajaron de las células biológicas a los sistemas artificiales y de vuelta, mediante descubrimientos enlazados, líneas de tiempo, grafos de ideas y demostraciones científicas, en inglés, alemán y español.',
    accompanies: 'The Intelligence Atlas es un proyecto en desarrollo que acompaña un',
    lead: 'dirigido por Mario Archila',
    universityIntro: 'en la',
    university: 'Universidad de Jena',
    country: 'Alemania',
    course: 'curso de Neuro-AI',
    researchIntro: 'y el tema de investigación',
    research: 'Inteligencia natural y artificial en medicina',
    evidence:
      'Las conexiones enlazan fuentes y distinguen la influencia documentada de la analogía y la interpretación. Las demos interactivas son explicaciones simplificadas, no reproducciones de experimentos históricos.',
    source: 'Código fuente',
    cite: 'Archivo y cita',
    pending: 'DOI de Zenodo: depósito pendiente',
    note: 'Se añadirá un DOI cuando esté disponible una versión archivada.',
  },
};
type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: `${copy[locale].title} | ${t('brand', locale)}`,
    description: copy[locale].intro,
    alternates: { canonical: `/${locale}/about` },
  };
}
export default async function About({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const c = copy[locale];
  return (
    <main className="about-page">
      <Link href={`/${locale}`}>← {c.back}</Link>
      <nav aria-label="Language">
        <Link href="/en/about" lang="en">
          English
        </Link>
        <Link href="/de/about" lang="de">
          Deutsch
        </Link>
        <Link href="/es/about" lang="es">
          Español
        </Link>
      </nav>
      <h1>{c.title}</h1>
      <h2>The Intelligence Atlas</h2>
      <p>{c.intro}</p>
      <p>
        {c.accompanies}{' '}
        <a href="https://archilaresearch.github.io/teaching.html#neuro-ai">{c.course}</a>{' '}
        {c.researchIntro} <a href="https://archilaresearch.github.io/research.html">{c.research}</a>{' '}
        {c.lead} {c.universityIntro}{' '}
        <a href={locale === 'de' ? 'https://www.uni-jena.de/' : 'https://www.uni-jena.de/en'}>
          {c.university}
        </a>
        , {c.country}.
      </p>
      <p>{c.evidence}</p>
      <h2>{c.source}</h2>
      <a href="https://github.com/virtualmarioe/brain-machines-and-ideas-in-between">
        GitHub: brain-machines-and-ideas-in-between
      </a>
      <h2>{c.cite}</h2>
      <p className="doi-placeholder">{c.pending}</p>
      <p>{c.note}</p>
      <p className="muted">
        {t('map', locale)}:{' '}
        <a href="https://www.naturalearthdata.com/about/terms-of-use/">Natural Earth</a>,{' '}
        {t('publicDomain', locale)}.
      </p>
    </main>
  );
}
