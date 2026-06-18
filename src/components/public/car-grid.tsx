import type { CarListItem } from '@/lib/types';
import { CarCard } from './car-card';
import { Icon } from '@/components/ui/icon';

type CarGridProps = {
  cars: CarListItem[];
  listView?: boolean;
};

export function CarGrid({ cars, listView = false }: CarGridProps) {
  if (cars.length === 0) {
    return (
      <div className="empty card">
        <div className="ic"><Icon name="search" size={26} /></div>
        <h3 style={{ margin: '0 0 6px', color: 'var(--ink)' }}>Aktuell sind keine Fahrzeuge verfügbar.</h3>
      </div>
    );
  }

  return (
    <div className="vgrid" style={listView ? { gridTemplateColumns: '1fr' } : undefined}>
      {cars.map((car) => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  );
}
