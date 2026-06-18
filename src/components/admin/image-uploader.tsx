// CMP-010
'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Star, Upload, X } from 'lucide-react';
import { api, ApiError } from '@/lib/api-client';
import { useToast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';

type GalleryImage = {
  id: string;
  url: string;
  sortOrder: number;
};

type ImageUploaderProps = {
  carId: string;
  initialImages: GalleryImage[];
};

const MAX_IMAGES = 10;

export function ImageUploader({ carId, initialImages }: ImageUploaderProps) {
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const atLimit = images.length >= MAX_IMAGES;

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const form = new FormData();
      form.append('image', file);
      const res = await api.postForm<{ data: GalleryImage }>(
        `/admin/cars/${carId}/images`,
        form,
      );
      setImages((prev) =>
        [...prev, res.data].sort((a, b) => a.sortOrder - b.sortOrder),
      );
      showToast({ variant: 'success', message: 'Bild wurde erfolgreich hochgeladen.' });
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.error === 'FILE_TOO_LARGE') {
          showToast({ variant: 'error', message: 'Das Bild ist zu groß (max. 5 MB).' });
        } else if (err.error === 'UNSUPPORTED_MEDIA_TYPE') {
          showToast({ variant: 'error', message: 'Nur JPEG, PNG und WEBP sind erlaubt.' });
        } else if (err.error === 'UNPROCESSABLE') {
          showToast({ variant: 'error', message: 'Maximal 10 Bilder pro Fahrzeug.' });
        } else {
          showToast({ variant: 'error', message: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.' });
        }
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleDelete(imageId: string) {
    try {
      await api.del(`/admin/cars/${carId}/images/${imageId}`);
      setImages((prev) =>
        prev
          .filter((img) => img.id !== imageId)
          .map((img, idx) => ({ ...img, sortOrder: idx })),
      );
      showToast({ variant: 'success', message: 'Bild wurde erfolgreich entfernt.' });
    } catch {
      showToast({ variant: 'error', message: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.' });
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && !uploading && !atLimit) handleUpload(file);
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {images.length} / {MAX_IMAGES} Bilder
        </span>
      </div>

      {/* Bild-Grid */}
      {images.length > 0 && (
        <div className="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {images.map((img, idx) => (
            <div key={img.id} className="group relative">
              <div className="relative aspect-square overflow-hidden rounded-[6px] bg-canvas">
                <Image
                  src={img.url}
                  alt={`Bild ${idx + 1}`}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
                {idx === 0 && (
                  <span
                    className="absolute left-1 top-1"
                    title="Titelbild"
                    aria-label="Titelbild"
                  >
                    <Star
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      aria-hidden="true"
                    />
                  </span>
                )}
              </div>
              <button
                onClick={() => handleDelete(img.id)}
                aria-label="Bild löschen"
                className="absolute right-1 top-1 rounded-full bg-danger p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload-Zone */}
      {atLimit ? (
        <p className="text-sm text-gray-400">Maximal 10 Bilder pro Fahrzeug.</p>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className={cn(
            'flex flex-col items-center justify-center gap-3 rounded-[10px] border-2 border-dashed border-gray-200 bg-canvas px-6 py-8 transition-colors',
            uploading && 'opacity-50',
          )}
        >
          <Upload className="h-8 w-8 text-gray-400" aria-hidden="true" />
          <p className="text-sm text-gray-500">
            Datei hierher ziehen oder{' '}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="text-accent hover:underline disabled:opacity-50"
            >
              auswählen
            </button>
          </p>
          <p className="text-xs text-gray-400">JPEG, PNG, WEBP — max. 5 MB</p>
          {uploading && (
            <p className="text-sm text-accent">Wird hochgeladen…</p>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
            aria-label="Bild auswählen"
          />
        </div>
      )}
    </div>
  );
}
