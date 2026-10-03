import { NextResponse, type NextRequest } from 'next/server';
export function proxy(request: NextRequest) {
  const segment = request.nextUrl.pathname.split('/')[1];
  const headers = new Headers(request.headers);
  headers.set('x-atlas-locale', segment === 'de' || segment === 'es' ? segment : 'en');
  return NextResponse.next({ request: { headers } });
}
export const config = { matcher: ['/', '/en/:path*', '/de/:path*', '/es/:path*'] };
