// EP-004
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  comparePassword,
  signJwt,
  getAdminCookieOptions,
  COOKIE_NAME,
} from '@/lib/auth';
import { loginSchema } from '@/lib/validations';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import bcryptjs from 'bcryptjs';

const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 15 * 60 * 1000; // 15 Minuten

// Dummy-Hash für Timing-Schutz bei unbekanntem User
const DUMMY_HASH =
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4tbXfIqWai';

export async function POST(req: NextRequest) {
  // Rate-Limit
  const ip = getClientIp(req);
  const allowed = checkRateLimit(`login:${ip}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!allowed) {
    return NextResponse.json(
      {
        statusCode: 429,
        error: 'RATE_LIMITED',
        message:
          'Zu viele Anmeldeversuche. Bitte in 15 Minuten erneut versuchen.',
        details: [],
      },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      {
        statusCode: 400,
        error: 'VALIDATION_ERROR',
        message: 'Ungültiger Request-Body.',
        details: [],
      },
      { status: 400 },
    );
  }

  const parseResult = loginSchema.safeParse(body);
  if (!parseResult.success) {
    const details = parseResult.error.errors.map((e) => ({
      field: e.path.join('.'),
      rule: e.code,
    }));
    return NextResponse.json(
      {
        statusCode: 400,
        error: 'VALIDATION_ERROR',
        message: 'Eingabe ungültig.',
        details,
      },
      { status: 400 },
    );
  }

  const { email, password } = parseResult.data;

  const user = await prisma.user.findUnique({ where: { email } });

  // Konstante Antwortzeit: immer bcryptjs.compare aufrufen (auch bei unbekanntem User)
  const hashToCompare = user ? user.passwordHash : DUMMY_HASH;
  const valid = await bcryptjs.compare(password, hashToCompare);

  if (!user || !valid) {
    return NextResponse.json(
      {
        statusCode: 401,
        error: 'INVALID_CREDENTIALS',
        message: 'E-Mail oder Passwort falsch.',
        details: [],
      },
      { status: 401 },
    );
  }

  const token = await signJwt({ sub: user.id, email: user.email });
  const cookieOpts = getAdminCookieOptions();

  const res = NextResponse.json({ data: { email: user.email } });
  res.cookies.set(COOKIE_NAME, token, cookieOpts);

  return res;
}
