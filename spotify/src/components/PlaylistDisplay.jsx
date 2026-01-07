'use client';

import TrackCard from './TrackCard';

export default function PlaylistDisplay({ title = 'Resultados', tracks = [] }) {
  const list = Array.isArray(tracks) ? tracks : [];

  return (
    <section className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4">
      <div className="flex items-end justify-between gap-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="text-xs text-neutral-400">{list.length} track(s)</div>
      </div>

      {list.length === 0 ? (
        <p className="mt-4 text-sm text-neutral-400">No hay canciones todavía.</p>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((t) => (
            <TrackCard key={t?.id || Math.random()} track={t} />
          ))}
        </div>
      )}
    </section>
  );
}
