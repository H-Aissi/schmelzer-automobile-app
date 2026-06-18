// EP-012
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string; imageId: string } },
) {
  const image = await prisma.image.findFirst({
    where: { id: params.imageId, carId: params.id },
  });

  if (!image) {
    return NextResponse.json(
      { statusCode: 404, error: 'NOT_FOUND', message: 'Bild nicht gefunden.', details: [] },
      { status: 404 },
    );
  }

  // Datei vom Filesystem löschen
  try {
    await fs.unlink(path.join(process.cwd(), 'public', image.url));
  } catch {
    // Datei evtl. nicht vorhanden — ignorieren
  }

  // Aus DB löschen
  await prisma.image.delete({ where: { id: params.imageId } });

  // Verbleibende Bilder neu nummerieren
  const remaining = await prisma.image.findMany({
    where: { carId: params.id },
    orderBy: { sortOrder: 'asc' },
  });

  for (let i = 0; i < remaining.length; i++) {
    if (remaining[i].sortOrder !== i) {
      await prisma.image.update({
        where: { id: remaining[i].id },
        data: { sortOrder: i },
      });
    }
  }

  return NextResponse.json({
    data: { message: 'Bild wurde erfolgreich gelöscht.' },
  });
}
