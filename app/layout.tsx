import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { scientificColorVariables } from '../lib/colors';
import type { CSSProperties } from 'react';
import './colors.css';
import './design-system.css';
import './globals.css';
import './overlays.css';
import './motion.css';
import './journeys.css';
import './background-network.css';
import BackgroundNetwork from '../components/ui/BackgroundNetwork';
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://127.0.0.1:3000'),
  title: 'The Intelligence Atlas',
  description:
    'Explore the connected histories of neuroscience, computation and artificial intelligence through time, geography and original sources.',
  icons: { icon: '/favicon.svg' },
};
const themeScript = `(function(){try{var t=localStorage.getItem('atlas-theme');document.documentElement.dataset.theme=['light','dark','system'].includes(t)?t:'system';}catch(e){document.documentElement.dataset.theme='system';}})()`;
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = (await headers()).get('x-atlas-locale') || 'en';
  return (
    <html
      lang={locale || 'en'}
      style={scientificColorVariables as CSSProperties}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <BackgroundNetwork locale={locale} />
        {children}
      </body>
    </html>
  );
}
