'use client';

import { useEffect, useMemo, useState } from 'react';
import PlaylistDisplay from '../PlaylistDisplay';

function getYear(releaseDate) {
  if (!releaseDate) return null;
  const y = Number.parseInt(String(releaseDate).slice(0, 4), 10);
  return Number.isFinite(y) ? y : null;
}

function decadeToRange(decade) {
  const start = Number.parseInt(String(decade).slice(0, 4), 10);
  if (!Number.isFinite(start)) return null;
  return { start, end: start + 9 };
}

function uniqTracks(tracks) {
  const seen = new Set();
  const out = [];
  for (const t of tracks) {
    if (!t?.id) continue;
    if (seen.has(t.id)) continue;
    seen.add(t.id);
    out.push(t);
  }
  return out;
}

async function spotifyGet(accessToken, url) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.message || `Spotify error ${res.status}`);
  return data;
}

async function spotifyPost(accessToken, url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body ?? {}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.message || `Spotify error ${res.status}`);
  return data;
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export default function DisplaySongs({
  accessToken,
  artists = [],
  genres = [],
  decades = [],
  minPopularity = 50,
  maxPopularity = 100,
}) {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  // UI crear playlist
  const [plName, setPlName] = useState('Taste Mixer Playlist');
  const [plPublic, setPlPublic] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createdUrl, setCreatedUrl] = useState(null);
  const [createdId, setCreatedId] = useState(null);

  const hasFilters = useMemo(() => {
    return (
      (Array.isArray(artists) && artists.length) ||
      (Array.isArray(genres) && genres.length) ||
      (Array.isArray(decades) && decades.length)
    );
  }, [artists, genres, decades]);

  const fetchSongs = async () => {
    if (!accessToken) {
      setErr('Falta accessToken.');
      return;
    }
    if (!hasFilters) {
      setSongs([]);
      setErr(null);
      setCreatedUrl(null);
      setCreatedId(null);
      return;
    }

    setLoading(true);
    setErr(null);

    try {
      let trackList = [];

      //op-tracks por artistas
      if (Array.isArray(artists)) {
        for (const a of artists) {
          if (!a?.id) continue;
          const url = new URL(`https://api.spotify.com/v1/artists/${a.id}/top-tracks`);
          url.searchParams.set('market', 'ES');
          const data = await spotifyGet(accessToken, url.toString());
          trackList.push(...(Array.isArray(data?.tracks) ? data.tracks : []));
        }
      }

      //Tracks por género
      if (Array.isArray(genres)) {
        for (const g of genres) {
          if (!g) continue;
          const url = new URL('https://api.spotify.com/v1/search');
          url.searchParams.set('type', 'track');
          url.searchParams.set('limit', '10');
          url.searchParams.set('q', `genre:${g}`);
          const data = await spotifyGet(accessToken, url.toString());
          trackList.push(...(Array.isArray(data?.tracks?.items) ? data.tracks.items : []));
        }
      }

      // Tracks por década
      if (Array.isArray(decades)) {
        for (const d of decades) {
          const r = decadeToRange(d);
          if (!r) continue;
          const url = new URL('https://api.spotify.com/v1/search');
          url.searchParams.set('type', 'track');
          url.searchParams.set('limit', '10');
          url.searchParams.set('q', `year:${r.start}-${r.end}`);
          const data = await spotifyGet(accessToken, url.toString());
          trackList.push(...(Array.isArray(data?.tracks?.items) ? data.tracks.items : []));
        }
      }

      // Dedupe
      trackList = uniqTracks(trackList);

      // Filtro por década (extra seguridad)
      const decadeRanges = (Array.isArray(decades) ? decades : []).map(decadeToRange).filter(Boolean);
      if (decadeRanges.length) {
        trackList = trackList.filter((t) => {
          const y = getYear(t?.album?.release_date);
          if (!y) return false;
          return decadeRanges.some((r) => y >= r.start && y <= r.end);
        });
      }

      // Popularidad
      const minP = Number(minPopularity);
      const maxP = Number(maxPopularity);
      trackList = trackList.filter((t) => {
        const p = typeof t?.popularity === 'number' ? t.popularity : null;
        if (p === null) return true;
        return p >= minP && p <= maxP;
      });

      trackList.sort((a, b) => (b?.popularity || 0) - (a?.popularity || 0));

      const finalList = trackList.slice(0, 30);
      setSongs(finalList);

      // reset de playlist creada si regeneras canciones
      setCreatedUrl(null);
      setCreatedId(null);
    } catch (e) {
      setErr(e?.message || 'Error obteniendo canciones');
      setSongs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, [accessToken, artists, genres, decades, minPopularity, maxPopularity]);

  const createPlaylistInSpotify = async () => {
    if (!accessToken) {
      setErr('Falta accessToken.');
      return;
    }
    if (!songs.length) {
      setErr('No hay canciones para meter en una playlist.');
      return;
    }

    setCreating(true);
    setErr(null);

    try {
      //Obtener usuario
      const me = await spotifyGet(accessToken, 'https://api.spotify.com/v1/me');
      if (!me?.id) throw new Error('No se pudo obtener tu usuario de Spotify.');

      // Crear playlist
      const name = (plName || 'Taste Mixer Playlist').trim();
      const desc = `Generada por Spotify Taste Mixer · ${new Date().toLocaleString()}`;

      const playlist = await spotifyPost(
        accessToken,
        `https://api.spotify.com/v1/users/${encodeURIComponent(me.id)}/playlists`,
        {
          name,
          description: desc,
          public: !!plPublic,
        }
      );

      if (!playlist?.id) throw new Error('No se pudo crear la playlist.');
      const playlistId = playlist.id;

      //Añadir tracks
      const uris = songs
        .map((t) => t?.uri || (t?.id ? `spotify:track:${t.id}` : null))
        .filter(Boolean);

      for (const pack of chunk(uris, 100)) {
        await spotifyPost(
          accessToken,
          `https://api.spotify.com/v1/playlists/${encodeURIComponent(playlistId)}/tracks`,
          { uris: pack }
        );
      }

      setCreatedId(playlistId);
      setCreatedUrl(playlist?.external_urls?.spotify || null);
    } catch (e) {
      setErr(e?.message || 'Error creando la playlist');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-neutral-100">Personalized Songs</h2>
          <p className="mt-1 text-xs text-neutral-400">
            Artistas: {Array.isArray(artists) ? artists.length : 0} · Géneros:{' '}
            {Array.isArray(genres) ? genres.length : 0} · Décadas:{' '}
            {Array.isArray(decades) ? decades.length : 0}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={fetchSongs}
            className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-emerald-400"
          >
            Generar
          </button>
          <button
            onClick={() => {
              setSongs([]);
              setCreatedUrl(null);
              setCreatedId(null);
            }}
            className="rounded-xl border border-neutral-800 bg-neutral-950/40 px-4 py-2 text-sm font-semibold text-neutral-200 hover:bg-neutral-900/50"
          >
            Limpiar
          </button>
        </div>
      </div>

      {err ? <p className="mt-3 text-sm text-red-400">{err}</p> : null}

      {loading ? (
        <div className="mt-4 flex items-center gap-2 text-sm text-neutral-300">
          <div className="h-4 w-4 animate-spin rounded-full border border-neutral-700 border-t-emerald-500" />
          Cargando…
        </div>
      ) : songs.length === 0 ? (
        <p className="mt-4 text-sm text-neutral-400">Selecciona filtros arriba para generar canciones.</p>
      ) : (
        <>
          <div className="mt-4">
            <PlaylistDisplay title="Resultados" tracks={songs} />
          </div>

          {/* Crear playlist en Spotify */}
          <div className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-950/30 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-base font-semibold text-neutral-100">Crear playlist en Spotify</h3>
                <p className="mt-1 text-xs text-neutral-400">
                  Se creará en tu cuenta y se añadirán {songs.length} canciones (máx 30).
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={createPlaylistInSpotify}
                  disabled={creating}
                  className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-emerald-400 disabled:opacity-60"
                >
                  {creating ? 'Creando…' : 'Crear playlist'}
                </button>

                {createdUrl ? (
                  <a
                    href={createdUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border border-neutral-800 bg-neutral-950/40 px-4 py-2 text-sm font-semibold text-neutral-200 hover:bg-neutral-900/50"
                  >
                    Abrir en Spotify
                  </a>
                ) : null}
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-neutral-300">Nombre</label>
                <input
                  value={plName}
                  onChange={(e) => setPlName(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-neutral-800 bg-neutral-950/40 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  placeholder="Nombre de tu playlist"
                />
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-950/40 px-3 py-2">
                <input
                  id="plPublic"
                  type="checkbox"
                  checked={plPublic}
                  onChange={(e) => setPlPublic(e.target.checked)}
                  className="h-4 w-4 accent-emerald-500"
                />
                <label htmlFor="plPublic" className="text-sm text-neutral-200">
                  Playlist pública
                </label>
              </div>
            </div>

            {createdId ? (
              <p className="mt-3 text-xs text-neutral-400">
                Playlist creada ID: <span className="font-mono text-neutral-200">{createdId}</span>
              </p>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
