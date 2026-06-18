// T-009 — ET-001
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

type OfferEmailProps = {
  carTitle: string;
  carMake: string;
  carModel: string;
  carYear: number;
  offerAmount: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  message: string | null;
  adminUrl: string;
};

export function OfferNotificationEmail({
  carTitle,
  carMake,
  carModel,
  carYear,
  offerAmount,
  firstName,
  lastName,
  email,
  phone,
  message,
  adminUrl,
}: OfferEmailProps) {
  const formattedAmount = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(offerAmount);

  return (
    <Html lang="de">
      <Head />
      <Preview>Neues Angebot: {carTitle} — {formattedAmount}</Preview>
      <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#F4F6F9' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '24px' }}>
          <Section style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '32px' }}>
            <Heading style={{ color: '#111827', fontSize: '24px', marginBottom: '8px' }}>
              Neues Angebot eingegangen
            </Heading>

            <Hr style={{ borderColor: '#E5E7EB', margin: '24px 0' }} />

            <Heading as="h2" style={{ color: '#374151', fontSize: '16px', marginBottom: '8px' }}>
              Fahrzeug
            </Heading>
            <Text style={{ color: '#6B7280', margin: '4px 0' }}>
              <strong>{carTitle}</strong>
            </Text>
            <Text style={{ color: '#6B7280', margin: '4px 0' }}>
              {carMake} {carModel}, Baujahr {carYear}
            </Text>

            <Hr style={{ borderColor: '#E5E7EB', margin: '24px 0' }} />

            <Heading as="h2" style={{ color: '#374151', fontSize: '16px', marginBottom: '8px' }}>
              Angebot
            </Heading>
            <Text style={{ color: '#C41E3A', fontSize: '28px', fontWeight: 'bold', margin: '4px 0' }}>
              {formattedAmount}
            </Text>

            <Hr style={{ borderColor: '#E5E7EB', margin: '24px 0' }} />

            <Heading as="h2" style={{ color: '#374151', fontSize: '16px', marginBottom: '8px' }}>
              Kontaktdaten
            </Heading>
            <Text style={{ color: '#6B7280', margin: '4px 0' }}>
              {firstName} {lastName}
            </Text>
            <Text style={{ color: '#6B7280', margin: '4px 0' }}>{email}</Text>
            {phone && (
              <Text style={{ color: '#6B7280', margin: '4px 0' }}>{phone}</Text>
            )}

            <Hr style={{ borderColor: '#E5E7EB', margin: '24px 0' }} />

            <Heading as="h2" style={{ color: '#374151', fontSize: '16px', marginBottom: '8px' }}>
              Nachricht
            </Heading>
            <Text style={{ color: '#6B7280', margin: '4px 0' }}>
              {message ?? 'Keine Nachricht'}
            </Text>

            <Hr style={{ borderColor: '#E5E7EB', margin: '24px 0' }} />

            <Button
              href={adminUrl}
              style={{
                backgroundColor: '#C41E3A',
                color: '#ffffff',
                padding: '12px 24px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: 'bold',
              }}
            >
              Angebot im Admin ansehen
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
