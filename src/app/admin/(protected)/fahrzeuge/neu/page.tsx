// SCR-008 (Neu-Modus)
import type { Metadata } from 'next';
import Link from 'next/link';
import { CarForm } from '@/components/admin/car-form';

export const metadata: Metadata = {
  title: 'Fahrzeug inserieren | Admin',
};

export default function FahrzeugNeuPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <nav className="mb-4 flex gap-2 text-sm text-gray-500" aria-label="Breadcrumb">
        <Link href="/admin/fahrzeuge" className="hover:text-accent">
          Fahrzeuge
        </Link>
        <span>→</span>
        <span className="text-gray-900">Neues Fahrzeug</span>
      </nav>

      <h1 className="mb-8 text-[28px] font-bold text-gray-900">
        Fahrzeug inserieren
      </h1>

      <CarForm mode="create" />
    </div>
  );
}
