// SCR-006
import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Icon } from '@/components/ui/icon';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

export const metadata: Metadata = { title: 'Dashboard | Admin' };

function formatPrice(price: number) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price);
}

const OFFER_STATUS: Record<string, { label: string; cls: string; dot: string }> = {
  NEW:       { label: 'Neu',         cls: 'badge-accent dot', dot: 'var(--accent-700)' },
  READ:      { label: 'Gelesen',     cls: 'badge-blue dot',   dot: '#2B5C9A' },
  CONTACTED: { label: 'Kontaktiert', cls: 'badge-green dot',  dot: '#1E7A4D' },
  DECLINED:  { label: 'Abgelehnt',  cls: 'dot',              dot: 'var(--ink-3)' },
};

export default async function AdminDashboardPage() {
  const [activeCars, soldCars, newOffers, totalOffers, recentOffers] = await Promise.all([
    prisma.car.count({ where: { status: 'ACTIVE' } }),
    prisma.car.count({ where: { status: 'SOLD' } }),
    prisma.offer.count({ where: { status: 'NEW' } }),
    prisma.offer.count(),
    prisma.offer.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { car: { select: { title: true, make: true, model: true } } },
    }),
  ]);

  const kpis = [
    { label: 'Aktive Inserate', value: activeCars, icon: 'car' },
    { label: 'Verkaufte Fahrzeuge', value: soldCars, icon: 'tag' },
    { label: 'Neue Angebote', value: newOffers, icon: 'inbox', accent: newOffers > 0 },
    { label: 'Angebote gesamt', value: totalOffers, icon: 'trend' },
  ];

  return (
    <div>
      <div className="admin-topbar">
        <div>
          <h1>Dashboard</h1>
          <div className="sub">Übersicht · {format(new Date(), 'dd. MMMM yyyy', { locale: de })}</div>
        </div>
        <Link href="/admin/fahrzeuge/neu" className="btn btn-primary btn-sm">
          <Icon name="plus" size={16} /> Fahrzeug inserieren
        </Link>
      </div>

      <div className="admin-page-pad">
        {/* KPI-Karten */}
        <div className="kpi-grid" style={{ marginBottom: 28 }}>
          {kpis.map((k) => (
            <div className="kpi" key={k.label}>
              <div className="kpi-top">
                <div className="kpi-ic"><Icon name={k.icon} size={20} /></div>
              </div>
              <div className="kpi-val" style={k.accent ? { color: 'var(--accent)' } : undefined}>{k.value}</div>
              <div className="kpi-label">{k.label}</div>
            </div>
          ))}
        </div>

        {/* Letzte Angebote */}
        <div className="panel">
          <div className="panel-head">
            <h3>Letzte Angebote</h3>
            <Link href="/admin/angebote" className="btn btn-ghost btn-sm">
              Alle anzeigen <Icon name="arrowRight" size={15} />
            </Link>
          </div>
          {recentOffers.length === 0 ? (
            <div className="empty"><p>Noch keine Angebote eingegangen.</p></div>
          ) : (
            <>
              {/* Desktop */}
              <div className="scroll-x dash-offers-table">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>Fahrzeug</th>
                      <th>Kunde</th>
                      <th>Betrag</th>
                      <th>Status</th>
                      <th>Datum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOffers.map((offer) => {
                      const s = OFFER_STATUS[offer.status] ?? OFFER_STATUS.NEW;
                      return (
                        <tr key={offer.id} className={offer.status === 'NEW' ? 'row-new' : ''}>
                          <td>
                            <Link href={`/admin/angebote/${offer.id}`} style={{ fontWeight: 600, color: 'var(--ink)' }}>
                              {offer.car.make} {offer.car.model}
                            </Link>
                          </td>
                          <td style={{ color: 'var(--ink-2)' }}>{offer.firstName} {offer.lastName}</td>
                          <td className="mono" style={{ fontWeight: 600 }}>{formatPrice(offer.offerAmount)}</td>
                          <td><span className={'badge ' + s.cls}>{s.label}</span></td>
                          <td style={{ color: 'var(--ink-3)' }}>{format(offer.createdAt, 'dd.MM.yyyy', { locale: de })}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}
              <div className="dash-offers-list">
                {recentOffers.map((offer) => {
                  const s = OFFER_STATUS[offer.status] ?? OFFER_STATUS.NEW;
                  return (
                    <Link
                      key={offer.id}
                      href={`/admin/angebote/${offer.id}`}
                      className={'dash-offer-row' + (offer.status === 'NEW' ? ' row-new' : '')}
                    >
                      <span className="dash-offer-dot" style={{ background: s.dot }} />
                      <div className="dash-offer-info">
                        <div className="dash-offer-car">{offer.car.make} {offer.car.model}</div>
                        <div className="dash-offer-meta">{offer.firstName} {offer.lastName}</div>
                      </div>
                      <div className="dash-offer-right">
                        <div className="dash-offer-amount">{formatPrice(offer.offerAmount)}</div>
                        <div className="dash-offer-date">{format(offer.createdAt, 'dd.MM.yy', { locale: de })}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
