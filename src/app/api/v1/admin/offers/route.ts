// EP-013
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const OFFER_STATUSES = ['NEW', 'READ', 'CONTACTED', 'DECLINED'] as const;
const SORT_OPTIONS = ['date_desc', 'date_asc'] as const;

const querySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  status: z.enum(OFFER_STATUSES).optional(),
  sort: z.enum(SORT_OPTIONS).optional().default('date_desc'),
});

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const parseResult = querySchema.safeParse({
    page: searchParams.get('page') ?? undefined,
    limit: searchParams.get('limit') ?? undefined,
    status: searchParams.get('status') ?? undefined,
    sort: searchParams.get('sort') ?? undefined,
  });

  if (!parseResult.success) {
    return NextResponse.json(
      {
        statusCode: 400,
        error: 'VALIDATION_ERROR',
        message: 'Ungültige Parameter.',
        details: parseResult.error.errors.map((e) => ({
          field: e.path.join('.'),
          rule: e.code,
        })),
      },
      { status: 400 },
    );
  }

  const { page, limit, status, sort } = parseResult.data;

  const where = status ? { status } : {};
  const orderBy = sort === 'date_asc'
    ? { createdAt: 'asc' as const }
    : { createdAt: 'desc' as const };

  const [offers, total, summaryRaw] = await Promise.all([
    prisma.offer.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        car: { select: { id: true, title: true, make: true, year: true } },
      },
    }),
    prisma.offer.count({ where }),
    prisma.offer.groupBy({
      by: ['status'],
      _count: true,
    }),
  ]);

  const summary = { new: 0, read: 0, contacted: 0, declined: 0 };
  for (const row of summaryRaw) {
    if (row.status === 'NEW') summary.new = row._count;
    else if (row.status === 'READ') summary.read = row._count;
    else if (row.status === 'CONTACTED') summary.contacted = row._count;
    else if (row.status === 'DECLINED') summary.declined = row._count;
  }

  return NextResponse.json({
    data: offers.map((offer) => ({
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
    })),
    meta: { page, limit, total },
    summary,
  });
}
