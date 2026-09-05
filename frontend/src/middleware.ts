/**
 * @fileoverview ASHENRITUAL Architecture
 * @module middleware.ts
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check auth via the cookie set by our Zustand store on login
  const isAuthenticated = request.cookies.get('isAuthenticated')?.value === 'true';
  const hasRefreshToken = request.cookies.has('refreshToken');
  const loggedIn = isAuthenticated || hasRefreshToken;

  // Redirect authenticated users away from auth pages
  const authRoutes = ['/login', '/register'];
  if (loggedIn && authRoutes.some((route) => pathname.startsWith(route))) {
    const callbackUrl = request.nextUrl.searchParams.get('callbackUrl') ||
                        request.nextUrl.searchParams.get('redirect') || '/';
    return NextResponse.redirect(new URL(callbackUrl, request.url));
  }

  // Redirect unauthenticated users away from protected pages
  const protectedRoutes = ['/account', '/admin', '/checkout', '/archive', '/saved-rituals'];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !loggedIn) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
