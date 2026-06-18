'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/icon';
import { api } from '@/lib/api-client';
import { company } from '@/lib/company';

type AdminSidebarProps = { newOffersCount: number };

const navItems = [
  { k: 'admin-dashboard', label: 'Dashboard', icon: 'dashboard', href: '/admin/dashboard' },
  { k: 'admin-fahrzeuge', label: 'Fahrzeuge', icon: 'car', href: '/admin/fahrzeuge' },
  { k: 'admin-angebote', label: 'Angebote', icon: 'inbox', href: '/admin/angebote' },
];

function SidebarContent({ newOffersCount, onClose }: AdminSidebarProps & { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    try { await api.post('/auth/logout'); } catch { /* noop */ }
    router.push('/admin/login');
  }

  const isActive = (k: string) =>
    (k === 'admin-fahrzeuge' && pathname.startsWith('/admin/fahrzeuge')) ||
    (k === 'admin-angebote' && pathname.startsWith('/admin/angebote')) ||
    (k === 'admin-dashboard' && pathname === '/admin/dashboard');

  return (
    <div className="admin-aside" style={{ height: '100vh', overflowY: 'auto' }}>
      <div className="admin-brand">
        <Link href="/admin/dashboard" onClick={onClose} style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: '#fff' }}>
          {company.name}
        </Link>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '.14em', color: '#6E7480', marginTop: 8, textTransform: 'uppercase' }}>
          Händler-Verwaltung
        </div>
      </div>

      <nav className="admin-nav">
        {navItems.map((l) => (
          <Link
            key={l.k}
            href={l.href}
            onClick={onClose}
            className={'admin-nav-link' + (isActive(l.k) ? ' is-active' : '')}
          >
            <Icon name={l.icon} size={19} />
            {l.label}
            {l.k === 'admin-angebote' && newOffersCount > 0 && (
              <span className="ct">{newOffersCount}</span>
            )}
          </Link>
        ))}
        <div style={{ height: 1, background: '#262A31', margin: '14px 4px' }} />
        <Link href="/" className="admin-nav-link">
          <Icon name="eye" size={19} /> Website ansehen
        </Link>
      </nav>

      <div className="admin-aside-foot">
        <button
          onClick={handleLogout}
          className="admin-nav-link"
          style={{ width: '100%', background: 'none', border: 0, textAlign: 'left', cursor: 'pointer' }}
        >
          <Icon name="logout" size={19} /> Abmelden
        </button>
      </div>
    </div>
  );
}

export function AdminSidebar({ newOffersCount }: AdminSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        aria-label="Menü öffnen"
        style={{ position: 'fixed', left: 16, top: 16, zIndex: 40, background: '#14161B', color: '#fff', border: 0, borderRadius: 8, padding: 8, cursor: 'pointer' }}
        className="show-sm"
      >
        <Icon name="menu" size={20} />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hide-sm" style={{ position: 'sticky', top: 0, height: '100vh', flexShrink: 0 }}>
        <SidebarContent newOffersCount={newOffersCount} />
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(20,22,27,.5)' }}
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside style={{ position: 'fixed', inset: '0 auto 0 0', zIndex: 50, width: 248 }}>
            <SidebarContent newOffersCount={newOffersCount} onClose={() => setMobileOpen(false)} />
          </aside>
        </>
      )}
    </>
  );
}
