import Link from 'next/link';
import { Icon } from '@/components/ui/icon';
import { company } from '@/lib/company';

export function PublicFooter() {
  return (
    <footer className="pub-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: '#fff' }}>
              {company.name}
            </div>
            <p className="muted" style={{ maxWidth: 320, marginTop: 18, color: '#A9ADB6' }}>
              Ihr Partner für geprüfte Gebrauchtwagen. Persönliche Beratung, faire Preise,
              transparente Fahrzeughistorie.
            </p>
          </div>
          <div>
            <div className="footer-h">Navigation</div>
            <Link href="/" className="footer-link">Startseite</Link>
            <Link href="/fahrzeuge" className="footer-link">Fahrzeugbestand</Link>
            <Link href="/#kontakt" className="footer-link">Kontakt</Link>
          </div>
          <div>
            <div className="footer-h">Kontakt</div>
            <div className="footer-line">
              <Icon name="pin" size={16} />
              {company.address.street}, {company.address.zip} {company.address.city}
            </div>
            <div className="footer-line">
              <Icon name="phone" size={16} />
              <Link href={`tel:${company.phone}`}>{company.phone}</Link>
            </div>
            <div className="footer-line">
              <Icon name="mail" size={16} />
              <Link href={`mailto:${company.email}`}>{company.email}</Link>
            </div>
          </div>
          <div>
            <div className="footer-h">Öffnungszeiten</div>
            <div className="footer-line">
              <span className="mono">Mo–Fr</span>&nbsp;09:00 – 18:00 Uhr
            </div>
            <div className="footer-line">
              <span className="mono">Sa</span>&nbsp;&nbsp;&nbsp;&nbsp;10:00 – 14:00 Uhr
            </div>
            <div className="footer-line faint" style={{ color: '#8B8F98' }}>
              So &amp; feiertags geschlossen
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {company.name}</span>
          <span className="row" style={{ gap: 20 }}>
            <Link href="/impressum" className="footer-mini">Impressum</Link>
            <Link href="/datenschutz" className="footer-mini">Datenschutz</Link>
            <Link href="/admin/login" className="footer-mini">Händler-Login</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
