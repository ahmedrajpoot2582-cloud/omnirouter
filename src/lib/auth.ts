import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export const JWT_SECRET_STRING =
  process.env.JWT_SECRET || 'omnirouter-secure-jwt-key-2026-production-random-hash';

export const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);

export const AUTH_COOKIE_NAME = 'omnirouter_session';

export const ADMIN_CREDENTIALS = {
  email: process.env.ADMIN_EMAIL || 'admin@omnirouter.ai',
  password: process.env.ADMIN_PASSWORD || 'omnirouter2026',
};

export async function createToken(email: string) {
  return await new SignJWT({ email, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(JWT_SECRET);
}

export async function verifySession(token?: string) {
  if (!token) return null;
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as { email: string; role: string };
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const cookieStore = cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  return verifySession(token);
}
