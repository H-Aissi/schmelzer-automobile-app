'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/icon';
import { company } from '@/lib/company';

export function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isHome = pathname === '/';
  const isFahrzeuge = pathname.startsWith('/fahrzeuge');

  function goContact(e: React.MouseEvent) {
    e.preventDefault();
    setOpen(false);
    if (isHome) {
      document.getElementById('kontakt')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      router.push('/#kontakt');
    }
  }

  const links = [
    { k: 'home', label: 'Startseite', href: '/' },
    { k: 'fahrzeuge', label: 'Fahrzeuge', href: '/fahrzeuge' },
    { k: 'kontakt', label: 'Kontakt', href: '/#kontakt', onClick: goContact },
  ];

  const active = (k: string) =>
    (k === 'fahrzeuge' && isFahrzeuge) || (k === 'home' && isHome && !isFahrzeuge);

  return (
    <header className="pub-header" data-scrolled={scrolled}>
      <div className="container row between" style={{ height: 'var(--header-h)' }}>
        <Link href="/" className="row" style={{ gap: 14, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>
          {company.name}
        </Link>

        <nav className="pub-nav">
          {links.map((l) => (
            <Link
              key={l.k}
              href={l.href}
              onClick={l.onClick}
              className={'pub-nav-link' + (active(l.k) ? ' is-active' : '')}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="row" style={{ gap: 12 }}>
          <Link
            href={`tel:${company.phone}`}
            className="hide-sm row"
            style={{ gap: 8, fontWeight: 600, fontSize: 14 }}
          >
            <Icon name="phone" size={17} /> {company.phone}
          </Link>
          <Link href="/fahrzeuge" className="btn btn-primary btn-sm hide-sm">
            Bestand ansehen
          </Link>
          <Link href="/admin/login" className="btn btn-ghost btn-sm icon-only" title="Händler-Login">
            <Icon name="user" size={17} />
          </Link>
          <button
            className="btn btn-ghost btn-sm icon-only show-sm"
            onClick={() => setOpen(!open)}
            aria-label="Menü"
          >
            <Icon name={open ? 'x' : 'menu'} size={18} />
          </button>
        </div>
      </div>

      {open && (
        <div className="mobile-menu">
          {links.map((l) => (
            <Link
              key={l.k}
              href={l.href}
              onClick={l.onClick ?? (() => setOpen(false))}
              className="mobile-link"
            >
              {l.label}
            </Link>
          ))}
          <Link href="/fahrzeuge" onClick={() => setOpen(false)} className="btn btn-primary btn-block" style={{ marginTop: 8 }}>
            Bestand ansehen
          </Link>
        </div>
      )}
    </header>
  );
}
