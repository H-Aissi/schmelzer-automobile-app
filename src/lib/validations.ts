// T-004
import { z } from 'zod';

const FUEL_TYPES = ['BENZIN', 'DIESEL', 'ELEKTRO', 'HYBRID', 'GAS'] as const;
const TRANSMISSIONS = ['MANUELL', 'AUTOMATIK'] as const;
const CAR_STATUSES = ['ACTIVE', 'SOLD', 'HIDDEN'] as const;
const SORT_OPTIONS = ['price_asc', 'price_desc', 'date_desc'] as const;

export const loginSchema = z.object({
  email: z.string().email('Keine gültige E-Mail-Adresse.').max(255),
  password: z.string().min(1, 'Passwort ist erforderlich.').max(200),
});

export const offerSchema = z.object({
  firstName: z
    .string()
    .min(1, 'Vorname ist erforderlich.')
    .max(100, 'Vorname darf maximal 100 Zeichen lang sein.'),
  lastName: z
    .string()
    .min(1, 'Nachname ist erforderlich.')
    .max(100, 'Nachname darf maximal 100 Zeichen lang sein.'),
  email: z
    .string()
    .email('Keine gültige E-Mail-Adresse.')
    .max(255),
  phone: z
    .string()
    .max(30, 'Telefonnummer darf maximal 30 Zeichen lang sein.')
    .optional(),
  offerAmount: z
    .number({ invalid_type_error: 'Angebotsbetrag muss eine Zahl sein.' })
    .int('Angebotsbetrag muss eine ganze Zahl sein.')
    .min(100, 'Mindestbetrag ist 100 €.')
    .max(10_000_000, 'Maximalbetrag ist 10.000.000 €.'),
  message: z
    .string()
    .max(1000, 'Nachricht darf maximal 1000 Zeichen lang sein.')
    .optional(),
});

const currentYear = new Date().getFullYear();

export const carSchema = z.object({
  title: z
    .string()
    .min(2, 'Titel muss mindestens 2 Zeichen lang sein.')
    .max(100, 'Titel darf maximal 100 Zeichen lang sein.'),
  make: z
    .string()
    .min(1, 'Marke ist erforderlich.')
    .max(50, 'Marke darf maximal 50 Zeichen lang sein.'),
  model: z
    .string()
    .min(1, 'Modell ist erforderlich.')
    .max(100, 'Modell darf maximal 100 Zeichen lang sein.'),
  year: z
    .number({ invalid_type_error: 'Baujahr muss eine Zahl sein.' })
    .int()
    .min(1900, 'Baujahr muss nach 1900 liegen.')
    .max(currentYear + 1, `Baujahr darf maximal ${currentYear + 1} sein.`),
  price: z
    .number({ invalid_type_error: 'Preis muss eine Zahl sein.' })
    .int()
    .min(0, 'Preis darf nicht negativ sein.')
    .max(10_000_000, 'Preis darf maximal 10.000.000 € betragen.'),
  mileage: z
    .number({ invalid_type_error: 'Kilometerstand muss eine Zahl sein.' })
    .int()
    .min(0, 'Kilometerstand darf nicht negativ sein.')
    .max(2_000_000, 'Kilometerstand darf maximal 2.000.000 km betragen.'),
  fuelType: z.enum(FUEL_TYPES, {
    errorMap: () => ({ message: 'Ungültige Kraftstoffart.' }),
  }),
  transmission: z.enum(TRANSMISSIONS, {
    errorMap: () => ({ message: 'Ungültiger Getriebetyp.' }),
  }),
  power: z
    .number({ invalid_type_error: 'Leistung muss eine Zahl sein.' })
    .int()
    .min(1, 'Leistung muss mindestens 1 PS betragen.')
    .max(5000, 'Leistung darf maximal 5000 PS betragen.'),
  color: z
    .string()
    .min(1, 'Farbe ist erforderlich.')
    .max(50, 'Farbe darf maximal 50 Zeichen lang sein.'),
  description: z
    .string()
    .min(10, 'Beschreibung muss mindestens 10 Zeichen lang sein.')
    .max(2000, 'Beschreibung darf maximal 2000 Zeichen lang sein.'),
  status: z
    .enum(CAR_STATUSES, {
      errorMap: () => ({ message: 'Ungültiger Status.' }),
    })
    .optional()
    .default('ACTIVE'),
});

export const carUpdateSchema = carSchema.extend({
  status: z.enum(CAR_STATUSES, {
    errorMap: () => ({ message: 'Ungültiger Status.' }),
  }),
});

export const carFilterSchema = z
  .object({
    make: z.string().optional(),
    fuelType: z.enum(FUEL_TYPES).optional(),
    priceMin: z.coerce.number().int().min(0).optional(),
    priceMax: z.coerce.number().int().min(0).optional(),
    sort: z.enum(SORT_OPTIONS).optional().default('date_desc'),
  })
  .refine(
    (data) => {
      if (
        data.priceMin !== undefined &&
        data.priceMax !== undefined
      ) {
        return data.priceMin <= data.priceMax;
      }
      return true;
    },
    { message: 'Mindestpreis darf nicht größer als Höchstpreis sein.' },
  );

export type LoginInput = z.infer<typeof loginSchema>;
export type OfferInput = z.infer<typeof offerSchema>;
export type CarInput = z.infer<typeof carSchema>;
export type CarUpdateInput = z.infer<typeof carUpdateSchema>;
export type CarFilterInput = z.infer<typeof carFilterSchema>;
