// EP-003
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { offerSchema } from '@/lib/validations';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { sendOfferNotificationEmail } from '@/lib/email';

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 Stunde

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  // 1. Rate-Limit
  const ip = getClientIp(req);
  const allowed = checkRateLimit(`offer:${ip}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!allowed) {
    return NextResponse.json(
      {
        statusCode: 429,
        error: 'RATE_LIMITED',
        message: 'Zu viele Versuche. Bitte in einer Stunde erneut versuchen.',
        details: [],
      },
      { status: 429 },
    );
  }

  // 2. Car laden
  const car = await prisma.car.findUnique({ where: { id: params.id } });

  if (!car || car.status === 'HIDDEN') {
    return NextResponse.json(
      {
        statusCode: 404,
        error: 'NOT_FOUND',
        message: 'Fahrzeug nicht gefunden.',
        details: [],
      },
      { status: 404 },
    );
  }

  if (car.status === 'SOLD') {
    return NextResponse.json(
      {
        statusCode: 422,
        error: 'UNPROCESSABLE',
        message:
          'Für dieses Fahrzeug können keine Angebote mehr gesendet werden.',
        details: [],
      },
      { status: 422 },
    );
  }

  // 3. Body validieren
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

  const parseResult = offerSchema.safeParse(body);
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

  // 4. Angebot speichern
  const offer = await prisma.offer.create({
    data: {
      carId: params.id,
      firstName: parseResult.data.firstName,
      lastName: parseResult.data.lastName,
      email: parseResult.data.email,
      phone: parseResult.data.phone ?? null,
      offerAmount: parseResult.data.offerAmount,
      message: parseResult.data.message ?? null,
      status: 'NEW',
    },
  });

  // 5. E-Mail senden (JOB-001)
  try {
    await sendOfferNotificationEmail(offer, {
      title: car.title,
      make: car.make,
      model: car.model,
      year: car.year,
    });
  } catch (err) {
    console.error('E-Mail-Versand fehlgeschlagen (EP-003):', err);
  }

  return NextResponse.json(
    {
      data: {
        id: offer.id,
        message: 'Ihr Angebot wurde erfolgreich übermittelt.',
      },
    },
    { status: 201 },
  );
}
