// SCR-010
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { api, ApiError } from '@/lib/api-client';
import { useToast } from '@/components/ui/toast';
import { Icon } from '@/components/ui/icon';

type OfferStatus = 'NEW' | 'READ' | 'CONTACTED' | 'DECLINED';

type OfferDetail = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  offerAmount: number;
  message: string | null;
  status: OfferStatus;
  car: { id: string; title: string; make: string; year: number; price: number };
  createdAt: string;
};

const STATUS: Record<OfferStatus, { label: string; cls: string }> = {
  NEW: { label: 'Neu', cls: 'badge-accent dot' },
  READ: { label: 'Gelesen', cls: 'badge-blue dot' },
  CONTACTED: { label: 'Kontaktiert', cls: 'badge-green dot' },
  DECLINED: { label: 'Abgelehnt', cls: 'dot' },
};

function formatPrice(price: number) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price);
}

export default function AngebotDetailPage({ params }: { params: { id: string } }) {
  const { showToast } = useToast();
  const [offer, setOffer] = useState<OfferDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get<{ data: OfferDetail }>(`/admin/offers/${params.id}`);
        setOffer(res.data);
        if (res.data.status === 'NEW') {
          try {
            const updated = await api.put<{ data: OfferDetail }>(`/admin/offers/${params.id}`, { status: 'READ' });
            setOffer(updated.data);
          } catch { /* ignorieren */ }
        }
      } catch (err) {
        if (err instanceof ApiError && err.statusCode === 404) {
          setNotFoundState(true);
        } else {
          showToast({ variant: 'error', message: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.' });
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function updateStatus(status: 'CONTACTED' | 'DECLINED') {
    setActionLoading(true);
    try {
      const res = await api.put<{ data: OfferDetail }>(`/admin/offers/${params.id}`, { status });
      setOffer(res.data);
      showToast({ variant: 'success', message: 'Status aktualisiert.' });
    } catch {
      showToast({ variant: 'error', message: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.' });
    } finally {
      setActionLoading(false);
    }
  }

  if (notFoundState) notFound();

  if (loading) {
    return (
      <div className="admin-page-pad">
        <div className="skeleton" style={{ height: 20, width: 120, borderRadius: 6, marginBottom: 24 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div className="skeleton" style={{ height: 180, borderRadius: 12 }} />
          <div className="skeleton" style={{ height: 180, borderRadius: 12 }} />
        </div>
      </div>
    );
  }

  if (!offer) return null;

  const s = STATUS[offer.status];

  return (
    <div>
      <div className="admin-topbar">
        <div>
          <h1>Angebot {offer.id.slice(-8).toUpperCase()}</h1>
          <div className="sub">{offer.car.title} · eingegangen am {format(new Date(offer.createdAt), 'dd.MM.yyyy', { locale: de })}</div>
        </div>
        <span className={'badge ' + s.cls}>{s.label}</span>
      </div>

      <div className="admin-page-pad" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 420px), 1fr))', gap: 24, alignItems: 'start' }}>
        {/* Angebots-Details */}
        <div className="panel">
          <div className="panel-head">
            <h3>Angebotsdetails</h3>
            <div className="buy-price mono" style={{ fontSize: 28 }}>{formatPrice(offer.offerAmount)}</div>
          </div>
          <div className="card-pad">
            <div className="spec-grid" style={{ marginBottom: 20 }}>
              <div className="spec-cell"><div className="k">Interessent</div><div className="v">{offer.firstName} {offer.lastName}</div></div>
              <div className="spec-cell">
                <div className="k">E-Mail</div>
                <div className="v"><a href={`mailto:${offer.email}`} style={{ color: 'var(--accent)' }}>{offer.email}</a></div>
              </div>
              {offer.phone && (
                <div className="spec-cell">
                  <div className="k">Telefon</div>
                  <div className="v"><a href={`tel:${offer.phone}`} style={{ color: 'var(--accent)' }}>{offer.phone}</a></div>
                </div>
              )}
              <div className="spec-cell">
                <div className="k">Datum</div>
                <div className="v">{format(new Date(offer.createdAt), 'dd.MM.yyyy HH:mm', { locale: de })}</div>
              </div>
            </div>
            {offer.message && (
              <div>
                <div className="label" style={{ marginBottom: 8 }}>Nachricht</div>
                <div className="panel" style={{ padding: 16, background: 'var(--surface-2)', whiteSpace: 'pre-wrap', fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.6 }}>
                  {offer.message}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fahrzeug + Aktionen */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="panel">
            <div className="panel-head"><h3>Fahrzeug</h3></div>
            <div className="card-pad">
              <div className="vcard-brand mono" style={{ color: 'var(--accent)' }}>{offer.car.make}</div>
              <div style={{ fontWeight: 700, fontSize: 17, margin: '4px 0 8px' }}>{offer.car.title}</div>
              <div className="row between">
                <span className="muted" style={{ fontSize: 14 }}>Baujahr</span>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{offer.car.year}</span>
              </div>
              <div className="row between" style={{ marginTop: 8 }}>
                <span className="muted" style={{ fontSize: 14 }}>Angebotspreis</span>
                <span className="mono" style={{ fontWeight: 600 }}>{formatPrice(offer.car.price)}</span>
              </div>
              <div className="row between" style={{ marginTop: 8 }}>
                <span className="muted" style={{ fontSize: 14 }}>Kunden-Angebot</span>
                <span className="mono" style={{ fontWeight: 700, color: 'var(--accent)' }}>{formatPrice(offer.offerAmount)}</span>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                <Link href={`/fahrzeuge/${offer.car.id}`} className="btn btn-ghost btn-sm" style={{ flex: 1 }}>
                  <Icon name="eye" size={15} /> Ansehen
                </Link>
                <Link href={`/admin/fahrzeuge/${offer.car.id}/bearbeiten`} className="btn btn-ghost btn-sm" style={{ flex: 1 }}>
                  <Icon name="pencil" size={15} /> Bearbeiten
                </Link>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-head"><h3>Status ändern</h3></div>
            <div className="card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                className="btn btn-primary btn-block"
                onClick={() => updateStatus('CONTACTED')}
                disabled={offer.status === 'CONTACTED' || actionLoading}
              >
                <Icon name="checkCircle" size={17} /> Kontakt aufgenommen
              </button>
              <button
                className="btn btn-ghost btn-block"
                onClick={() => updateStatus('DECLINED')}
                disabled={offer.status === 'DECLINED' || actionLoading}
                style={{ color: 'var(--ink-2)' }}
              >
                Ablehnen
              </button>
            </div>
          </div>

          <Link href="/admin/angebote" className="btn btn-ghost btn-block">
            <Icon name="arrowLeft" size={16} /> Zurück zu Angeboten
          </Link>
        </div>
      </div>
    </div>
  );
}
