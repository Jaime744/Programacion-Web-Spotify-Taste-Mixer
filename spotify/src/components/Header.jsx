'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '../lib/auth';

export default function Header({ accessToken }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      if (!accessToken) return;
      setLoading(true);
      try {
        const res = await fetch('https://api.spotify.com/v1/me', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok) setUser(data);
      } catch (e) {
        console.error('Error fetching user data:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [accessToken]);

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-800 bg-neutral-950/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30" />
          <div>
            <div className="text-sm font-semibold leading-none">Spotify Taste Mixer</div>
            <div className="mt-1 text-xs text-neutral-400">Dashboard</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {loading && (
            <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-400">
              <div className="h-3 w-3 animate-spin rounded-full border border-neutral-700 border-t-emerald-500" />
              Cargando perfil…
            </div>
          )}

          {user?.images?.[0]?.url ? (
            <img
              src={user.images[0].url}
              alt="User avatar"
              className="h-9 w-9 rounded-full border border-neutral-800"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="h-9 w-9 rounded-full border border-neutral-800 bg-neutral-900" />
          )}

          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center rounded-xl bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
}
