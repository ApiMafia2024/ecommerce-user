import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

// Routes that require authentication
const protectedRoutes = [
  '/auth/profile',
  '/cart',
  '/auth/change-password',
  '/auth/logout',
];

// Routes that should redirect to home if already authenticated
const authRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
];

const handleI18nRouting = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const i18nResponse = handleI18nRouting(request);
  // If `next-intl` issued a redirect (e.g. `/` -> `/en`), return it early.
  if (i18nResponse.headers.get('location')) {
    return i18nResponse;
  }

  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  const segments = pathname.split('/');
  const maybeLocale = segments[1];
  const locale = routing.locales.includes(maybeLocale as never)
    ? maybeLocale
    : routing.defaultLocale;
  const pathnameWithoutLocale = routing.locales.includes(maybeLocale as never)
    ? `/${segments.slice(2).join('/')}`
    : pathname;

  // Check if the current path matches any protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathnameWithoutLocale.startsWith(route)
  );

  // Check if the current path matches any auth route
  const isAuthRoute = authRoutes.some((route) =>
    pathnameWithoutLocale.startsWith(route)
  );

  // Redirect to login if accessing protected route without token
  if (isProtectedRoute && !token) {
    const loginUrl = new URL(`/${locale}/auth/login`, request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to home if accessing auth routes while already logged in
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  return i18nResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ],
};

