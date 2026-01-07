'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { saveTokens } from '../../../lib/auth';

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState(null);
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;

    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setError('Autenticación cancelada');
      return;
    }

    if (!code) {
      setError('No se recibió código de autorización');
      return;
    }

    const savedState = localStorage.getItem('spotify_auth_state');
    if (!state || state !== savedState) {
      setError('Error de validación de seguridad (CSRF). Intenta iniciar sesión de nuevo.');
      localStorage.removeItem('spotify_auth_state');
      return;
    }

    localStorage.removeItem('spotify_auth_state');
    hasProcessed.current = true;

    (async () => {
      try {
        const response = await fetch('/api/spotify-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.error || 'Error al obtener token');
        }

        saveTokens(data.access_token, data.refresh_token, data.expires_in);
        router.replace('/dashboard');
      } catch (e) {
        console.error('Error:', e);
        setError(e?.message || 'Error desconocido');
      }
    })();
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 shadow">
          <h1 className="text-xl font-semibold text-red-400">Error</h1>
          <p className="mt-2 text-sm text-neutral-200">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 shadow">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-neutral-700 border-t-emerald-500" />
        <p className="mt-4 text-center text-sm text-neutral-200">Autenticando…</p>
      </div>
    </div>
  );
}
