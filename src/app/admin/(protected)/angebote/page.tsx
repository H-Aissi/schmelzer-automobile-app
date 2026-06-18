// SCR-009
import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { OfferTable } from '@/components/admin/offer-table';
import { Icon } from '@/components/ui/icon';
import type { OfferListItem } from '@/lib/types';

export const metadata: Metadata = { title: 'Angebote | Admin' };

const VALID_STATUSES = ['NEW', 'READ', 'CONTACTED', 'DECLINED'] as const;
type ValidStatus = (typeof VALID_STATUSES)[number];

type PageProps = { searchParams: { status?: string } };

export default async function AdminAngeboteListePage({ searchParams }: PageProps) {
  const activeStatus = VALID_STATUSES.includes(searchParams.status as ValidStatus)
    ? (searchParams.status as ValidStatus)
    : undefined;

  const where = activeStatus ? { status: activeStatus } : {};

  const [rawOffers, summaryRaw] = await Promise.all([
    prisma.offer.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { car: { select: { title: true, images: { select: { url: true }, orderBy: { sortOrder: 'asc' }, take: 1 } } } },
    }),
    prisma.offer.groupBy({ by: ['status'], _count: true }),
  ]);

  const counts: Record<string, number> = {};
  for (const row of summaryRaw) counts[row.status] = row._count;
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  const offers: OfferListItem[] = rawOffers.map((o) => ({
    id: o.id,
    carId: o.carId,
    carTitle: o.car.title,
    carImageUrl: o.car.images[0]?.url ?? null,
    firstName: o.firstName,
    lastName: o.lastName,
    email: o.email,
    phone: o.phone,
    offerAmount: o.offerAmount,
    message: o.message,
    status: o.status as OfferListItem['status'],
    createdAt: o.createdAt.toISOString(),
  }));

  const tabs = [
    { value: 'all', label: 'Alle', count: total },
    { value: 'NEW', label: 'Neu', count: counts['NEW'] ?? 0 },
    { value: 'READ', label: 'Gelesen', count: counts['READ'] ?? 0 },
    { value: 'CONTACTED', label: 'Kontaktiert', count: counts['CONTACTED'] ?? 0 },
    { value: 'DECLINED', label: 'Abgelehnt', count: counts['DECLINED'] ?? 0 },
  ];

  return (
    <div>
      <div className="admin-topbar">
        <div>
          <h1>Angebote</h1>
          <div className="sub">{total} Angebote insgesamt</div>
        </div>
      </div>

      <div className="admin-page-pad">
        <div className="tabs" style={{ marginBottom: 22 }}>
          {tabs.map((tab) => {
            const isActive = (tab.value === 'all' && !activeStatus) || activeStatus === tab.value;
            return (
              <Link
                key={tab.value}
                href={tab.value === 'all' ? '/admin/angebote' : `/admin/angebote?status=${tab.value}`}
                className={'tab' + (isActive ? ' on' : '')}
              >
                {tab.label}
                {tab.count > 0 && <span className="ct">{tab.count}</span>}
              </Link>
            );
          })}
        </div>

        <div className="panel">
          {offers.length === 0 ? (
            <div className="empty">
              <div className="ic"><Icon name="inbox" size={28} /></div>
              <p>Keine Angebote in dieser Kategorie.</p>
            </div>
          ) : (
            <OfferTable offers={offers} />
          )}
        </div>
      </div>
    </div>
  );
}
