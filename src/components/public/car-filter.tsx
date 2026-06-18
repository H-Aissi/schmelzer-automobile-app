'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Icon } from '@/components/ui/icon';
import type { CarFilterValues } from '@/lib/types';

const FUEL_OPTIONS = [
  { value: 'BENZIN', label: 'Benzin' },
  { value: 'DIESEL', label: 'Diesel' },
  { value: 'ELEKTRO', label: 'Elektro' },
  { value: 'HYBRID', label: 'Hybrid' },
];

const SORT_OPTIONS = [
  { value: 'date_desc', label: 'Neueste zuerst' },
  { value: 'price_asc', label: 'Preis aufsteigend' },
  { value: 'price_desc', label: 'Preis absteigend' },
];

type CarFilterProps = {
  makes: string[];
  initialValues: CarFilterValues;
  total: number;
  children: React.ReactNode;
};

export function CarFilter({ makes, initialValues, total, children }: CarFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [localMaxPrice, setLocalMaxPrice] = useState(initialValues.priceMax ?? 60000);

  function updateParams(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page');
    for (const [key, value] of Object.entries(updates)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    router.push(`?${params.toString()}`);
  }

  function toggleFilter(key: string, value: string, current: string | undefined) {
    updateParams({ [key]: current === value ? undefined : value });
  }

  const handlePriceRange = useCallback(
    (val: number) => {
      setLocalMaxPrice(val);
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        updateParams({ priceMax: val < 60000 ? String(val) : undefined });
      }, 400);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams],
  );

  function handleReset() {
    setLocalMaxPrice(60000);
    router.push('?');
  }

  const currentMake = initialValues.make;
  const currentFuel = initialValues.fuelType;
  const currentSort = initialValues.sort ?? 'date_desc';
  const hasFilters = !!(currentMake || currentFuel || localMaxPrice < 60000);

  const formatEUR = (n: number) =>
    new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="list-layout">
      {/* Filter-Sidebar */}
      <aside className={'filters' + (filtersOpen ? ' open' : '')}>
        <div className="row between" style={{ marginBottom: 4 }}>
          <strong style={{ fontSize: 15 }}>Filter</strong>
          {hasFilters && (
            <button
              onClick={handleReset}
              style={{ background: 'none', border: 0, color: 'var(--accent)', fontWeight: 600, fontSize: 13, padding: 0, cursor: 'pointer' }}
            >
              Zurücksetzen
            </button>
          )}
        </div>

        <div className="filter-group">
          <h4>Marke</h4>
          {makes.map((m) => (
            <label className="chk" key={m}>
              <input
                type="checkbox"
                checked={currentMake === m}
                onChange={() => toggleFilter('make', m, currentMake)}
              />
              {m}
            </label>
          ))}
        </div>

        <div className="filter-group">
          <h4>Kraftstoff</h4>
          {FUEL_OPTIONS.map((opt) => (
            <label className="chk" key={opt.value}>
              <input
                type="checkbox"
                checked={currentFuel === opt.value}
                onChange={() => toggleFilter('fuelType', opt.value, currentFuel)}
              />
              {opt.label}
            </label>
          ))}
        </div>

        <div className="filter-group">
          <h4>Preis bis</h4>
          <div className="mono" style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>
            {formatEUR(localMaxPrice)}
          </div>
          <input
            type="range"
            min="15000"
            max="60000"
            step="1000"
            value={localMaxPrice}
            onChange={(e) => handlePriceRange(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent)' }}
          />
          <div className="row between faint" style={{ fontSize: 12, marginTop: 6, fontFamily: 'var(--font-mono)' }}>
            <span>15.000 €</span><span>60.000 €</span>
          </div>
        </div>
      </aside>

      {/* Ergebnisbereich */}
      <div>
        <div className="list-toolbar">
          <div className="row" style={{ gap: 12, flexWrap: 'wrap' }}>
            <button
              className="btn btn-ghost btn-sm filter-toggle-mobile"
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <Icon name="filter" size={16} /> Filter
            </button>
            <span className="muted" style={{ fontSize: 14 }}>
              <strong style={{ color: 'var(--ink)' }}>{total}</strong> Fahrzeuge gefunden
            </span>
          </div>
          <div className="row" style={{ gap: 12 }}>
            <div className="row" style={{ gap: 8 }}>
              <Icon name="sort" size={16} style={{ color: 'var(--ink-3)' }} />
              <select
                className="select"
                value={currentSort}
                onChange={(e) => updateParams({ sort: e.target.value })}
                style={{ width: 'auto', padding: '9px 32px 9px 12px', fontSize: 14 }}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {hasFilters && (
          <div className="chips" style={{ marginBottom: 20 }}>
            {currentMake && (
              <span className="chip">
                {currentMake}
                <button onClick={() => updateParams({ make: undefined })}><Icon name="x" size={13} /></button>
              </span>
            )}
            {currentFuel && (
              <span className="chip">
                {FUEL_OPTIONS.find((o) => o.value === currentFuel)?.label ?? currentFuel}
                <button onClick={() => updateParams({ fuelType: undefined })}><Icon name="x" size={13} /></button>
              </span>
            )}
            {localMaxPrice < 60000 && (
              <span className="chip">
                bis {formatEUR(localMaxPrice)}
                <button onClick={() => { setLocalMaxPrice(60000); updateParams({ priceMax: undefined }); }}>
                  <Icon name="x" size={13} />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Server-seitig gerenderte Kinder (Grid + Pagination) */}
        {children}
      </div>
    </div>
  );
}
