// SCR-005
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@/lib/validations';
import { api, ApiError } from '@/lib/api-client';
import { useToast } from '@/components/ui/toast';
import { Icon } from '@/components/ui/icon';
import { company } from '@/lib/company';

export default function AdminLoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [credentialError, setCredentialError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginInput) {
    setCredentialError(null);
    try {
      await api.post('/auth/login', data);
      router.push('/admin/dashboard');
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.error === 'INVALID_CREDENTIALS') {
          setCredentialError('E-Mail oder Passwort falsch.');
        } else if (err.error === 'RATE_LIMITED') {
          showToast({ variant: 'error', message: 'Zu viele Anfragen. Bitte warten Sie einen Moment.' });
        } else {
          showToast({ variant: 'error', message: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.' });
        }
      } else {
        showToast({ variant: 'error', message: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.' });
      }
    }
  }

  return (
    <div className="login-wrap">
      {/* Linke Seite */}
      <div className="login-aside">
        <svg className="login-aside-bg" viewBox="0 0 600 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#8C2233" />
              <stop offset="1" stopColor="#14161B" />
            </linearGradient>
          </defs>
          <circle cx="500" cy="120" r="300" fill="url(#lg)" />
          <circle cx="80" cy="600" r="200" fill="#8C2233" opacity="0.4" />
        </svg>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, color: '#fff' }}>
            {company.name}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.14em', color: '#6E7480', marginTop: 8, textTransform: 'uppercase' }}>
            Händler-Verwaltung
          </div>
        </div>
        <div className="login-quote" style={{ position: 'relative', zIndex: 2 }}>
          Vertrauen entsteht durch Transparenz &mdash; bei jedem Fahrzeug.
        </div>
        <div style={{ position: 'relative', zIndex: 2, color: '#6E7480', fontSize: 13, fontFamily: 'var(--font-mono)' }}>
          © {new Date().getFullYear()} {company.name}
        </div>
      </div>

      {/* Rechte Seite — Formular */}
      <div className="login-form-side">
        <div className="login-card">
          <div style={{ marginBottom: 32 }}>
            <h1 className="display" style={{ fontSize: 28, margin: 0 }}>Anmelden</h1>
            <p className="muted" style={{ marginTop: 8 }}>Händler-Zugang für {company.name}</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="form-stack">
              <div className="field">
                <label className="label">E-Mail-Adresse</label>
                <input
                  className={'input' + (errors.email ? ' input-err' : '')}
                  type="email"
                  autoComplete="email"
                  disabled={isSubmitting}
                  {...register('email')}
                />
                {errors.email && <div className="err-text">{errors.email.message}</div>}
              </div>

              <div className="field">
                <label className="label">Passwort</label>
                <div style={{ position: 'relative' }}>
                  <input
                    className={'input' + (errors.password ? ' input-err' : '')}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    disabled={isSubmitting}
                    style={{ paddingRight: 44 }}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    disabled={isSubmitting}
                    aria-label={showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'}
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      color: 'var(--ink-3)',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Icon name={showPassword ? 'eyeOff' : 'eye'} size={18} />
                  </button>
                </div>
                {errors.password && <div className="err-text">{errors.password.message}</div>}
              </div>

              {credentialError && (
                <div className="alert alert-err" role="alert">
                  <Icon name="x" size={18} />
                  {credentialError}
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={isSubmitting}>
                {isSubmitting ? 'Anmelden …' : 'Anmelden'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
