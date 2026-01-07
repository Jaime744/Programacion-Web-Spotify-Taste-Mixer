'use client';

import { useEffect, useMemo, useState } from 'react';

function clamp01(x) {
  const n = Number(x);
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

function to01(v0_100) {
  return clamp01(Number(v0_100) / 100);
}

function Slider({ label, value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-medium text-neutral-100">{label}</label>
        <span className="text-sm font-semibold text-neutral-200/80 tabular-nums">{value}</span>
      </div>

      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={onChange}
        className="w-full accent-emerald-500"
      />

      <div className="flex justify-between text-[11px] text-neutral-200/40">
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
    </div>
  );
}

/**
 * MoodWidget (adaptado)
 * - NO llama a Spotify (evita 404 /recommendations)
 * - Emite un objeto normalizado a 0..1 para que DisplaySongs lo use como filtros
 *
 * Props:
 *  - onChangeMood?: (moodProfile) => void
 */
export default function MoodWidget({ onChangeMood }) {
  const [energy, setEnergy] = useState(50);
  const [relax, setRelax] = useState(50);
  const [danceability, setDanceability] = useState(50);
  const [melody, setMelody] = useState(50);
  const [mood, setMood] = useState('Happy');

  // ✅ Perfil que entiende Spotify (0..1)
  const moodProfile = useMemo(() => {
    // relax -> acousticness (más relax => más acústico/suave)
    // melody -> valence (más “melódico/positivo” => más valence)
    return {
      mood,
      // 0..1
      target_energy: to01(energy),
      target_danceability: to01(danceability),
      target_valence: to01(melody),
      target_acousticness: to01(relax),
      // por si quieres guardar también el UI raw 0..100
      ui: {
        energy: Number(energy),
        relax: Number(relax),
        danceability: Number(danceability),
        melody: Number(melody),
      },
    };
  }, [mood, energy, relax, danceability, melody]);

  useEffect(() => {
    if (typeof onChangeMood === 'function') {
      onChangeMood(moodProfile);
    }
  }, [moodProfile, onChangeMood]);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="text-lg font-semibold text-neutral-100">Mood</h3>
        <p className="text-sm text-neutral-300/70">
          Define energía, relax y baile. Esto se usará como perfil de audio-features para la playlist.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Slider label="Energía" value={energy} onChange={(e) => setEnergy(e.target.value)} />
        <Slider label="Relax" value={relax} onChange={(e) => setRelax(e.target.value)} />
        <Slider label="Bailongo" value={danceability} onChange={(e) => setDanceability(e.target.value)} />
        <Slider label="Melódico (Valence)" value={melody} onChange={(e) => setMelody(e.target.value)} />
      </div>

      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-medium text-neutral-100">Estado</h4>

        <select
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          className="w-full rounded-lg bg-neutral-900 px-3 py-2 text-sm text-neutral-100
                     ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        >
          <option value="Happy">Feliz</option>
          <option value="Sad">Triste</option>
          <option value="Energetic">Enérgico</option>
          <option value="Calm">Calmado</option>
        </select>
      </div>

      <div className="rounded-2xl bg-neutral-950/40 ring-1 ring-white/10 p-4">
        <h4 className="text-sm font-semibold text-neutral-100">Resumen</h4>

        <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-neutral-200/70 sm:grid-cols-3">
          <div>
            Estado: <span className="text-neutral-100 font-semibold">{mood}</span>
          </div>
          <div>
            Energía:{' '}
            <span className="text-neutral-100 font-semibold tabular-nums">
              {moodProfile.target_energy.toFixed(2)}
            </span>
          </div>
          <div>
            Relax:{' '}
            <span className="text-neutral-100 font-semibold tabular-nums">
              {moodProfile.target_acousticness.toFixed(2)}
            </span>
          </div>
          <div>
            Bailongo:{' '}
            <span className="text-neutral-100 font-semibold tabular-nums">
              {moodProfile.target_danceability.toFixed(2)}
            </span>
          </div>
          <div>
            Valence:{' '}
            <span className="text-neutral-100 font-semibold tabular-nums">
              {moodProfile.target_valence.toFixed(2)}
            </span>
          </div>
        </div>

        <p className="mt-3 text-xs text-neutral-400">
          Nota: “Melódico” se interpreta como <span className="font-mono">valence</span> y “Relax” como{' '}
          <span className="font-mono">acousticness</span>.
        </p>
      </div>
    </div>
  );
}
