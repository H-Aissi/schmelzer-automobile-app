// EP-001
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { carFilterSchema } from '@/lib/validations';
import { buildCarsQuery } from '@/lib/cars-query';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const rawParams = {
    make: searchParams.get('make') ?? undefined,
    fuelType: searchParams.get('fuelType') ?? undefined,
    priceMin: searchParams.get('priceMin') ?? undefined,
    priceMax: searchParams.get('priceMax') ?? undefined,
    sort: searchParams.get('sort') ?? undefined,
  };

  const parseResult = carFilterSchema.safeParse(rawParams);

  if (!parseResult.success) {
    const details = parseResult.error.errors.map((e) => ({
      field: e.path.join('.'),
      rule: e.code,
    }));
    return NextResponse.json(
      {
        statusCode: 400,
        error: 'VALIDATION_ERROR',
        message: 'Ungültige Filter-Parameter.',
        details,
      },
      { status: 400 },
    );
  }

  const page = Math.max(1, Number(searchParams.get('page') ?? 1));
  const limit = Math.min(
    100,
    Math.max(1, Number(searchParams.get('limit') ?? 12)),
  );

  const { where, orderBy, skip, take } = buildCarsQuery({
    ...parseResult.data,
    page,
    limit,
    statusFilter: 'public',
  });

  const [cars, total] = await prisma.$transaction([
    prisma.car.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        images: {
          where: { sortOrder: 0 },
          take: 1,
        },
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
    createdAt: car.createdAt.toISOString(),
  }));

  return NextResponse.json({
    data,
    meta: { page, limit, total },
  });
}
