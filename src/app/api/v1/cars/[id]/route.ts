// EP-002
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const car = await prisma.car.findUnique({
    where: { id: params.id },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
    },
  });

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

  return NextResponse.json({
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
      images: car.images.map((img) => ({
        id: img.id,
        url: img.url,
        sortOrder: img.sortOrder,
      })),
      createdAt: car.createdAt.toISOString(),
    },
  });
}
