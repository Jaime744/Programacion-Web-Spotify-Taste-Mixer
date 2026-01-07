'use client';

export default function TrackCard({ track }) {
  if (!track) return null;

  const image = track?.album?.images?.[1]?.url || track?.album?.images?.[0]?.url || null;
  const artists = Array.isArray(track?.artists)
    ? track.artists.map((a) => a.name).join(', ')
    : '';
  const href =
    track?.external_urls?.spotify ||
    (track?.id ? `https://open.spotify.com/track/${track.id}` : '#');

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex gap-3 rounded-2xl border border-neutral-800 bg-neutral-950/40 p-3 shadow-sm transition hover:bg-neutral-900/50"
    >
      <div className="h-14 w-14 flex-none overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
        {image ? (
          <img
            src={image}
            alt={track.name || 'Track cover'}
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="h-full w-full" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-neutral-100">
          {track.name || 'Unknown track'}
        </div>
        <div className="mt-1 truncate text-xs text-neutral-400">{artists || '—'}</div>

        <div className="mt-2 flex items-center gap-2 text-xs text-neutral-500">
          {track?.album?.name ? (
            <span className="min-w-0 truncate">{track.album.name}</span>
          ) : (
            <span className="min-w-0 truncate">&nbsp;</span>
          )}

          {typeof track?.popularity === 'number' ? (
            <span className="ml-auto inline-flex items-center rounded-full border border-neutral-800 bg-neutral-900/60 px-2 py-0.5 text-[11px] text-neutral-300">
              Pop {track.popularity}
            </span>
          ) : null}
        </div>
      </div>
    </a>
  );
}
