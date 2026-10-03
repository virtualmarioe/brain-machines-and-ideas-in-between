import Link from 'next/link';
export default function NotFound() {
  return (
    <main className="not-found">
      <p className="eyebrow">404</p>
      <h1>Page not found · Seite nicht gefunden · Página no encontrada</h1>
      <p>
        <Link href="/en">English</Link> · <Link href="/de">Deutsch</Link> ·{' '}
        <Link href="/es">Español</Link>
      </p>
    </main>
  );
}
