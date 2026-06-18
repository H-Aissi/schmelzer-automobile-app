'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Icon } from '@/components/ui/icon';
import { useToast } from '@/components/ui/toast';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { api } from '@/lib/api-client';

type CarListItem = {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  status: string;
  createdAt: string;
  images: { url: string }[];
  _count: { offers: number };
};

const STATUS: Record<string, { label: string; cls: string }> = {
  ACTIVE: { label: 'Verfügbar', cls: 'badge-green dot' },
  SOLD:   { label: 'Verkauft',  cls: 'badge-ink' },
  HIDDEN: { label: 'Versteckt', cls: 'dot' },
};

function formatPrice(price: number) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price);
}

export function CarList({ cars }: { cars: CarListItem[] }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [selected, setSelected] = useState<CarListItem | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!selected) return;
    setDeleting(true);
    try {
      await api.del(`/admin/cars/${selected.id}`);
      setConfirmDelete(false);
      setSelected(null);
      showToast({ variant: 'success', message: 'Fahrzeug wurde erfolgreich gelöscht.' });
      router.refresh();
    } catch {
      showToast({ variant: 'error', message: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.' });
    } finally {
      setDeleting(false);
    }
  }

  useEffect(() => {
    document.body.style.overflow = selected ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selected]);

  const s = selected ? (STATUS[selected.status] ?? STATUS.ACTIVE) : null;

  return (
    <>
      {/* Desktop table */}
      <div className="scroll-x car-desktop-table">
        <table className="tbl">
          <thead>
            <tr>
              <th>Bild</th>
              <th>Fahrzeug</th>
              <th>Preis</th>
              <th>Status</th>
              <th>Angebote</th>
              <th>Erstellt</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => {
              const st = STATUS[car.status] ?? STATUS.ACTIVE;
              return (
                <tr key={car.id}>
                  <td>
                    <div className="tbl-thumb">
                      {car.images[0] ? (
                        <Image src={car.images[0].url} alt={car.title} fill sizes="64px" style={{ objectFit: 'cover' }} />
                      ) : (
                        <div className="ph" style={{ width: '100%', height: '100%' }} data-label="" />
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="tbl-veh">
                      <div>
                        <div className="nm">{car.make} {car.model}</div>
                        <div className="sub">{car.year} · {formatPrice(car.price)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="mono" style={{ fontWeight: 600 }}>{formatPrice(car.price)}</td>
                  <td><span className={'badge ' + st.cls}>{st.label}</span></td>
                  <td style={{ color: 'var(--ink-2)' }}>{car._count.offers}</td>
                  <td style={{ color: 'var(--ink-3)' }}>{format(new Date(car.createdAt), 'dd.MM.yy', { locale: de })}</td>
                  <td>
                    <div className="row-actions">
                      <Link href={`/admin/fahrzeuge/${car.id}/bearbeiten`} className="icon-btn" title="Bearbeiten">
                        <Icon name="pencil" size={15} />
                      </Link>
                      <Link href={`/fahrzeuge/${car.id}`} className="icon-btn" title="Ansehen" target="_blank">
                        <Icon name="eye" size={15} />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="car-mobile-list">
        {cars.map((car) => {
          const st = STATUS[car.status] ?? STATUS.ACTIVE;
          return (
            <button key={car.id} className="car-mobile-card" onClick={() => setSelected(car)}>
              <div className="car-mobile-card-img">
                {car.images[0] ? (
                  <Image src={car.images[0].url} alt={car.title} fill style={{ objectFit: 'cover' }} sizes="80px" />
                ) : (
                  <div className="car-mobile-card-img-ph" />
                )}
              </div>
              <div className="car-mobile-card-body">
                <div className="car-mobile-card-name">{car.make} {car.model}</div>
                <div className="car-mobile-card-sub">
                  {formatPrice(car.price)} · {car._count.offers} Angebot{car._count.offers !== 1 ? 'e' : ''}
                </div>
                <div className="car-mobile-card-meta">
                  <span className={'badge ' + st.cls} style={{ fontSize: 11 }}>{st.label}</span>
                </div>
              </div>
              <Icon name="chevRight" size={16} style={{ color: 'var(--ink-3)', flexShrink: 0 }} />
            </button>
          );
        })}
      </div>

      {/* Bottom sheet */}
      {selected && (
        <>
          <div className="car-sheet-backdrop" onClick={() => setSelected(null)} />
          <div className="car-sheet">
            <button className="car-sheet-close" onClick={() => setSelected(null)} aria-label="Schließen">
              <Icon name="x" size={18} />
            </button>

            <div className="car-sheet-img">
              {selected.images[0] ? (
                <Image src={selected.images[0].url} alt={selected.title} fill style={{ objectFit: 'cover' }} sizes="100vw" />
              ) : (
                <div className="car-sheet-img-ph" />
              )}
            </div>

            <div className="car-sheet-body">
              <div className="car-sheet-title">{selected.make} {selected.model}</div>
              <div className="car-sheet-price">{formatPrice(selected.price)}</div>
              <div className="car-sheet-meta">
                <span className={'badge ' + s!.cls}>{s!.label}</span>
                <span className="car-sheet-offers">
                  {selected._count.offers} Angebot{selected._count.offers !== 1 ? 'e' : ''}
                </span>
              </div>
            </div>

            <div className="car-sheet-actions">
              <Link
                href={`/admin/fahrzeuge/${selected.id}/bearbeiten`}
                className="btn btn-primary"
                title="Bearbeiten"
              >
                <Icon name="pencil" size={18} />
              </Link>
              <Link
                href={`/fahrzeuge/${selected.id}`}
                className="btn btn-ghost"
                target="_blank"
                title="Ansehen"
              >
                <Icon name="eye" size={18} />
              </Link>
              <button
                className="btn btn-ghost car-sheet-delete"
                onClick={() => setConfirmDelete(true)}
                title="Löschen"
              >
                <Icon name="trash" size={18} />
              </button>
            </div>
          </div>

          <ConfirmDialog
            isOpen={confirmDelete}
            title="Fahrzeug löschen"
            message="Möchten Sie dieses Fahrzeug wirklich löschen? Alle Bilder und Angebote werden unwiderruflich entfernt."
            confirmLabel="Löschen"
            onConfirm={handleDelete}
            onCancel={() => setConfirmDelete(false)}
            isLoading={deleting}
            danger
          />
        </>
      )}
    </>
  );
}
