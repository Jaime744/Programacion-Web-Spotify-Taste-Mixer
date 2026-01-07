'use client';

import { useMemo, useState } from 'react';

function uniqById(list) {
  const seen = new Set();
  const out = [];
  for (const a of list) {
    if (!a?.id) continue;
    if (seen.has(a.id)) continue;
    seen.add(a.id);
    out.push(a);
  }
  return out;
}

export default function ArtistSearchWidget({
  accessToken,
  selectedArtists,
  onSelectArtists,
  onSelectArtist, // compat
  maxSelected = 5,
}) {
  const [query, setQuery] = useState('');
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const currentSelected = useMemo(
    () => (Array.isArray(selectedArtists) ? selectedArtists : []),
    [selectedArtists]
  );

  const emit = (next) => {
    onSelectArtists?.(next);
    onSelectArtist?.(next); // compat
  };

  const isSelected = (id) => currentSelected.some((a) => a?.id === id);

  const toggle = (artist) => {
    if (!artist?.id) return;

    const exists = isSelected(artist.id);
    let next;

    if (exists) {
      next = currentSelected.filter((a) => a.id !== artist.id);
    } else {
      if (currentSelected.length >= maxSelected) return;
      next = uniqById([...currentSelected, artist]);
    }

    emit(next);
  };

  const handleSearch = async () => {
    const q = query.trim();
    if (!q) return;

    if (!accessToken) {
      setError('Falta accessToken (no estás autenticado).');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = new URL('https://api.spotify.com/v1/search');
      url.searchParams.set('type', 'artist');
      url.searchParams.set('limit', '15');
      url.searchParams.set('q', q);

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error?.message || 'Error buscando artistas');

      setArtists(Array.isArray(data?.artists?.items) ? data.artists.items : []);
    } catch (e) {
      setError(e?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-neutral-100">Buscar artistas</h2>
          <p className="mt-1 text-xs text-neutral-400">Añade hasta {maxSelected} artistas (total).</p>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-950/40 px-3 py-1 text-xs text-neutral-300">
          {currentSelected.length}/{maxSelected}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ej: Arctic Monkeys"
          className="w-full rounded-xl border border-neutral-800 bg-neutral-950/40 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
        />
        <button
          onClick={handleSearch}
          className="shrink-0 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-emerald-400"
        >
          Buscar
        </button>
      </div>

      {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}

      <div className="mt-4 h-64 overflow-y-auto pr-1">
        {loading ? (
          <p className="text-sm text-neutral-300">Buscando…</p>
        ) : artists.length === 0 ? (
          <p className="text-sm text-neutral-400">Sin resultados.</p>
        ) : (
          <ul className="space-y-2">
            {artists.map((artist) => {
              const img = artist?.images?.[2]?.url || artist?.images?.[1]?.url;
              const selected = isSelected(artist.id);

              return (
                <li key={artist.id}>
                  <button
                    type="button"
                    onClick={() => toggle(artist)}
                    className={`w-full flex items-center gap-3 rounded-xl border p-2 text-left transition ${
                      selected
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
                      <div className="truncate text-sm font-semibold">{artist.name}</div>
                      <div className="mt-0.5 text-xs text-neutral-400">
                        {Array.isArray(artist?.genres) && artist.genres.length ? artist.genres[0] : '—'}
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] ${
                        selected
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                          : 'border-neutral-800 bg-neutral-900/50 text-neutral-300'
                      }`}
                    >
                      {selected ? 'Añadido' : 'Añadir'}
                    </span>
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
