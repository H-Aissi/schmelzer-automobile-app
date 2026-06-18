'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Icon } from '@/components/ui/icon';

type PaginationProps = {
  page: number;
  total: number;
  limit: number;
};

export function Pagination({ page, total, limit }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(total / limit);
  if (total <= limit) return null;

  function navigate(targetPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(targetPage));
    router.push(`?${params.toString()}`);
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="pager" aria-label="Seitennavigation">
      <button onClick={() => navigate(page - 1)} disabled={page === 1} aria-label="Vorherige Seite">
        <Icon name="chevLeft" size={16} />
      </button>
      {pages.map((num) => (
        <button
          key={num}
          onClick={() => navigate(num)}
          className={page === num ? 'on' : ''}
          aria-current={page === num ? 'page' : undefined}
        >
          {num}
        </button>
      ))}
      <button onClick={() => navigate(page + 1)} disabled={page === totalPages} aria-label="Nächste Seite">
        <Icon name="chevRight" size={16} />
      </button>
    </nav>
  );
}

export type { PaginationProps };
