import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_ROUTES = ['/login', '/register'];
const PROTECTED_ROUTES = ['/dashboard'];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const hasToken = request.cookies.has('token');

    // Logged-in user visiting /login or /register → send to dashboard
    if (hasToken && AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Logged-out user visiting a protected route → send to login
    if (!hasToken && PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all paths except:
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico, sitemap.xml, robots.txt
         * - public folder files (paths containing a file extension)
         */
        '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)',
    ],
};
