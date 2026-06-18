// T-010
import Link from 'next/link';

export default function AdminNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <h1 className="text-6xl font-extrabold text-gray-200">404</h1>
      <p className="text-xl font-semibold text-gray-900">
        Diese Seite wurde nicht gefunden.
      </p>
      <Link
        href="/admin/dashboard"
        className="rounded-[10px] bg-accent px-5 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-accent-hover"
      >
        Zum Dashboard
      </Link>
    </div>
  );
}
