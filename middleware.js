import { NextResponse } from 'next/server';

export function middleware(request) {
  // Only allow /admin on localhost
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const hostname = request.headers.get('host');

    // Allow localhost and 127.0.0.1
    if (!hostname?.includes('localhost') && !hostname?.includes('127.0.0.1')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
