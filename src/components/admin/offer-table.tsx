'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import type { OfferListItem } from '@/lib/types';

type OfferTableProps = { offers: OfferListItem[] };

const STATUS: Record<string, { label: string; cls: string; dot: string }> = {
  NEW:       { label: 'Neu',         cls: 'badge-accent dot', dot: 'var(--accent-700)' },
  READ:      { label: 'Gelesen',     cls: 'badge-blue dot',   dot: '#2B5C9A' },
  CONTACTED: { label: 'Kontaktiert', cls: 'badge-green dot',  dot: '#1E7A4D' },
  DECLINED:  { label: 'Abgelehnt',  cls: 'dot',              dot: 'var(--ink-3)' },
};

function formatPrice(price: number) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price);
}

export function OfferTable({ offers }: OfferTableProps) {
  const router = useRouter();

  return (
    <>
      {/* Desktop table */}
      <div className="scroll-x offer-desktop-table">
        <table className="tbl">
          <thead>
            <tr>
              <th>Status</th>
              <th>Fahrzeug</th>
              <th>Interessent</th>
              <th>E-Mail</th>
              <th>Angebot</th>
              <th>Datum</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer) => {
              const s = STATUS[offer.status] ?? STATUS.NEW;
              return (
                <tr
                  key={offer.id}
                  className={offer.status === 'NEW' ? 'row-new' : ''}
                  style={{ cursor: 'pointer' }}
                  onClick={() => router.push(`/admin/angebote/${offer.id}`)}
                >
                  <td><span className={'badge ' + s.cls}>{s.label}</span></td>
                  <td style={{ fontWeight: offer.status === 'NEW' ? 600 : undefined }}>{offer.carTitle}</td>
                  <td>{offer.firstName} {offer.lastName}</td>
                  <td style={{ color: 'var(--ink-2)' }}>{offer.email}</td>
                  <td className="mono" style={{ fontWeight: 600 }}>{formatPrice(offer.offerAmount)}</td>
                  <td style={{ color: 'var(--ink-3)' }}>
                    {format(new Date(offer.createdAt), 'dd.MM.yyyy HH:mm', { locale: de })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="offer-mobile-list">
        {offers.map((offer) => {
          const s = STATUS[offer.status] ?? STATUS.NEW;
          return (
            <button
              key={offer.id}
              className={'offer-mobile-card' + (offer.status === 'NEW' ? ' row-new' : '')}
              onClick={() => router.push(`/admin/angebote/${offer.id}`)}
            >
              <div className="offer-mobile-card-img">
                {offer.carImageUrl ? (
                  <Image src={offer.carImageUrl} alt={offer.carTitle} fill style={{ objectFit: 'cover' }} sizes="72px" />
                ) : (
                  <div className="offer-mobile-card-img-ph" />
                )}
              </div>
              <div className="offer-mobile-card-body">
                <div className="offer-mobile-card-name">{offer.carTitle}</div>
                <div className="offer-mobile-card-sub">
                  {offer.firstName} {offer.lastName} · {formatPrice(offer.offerAmount)}
                </div>
                <div className="offer-mobile-card-date">
                  {format(new Date(offer.createdAt), 'dd.MM.yy HH:mm', { locale: de })}
                </div>
              </div>
              <span className="offer-mobile-card-dot" style={{ background: s.dot }} title={s.label} />
            </button>
          );
        })}
      </div>
    </>
  );
}
