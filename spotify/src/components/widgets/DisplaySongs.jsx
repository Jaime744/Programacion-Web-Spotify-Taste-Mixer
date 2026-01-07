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
  if (!res.ok) {
    throw new Error(data?.error?.message || `Spotify error ${res.status}`);
  }
  return data;
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

  const hasFilters = useMemo(() => {
    return (Array.isArray(artists) && artists.length) ||
      (Array.isArray(genres) && genres.length) ||
      (Array.isArray(decades) && decades.length);
  }, [artists, genres, decades]);

  const fetchSongs = async () => {
    if (!accessToken) {
      setErr('Falta accessToken.');
      return;
    }
    if (!hasFilters) {
      setSongs([]);
      setErr(null);
      return;
    }

    setLoading(true);
    setErr(null);

    try {
      let trackList = [];

      //Top-tracks por artistas
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
      trackList = uniqTracks(trackList);

      // Filtro por década 
      const decadeRanges = (Array.isArray(decades) ? decades : [])
        .map(decadeToRange)
        .filter(Boolean);

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

      // Ordenar por popularidad
      trackList.sort((a, b) => (b?.popularity || 0) - (a?.popularity || 0));
      setSongs(trackList.slice(0, 30));
    } catch (e) {
      setErr(e?.message || 'Error obteniendo canciones');
      setSongs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // auto-refresh cuando cambian filtros (si hay algo seleccionado)
    fetchSongs();
  }, [accessToken, artists, genres, decades, minPopularity, maxPopularity]);

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-neutral-100">Personalized Songs</h2>
          <p className="mt-1 text-xs text-neutral-400">
            Artistas: {Array.isArray(artists) ? artists.length : 0} · Géneros:{' '}
            {Array.isArray(genres) ? genres.length : 0} · Décadas: {Array.isArray(decades) ? decades.length : 0}
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
            onClick={() => setSongs([])}
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
        <div className="mt-4">
          <PlaylistDisplay title="Resultados" tracks={songs} />
        </div>
      )}
    </div>
  );
}
