'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { offerSchema, type OfferInput } from '@/lib/validations';
import { api, ApiError } from '@/lib/api-client';
import { useToast } from '@/components/ui/toast';
import { Icon } from '@/components/ui/icon';

type OfferFormProps = {
  carId: string;
  suggestedPrice?: number;
};

export function OfferForm({ carId, suggestedPrice }: OfferFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [privacyErr, setPrivacyErr] = useState(false);
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OfferInput>({ resolver: zodResolver(offerSchema) });

  async function onSubmit(data: OfferInput) {
    if (!privacy) { setPrivacyErr(true); return; }
    try {
      await api.post(`/cars/${carId}/offers`, data);
      setSubmitted(true);
    } catch (err) {
      if (err instanceof ApiError && err.error === 'RATE_LIMITED') {
        showToast({ variant: 'error', message: 'Zu viele Anfragen. Bitte warten Sie einen Moment.' });
      } else {
        showToast({ variant: 'error', message: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.' });
      }
    }
  }

  if (submitted) {
    return (
      <div className="success-wrap animate-in">
        <div className="success-ic"><Icon name="check" size={36} stroke={2.2} /></div>
        <h2 className="display" style={{ fontSize: 34, margin: '0 0 12px' }}>Angebot gesendet!</h2>
        <p className="muted" style={{ fontSize: 17, maxWidth: '52ch', marginInline: 'auto' }}>
          Vielen Dank! Ihr Angebot wurde erfolgreich übermittelt. Der Inhaber wird sich bei Interesse bei Ihnen melden.
        </p>
        <div className="row" style={{ gap: 12, justifyContent: 'center', marginTop: 30 }}>
          <a href="/fahrzeuge" className="btn btn-primary">Weitere Fahrzeuge</a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="form-stack">
        <div>
          <div className="label" style={{ marginBottom: 12, fontSize: 14, color: 'var(--ink)' }}>Ihre Kontaktdaten</div>
          <div className="form-row">
            <FieldWrap label="Vorname" err={errors.firstName?.message}>
              <input
                className={'input' + (errors.firstName ? ' input-err' : '')}
                placeholder="Max"
                disabled={isSubmitting}
                {...register('firstName')}
              />
            </FieldWrap>
            <FieldWrap label="Nachname" err={errors.lastName?.message}>
              <input
                className={'input' + (errors.lastName ? ' input-err' : '')}
                placeholder="Mustermann"
                disabled={isSubmitting}
                {...register('lastName')}
              />
            </FieldWrap>
          </div>
        </div>

        <div className="form-row">
          <FieldWrap label="E-Mail" err={errors.email?.message}>
            <input
              className={'input' + (errors.email ? ' input-err' : '')}
              type="email"
              placeholder="max@beispiel.de"
              autoComplete="email"
              disabled={isSubmitting}
              {...register('email')}
            />
          </FieldWrap>
          <FieldWrap label="Telefon (optional)">
            <input
              className="input"
              type="tel"
              placeholder="0170 1234567"
              autoComplete="tel"
              disabled={isSubmitting}
              {...register('phone')}
            />
          </FieldWrap>
        </div>

        <hr className="divider" />

        <FieldWrap label="Ihr Preisangebot (€)" err={errors.offerAmount?.message}>
          <input
            className={'input mono' + (errors.offerAmount ? ' input-err' : '')}
            type="number"
            min={100}
            placeholder={suggestedPrice ? String(suggestedPrice - 1500) : '25000'}
            inputMode="numeric"
            disabled={isSubmitting}
            style={{ fontSize: 18, fontWeight: 600 }}
            {...register('offerAmount', { valueAsNumber: true })}
          />
        </FieldWrap>

        {suggestedPrice && (
          <div className="price-hint">
            <Icon name="tag" size={17} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>
              Angebotspreis des Händlers:{' '}
              <strong className="mono">
                {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(suggestedPrice)}
              </strong>
              . Realistische Angebote werden bevorzugt bearbeitet.
            </span>
          </div>
        )}

        <FieldWrap label="Nachricht (optional)">
          <textarea
            className="textarea"
            placeholder="Fragen, Wunschtermin für die Besichtigung, Inzahlungnahme …"
            disabled={isSubmitting}
            {...register('message')}
          />
        </FieldWrap>

        <div>
          <label className="chk" style={{ alignItems: 'flex-start', gap: 12 }}>
            <input
              type="checkbox"
              checked={privacy}
              onChange={(e) => { setPrivacy(e.target.checked); setPrivacyErr(false); }}
              style={{ marginTop: 3 }}
            />
            <span style={{ color: 'var(--ink-2)' }}>
              Ich habe die <a href="/datenschutz" style={{ color: 'var(--accent)', fontWeight: 600 }}>Datenschutzhinweise</a> gelesen und stimme der Verarbeitung meiner Daten zu. *
            </span>
          </label>
          {privacyErr && <div className="err-text" style={{ marginTop: 4, marginLeft: 28 }}>Zustimmung erforderlich</div>}
        </div>

        <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={isSubmitting}>
          <Icon name="arrowRight" size={18} />
          {isSubmitting ? 'Wird gesendet …' : 'Angebot verbindlich senden'}
        </button>
        <p className="faint" style={{ fontSize: 12.5, textAlign: 'center', margin: 0 }}>
          Unverbindliche Anfrage · keine Kaufverpflichtung
        </p>
      </div>
    </form>
  );
}

function FieldWrap({ label, err, children }: { label: string; err?: string; children: React.ReactNode }) {
  return (
    <div className="field">
      <label className="label">{label}</label>
      {children}
      {err && <div className="err-text">{err}</div>}
    </div>
  );
}
