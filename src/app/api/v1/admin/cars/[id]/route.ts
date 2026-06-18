// EP-008, EP-009, EP-010
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { prisma } from '@/lib/prisma';
import { carUpdateSchema } from '@/lib/validations';

// EP-008
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const car = await prisma.car.findUnique({
    where: { id: params.id },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      _count: { select: { offers: true } },
    },
  });

  if (!car) {
    return NextResponse.json(
      { statusCode: 404, error: 'NOT_FOUND', message: 'Fahrzeug nicht gefunden.', details: [] },
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
      offersCount: car._count.offers,
      createdAt: car.createdAt.toISOString(),
      updatedAt: car.updatedAt.toISOString(),
    },
  });
}

// EP-009
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const existing = await prisma.car.findUnique({ where: { id: params.id } });
  if (!existing) {
    return NextResponse.json(
      { statusCode: 404, error: 'NOT_FOUND', message: 'Fahrzeug nicht gefunden.', details: [] },
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

  const parseResult = carUpdateSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      {
        statusCode: 400,
        error: 'VALIDATION_ERROR',
        message: 'Eingabe ungültig.',
        details: parseResult.error.errors.map((e) => ({
          field: e.path.join('.'),
          rule: e.code,
        })),
      },
      { status: 400 },
    );
  }

  const d = parseResult.data;
  const car = await prisma.car.update({
    where: { id: params.id },
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
      status: d.status,
    },
    include: { images: { orderBy: { sortOrder: 'asc' } } },
  });

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
      updatedAt: car.updatedAt.toISOString(),
    },
  });
}

// EP-010
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const car = await prisma.car.findUnique({
    where: { id: params.id },
    include: { images: true },
  });

  if (!car) {
    return NextResponse.json(
      { statusCode: 404, error: 'NOT_FOUND', message: 'Fahrzeug nicht gefunden.', details: [] },
      { status: 404 },
    );
  }

  // Bilder vom Filesystem löschen
  for (const image of car.images) {
    try {
      await fs.unlink(path.join(process.cwd(), 'public', image.url));
    } catch {
      // Datei evtl. nicht vorhanden — ignorieren
    }
  }

  // Verzeichnis löschen
  const carDir = path.join(process.cwd(), 'public', 'uploads', 'cars', params.id);
  await fs.rm(carDir, { recursive: true, force: true });

  // Car löschen (Cascade entfernt Images + Offers)
  await prisma.car.delete({ where: { id: params.id } });

  return NextResponse.json({
    data: { message: 'Fahrzeug wurde erfolgreich gelöscht.' },
  });
}
