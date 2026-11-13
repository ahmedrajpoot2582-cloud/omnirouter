import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export const JWT_SECRET_STRING =
  process.env.JWT_SECRET || 'omnirouter-secure-jwt-key-2026-production-random-hash';

export const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);

export const AUTH_COOKIE_NAME = 'omnirouter_session';

export const MANAGEMENT_PASSWORD =
  process.env.MANAGEMENT_PASSWORD ||
  process.env.INITIAL_PASSWORD ||
  process.env.ADMIN_PASSWORD ||
  'omnirouter2026';

export async function createToken() {
  return await new SignJWT({ role: 'admin', authenticated: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(JWT_SECRET);
}

export async function verifySession(token?: string) {
  if (!token) return null;
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as { role: string; authenticated: boolean };
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const cookieStore = cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  return verifySession(token);
}
