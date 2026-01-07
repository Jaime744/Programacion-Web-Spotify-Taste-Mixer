import { getAccessToken } from './auth';

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

export async function generatePlaylistTracks(preferences) {
  const { artists = [], genres = [], decades = [], popularity = { min: 0, max: 100 } } = preferences || {};
  const accessToken = getAccessToken();
  if (!accessToken) throw new Error('Not authenticated');

  let trackList = [];

  for (const a of artists) {
    if (!a?.id) continue;
    const url = new URL(`https://api.spotify.com/v1/artists/${a.id}/top-tracks`);
    url.searchParams.set('market', 'ES');
    const data = await spotifyGet(accessToken, url.toString());
    trackList.push(...(Array.isArray(data?.tracks) ? data.tracks : []));
  }

  for (const g of genres) {
    if (!g) continue;
    const url = new URL('https://api.spotify.com/v1/search');
    url.searchParams.set('type', 'track');
    url.searchParams.set('limit', '10');
    url.searchParams.set('q', `genre:${g}`);
    const data = await spotifyGet(accessToken, url.toString());
    trackList.push(...(Array.isArray(data?.tracks?.items) ? data.tracks.items : []));
  }

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

  trackList = uniqTracks(trackList);

  const decadeRanges = decades.map(decadeToRange).filter(Boolean);
  if (decadeRanges.length) {
    trackList = trackList.filter((t) => {
      const y = getYear(t?.album?.release_date);
      if (!y) return false;
      return decadeRanges.some((r) => y >= r.start && y <= r.end);
    });
  }

  const minP = Number(popularity?.min ?? 0);
  const maxP = Number(popularity?.max ?? 100);
  trackList = trackList.filter((t) => {
    const p = typeof t?.popularity === 'number' ? t.popularity : null;
    if (p === null) return true;
    return p >= minP && p <= maxP;
  });

  trackList.sort((a, b) => (b?.popularity || 0) - (a?.popularity || 0));
  return trackList;
}
