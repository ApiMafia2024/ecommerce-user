import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { serverApiClient } from '@/lib/api/server-client';
import { endpoints } from '@/lib/endpoints';
import { routing } from '@/i18n/routing';

interface GoogleCallbackResponse {
  token: string;
}

export async function GET(request: NextRequest) {
  try {
    // Extract code and locale from query parameters
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const locale = searchParams.get('locale') || getLocaleFromRequest(request) || getLocaleFromCookie(request) || routing.defaultLocale;

    // Validate code parameter
    if (!code) {
      return NextResponse.redirect(
        new URL(`/${locale}/auth/login?error=missing_code`, request.url)
      );
    }

    // Call backend API to exchange code for token
    const response = await serverApiClient.get<GoogleCallbackResponse>(
      endpoints.auth.googleCallback,
      { code }
    );

    // Validate response
    if (!response.data?.token) {
      return NextResponse.redirect(
        new URL(`/${locale}/auth/login?error=invalid_response`, request.url)
      );
    }
    const token = response.data.token;
    
    // Set auth token cookie server-side
    // Note: Next.js cookies API automatically handles URL encoding/decoding
    // The | character will be encoded as %7C in the cookie, but will be decoded automatically when read
    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      // httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    
    // Set a temporary flag cookie (non-httpOnly) to signal client to refresh profile
    // This cookie expires in 30 seconds and will be cleared after use
    cookieStore.set('google_auth_complete', 'true', {
      maxAge: 30, // 30 seconds - enough time for the redirect and initial load
      httpOnly: false, // Must be readable by client
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      domain: undefined, // Use default domain
    });
    
    // Redirect to home page - AuthContext will detect the cookie flag and trigger profile fetch
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    
    // Extract error message if available
    const errorMessage = error instanceof Error ? error.message : 'unknown_error';
    const errorSearchParams = request.nextUrl.searchParams;
    const locale = errorSearchParams.get('locale') || getLocaleFromRequest(request) || getLocaleFromCookie(request) || routing.defaultLocale;
    
    // Redirect to login page with error
    return NextResponse.redirect(
      new URL(`/${locale}/auth/login?error=${encodeURIComponent(errorMessage)}`, request.url)
    );
  }
}

/**
 * Extract locale from request URL
 */
function getLocaleFromRequest(request: NextRequest): string | null {
  const pathname = request.nextUrl.pathname;
  const segments = pathname.split('/').filter(Boolean);
  const maybeLocale = segments[0];
  
  if (routing.locales.includes(maybeLocale as never)) {
    return maybeLocale;
  }
  
  return null;
}

/**
 * Extract locale from cookie
 */
function getLocaleFromCookie(request: NextRequest): string | null {
  const localeCookie = request.cookies.get('NEXT_LOCALE')?.value;
  if (localeCookie && routing.locales.includes(localeCookie as never)) {
    return localeCookie;
  }
  return null;
}

