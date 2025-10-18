import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Generate dynamic cache-bust value on every request
  const buildTimestamp = Date.now();
  const buildVersion = `v${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${buildTimestamp}`;

  // Get the hostname to identify which domain is being accessed
  const hostname = request.headers.get('host') || '';

  // Determine domain source
  let domainSource = 'unknown';
  if (hostname.includes('ursulabenavidez.com')) {
    domainSource = hostname.startsWith('www.') ? 'www-domain' : 'naked-domain';
  } else if (hostname.includes('vercel.app')) {
    domainSource = 'vercel-domain';
  }

  // Set aggressive no-cache headers for HTML pages
  const { pathname } = request.nextUrl;

  // Don't cache HTML pages or API routes
  if (
    !pathname.startsWith('/_next/static') &&
    !pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/)
  ) {
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
  }

  // Add cache-bust headers to ALL responses
  response.headers.set('X-Cache-Bust', buildVersion);
  response.headers.set('X-Build-Timestamp', buildTimestamp.toString());
  response.headers.set('X-Domain-Source', domainSource);

  // Add Vary header for mobile-specific caching
  if (pathname.startsWith('/work')) {
    response.headers.set('Vary', 'User-Agent, Accept-Encoding');
  }

  return response;
}

// Configure which routes use the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
