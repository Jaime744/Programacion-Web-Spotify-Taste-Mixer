function isBrowser() {
  return typeof window !== 'undefined';
}

export function generateRandomString(length) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export function getSpotifyAuthUrl() {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || '';
  const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI || '';
  const state = generateRandomString(16);

  if (isBrowser()) {
    localStorage.setItem('spotify_auth_state', state);
  }

  const scope = [
    'user-read-private',
    'user-read-email',
    'user-top-read',
    'playlist-modify-public',
    'playlist-modify-private',
  ].join(' ');

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    state,
    scope,
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export function saveTokens(accessToken, refreshToken, expiresIn) {
  if (!isBrowser()) return;

  const expSeconds = Number(expiresIn) || 0;
  const expirationTime = Date.now() + expSeconds * 1000;

  if (accessToken) localStorage.setItem('spotify_token', accessToken);
  if (refreshToken) localStorage.setItem('spotify_refresh_token', refreshToken);
  if (expSeconds) localStorage.setItem('spotify_token_expiration', String(expirationTime));
}

export function getAccessToken() {
  if (!isBrowser()) return null;

  const token = localStorage.getItem('spotify_token');
  const expiration = localStorage.getItem('spotify_token_expiration');
  if (!token || !expiration) return null;

  const exp = Number.parseInt(expiration, 10);
  if (Number.isNaN(exp)) return null;

  if (Date.now() > exp) return null;
  return token;
}

export function getRefreshToken() {
  if (!isBrowser()) return null;
  return localStorage.getItem('spotify_refresh_token');
}

export function isAuthenticated() {
  return getAccessToken() !== null;
}

export function logout() {
  if (!isBrowser()) return;
  localStorage.removeItem('spotify_token');
  localStorage.removeItem('spotify_refresh_token');
  localStorage.removeItem('spotify_token_expiration');
  localStorage.removeItem('spotify_auth_state');
}

export async function refreshAccessToken() {
  if (!isBrowser()) return null;

  const refresh_token = getRefreshToken();
  if (!refresh_token) return null;

  const res = await fetch('/api/refresh-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data?.access_token) return null;

  saveTokens(data.access_token, null, data.expires_in);
  return data.access_token;
}

export async function spotifyRequest(url, options = {}) {
  let token = getAccessToken();
  if (!token) token = await refreshAccessToken();

  if (!token) throw new Error('Not authenticated');

  const doFetch = (bearer) =>
    fetch(url, {
      ...options,
      headers: {
        ...(options?.headers || {}),
        Authorization: `Bearer ${bearer}`,
      },
    });

  let response = await doFetch(token);

  if (response.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) response = await doFetch(newToken);
  }

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Spotify API error ${response.status}: ${text || response.statusText}`);
  }

  const ct = response.headers.get('content-type') || '';
  if (ct.includes('application/json')) return response.json();
  return response.text();
}
