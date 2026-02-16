import { NextResponse } from 'next/server';

const CANONICAL_HOST = 'schooltransparency.com';

export function middleware(request) {
  const hostname = request.headers.get('host') || '';
  const { pathname, search } = request.nextUrl;

  // Redirect www → non-www (fixes "Alternate page with proper canonical tag" in Search Console)
  if (hostname.startsWith('www.')) {
    const url = new URL(`https://${CANONICAL_HOST}${pathname}${search}`);
    return NextResponse.redirect(url, 301);
  }

  // Only allow /admin on localhost
  if (pathname.startsWith('/admin')) {
    if (!hostname.includes('localhost') && !hostname.includes('127.0.0.1')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files and Next.js internals
    '/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|woff|woff2|ttf|eot)$).*)',
  ],
};
