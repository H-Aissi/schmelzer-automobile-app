// T-005
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-6xl font-extrabold text-gray-200">404</h1>
      <p className="text-xl font-semibold text-gray-900">
        Diese Seite wurde nicht gefunden.
      </p>
      <Link
        href="/"
        className="rounded-[10px] bg-accent px-5 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-accent-hover"
      >
        Zur Startseite
      </Link>
    </div>
  );
}
