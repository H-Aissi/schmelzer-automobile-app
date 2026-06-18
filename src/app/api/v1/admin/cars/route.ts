// EP-006, EP-007
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { carSchema } from '@/lib/validations';
import { buildCarsQuery } from '@/lib/cars-query';

const FUEL_TYPES = ['BENZIN', 'DIESEL', 'ELEKTRO', 'HYBRID', 'GAS'] as const;
const SORT_OPTIONS_FILTER = ['price_asc', 'price_desc', 'date_desc'] as const;
const CAR_STATUSES = ['ACTIVE', 'SOLD', 'HIDDEN'] as const;

const adminCarFilterSchema = z
  .object({
    make: z.string().optional(),
    fuelType: z.enum(FUEL_TYPES).optional(),
    priceMin: z.coerce.number().int().min(0).optional(),
    priceMax: z.coerce.number().int().min(0).optional(),
    sort: z.enum(SORT_OPTIONS_FILTER).optional().default('date_desc'),
    status: z.enum(CAR_STATUSES).optional(),
  })
  .refine(
    (data) => {
      if (data.priceMin !== undefined && data.priceMax !== undefined) {
        return data.priceMin <= data.priceMax;
      }
      return true;
    },
    { message: 'Mindestpreis darf nicht größer als Höchstpreis sein.' },
  );

// EP-006
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const rawParams = {
    make: searchParams.get('make') ?? undefined,
    fuelType: searchParams.get('fuelType') ?? undefined,
    priceMin: searchParams.get('priceMin') ?? undefined,
    priceMax: searchParams.get('priceMax') ?? undefined,
    sort: searchParams.get('sort') ?? undefined,
    status: searchParams.get('status') ?? undefined,
  };

  const parseResult = adminCarFilterSchema.safeParse(rawParams);
  if (!parseResult.success) {
    return NextResponse.json(
      {
        statusCode: 400,
        error: 'VALIDATION_ERROR',
        message: 'Ungültige Filter-Parameter.',
        details: parseResult.error.errors.map((err) => ({
          field: err.path.join('.'),
          rule: err.code,
        })),
      },
      { status: 400 },
    );
  }

  const page = Math.max(1, Number(searchParams.get('page') ?? 1));
  const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') ?? 12)));

  const { where, orderBy, skip, take } = buildCarsQuery({
    make: parseResult.data.make,
    fuelType: parseResult.data.fuelType,
    priceMin: parseResult.data.priceMin,
    priceMax: parseResult.data.priceMax,
    sort: parseResult.data.sort,
    page,
    limit,
    // keine statusFilter: 'public' — alle Status sichtbar
  });

  // Optionaler Status-Filter
  if (parseResult.data.status) {
    (where as { status?: string }).status = parseResult.data.status;
  }

  const [cars, total] = await prisma.$transaction([
    prisma.car.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        images: { where: { sortOrder: 0 }, take: 1 },
        _count: { select: { offers: true } },
      },
    }),
    prisma.car.count({ where }),
  ]);

  const data = cars.map((car) => ({
    id: car.id,
    title: car.title,
    make: car.make,
    model: car.model,
    year: car.year,
    price: car.price,
    mileage: car.mileage,
    fuelType: car.fuelType,
    transmission: car.transmission,
    power: car.power,
    color: car.color,
    status: car.status,
    titleImage: car.images[0]?.url ?? null,
    offersCount: car._count.offers,
    createdAt: car.createdAt.toISOString(),
  }));

  return NextResponse.json({ data, meta: { page, limit, total } });
}

// EP-007
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { statusCode: 400, error: 'VALIDATION_ERROR', message: 'Ungültiger Request-Body.', details: [] },
      { status: 400 },
    );
  }

  const parseResult = carSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      {
        statusCode: 400,
        error: 'VALIDATION_ERROR',
        message: 'Eingabe ungültig.',
        details: parseResult.error.errors.map((err) => ({
          field: err.path.join('.'),
          rule: err.code,
        })),
      },
      { status: 400 },
    );
  }

  const d = parseResult.data;
  const car = await prisma.car.create({
    data: {
      title: d.title,
      make: d.make,
      makeNormalized: d.make.trim().toLowerCase(),
      model: d.model,
      year: d.year,
      price: d.price,
      mileage: d.mileage,
      fuelType: d.fuelType,
      transmission: d.transmission,
      power: d.power,
      color: d.color,
      description: d.description,
      status: d.status ?? 'ACTIVE',
    },
    include: { images: true },
  });

  return NextResponse.json(
    {
      data: {
        id: car.id,
        title: car.title,
        make: car.make,
        model: car.model,
        year: car.year,
        price: car.price,
        mileage: car.mileage,
        fuelType: car.fuelType,
        transmission: car.transmission,
        power: car.power,
        color: car.color,
        description: car.description,
        status: car.status,
        images: [],
        createdAt: car.createdAt.toISOString(),
      },
    },
    { status: 201 },
  );
}
