'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSpotifyAuthUrl, isAuthenticated } from '../lib/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace('/dashboard');
    }
  }, [router]);

  const handleLogin = () => {
    window.location.href = getSpotifyAuthUrl();
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-3xl border border-neutral-800 bg-neutral-900/60 p-8 shadow-xl">
        <div className="flex items-center justify-center">
          <div className="rounded-2xl bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/20">
            Spotify Taste Mixer
          </div>
        </div>

        <h1 className="mt-6 text-center text-3xl sm:text-4xl font-bold tracking-tight">
          Mezcla tu gusto musical
        </h1>
        <p className="mt-3 text-center text-sm sm:text-base text-neutral-300">
          Conecta con Spotify, elige artistas / géneros / décadas y genera una selección de canciones personalizada.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={handleLogin}
            className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-neutral-950 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            Iniciar sesión con Spotify
          </button>
          <p className="text-center text-xs text-neutral-400">
            Configura <span className="font-mono">NEXT_PUBLIC_SPOTIFY_CLIENT_ID</span> y{' '}
            <span className="font-mono">NEXT_PUBLIC_REDIRECT_URI</span>.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/40 p-4">
            <div className="text-sm font-semibold">Artistas</div>
            <div className="mt-1 text-xs text-neutral-400">Top y búsqueda</div>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/40 p-4">
            <div className="text-sm font-semibold">Filtros</div>
            <div className="mt-1 text-xs text-neutral-400">Género, década, popularidad</div>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/40 p-4">
            <div className="text-sm font-semibold">Resultados</div>
            <div className="mt-1 text-xs text-neutral-400">Canciones listas para abrir</div>
          </div>
        </div>
      </div>
    </main>
  );
}
