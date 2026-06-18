// SCR-004
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { company } from '@/lib/company';
import { Icon } from '@/components/ui/icon';
import { OfferForm } from '@/components/public/offer-form';

type PageProps = { params: { id: string } };

function formatPrice(price: number) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price);
}
function formatMileage(mileage: number) {
  return new Intl.NumberFormat('de-DE').format(mileage) + ' km';
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const car = await prisma.car.findUnique({ where: { id: params.id } });
  if (!car) return { title: `Angebot senden | ${company.name}` };
  return { title: `Angebot senden — ${car.title} | ${company.name}` };
}

export default async function AngebotPage({ params }: PageProps) {
  const car = await prisma.car.findUnique({
    where: { id: params.id },
    include: { images: { where: { sortOrder: 0 }, take: 1 } },
  });

  if (!car || car.status === 'HIDDEN') notFound();
  if (car.status === 'SOLD') redirect(`/fahrzeuge/${params.id}`);

  return (
    <div className="container" style={{ paddingBottom: 40 }}>
      <div className="crumbs">
        <Link href="/">Startseite</Link>
        <Icon name="chevRight" size={14} />
        <Link href="/fahrzeuge">Fahrzeuge</Link>
        <Icon name="chevRight" size={14} />
        <Link href={`/fahrzeuge/${car.id}`}>{car.make} {car.model}</Link>
        <Icon name="chevRight" size={14} />
        <span style={{ color: 'var(--ink-2)' }}>Angebot</span>
      </div>

      <div style={{ marginBottom: 28 }}>
        <div className="eyebrow">Preisangebot abgeben</div>
        <h1 className="display" style={{ fontSize: 'clamp(30px,3.6vw,44px)', margin: '8px 0 0' }}>
          Machen Sie Ihren Preis
        </h1>
        <p className="muted" style={{ maxWidth: '56ch', marginTop: 8 }}>
          Senden Sie uns Ihr unverbindliches Angebot für dieses Fahrzeug. Wir prüfen es und melden uns persönlich bei Ihnen zurück.
        </p>
      </div>

      <div className="form-layout">
        <div className="form-card">
          <OfferForm carId={car.id} suggestedPrice={car.price} />
        </div>

        {/* Fahrzeug-Zusammenfassung */}
        <div className="summary-card">
          {car.images[0] ? (
            <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden' }}>
              <Image
                src={car.images[0].url}
                alt={car.title}
                fill
                sizes="(max-width: 920px) 100vw, 400px"
                style={{ objectFit: 'cover' }}
              />
            </div>
          ) : (
            <div className="ph" data-label="Fahrzeugfoto" style={{ aspectRatio: '16/10' }} />
          )}
          <div className="card-pad">
            <div className="vcard-brand mono" style={{ color: 'var(--accent)' }}>{car.make}</div>
            <h3 className="display" style={{ fontSize: 22, margin: '4px 0 2px' }}>{car.model}</h3>
            <div className="faint" style={{ fontSize: 13, marginBottom: 16 }}>{car.year}</div>
            <div className="row between" style={{ padding: '10px 0', borderTop: '1px solid var(--line)' }}>
              <span className="muted" style={{ fontSize: 14 }}>Angebotspreis</span>
              <span className="mono" style={{ fontWeight: 600 }}>{formatPrice(car.price)}</span>
            </div>
            <div className="row between" style={{ padding: '10px 0', borderTop: '1px solid var(--line)' }}>
              <span className="muted" style={{ fontSize: 14 }}>Baujahr</span>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{car.year}</span>
            </div>
            <div className="row between" style={{ padding: '10px 0', borderTop: '1px solid var(--line)' }}>
              <span className="muted" style={{ fontSize: 14 }}>Kilometerstand</span>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{formatMileage(car.mileage)}</span>
            </div>
            <Link href={`/fahrzeuge/${car.id}`} className="btn btn-ghost btn-block btn-sm" style={{ marginTop: 16 }}>
              <Icon name="arrowLeft" size={15} /> Zurück zum Fahrzeug
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
