'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Icon } from '@/components/ui/icon';

type GalleryImage = { id: string; url: string; sortOrder: number };
type ImageGalleryProps = { images: GalleryImage[]; carTitle: string };

export function ImageGallery({ images, carTitle }: ImageGalleryProps) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <>
        <div className="gallery-main">
          <div className="ph" data-label="Kein Foto vorhanden" style={{ aspectRatio: '16/10' }} />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="gallery-main">
        <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden' }}>
          <Image
            key={images[active].id}
            src={images[active].url}
            alt={`${carTitle} — Bild ${active + 1}`}
            fill
            sizes="(max-width: 920px) 100vw, 55vw"
            style={{ objectFit: 'cover' }}
            priority={active === 0}
          />
        </div>
      </div>

      {images.length > 1 && (
        <div className="gallery-thumbs">
          {images.slice(0, 5).map((img, idx) => (
            <div
              key={img.id}
              className={'ph' + (active === idx ? ' on' : '')}
              onClick={() => setActive(idx)}
              style={{
                position: 'relative',
                aspectRatio: '4/3',
                cursor: 'pointer',
                border: active === idx ? '2px solid var(--accent)' : '2px solid transparent',
                borderRadius: 'var(--r-sm)',
                overflow: 'hidden',
              }}
              role="button"
              aria-label={`Bild ${idx + 1} auswählen`}
            >
              <Image
                src={img.url}
                alt={`Thumbnail ${idx + 1}`}
                fill
                sizes="100px"
                style={{ objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
