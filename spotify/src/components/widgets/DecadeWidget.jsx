'use client';

import { useEffect, useMemo, useState } from 'react';

const DECADES = ['1950s','1960s','1970s','1980s','1990s','2000s','2010s','2020s'];

function decadeRange(decade) {
  const start = Number.parseInt(decade.slice(0, 4), 10);
  return { startYear: start, endYear: start + 9 };
}

export default function DecadeWidget({ accessToken, onSelectDecade }) {
  const [selected, setSelected] = useState('');
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const range = useMemo(() => (selected ? decadeRange(selected) : null), [selected]);

  useEffect(() => {
    if (!selected) {
      setPreview([]);
      setErr(null);
      return;
    }

    onSelectDecade?.(selected);

    // Preview opcional: si no hay token, no hacemos preview.
    if (!accessToken) return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const { startYear, endYear } = decadeRange(selected);
        const url = new URL('https://api.spotify.com/v1/search');
        url.searchParams.set('type', 'track');
        url.searchParams.set('limit', '8');
        url.searchParams.set('q', `year:${startYear}-${endYear}`);

        const res = await fetch(url.toString(), {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error?.message || 'Error cargando preview');

        const items = Array.isArray(data?.tracks?.items) ? data.tracks.items : [];
        if (!cancelled) setPreview(items);
      } catch (e) {
        if (!cancelled) setErr(e?.message || 'Error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selected, accessToken, onSelectDecade]);

  return (
    <div>
      <h2 className="text-lg font-semibold text-neutral-100">Décadas</h2>
      <p className="mt-1 text-xs text-neutral-400">Selecciona 1 década.</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {DECADES.map((d) => {
          const active = d === selected;
          return (
            <button
              key={d}
              type="button"
              onClick={() => setSelected(active ? '' : d)}
              className={`rounded-full border px-3 py-1.5 text-sm transition ${
                active
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100'
                  : 'border-neutral-800 bg-neutral-950/40 text-neutral-200 hover:bg-neutral-900/50'
              }`}
            >
              {d}
            </button>
          );
        })}
      </div>

      {range ? (
        <div className="mt-3 text-xs text-neutral-400">
          Rango: <span className="font-mono text-neutral-200">{range.startYear}</span>–
          <span className="font-mono text-neutral-200">{range.endYear}</span>
        </div>
      ) : null}

      {err ? <p className="mt-3 text-sm text-red-400">{err}</p> : null}

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-200">Preview</h3>
          {loading ? (
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <div className="h-3 w-3 animate-spin rounded-full border border-neutral-700 border-t-emerald-500" />
              Cargando…
            </div>
          ) : null}
        </div>

        {preview.length === 0 ? (
          <p className="mt-2 text-sm text-neutral-400">Selecciona una década para ver canciones.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {preview.map((t) => (
              <li key={t.id} className="rounded-xl border border-neutral-800 bg-neutral-950/40 p-2">
                <div className="truncate text-sm font-semibold text-neutral-100">{t.name}</div>
                <div className="mt-0.5 truncate text-xs text-neutral-400">
                  {t.artists?.map((a) => a.name).join(', ') || '—'}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
