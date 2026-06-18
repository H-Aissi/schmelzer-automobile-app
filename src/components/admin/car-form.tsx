// CMP-009
'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { carSchema, carUpdateSchema, type CarInput, type CarUpdateInput } from '@/lib/validations';
import { api, ApiError } from '@/lib/api-client';
import { useToast } from '@/components/ui/toast';
import { Input, InputField } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Upload, X } from 'lucide-react';

type CarFormMode = 'create' | 'edit';

type CarFormProps = {
  mode: CarFormMode;
  carId?: string;
  defaultValues?: Partial<CarUpdateInput>;
};

type StagedFile = {
  file: File;
  previewUrl: string;
};

const FUEL_OPTIONS = [
  { value: 'BENZIN', label: 'Benzin' },
  { value: 'DIESEL', label: 'Diesel' },
  { value: 'ELEKTRO', label: 'Elektro' },
  { value: 'HYBRID', label: 'Hybrid' },
  { value: 'GAS', label: 'Gas' },
];

const TRANSMISSION_OPTIONS = [
  { value: 'MANUELL', label: 'Manuell' },
  { value: 'AUTOMATIK', label: 'Automatik' },
];

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Verfügbar' },
  { value: 'SOLD', label: 'Verkauft' },
  { value: 'HIDDEN', label: 'Versteckt' },
];

export function CarForm({ mode, carId, defaultValues }: CarFormProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const isEdit = mode === 'edit';
  const schema = isEdit ? carUpdateSchema : carSchema;

  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CarUpdateInput>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? { status: 'ACTIVE' },
  });

  function stageFile(file: File) {
    if (stagedFiles.length >= 10) return;
    const previewUrl = URL.createObjectURL(file);
    setStagedFiles((prev) => [...prev, { file, previewUrl }]);
  }

  function removeStaged(index: number) {
    setStagedFiles((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    files.forEach(stageFile);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    files.forEach(stageFile);
  }

  async function uploadStagedImages(newCarId: string) {
    for (const { file } of stagedFiles) {
      const form = new FormData();
      form.append('image', file);
      try {
        await api.postForm(`/admin/cars/${newCarId}/images`, form);
      } catch {
        // Continue uploading remaining images even if one fails
      }
    }
    stagedFiles.forEach((sf) => URL.revokeObjectURL(sf.previewUrl));
    setStagedFiles([]);
  }

  async function onSubmit(data: CarInput | CarUpdateInput) {
    try {
      if (isEdit && carId) {
        await api.put(`/admin/cars/${carId}`, data);
        showToast({ variant: 'success', message: 'Fahrzeug wurde erfolgreich aktualisiert.' });
        router.refresh();
      } else {
        const res = await api.post<{ data: { id: string } }>('/admin/cars', data);
        const newCarId = res.data.id;

        if (stagedFiles.length > 0) {
          setUploadingImages(true);
          await uploadStagedImages(newCarId);
          setUploadingImages(false);
        }

        showToast({ variant: 'success', message: 'Fahrzeug wurde erfolgreich inseriert.' });
        reset({ status: 'ACTIVE' });
      }
    } catch (err) {
      setUploadingImages(false);
      if (err instanceof ApiError && err.error === 'VALIDATION_ERROR') {
        for (const detail of err.details) {
          if (detail.field) {
            setError(detail.field as keyof CarUpdateInput, {
              message: err.message,
            });
          }
        }
      } else {
        showToast({ variant: 'error', message: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.' });
      }
    }
  }

  const isBusy = isSubmitting || uploadingImages;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      {/* Bildupload nur im Create-Modus */}
      {!isEdit && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-900">
            Fotos <span className="text-gray-400 font-normal">(optional, max. 10)</span>
          </span>

          {stagedFiles.length > 0 && (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
              {stagedFiles.map((sf, idx) => (
                <div key={idx} className="group relative">
                  <div className="relative aspect-square overflow-hidden rounded-[6px] bg-canvas">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={sf.previewUrl} alt={`Vorschau ${idx + 1}`} className="h-full w-full object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeStaged(idx)}
                    aria-label="Bild entfernen"
                    className="absolute right-1 top-1 rounded-full bg-danger p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {stagedFiles.length < 10 && (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="flex flex-col items-center justify-center gap-3 rounded-[10px] border-2 border-dashed border-gray-200 bg-canvas px-6 py-8 transition-colors"
            >
              <Upload className="h-8 w-8 text-gray-400" aria-hidden="true" />
              <p className="text-sm text-gray-500">
                Dateien hierher ziehen oder{' '}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-accent hover:underline"
                >
                  auswählen
                </button>
              </p>
              <p className="text-xs text-gray-400">JPEG, PNG, WEBP — max. 5 MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleFileChange}
                className="hidden"
                aria-label="Bilder auswählen"
              />
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input
          label="Inserat-Titel"
          required
          type="text"
          error={errors.title?.message}
          disabled={isBusy}
          {...register('title')}
        />
        <Input
          label="Marke"
          required
          type="text"
          error={errors.make?.message}
          disabled={isBusy}
          {...register('make')}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input
          label="Modell"
          required
          type="text"
          error={errors.model?.message}
          disabled={isBusy}
          {...register('model')}
        />
        <Input
          label="Baujahr"
          required
          type="number"
          error={errors.year?.message}
          disabled={isBusy}
          {...register('year', { valueAsNumber: true })}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input
          label="Preis (€)"
          required
          type="number"
          min={0}
          error={errors.price?.message}
          disabled={isBusy}
          {...register('price', { valueAsNumber: true })}
        />
        <Input
          label="Kilometerstand (km)"
          required
          type="number"
          min={0}
          error={errors.mileage?.message}
          disabled={isBusy}
          {...register('mileage', { valueAsNumber: true })}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="fuelType" className="text-sm font-medium text-gray-900">
            Kraftstoffart <span className="text-danger">*</span>
          </label>
          <select
            id="fuelType"
            className="rounded-[6px] border border-gray-200 bg-white px-4 py-2.5 text-base text-gray-900 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            disabled={isBusy}
            {...register('fuelType')}
          >
            <option value="">Bitte wählen</option>
            {FUEL_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          {errors.fuelType && (
            <p className="text-xs text-danger">{errors.fuelType.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="transmission" className="text-sm font-medium text-gray-900">
            Getriebe <span className="text-danger">*</span>
          </label>
          <select
            id="transmission"
            className="rounded-[6px] border border-gray-200 bg-white px-4 py-2.5 text-base text-gray-900 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            disabled={isBusy}
            {...register('transmission')}
          >
            <option value="">Bitte wählen</option>
            {TRANSMISSION_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          {errors.transmission && (
            <p className="text-xs text-danger">{errors.transmission.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input
          label="Leistung (PS)"
          required
          type="number"
          min={1}
          error={errors.power?.message}
          disabled={isBusy}
          {...register('power', { valueAsNumber: true })}
        />
        <Input
          label="Farbe"
          required
          type="text"
          error={errors.color?.message}
          disabled={isBusy}
          {...register('color')}
        />
      </div>

      <InputField
        as="textarea"
        label="Beschreibung"
        required
        error={errors.description?.message}
        disabled={isBusy}
        {...register('description')}
      />

      {isEdit && (
        <div className="flex flex-col gap-1">
          <label htmlFor="status" className="text-sm font-medium text-gray-900">
            Status <span className="text-danger">*</span>
          </label>
          <select
            id="status"
            className="rounded-[6px] border border-gray-200 bg-white px-4 py-2.5 text-base text-gray-900 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            disabled={isBusy}
            {...register('status')}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          {errors.status && (
            <p className="text-xs text-danger">{errors.status.message}</p>
          )}
        </div>
      )}

      <div className="flex items-center gap-4">
        <Button
          type="submit"
          variant="primary"
          isLoading={isBusy}
          disabled={isBusy}
        >
          {uploadingImages ? 'Bilder werden hochgeladen…' : 'Speichern'}
        </Button>
        <Link
          href="/admin/fahrzeuge"
          className="text-[15px] font-medium text-gray-500 transition-colors hover:text-gray-800"
        >
          Abbrechen
        </Link>
      </div>
    </form>
  );
}
