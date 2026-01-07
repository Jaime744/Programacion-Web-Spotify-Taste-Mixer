'use client';

import { useMemo, useState } from 'react';

const GENRES = [
  'acoustic','afrobeat','alt-rock','alternative','ambient','anime',
  'black-metal','bluegrass','blues','bossanova','brazil','breakbeat',
  'british','cantopop','chicago-house','children','chill','classical',
  'club','comedy','country','dance','dancehall','death-metal',
  'deep-house','detroit-techno','disco','disney','drum-and-bass',
  'dub','dubstep','edm','electro','electronic','emo','folk','forro',
  'french','funk','garage','german','gospel','goth','grindcore',
  'groove','grunge','guitar','happy','hard-rock','hardcore','hardstyle',
  'heavy-metal','hip-hop','house','idm','indian','indie','indie-pop',
  'industrial','iranian','j-dance','j-idol','j-pop','j-rock','jazz',
  'k-pop','kids','latin','latino','malay','mandopop','metal','metal-misc',
  'metalcore','minimal-techno','movies','mpb','new-age','new-release',
  'opera','pagode','party','philippines-opm','piano','pop','pop-film',
  'post-dubstep','power-pop','progressive-house','psych-rock','punk',
  'punk-rock','r-n-b','rainy-day','reggae','reggaeton','road-trip',
  'rock','rock-n-roll','rockabilly','romance','sad','salsa','samba',
  'sertanejo','show-tunes','singer-songwriter','ska','sleep','songwriter',
  'soul','soundtracks','spanish','study','summer','swedish','synth-pop',
  'tango','techno','trance','trip-hop','turkish','work-out','world-music'
];

export default function GenreWidget({
  onSelectGenres,
  maxSelected = 5,
  selectedGenres,
}) {
  const [q, setQ] = useState('');
  const [localSelected, setLocalSelected] = useState(
    Array.isArray(selectedGenres) ? selectedGenres : []
  );

  const selected = Array.isArray(selectedGenres) ? selectedGenres : localSelected;

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return GENRES;
    return GENRES.filter((g) => g.toLowerCase().includes(s));
  }, [q]);

  const emit = (next) => {
    setLocalSelected(next);
    onSelectGenres?.(next);
  };

  const toggle = (genre) => {
    const exists = selected.includes(genre);
    let next;

    if (exists) {
      next = selected.filter((g) => g !== genre);
    } else {
      if (selected.length >= maxSelected) return;
      next = [...selected, genre];
    }

    emit(next);
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-neutral-100">Géneros</h2>
          <p className="mt-1 text-xs text-neutral-400">Selecciona hasta {maxSelected}.</p>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-950/40 px-3 py-1 text-xs text-neutral-300">
          {selected.length}/{maxSelected}
        </div>
      </div>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Filtrar (ej: techno)"
        className="mt-4 w-full rounded-xl border border-neutral-800 bg-neutral-950/40 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
      />

      <div className="mt-4 h-64 overflow-y-auto pr-1">
        <ul className="space-y-2">
          {filtered.map((genre) => {
            const active = selected.includes(genre);
            return (
              <li key={genre}>
                <button
                  type="button"
                  onClick={() => toggle(genre)}
                  className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition ${
                    active
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100'
                      : 'border-neutral-800 bg-neutral-950/40 text-neutral-200 hover:bg-neutral-900/50'
                  }`}
                >
                  {genre}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
