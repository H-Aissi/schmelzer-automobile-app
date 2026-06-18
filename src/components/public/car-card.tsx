import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@/components/ui/icon';
import type { CarListItem } from '@/lib/types';

const FUEL_LABELS: Record<string, string> = {
  BENZIN: 'Benzin',
  DIESEL: 'Diesel',
  ELEKTRO: 'Elektro',
  HYBRID: 'Hybrid',
  GAS: 'Gas',
};

const TRANS_LABELS: Record<string, string> = {
  MANUELL: 'Schaltgetriebe',
  AUTOMATIK: 'Automatik',
};

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  ACTIVE: { label: 'Verfügbar', cls: 'badge-green dot' },
  SOLD: { label: 'Verkauft', cls: 'badge-ink' },
  HIDDEN: { label: 'Versteckt', cls: 'dot' },
};

function formatPrice(price: number) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price);
}
function formatMileage(mileage: number) {
  return new Intl.NumberFormat('de-DE').format(mileage) + ' km';
}

type CarCardProps = { car: CarListItem };

export function CarCard({ car }: CarCardProps) {
  const status = STATUS_MAP[car.status] ?? STATUS_MAP.ACTIVE;

  return (
    <Link href={`/fahrzeuge/${car.id}`} className="vcard" aria-label={`${car.make} ${car.model} — ${formatPrice(car.price)}`}>
      <div className="vcard-media">
        {car.titleImage ? (
          <div style={{ aspectRatio: 'var(--img-ar)', position: 'relative', overflow: 'hidden' }}>
            <Image
              src={car.titleImage}
              alt={`${car.make} ${car.model}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
        ) : (
          <div className="ph" data-label="Kein Foto" style={{ aspectRatio: 'var(--img-ar)' }} />
        )}
        <div className="vcard-badges">
          <span className={'badge ' + status.cls}>{status.label}</span>
        </div>
      </div>
      <div className="vcard-body">
        <div className="row between" style={{ gap: 10, alignItems: 'flex-start' }}>
          <div>
            <div className="vcard-brand mono">{car.make}</div>
            <h3 className="vcard-title display">{car.model}</h3>
            <div className="vcard-variant faint">{car.year}</div>
          </div>
          <div className="vcard-price mono">{formatPrice(car.price)}</div>
        </div>
        <div className="vcard-specs">
          <span className="vcard-spec"><Icon name="calendar" size={15} />{car.year}</span>
          <span className="vcard-spec"><Icon name="gauge" size={15} />{formatMileage(car.mileage)}</span>
          <span className="vcard-spec"><Icon name="fuel" size={15} />{FUEL_LABELS[car.fuelType] ?? car.fuelType}</span>
          <span className="vcard-spec"><Icon name="cog" size={15} />{TRANS_LABELS[car.transmission] ?? car.transmission}</span>
        </div>
        <div className="vcard-foot">
          <span className="vcard-power mono"><Icon name="bolt" size={14} /> {car.power} PS</span>
          <span className="vcard-cta">Details <Icon name="arrowRight" size={16} /></span>
        </div>
      </div>
    </Link>
  );
}
