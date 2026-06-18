// T-010
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyJwt, COOKIE_NAME } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AdminSidebar } from '@/components/admin/admin-sidebar';

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) redirect('/admin/login');

  const payload = await verifyJwt(token);
  if (!payload) redirect('/admin/login');

  const newOffersCount = await prisma.offer.count({ where: { status: 'NEW' } });

  return (
    <div className="admin">
      <AdminSidebar newOffersCount={newOffersCount} />
      <div className="admin-main">
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
