// T-003
import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt, COOKIE_NAME } from '@/lib/auth';

const ADMIN_LOGIN_PATH = '/admin/login';
const ADMIN_DASHBOARD_PATH = '/admin/dashboard';

async function getSessionPayload(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyJwt(token);
}

function unauthorizedJson() {
  return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const host = req.headers.get('host') ?? '';

  const isLocal =
    host.startsWith('localhost') || host.startsWith('127.0.0.1');
  const isAdminSubdomain = !isLocal && host.startsWith('admin.');

  // --- Lokale Entwicklung ---
  if (isLocal) {
    // API admin-Routen: Cookie-Prüfung → 401
    if (pathname.startsWith('/api/v1/admin/')) {
      const payload = await getSessionPayload(req);
      if (!payload) return unauthorizedJson();
      return NextResponse.next();
    }

    // Admin-Seiten-Routen
    if (pathname.startsWith('/admin/')) {
      const payload = await getSessionPayload(req);
      if (!payload && pathname !== ADMIN_LOGIN_PATH) {
        return NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, req.url));
      }
      if (payload && pathname === ADMIN_LOGIN_PATH) {
        return NextResponse.redirect(new URL(ADMIN_DASHBOARD_PATH, req.url));
      }
      return NextResponse.next();
    }

    return NextResponse.next();
  }

  // --- Produktions-Subdomain: admin.domain.com ---
  if (isAdminSubdomain) {
    // a) API-Pfade: niemals umschreiben
    if (pathname.startsWith('/api/')) {
      if (pathname.startsWith('/api/v1/admin/')) {
        const payload = await getSessionPayload(req);
        if (!payload) return unauthorizedJson();
      }
      return NextResponse.next();
    }

    // b) Pfad beginnt bereits mit /admin → kein Rewrite
    if (pathname.startsWith('/admin')) {
      const payload = await getSessionPayload(req);
      if (!payload && pathname !== ADMIN_LOGIN_PATH) {
        return NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, req.url));
      }
      if (payload && pathname === ADMIN_LOGIN_PATH) {
        return NextResponse.redirect(new URL(ADMIN_DASHBOARD_PATH, req.url));
      }
      return NextResponse.next();
    }

    // c) Bare path: /foo → /admin/foo, / → /admin
    const effectivePath =
      pathname === '/' ? '/admin' : `/admin${pathname}`;
    const rewrittenUrl = new URL(effectivePath, req.url);
    const payload = await getSessionPayload(req);

    if (!payload && effectivePath !== ADMIN_LOGIN_PATH) {
      return NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, req.url));
    }
    if (payload && effectivePath === ADMIN_LOGIN_PATH) {
      return NextResponse.redirect(new URL(ADMIN_DASHBOARD_PATH, req.url));
    }
    return NextResponse.rewrite(rewrittenUrl);
  }

  // Root-Domain oder sonstige: unverändert durchlassen
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Alle Pfade außer statische Assets und Next.js Internals
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
