// SCR-002
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import { company } from '@/lib/company';
import { carFilterSchema } from '@/lib/validations';
import { buildCarsQuery } from '@/lib/cars-query';
import { CarGrid } from '@/components/public/car-grid';
import { CarFilter } from '@/components/public/car-filter';
import { Pagination } from '@/components/ui/pagination';
import type { CarListItem, CarFilterValues } from '@/lib/types';

export const revalidate = 60;

export const metadata: Metadata = {
  title: `Fahrzeuge | ${company.name}`,
  description: 'Alle verfügbaren Fahrzeuge auf einen Blick. Jetzt filtern und das richtige Auto finden.',
};

type PageProps = {
  searchParams: {
    page?: string;
    make?: string;
    fuelType?: string;
    priceMin?: string;
    priceMax?: string;
    sort?: string;
  };
};

export default async function FahrzeugListePage({ searchParams }: PageProps) {
  const page = Math.max(1, Number(searchParams.page ?? 1));
  const limit = 6;

  const filterResult = carFilterSchema.safeParse({
    make: searchParams.make,
    fuelType: searchParams.fuelType,
    priceMin: searchParams.priceMin,
    priceMax: searchParams.priceMax,
    sort: searchParams.sort,
  });

  const filterValues: CarFilterValues = filterResult.success
    ? {
        make: filterResult.data.make,
        fuelType: filterResult.data.fuelType,
        priceMin: filterResult.data.priceMin,
        priceMax: filterResult.data.priceMax,
        sort: filterResult.data.sort,
      }
    : {};

  const { where, orderBy, skip, take } = buildCarsQuery({
    ...filterValues,
    page,
    limit,
    statusFilter: 'public',
  });

  const [rawCars, total, distinctMakes] = await Promise.all([
    prisma.car.findMany({
      where,
      orderBy,
      skip,
      take,
      include: { images: { where: { sortOrder: 0 }, take: 1 } },
    }),
    prisma.car.count({ where }),
    prisma.car.findMany({
      where: { status: { in: ['ACTIVE', 'SOLD'] } },
      select: { make: true },
      distinct: ['make'],
    }),
  ]);

  const cars: CarListItem[] = rawCars.map((car) => ({
    id: car.id,
    title: car.title,
    make: car.make,
    model: car.model,
    year: car.year,
    price: car.price,
    mileage: car.mileage,
    fuelType: car.fuelType as CarListItem['fuelType'],
    transmission: car.transmission as CarListItem['transmission'],
    power: car.power,
    color: car.color,
    status: car.status as CarListItem['status'],
    createdAt: car.createdAt.toISOString(),
    titleImage: car.images[0]?.url ?? null,
  }));

  const makes = [...distinctMakes.map((m) => m.make)].sort((a, b) => a.localeCompare(b, 'de'));

  return (
    <div className="container" style={{ paddingTop: 8, paddingBottom: 40 }}>
      <div className="crumbs">
        <a href="/">Startseite</a>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
        <span style={{ color: 'var(--ink-2)' }}>Fahrzeuge</span>
      </div>

      <div style={{ marginBottom: 26 }}>
        <div className="eyebrow">Fahrzeugbestand</div>
        <h1 className="display" style={{ fontSize: 'clamp(32px,4vw,48px)', margin: '8px 0 0' }}>
          Unsere Gebrauchtwagen
        </h1>
      </div>

      <Suspense>
        <CarFilter makes={makes} initialValues={filterValues} total={total}>
          <CarGrid cars={cars} />

          {total > limit && (
            <Suspense>
              <Pagination page={page} total={total} limit={limit} />
            </Suspense>
          )}
        </CarFilter>
      </Suspense>
    </div>
  );
}
