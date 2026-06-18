// SCR-008 (Edit-Modus)
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { CarForm } from '@/components/admin/car-form';
import { ImageUploader } from '@/components/admin/image-uploader';
import type { CarUpdateInput } from '@/lib/validations';

type PageProps = {
  params: { id: string };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const car = await prisma.car.findUnique({ where: { id: params.id } });
  if (!car) return { title: 'Fahrzeug bearbeiten | Admin' };
  return { title: `${car.title} bearbeiten | Admin` };
}

export default async function FahrzeugBearbeitenPage({ params }: PageProps) {
  const car = await prisma.car.findUnique({
    where: { id: params.id },
    include: { images: { orderBy: { sortOrder: 'asc' } } },
  });

  if (!car) notFound();

  const defaultValues: CarUpdateInput = {
    title: car.title,
    make: car.make,
    model: car.model,
    year: car.year,
    price: car.price,
    mileage: car.mileage,
    fuelType: car.fuelType as CarUpdateInput['fuelType'],
    transmission: car.transmission as CarUpdateInput['transmission'],
    power: car.power,
    color: car.color,
    description: car.description,
    status: car.status as CarUpdateInput['status'],
  };

  return (
    <div className="mx-auto max-w-2xl">
      <nav className="mb-4 flex gap-2 text-sm text-gray-500" aria-label="Breadcrumb">
        <Link href="/admin/fahrzeuge" className="hover:text-accent">
          Fahrzeuge
        </Link>
        <span>→</span>
        <span className="max-w-[200px] truncate text-gray-900">{car.title}</span>
        <span>→</span>
        <span className="text-gray-900">Bearbeiten</span>
      </nav>

      <h1 className="mb-8 text-[28px] font-bold text-gray-900">
        Fahrzeug bearbeiten
      </h1>

      <CarForm mode="edit" carId={car.id} defaultValues={defaultValues} />

      {/* Bilder-Bereich */}
      <div className="mt-10">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Fotos</h2>
        <ImageUploader carId={car.id} initialImages={car.images} />
      </div>
    </div>
  );
}
