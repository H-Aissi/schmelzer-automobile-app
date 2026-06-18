// EP-014
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const ALLOWED_STATUSES = ['READ', 'CONTACTED', 'DECLINED'] as const;

const statusSchema = z.object({
  status: z.enum(ALLOWED_STATUSES, {
    errorMap: () => ({ message: "Status 'NEW' kann nicht manuell gesetzt werden." }),
  }),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const offer = await prisma.offer.findUnique({
    where: { id: params.id },
    include: {
      car: { select: { id: true, title: true, make: true, year: true, price: true } },
    },
  });

  if (!offer) {
    return NextResponse.json(
      { statusCode: 404, error: 'NOT_FOUND', message: 'Angebot nicht gefunden.', details: [] },
      { status: 404 },
    );
  }

  return NextResponse.json({
    data: {
      id: offer.id,
      firstName: offer.firstName,
      lastName: offer.lastName,
      email: offer.email,
      phone: offer.phone,
      offerAmount: offer.offerAmount,
      message: offer.message,
      status: offer.status,
      car: offer.car,
      createdAt: offer.createdAt.toISOString(),
    },
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const offer = await prisma.offer.findUnique({ where: { id: params.id } });
  if (!offer) {
    return NextResponse.json(
      { statusCode: 404, error: 'NOT_FOUND', message: 'Angebot nicht gefunden.', details: [] },
      { status: 404 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { statusCode: 400, error: 'VALIDATION_ERROR', message: 'Ungültiger Request-Body.', details: [] },
      { status: 400 },
    );
  }

  const parseResult = statusSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      {
        statusCode: 400,
        error: 'VALIDATION_ERROR',
        message: parseResult.error.errors[0]?.message ?? 'Ungültiger Status.',
        details: [],
      },
      { status: 400 },
    );
  }

  const updated = await prisma.offer.update({
    where: { id: params.id },
    data: { status: parseResult.data.status },
    include: {
      car: { select: { id: true, title: true, make: true, year: true, price: true } },
    },
  });

  return NextResponse.json({
    data: {
      id: updated.id,
      firstName: updated.firstName,
      lastName: updated.lastName,
      email: updated.email,
      phone: updated.phone,
      offerAmount: updated.offerAmount,
      message: updated.message,
      status: updated.status,
      car: updated.car,
      createdAt: updated.createdAt.toISOString(),
    },
  });
}
