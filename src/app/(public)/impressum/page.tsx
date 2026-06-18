// T-006
import type { Metadata } from 'next';
import { company } from '@/lib/company';

export const metadata: Metadata = {
  title: `Impressum | ${company.name}`,
};

export default function ImpressumPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-8">
      <h1 className="mb-8 text-4xl font-bold text-gray-900">Impressum</h1>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-gray-900">
          Angaben gemäß § 5 TMG
        </h2>
        <address className="not-italic text-base text-gray-700">
          <p className="font-semibold">{company.name}</p>
          <p>{company.address.street}</p>
          <p>
            {company.address.zip} {company.address.city}
          </p>
        </address>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-gray-900">Inhaber</h2>
        <p className="text-base text-gray-700">{company.legal.owner}</p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-gray-900">Kontakt</h2>
        <p className="text-base text-gray-700">
          Telefon: {company.phone}
          <br />
          E-Mail: {company.email}
        </p>
      </section>

      {company.legal.taxId !== '—' && (
        <section className="mb-8">
          <h2 className="mb-3 text-xl font-semibold text-gray-900">
            Umsatzsteuer-ID
          </h2>
          <p className="text-base text-gray-700">{company.legal.taxId}</p>
        </section>
      )}

      {company.legal.handelsregister !== '—' && (
        <section className="mb-8">
          <h2 className="mb-3 text-xl font-semibold text-gray-900">
            Handelsregister
          </h2>
          <p className="text-base text-gray-700">
            {company.legal.handelsregister}
          </p>
        </section>
      )}

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-gray-900">
          Verantwortlicher gemäß § 55 Abs. 2 RStV
        </h2>
        <p className="text-base text-gray-700">{company.legal.responsible}</p>
      </section>
    </div>
  );
}
