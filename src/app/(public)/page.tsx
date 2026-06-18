// SCR-001
import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { company } from '@/lib/company';
import { CarGrid } from '@/components/public/car-grid';
import { Icon } from '@/components/ui/icon';
import type { CarListItem } from '@/lib/types';

export const revalidate = 60;

export const metadata: Metadata = {
  title: `${company.name} — Ihr Autohaus`,
  description: 'Entdecken Sie unser Fahrzeugangebot. Qualitätsfahrzeuge zu fairen Preisen.',
};

export default async function HomePage() {
  let cars: CarListItem[] = [];

  try {
    const rawCars = await prisma.car.findMany({
      where: { status: { in: ['ACTIVE', 'SOLD'] } },
      orderBy: { createdAt: 'desc' },
      take: 6,
      include: { images: { where: { sortOrder: 0 }, take: 1 } },
    });

    cars = rawCars.map((car) => ({
      id: car.id,
      title: car.title,
      make: car.make,
      model: car.model,
      year: car.year,
      price: car.price,
      mileage: car.mileage,
      fuelType: car.fuelType as CarListItem['fuelType'],
      transmission: car.transmission as CarListItem['transmission'],
      power: car.power,
      color: car.color,
      status: car.status as CarListItem['status'],
      createdAt: car.createdAt.toISOString(),
      titleImage: car.images[0]?.url ?? null,
    }));
  } catch {
    // DB nicht verfügbar — leeres Array zeigen
  }

  return (
    <>
      {/* Hero SCR-001 */}
      <section className="hero hero-b">
        <div className="hero-b-scrim" />
        <div className="container">
          <div className="hero-inner">
            <div className="animate-in">
              <div className="eyebrow hero-eyebrow">{company.name} · Gebrauchtwagen</div>
              <h1 className="display">
                Premium-Gebraucht&shy;wagen,<br />ehrlich vermittelt.
              </h1>
              <p className="hero-sub" style={{ fontSize: 19 }}>
                Handverlesener Bestand, geprüfte Qualität und ein Online-Angebotsprozess,
                der Ihnen den Gang zum Händler erspart.
              </p>
              <div className="hero-actions">
                <Link href="/fahrzeuge" className="btn btn-primary btn-lg">
                  Fahrzeuge entdecken <Icon name="arrowRight" size={18} />
                </Link>
                <Link
                  href={`tel:${company.phone}`}
                  className="btn btn-ghost btn-lg"
                  style={{ background: 'rgba(255,255,255,.08)', color: '#fff', borderColor: 'rgba(255,255,255,.2)' }}
                >
                  <Icon name="phone" size={17} /> Kontakt
                </Link>
              </div>
              <div className="hero-stats" style={{ marginTop: 12 }}>
                <div className="hero-stat"><div className="n display">120+</div><div className="l">Fahrzeuge</div></div>
                <div className="hero-stat"><div className="n display">12 J.</div><div className="l">Erfahrung</div></div>
                <div className="hero-stat"><div className="n display">4,9 ★</div><div className="l">Bewertung</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <div className="container" style={{ marginTop: -2 }}>
        <div className="section-tight">
          <div className="trust">
            {[
              { i: 'shield', h: 'Geprüfte Qualität', p: 'Jedes Fahrzeug technisch geprüft und aufbereitet vor der Übergabe.' },
              { i: 'tag', h: 'Faire Festpreise', p: 'Transparente Preise inkl. Historie – ohne versteckte Kosten.' },
              { i: 'euro', h: 'Preis selbst vorschlagen', p: 'Senden Sie online Ihr Angebot direkt aus der Fahrzeugansicht.' },
              { i: 'spark', h: 'Persönliche Beratung', p: 'Inhabergeführt – wir nehmen uns Zeit für Ihre Fragen.' },
            ].map((x, i) => (
              <div className="trust-item" key={i}>
                <div className="ic"><Icon name={x.i} size={20} /></div>
                <div><h4>{x.h}</h4><p>{x.p}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Neueste Fahrzeuge */}
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Aktueller Bestand</div>
              <h2 className="display">Neu hereingekommen</h2>
              <p>Eine Auswahl unserer zuletzt aufgenommenen Fahrzeuge – täglich aktualisiert.</p>
            </div>
            <Link href="/fahrzeuge" className="btn btn-ghost">
              Alle Fahrzeuge <Icon name="arrowRight" size={16} />
            </Link>
          </div>
          <CarGrid cars={cars} />
        </div>
      </section>

      {/* CTA Band */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta-band">
            <CtaBg />
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div className="eyebrow" style={{ color: 'var(--accent)' }}>Inzahlungnahme</div>
              <h2 className="display" style={{ marginTop: 10 }}>
                Ihr aktuelles Fahrzeug ist bares Geld wert.
              </h2>
              <p>Bringen Sie Ihren Gebrauchten in Zahlung oder verkaufen Sie ihn direkt an uns – schnelle, faire Bewertung.</p>
            </div>
            <div className="row" style={{ gap: 12, position: 'relative', zIndex: 2, flexWrap: 'wrap' }}>
              <Link href="/fahrzeuge" className="btn btn-primary btn-lg">Bestand entdecken</Link>
              <Link
                href={`tel:${company.phone}`}
                className="btn btn-ghost btn-lg"
                style={{ background: 'transparent', color: '#fff', borderColor: '#3A3E46' }}
              >
                <Icon name="phone" size={17} /> Rückruf anfordern
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Kontakt */}
      <section className="section" id="kontakt" style={{ paddingTop: 8 }}>
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Kontakt</div>
              <h2 className="display">Kontakt aufnehmen</h2>
              <p>Besuchen Sie uns vor Ort oder rufen Sie an – wir beraten Sie gern persönlich.</p>
            </div>
          </div>
          <div className="contact-grid">
            <div className="panel contact-info">
              <div className="card-pad">
                <div className="contact-row">
                  <div className="ic"><Icon name="pin" size={20} /></div>
                  <div>
                    <div className="contact-k">Adresse</div>
                    <div className="contact-v">
                      {company.address.street}<br />
                      {company.address.zip} {company.address.city}
                    </div>
                  </div>
                </div>
                <div className="contact-row">
                  <div className="ic"><Icon name="phone" size={20} /></div>
                  <div>
                    <div className="contact-k">Telefon</div>
                    <a href={`tel:${company.phone}`} className="contact-v link">{company.phone}</a>
                  </div>
                </div>
                <div className="contact-row">
                  <div className="ic"><Icon name="mail" size={20} /></div>
                  <div>
                    <div className="contact-k">E-Mail</div>
                    <a href={`mailto:${company.email}`} className="contact-v link">{company.email}</a>
                  </div>
                </div>
                <div className="contact-row">
                  <div className="ic"><Icon name="clock" size={20} /></div>
                  <div>
                    <div className="contact-k">Öffnungszeiten</div>
                    <div className="contact-v">
                      <span className="mono">Mo–Fr</span> 09:00–18:00 Uhr<br />
                      <span className="mono">Sa</span> 10:00–14:00 Uhr
                    </div>
                  </div>
                </div>
                <Link href="/fahrzeuge" className="btn btn-primary btn-block" style={{ marginTop: 20 }}>
                  Fahrzeugbestand ansehen <Icon name="arrowRight" size={16} />
                </Link>
              </div>
            </div>
            <div className="contact-map">
              <div className="ph" data-label="Anfahrt · Karte" style={{ height: '100%', minHeight: 320 }} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function CtaBg() {
  return (
    <svg className="login-aside-bg" viewBox="0 0 600 300" preserveAspectRatio="none" style={{ opacity: 0.14 }} aria-hidden="true">
      <defs>
        <linearGradient id="ctg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8C2233" />
          <stop offset="1" stopColor="#14161B" />
        </linearGradient>
      </defs>
      <circle cx="520" cy="60" r="180" fill="url(#ctg)" />
      <circle cx="120" cy="280" r="120" fill="#8C2233" opacity={0.5} />
    </svg>
  );
}
