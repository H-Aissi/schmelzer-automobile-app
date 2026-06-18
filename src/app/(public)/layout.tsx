// T-005
import { PublicNavbar } from '@/components/public/public-navbar';
import { PublicFooter } from '@/components/public/public-footer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="public-shell" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <PublicNavbar />
      <main className="animate-in" style={{ flex: 1 }}>{children}</main>
      <PublicFooter />
    </div>
  );
}
