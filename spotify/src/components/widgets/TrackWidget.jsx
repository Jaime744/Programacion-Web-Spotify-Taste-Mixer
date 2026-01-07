'use client';

import { useMemo, useState } from 'react';

export default function TrackWidget({
  accessToken,
  selectedTracks,
  onSelectTracks,
  maxSelected = 5,
}) {
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState([]);
  const [localSelected, setLocalSelected] = useState(
    Array.isArray(selectedTracks) ? selectedTracks : []
  );
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const selected = Array.isArray(selectedTracks) ? selectedTracks : localSelected;

  const emit = (next) => {
    setLocalSelected(next);
    onSelectTracks?.(next);
  };

  const isSelected = (id) => selected.includes(id);

  const toggle = (trackId) => {
    const exists = isSelected(trackId);
    let next;

    if (exists) next = selected.filter((id) => id !== trackId);
    else {
      if (selected.length >= maxSelected) return;
      next = [...selected, trackId];
    }

    emit(next);
  };

  const handleSearch = async () => {
    const q = query.trim();
    if (!q) return;

    if (!accessToken) {
      setErr('Falta accessToken (no estás autenticado).');
      return;
    }

    setLoading(true);
    setErr(null);

    try {
      const url = new URL('https://api.spotify.com/v1/search');
      url.searchParams.set('type', 'track');
      url.searchParams.set('limit', '15');
      url.searchParams.set('q', q);

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error?.message || 'Error buscando tracks');

      setTracks(Array.isArray(data?.tracks?.items) ? data.tracks.items : []);
    } catch (e) {
      setErr(e?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const selectedCount = useMemo(() => selected.length, [selected]);

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-neutral-100">Tracks semilla</h2>
          <p className="mt-1 text-xs text-neutral-400">Selecciona hasta {maxSelected}.</p>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-950/40 px-3 py-1 text-xs text-neutral-300">
          {selectedCount}/{maxSelected}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="Ej: Blinding Lights"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          className="w-full rounded-xl border border-neutral-800 bg-neutral-950/40 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
        />
        <button
          onClick={handleSearch}
          className="shrink-0 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-emerald-400"
        >
          Buscar
        </button>
      </div>

      {err ? <p className="mt-3 text-sm text-red-400">{err}</p> : null}

      <div className="mt-4 h-64 overflow-y-auto pr-1">
        {loading ? (
          <p className="text-sm text-neutral-300">Buscando…</p>
        ) : tracks.length === 0 ? (
          <p className="text-sm text-neutral-400">Sin resultados.</p>
        ) : (
          <ul className="space-y-2">
            {tracks.map((t) => {
              const active = isSelected(t.id);
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => toggle(t.id)}
                    className={`w-full rounded-xl border p-2 text-left transition ${
                      active
                        ? 'border-emerald-500/40 bg-emerald-500/10'
                        : 'border-neutral-800 bg-neutral-950/40 hover:bg-neutral-900/50'
                    }`}
                  >
                    <div className="truncate text-sm font-semibold text-neutral-100">
                      {t.name}
                    </div>
                    <div className="mt-0.5 truncate text-xs text-neutral-400">
                      {t.artists?.map((a) => a.name).join(', ') || '—'}
                    </div>
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
