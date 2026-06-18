// SCR-003
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { company } from '@/lib/company';
import { ImageGallery } from '@/components/public/image-gallery';
import { Icon } from '@/components/ui/icon';

export const revalidate = 30;

const FUEL_LABELS: Record<string, string> = {
  BENZIN: 'Benzin', DIESEL: 'Diesel', ELEKTRO: 'Elektro', HYBRID: 'Hybrid', GAS: 'Gas',
};

function formatPrice(price: number) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price);
}
function formatMileage(mileage: number) {
  return new Intl.NumberFormat('de-DE').format(mileage) + ' km';
}

type PageProps = { params: { id: string } };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const car = await prisma.car.findUnique({ where: { id: params.id }, include: { images: { where: { sortOrder: 0 }, take: 1 } } });
  if (!car || car.status === 'HIDDEN') return { title: `Fahrzeug nicht gefunden | ${company.name}` };
  return {
    title: `${car.title} ${car.year} | ${company.name}`,
    description: `${car.make} ${car.model}, ${car.year}, ${formatMileage(car.mileage)}, ${formatPrice(car.price)}`,
    openGraph: car.images[0] ? { images: [{ url: car.images[0].url }] } : undefined,
  };
}

export default async function FahrzeugDetailPage({ params }: PageProps) {
  const car = await prisma.car.findUnique({
    where: { id: params.id },
    include: { images: { orderBy: { sortOrder: 'asc' } } },
  });

  if (!car || car.status === 'HIDDEN') notFound();

  const isSold = car.status === 'SOLD';
  const isReserved = false; // reserved status not in schema yet

  const specs = [
    { k: 'Baujahr', v: String(car.year) },
    { k: 'Kilometerstand', v: formatMileage(car.mileage) },
    { k: 'Kraftstoff', v: FUEL_LABELS[car.fuelType] ?? car.fuelType },
    { k: 'Getriebe', v: car.transmission === 'MANUELL' ? 'Schaltgetriebe' : 'Automatik' },
    { k: 'Leistung', v: `${car.power} PS` },
    { k: 'Farbe', v: car.color },
  ];

  return (
    <div className="container" style={{ paddingBottom: 40 }}>
      <div className="crumbs">
        <Link href="/">Startseite</Link>
        <Icon name="chevRight" size={14} />
        <Link href="/fahrzeuge">Fahrzeuge</Link>
        <Icon name="chevRight" size={14} />
        <span style={{ color: 'var(--ink-2)' }}>{car.make} {car.model}</span>
      </div>

      <div className="detail-layout">
        {/* Galerie + Details */}
        <div>
          <div className="gallery-main">
            <ImageGallery images={car.images} carTitle={car.title} />
          </div>

          <div className="detail-section">
            <h3 className="display">Fahrzeugbeschreibung</h3>
            <p className="muted" style={{ fontSize: 16, lineHeight: 1.7, maxWidth: '62ch' }}>
              {car.description || 'Keine Beschreibung vorhanden.'}
              {' '}Alle Angaben ohne Gewähr; Irrtümer und Zwischenverkauf vorbehalten.
            </p>
          </div>

          <div className="detail-section">
            <h3 className="display">Technische Daten</h3>
            <div className="spec-grid">
              {specs.map((s) => (
                <div className="spec-cell" key={s.k}>
                  <div className="k">{s.k}</div>
                  <div className="v">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Buy Box */}
        <div>
          <div className="buy-box">
            <div className="row between" style={{ marginBottom: 14 }}>
              <span className="vcard-brand mono" style={{ color: 'var(--accent)' }}>{car.make}</span>
              <span className={'badge ' + (isSold ? 'badge-ink' : 'badge-green dot')}>
                {isSold ? 'Verkauft' : 'Verfügbar'}
              </span>
            </div>
            <h1 className="display" style={{ fontSize: 30, margin: '0 0 4px' }}>{car.model}</h1>
            <div className="faint" style={{ marginBottom: 18 }}>{car.year} · {car.color}</div>

            <div className="buy-price mono">{formatPrice(car.price)}</div>
            <div className="faint" style={{ fontSize: 13, marginTop: 8 }}>
              inkl. 19% MwSt. ausweisbar · Finanzierung auf Anfrage
            </div>

            <div className="buy-meta">
              <span className="badge"><Icon name="calendar" size={14} /> {car.year}</span>
              <span className="badge"><Icon name="gauge" size={14} /> {formatMileage(car.mileage)}</span>
              <span className="badge"><Icon name="fuel" size={14} /> {FUEL_LABELS[car.fuelType] ?? car.fuelType}</span>
              <span className="badge"><Icon name="cog" size={14} /> {car.transmission === 'MANUELL' ? 'Schaltgetriebe' : 'Automatik'}</span>
            </div>

            {isSold && (
              <div className="alert alert-info" style={{ marginBottom: 14 }}>
                <Icon name="inbox" size={18} /> Dieses Fahrzeug ist bereits verkauft. Sprechen Sie uns auf vergleichbare Modelle an.
              </div>
            )}

            {!isSold && (
              <Link href={`/fahrzeuge/${car.id}/angebot`} className="btn btn-primary btn-block btn-lg">
                <Icon name="euro" size={18} /> Preisangebot senden
              </Link>
            )}
            <Link href={`tel:${company.phone}`} className="btn btn-ghost btn-block" style={{ marginTop: 10 }}>
              <Icon name="phone" size={17} /> {company.phone}
            </Link>

            <div className="dealer-mini">
              <div className="dealer-ava">SA</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{company.name}</div>
                <div className="faint" style={{ fontSize: 12.5 }}>Heute bis 18:00 erreichbar</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
