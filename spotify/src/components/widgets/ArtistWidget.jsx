'use client';

import { useEffect, useState } from 'react';

export default function ArtistWidget({ accessToken, onSelectArtists }) {
  const [artists, setArtists] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopArtists = async () => {
      if (!accessToken) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('https://api.spotify.com/v1/me/top/artists?limit=50', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error?.message || 'Error fetching top artists');
        setArtists(Array.isArray(data?.items) ? data.items : []);
      } catch (e) {
        setError(e?.message || 'Error');
      } finally {
        setLoading(false);
      }
    };

    fetchTopArtists();
  }, [accessToken]);

  const toggleArtist = (artist) => {
    if (!artist?.id) return;

    const exists = selected.some((a) => a.id === artist.id);
    let next;

    if (exists) {
      next = selected.filter((a) => a.id !== artist.id);
    } else {
      if (selected.length >= 5) return;
      next = [...selected, artist];
    }

    setSelected(next);
    onSelectArtists?.(next);
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-neutral-100">Tus artistas top</h2>
          <p className="mt-1 text-xs text-neutral-400">Elige hasta 5.</p>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-950/40 px-3 py-1 text-xs text-neutral-300">
          {selected.length}/5
        </div>
      </div>

      {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}

      <div className="mt-4 h-64 overflow-y-auto pr-1">
        {loading ? (
          <p className="text-sm text-neutral-300">Cargando…</p>
        ) : artists.length === 0 ? (
          <p className="text-sm text-neutral-400">No hay artistas para mostrar.</p>
        ) : (
          <ul className="space-y-2">
            {artists.map((artist) => {
              const isSelected = selected.some((a) => a.id === artist.id);
              const img = artist?.images?.[2]?.url || artist?.images?.[1]?.url;
              return (
                <li key={artist.id}>
                  <button
                    type="button"
                    onClick={() => toggleArtist(artist)}
                    className={`w-full flex items-center gap-3 rounded-xl border p-2 text-left transition ${
                      isSelected
                        ? 'border-emerald-500/40 bg-emerald-500/10'
                        : 'border-neutral-800 bg-neutral-950/40 hover:bg-neutral-900/50'
                    }`}
                  >
                    <div className="h-10 w-10 overflow-hidden rounded-full border border-neutral-800 bg-neutral-900">
                      {img ? (
                        <img
                          src={img}
                          alt={artist.name}
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-neutral-100">{artist.name}</div>
                      <div className="mt-0.5 text-xs text-neutral-400">{artist?.genres?.[0] || '—'}</div>
                    </div>
                    <div className={`h-2.5 w-2.5 rounded-full ${isSelected ? 'bg-emerald-400' : 'bg-neutral-700'}`} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
