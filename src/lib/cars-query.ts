// T-007
import type { Prisma } from '@prisma/client';
import type { CarFilterInput } from './validations';

type CarsQueryParams = Omit<CarFilterInput, 'sort'> & {
  sort?: CarFilterInput['sort'];
  page?: number;
  limit?: number;
  statusFilter?: 'public' | 'admin';
};

export function buildCarsQuery(params: CarsQueryParams): {
  where: Prisma.CarWhereInput;
  orderBy: Prisma.CarOrderByWithRelationInput;
  skip: number;
  take: number;
} {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(100, Math.max(1, params.limit ?? 12));

  const where: Prisma.CarWhereInput = {};

  // Status-Filter: public zeigt nur ACTIVE+SOLD; admin zeigt alle (kein Filter)
  if (params.statusFilter === 'public') {
    where.status = { in: ['ACTIVE', 'SOLD'] };
  }

  if (params.make) {
    where.makeNormalized = params.make.trim().toLowerCase();
  }

  if (params.fuelType) {
    where.fuelType = params.fuelType;
  }

  if (params.priceMin !== undefined || params.priceMax !== undefined) {
    where.price = {
      ...(params.priceMin !== undefined && { gte: params.priceMin }),
      ...(params.priceMax !== undefined && { lte: params.priceMax }),
    };
  }

  let orderBy: Prisma.CarOrderByWithRelationInput;
  switch (params.sort) {
    case 'price_asc':
      orderBy = { price: 'asc' };
      break;
    case 'price_desc':
      orderBy = { price: 'desc' };
      break;
    case 'date_desc':
    default:
      orderBy = { createdAt: 'desc' };
  }

  return {
    where,
    orderBy,
    skip: (page - 1) * limit,
    take: limit,
  };
}
