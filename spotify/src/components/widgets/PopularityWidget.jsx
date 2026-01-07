'use client';

import { useMemo } from 'react';

export default function PopularityWidget({ value, onChange }) {
  const min = typeof value?.min === 'number' ? value.min : 50;
  const max = typeof value?.max === 'number' ? value.max : 100;

  const safe = useMemo(() => {
    const a = Math.min(min, max);
    const b = Math.max(min, max);
    return { min: Math.max(0, Math.min(100, a)), max: Math.max(0, Math.min(100, b)) };
  }, [min, max]);

  const setMin = (v) => onChange?.({ ...safe, min: v });
  const setMax = (v) => onChange?.({ ...safe, max: v });

  return (
    <div>
      <h2 className="text-lg font-semibold text-neutral-100">Popularidad</h2>
      <p className="mt-1 text-xs text-neutral-400">Filtra por popularidad (0–100).</p>

      <div className="mt-4 grid gap-4">
        <div>
          <div className="flex items-center justify-between text-xs text-neutral-300">
            <span>Mínimo</span>
            <span className="font-mono">{safe.min}</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={safe.min}
            onChange={(e) => setMin(Number(e.target.value))}
            className="mt-2 w-full accent-emerald-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between text-xs text-neutral-300">
            <span>Máximo</span>
            <span className="font-mono">{safe.max}</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={safe.max}
            onChange={(e) => setMax(Number(e.target.value))}
            className="mt-2 w-full accent-emerald-500"
          />
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-950/40 p-3 text-xs text-neutral-400">
          Rango activo: <span className="font-mono text-neutral-200">{safe.min}</span> –{' '}
          <span className="font-mono text-neutral-200">{safe.max}</span>
        </div>
      </div>
    </div>
  );
}
