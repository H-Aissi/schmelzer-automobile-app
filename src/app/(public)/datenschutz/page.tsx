// T-006
import type { Metadata } from 'next';
import { company } from '@/lib/company';

export const metadata: Metadata = {
  title: `Datenschutz | ${company.name}`,
};

export default function DatenschutzPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-8">
      <h1 className="mb-8 text-4xl font-bold text-gray-900">
        Datenschutzerklärung
      </h1>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-gray-900">
          1. Datenschutz auf einen Blick
        </h2>
        <p className="text-base text-gray-700">
          Die folgenden Hinweise geben einen einfachen Überblick darüber, was
          mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website
          besuchen.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-gray-900">
          2. Verantwortliche Stelle
        </h2>
        <address className="not-italic text-base text-gray-700">
          <p>{company.name}</p>
          <p>{company.address.street}</p>
          <p>
            {company.address.zip} {company.address.city}
          </p>
          <p>E-Mail: {company.email}</p>
        </address>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-gray-900">
          3. Datenerfassung auf dieser Website
        </h2>
        <p className="mb-4 text-base text-gray-700">
          <strong>Angebotsformular:</strong> Wenn Sie über unser Angebotsformular
          eine Anfrage stellen, werden Ihre Angaben (Name, E-Mail, Telefon,
          Angebotsbetrag, Nachricht) zur Bearbeitung Ihrer Anfrage gespeichert.
          Diese Daten werden nicht an Dritte weitergegeben.
        </p>
        <p className="text-base text-gray-700">
          <strong>Server-Log-Dateien:</strong> Der Anbieter dieser Website
          erhebt und speichert automatisch Informationen in Server-Log-Dateien,
          die Ihr Browser automatisch übermittelt.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold text-gray-900">
          4. Ihre Rechte
        </h2>
        <p className="text-base text-gray-700">
          Sie haben das Recht auf Auskunft, Berichtigung, Löschung und
          Einschränkung der Verarbeitung Ihrer personenbezogenen Daten. Wenden
          Sie sich dazu an: {company.email}
        </p>
      </section>

      <p className="text-sm text-gray-400">
        Dies ist ein Platzhalter-Datenschutztext. Vor Inbetriebnahme durch einen
        Rechtsanwalt prüfen lassen.
      </p>
    </div>
  );
}
