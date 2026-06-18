// EP-011
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';
import { prisma } from '@/lib/prisma';

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGES = 10;

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  // Car-Existenz prüfen
  const car = await prisma.car.findUnique({ where: { id: params.id } });
  if (!car) {
    return NextResponse.json(
      { statusCode: 404, error: 'NOT_FOUND', message: 'Fahrzeug nicht gefunden.', details: [] },
      { status: 404 },
    );
  }

  // Bild-Anzahl prüfen
  const imageCount = await prisma.image.count({ where: { carId: params.id } });
  if (imageCount >= MAX_IMAGES) {
    return NextResponse.json(
      { statusCode: 422, error: 'UNPROCESSABLE', message: 'Maximal 10 Bilder pro Fahrzeug.', details: [] },
      { status: 422 },
    );
  }

  // FormData parsen
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { statusCode: 400, error: 'VALIDATION_ERROR', message: 'Ungültiger Request.', details: [] },
      { status: 400 },
    );
  }

  const file = formData.get('image');
  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { statusCode: 400, error: 'VALIDATION_ERROR', message: 'Kein Bild übermittelt.', details: [] },
      { status: 400 },
    );
  }

  // Dateigröße prüfen
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { statusCode: 413, error: 'FILE_TOO_LARGE', message: 'Das Bild ist zu groß (max. 5 MB).', details: [] },
      { status: 413 },
    );
  }

  // MIME-Type prüfen
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { statusCode: 415, error: 'UNSUPPORTED_MEDIA_TYPE', message: 'Nur JPEG, PNG und WEBP sind erlaubt.', details: [] },
      { status: 415 },
    );
  }

  // Datei in Puffer lesen
  const buffer = Buffer.from(await file.arrayBuffer());

  // Mit sharp zu webp konvertieren
  const webpBuffer = await sharp(buffer)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();

  // Speicherort
  const filename = `${Date.now()}.webp`;
  const dirPath = path.join(process.cwd(), 'public', 'uploads', 'cars', params.id);
  await fs.mkdir(dirPath, { recursive: true });
  await fs.writeFile(path.join(dirPath, filename), webpBuffer);

  const relativeUrl = `/uploads/cars/${params.id}/${filename}`;

  // DB-Eintrag
  const image = await prisma.image.create({
    data: {
      carId: params.id,
      url: relativeUrl,
      sortOrder: imageCount,
    },
  });

  return NextResponse.json(
    {
      data: {
        id: image.id,
        url: image.url,
        sortOrder: image.sortOrder,
        createdAt: image.createdAt.toISOString(),
      },
    },
    { status: 201 },
  );
}
