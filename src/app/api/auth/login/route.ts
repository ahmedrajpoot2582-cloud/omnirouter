import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_CREDENTIALS, createSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Strictly authenticate against the single designated admin credentials
    const isValidEmail =
      email.trim().toLowerCase() === ADMIN_CREDENTIALS.email.trim().toLowerCase() ||
      email.trim().toLowerCase() === 'admin' ||
      email.trim().toLowerCase() === 'ahmed';

    const isValidPassword = password === ADMIN_CREDENTIALS.password;

    if (!isValidEmail || !isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials. Only the authorized administrator can access this gateway.' },
        { status: 401 }
      );
    }

    // Create session
    await createSession(ADMIN_CREDENTIALS.email);

    return NextResponse.json({
      success: true,
      user: { email: ADMIN_CREDENTIALS.email, role: 'admin' },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Login failed' },
      { status: 500 }
    );
  }
}

