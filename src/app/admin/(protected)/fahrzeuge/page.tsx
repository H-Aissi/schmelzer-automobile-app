// SCR-007
import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Icon } from '@/components/ui/icon';
import { CarList } from '@/components/admin/car-list';

export const metadata: Metadata = { title: 'Fahrzeuge | Admin' };

export default async function AdminFahrzeugListePage() {
  const cars = await prisma.car.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      images: { where: { sortOrder: 0 }, take: 1 },
      _count: { select: { offers: true } },
    },
  });

  const serialized = cars.map((car) => ({
    id: car.id,
    title: car.title,
    make: car.make,
    model: car.model,
    year: car.year,
    price: car.price,
    status: car.status,
    createdAt: car.createdAt.toISOString(),
    images: car.images.map((img) => ({ url: img.url })),
    _count: car._count,
  }));

  return (
    <div>
      <div className="admin-topbar">
        <div>
          <h1>Fahrzeuge</h1>
          <div className="sub">{cars.length} Inserate im System</div>
        </div>
        <Link href="/admin/fahrzeuge/neu" className="btn btn-primary btn-sm">
          <Icon name="plus" size={16} /> Fahrzeug inserieren
        </Link>
      </div>

      <div className="admin-page-pad">
        {cars.length === 0 ? (
          <div className="empty panel">
            <div className="ic"><Icon name="car" size={28} /></div>
            <h3 style={{ margin: '0 0 6px', color: 'var(--ink)' }}>Noch keine Fahrzeuge angelegt.</h3>
            <Link href="/admin/fahrzeuge/neu" className="btn btn-primary btn-sm" style={{ marginTop: 14 }}>
              Erstes Fahrzeug inserieren
            </Link>
          </div>
        ) : (
          <div className="panel">
            <CarList cars={serialized} />
          </div>
        )}
      </div>
    </div>
  );
}
