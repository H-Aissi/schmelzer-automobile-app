// T-004
export type FuelType = 'BENZIN' | 'DIESEL' | 'ELEKTRO' | 'HYBRID' | 'GAS';
export type Transmission = 'MANUELL' | 'AUTOMATIK';
export type CarStatus = 'ACTIVE' | 'SOLD' | 'HIDDEN';
export type OfferStatus = 'NEW' | 'READ' | 'CONTACTED' | 'DECLINED';

export type CarListItem = {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: FuelType;
  transmission: Transmission;
  power: number;
  color: string;
  status: CarStatus;
  createdAt: string;
  titleImage: string | null;
};

export type OfferListItem = {
  id: string;
  carId: string;
  carTitle: string;
  carImageUrl: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  offerAmount: number;
  message: string | null;
  status: OfferStatus;
  createdAt: string;
};

export type CarFilterValues = {
  make?: string;
  fuelType?: FuelType;
  priceMin?: number;
  priceMax?: number;
  sort?: 'price_asc' | 'price_desc' | 'date_desc';
};
