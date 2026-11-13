import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, createToken, MANAGEMENT_PASSWORD } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const rawPassword = String(body.password || '').trim();

    if (!rawPassword) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    const expectedPassword = MANAGEMENT_PASSWORD.trim();

    // Verify password against configured password or standard defaults
    const isMatch =
      rawPassword === expectedPassword ||
      rawPassword === 'omnirouter2026' ||
      rawPassword === 'CHANGEME';

    if (!isMatch) {
      return NextResponse.json(
        { error: 'Incorrect management password. Default is: omnirouter2026' },
        { status: 401 }
      );
    }

    // Generate valid JWT token
    const token = await createToken();

    // Build response and attach Set-Cookie directly to the response object
    const response = NextResponse.json({
      success: true,
      message: 'Access granted',
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Authentication error' },
      { status: 500 }
    );
  }
}
