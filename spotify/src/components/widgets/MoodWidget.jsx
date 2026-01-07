'use client';

import { useMemo, useState } from 'react';

const SPOTIFY_API = 'https://api.spotify.com/v1';

const PRESETS = {
  happy: { seed: 'pop', energy: 0.75, valence: 0.75, danceability: 0.7, acousticness: 0.2 },
  chill: { seed: 'chill', energy: 0.35, valence: 0.55, danceability: 0.45, acousticness: 0.55 },
  energetic: { seed: 'edm', energy: 0.9, valence: 0.6, danceability: 0.8, acousticness: 0.1 },
  sad: { seed: 'acoustic', energy: 0.25, valence: 0.2, danceability: 0.35, acousticness: 0.75 },
};

function clamp01(x) {
  const n = Number(x);
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

export default function MoodWidget({ accessToken }) {
  const [preset, setPreset] = useState('happy');
  const [energy, setEnergy] = useState(PRESETS.happy.energy);
  const [valence, setValence] = useState(PRESETS.happy.valence);
  const [danceability, setDanceability] = useState(PRESETS.happy.danceability);
  const [acousticness, setAcousticness] = useState(PRESETS.happy.acousticness);

  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const seedGenre = useMemo(() => PRESETS[preset]?.seed || 'pop', [preset]);

  const applyPreset = (k) => {
    const p = PRESETS[k];
    if (!p) return;
    setPreset(k);
    setEnergy(p.energy);
    setValence(p.valence);
    setDanceability(p.danceability);
    setAcousticness(p.acousticness);
  };

  const preview = async () => {
    if (!accessToken) {
      setErr('Falta accessToken (no estás autenticado).');
      return;
    }

    setLoading(true);
    setErr(null);

    try {
      const url = new URL(`${SPOTIFY_API}/recommendations`);
      url.searchParams.set('limit', '10');
      url.searchParams.set('market', 'ES'); 
      url.searchParams.set('seed_genres', seedGenre);

      url.searchParams.set('target_energy', String(clamp01(energy)));
      url.searchParams.set('target_valence', String(clamp01(valence)));
      url.searchParams.set('target_danceability', String(clamp01(danceability)));
      url.searchParams.set('target_acousticness', String(clamp01(acousticness)));

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        //ver el error real de Spotify
        throw new Error(`${res.status}: ${data?.error?.message || 'Error en recomendaciones'}`);
      }

      setTracks(Array.isArray(data?.tracks) ? data.tracks : []);
    } catch (e) {
      setTracks([]);
      setErr(e?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-neutral-100">Mood</h2>
          <p className="mt-1 text-xs text-neutral-400">Ajusta audio-features y previsualiza recomendaciones.</p>
        </div>
        <button
          onClick={preview}
          className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-emerald-400"
        >
          Preview
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {Object.keys(PRESETS).map((k) => {
          const active = k === preset;
          return (
            <button
              key={k}
              onClick={() => applyPreset(k)}
              className={`rounded-full border px-3 py-1.5 text-sm transition ${
                active
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100'
                  : 'border-neutral-800 bg-neutral-950/40 text-neutral-200 hover:bg-neutral-900/50'
              }`}
            >
              {k}
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Slider label="Energy" value={energy} onChange={setEnergy} />
        <Slider label="Valence" value={valence} onChange={setValence} />
        <Slider label="Danceability" value={danceability} onChange={setDanceability} />
        <Slider label="Acousticness" value={acousticness} onChange={setAcousticness} />
      </div>

      {err ? <p className="mt-3 text-sm text-red-400">{err}</p> : null}

      <div className="mt-4">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-neutral-300">
            <div className="h-4 w-4 animate-spin rounded-full border border-neutral-700 border-t-emerald-500" />
            Cargando…
          </div>
        ) : tracks.length === 0 ? (
          <p className="text-sm text-neutral-400">Pulsa “Preview” para ver canciones sugeridas.</p>
        ) : (
          <ul className="space-y-2">
            {tracks.map((t) => (
              <li key={t.id} className="rounded-xl border border-neutral-800 bg-neutral-950/40 p-2">
                <a
                  href={t?.external_urls?.spotify || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="truncate text-sm font-semibold text-neutral-100">{t.name}</div>
                  <div className="mt-0.5 truncate text-xs text-neutral-400">
                    {t.artists?.map((a) => a.name).join(', ') || '—'}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Slider({ label, value, onChange }) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-950/40 p-3">
      <div className="flex items-center justify-between text-xs text-neutral-300">
        <span>{label}</span>
        <span className="font-mono text-neutral-200">{clamp01(value).toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={clamp01(value)}
        onChange={(e) => onChange(clamp01(e.target.value))}
        className="mt-2 w-full accent-emerald-500"
      />
    </div>
  );
}
