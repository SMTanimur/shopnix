import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected dashboard routes that strictly require an authenticated session
const PROTECTED_PREFIXES = [
  '/dashboard',
  '/orders',
  '/products',
  '/stores',
  '/inbox',
  '/inventory',
  '/customers',
  '/couriers',
  '/ai-assistant',
  '/automations',
  '/ai-agents',
  '/analytics',
  '/settings',
];

// Guest-only auth routes where logged-in merchants should be redirected to their dashboard
const AUTH_ROUTES = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('shopnix_access_token')?.value;

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // 1. Unauthenticated user trying to access a protected dashboard route
  if (isProtected && !accessToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Already authenticated user trying to access login or register page
  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (/api/*)
     * - static files (_next/static, _next/image, favicon.ico, brand assets, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|brand|.*\\..*).*)',
  ],
};
