import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'omnirouter-secure-jwt-key-2026-production-random-hash'
);

const AUTH_COOKIE_NAME = 'omnirouter_session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Static assets and internal next requests
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Public authentication & health endpoints
  if (
    pathname === '/login' ||
    pathname === '/api/auth/login' ||
    pathname === '/api/health'
  ) {
    // If user is already logged in and visits /login, redirect to dashboard
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (token && pathname === '/login') {
      try {
        await jwtVerify(token, JWT_SECRET);
        return NextResponse.redirect(new URL('/', request.url));
      } catch {
        // invalid token, allow to stay on login
      }
    }
    return NextResponse.next();
  }

  // Check for Bearer token for /api/v1 (OpenAI-compatible endpoints)
  if (pathname.startsWith('/api/v1')) {
    const authHeader = request.headers.get('authorization');
    const customApiKey = process.env.OMNIROUTER_API_KEY;

    // If an API key is configured in env, require it or valid session
    if (customApiKey && authHeader) {
      const token = authHeader.replace(/^Bearer\s+/i, '');
      if (token === customApiKey) {
        return NextResponse.next();
      }
    }

    // Check cookie session fallback
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (token) {
      try {
        await jwtVerify(token, JWT_SECRET);
        return NextResponse.next();
      } catch {}
    }

    // If no customApiKey is configured, allow v1 proxy for convenience
    if (!customApiKey) {
      return NextResponse.next();
    }

    return NextResponse.json(
      { error: { message: 'Unauthorized. Provide valid Bearer token or login.', type: 'invalid_request_error' } },
      { status: 401 }
    );
  }

  // Standard Web UI Protected Routes
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    await jwtVerify(token, JWT_SECRET);
    return NextResponse.next();
  } catch {
    const loginUrl = new URL('/login', request.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete(AUTH_COOKIE_NAME);
    return response;
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
