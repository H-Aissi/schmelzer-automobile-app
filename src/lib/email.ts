// T-009
import { Resend } from 'resend';
import { render } from '@react-email/components';
import { OfferNotificationEmail } from '@/emails/offer-notification';

const resend = new Resend(process.env.RESEND_API_KEY);

type OfferData = {
  id: string;
  carId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  offerAmount: number;
  message: string | null;
};

type CarData = {
  title: string;
  make: string;
  model: string;
  year: number;
};

export async function sendOfferNotificationEmail(
  offer: OfferData,
  car: CarData,
): Promise<void> {
  const adminUrl = `${process.env.NEXT_PUBLIC_ADMIN_URL}/admin/angebote/${offer.id}`;

  const html = await render(
    OfferNotificationEmail({
      carTitle: car.title,
      carMake: car.make,
      carModel: car.model,
      carYear: car.year,
      offerAmount: offer.offerAmount,
      firstName: offer.firstName,
      lastName: offer.lastName,
      email: offer.email,
      phone: offer.phone,
      message: offer.message,
      adminUrl,
    }),
  );

  await resend.emails.send({
    from: process.env.FROM_EMAIL ?? '',
    to: process.env.OWNER_EMAIL ?? '',
    subject: `Neues Angebot: ${car.title} — ${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(offer.offerAmount)}`,
    html,
  });
}
