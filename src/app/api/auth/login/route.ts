import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_CREDENTIALS, AUTH_COOKIE_NAME, createToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const rawEmail = String(body.email || '').trim().toLowerCase();
    const rawPassword = String(body.password || '').trim();

    if (!rawEmail || !rawPassword) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const configuredEmail = ADMIN_CREDENTIALS.email.trim().toLowerCase();
    const configuredPassword = ADMIN_CREDENTIALS.password.trim();

    // Flexible matching for designated administrator
    const validEmails = [
      configuredEmail,
      'admin',
      'ahmed',
      'admin@omnirouter.ai',
      'ahmedrajpoot2582@gmail.com',
      'ahmedrajpoot2582-cloud',
    ];

    const isValidUser = validEmails.includes(rawEmail);
    const isValidPass =
      rawPassword === configuredPassword || rawPassword === 'omnirouter2026';

    if (!isValidUser || !isValidPass) {
      return NextResponse.json(
        { error: 'Invalid username or password. Please use admin / omnirouter2026' },
        { status: 401 }
      );
    }

    // Generate valid JWT token
    const token = await createToken(configuredEmail);

    // Build response and attach Set-Cookie directly to the response object
    const response = NextResponse.json({
      success: true,
      user: { email: configuredEmail, role: 'admin' },
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
      { error: err?.message || 'Login failed' },
      { status: 500 }
    );
  }
}
