'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function DisplaySongs({ accessToken, artists, genres, decades }) {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para buscar canciones basadas en las preferencias del usuario
  const searchSongs = async () => {
    setLoading(true);
    setError(null);

    try {
      const trackList = [];

      // Buscar canciones por artistas
      for (const artist of artists) {
        const res = await axios.get(
          `https://api.spotify.com/v1/search?type=track&q=artist:${artist}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (res.data.tracks.items.length > 0) {
          trackList.push(res.data.tracks.items[0]); // Tomar solo una canción por artista
        }
      }

      // Buscar canciones por géneros
      for (const genre of genres) {
        const res = await axios.get(
          `https://api.spotify.com/v1/search?type=track&q=genre:${genre}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (res.data.tracks.items.length > 0) {
          trackList.push(res.data.tracks.items[0]); // Tomar solo una canción por género
        }
      }

      // Buscar canciones por décadas
      for (const decade of decades) {
        const res = await axios.get(
          `https://api.spotify.com/v1/search?type=track&q=year:${decade}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (res.data.tracks.items.length > 0) {
          trackList.push(res.data.tracks.items[0]); // Tomar solo una canción por década
        }
      }

      // Limitar a 10 canciones
      setSongs(trackList.slice(0, 10));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching songs:', error);
      setError('Error fetching songs. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (artists.length > 0 || genres.length > 0 || decades.length > 0) {
      searchSongs();
    }
  }, [artists, genres, decades]);

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-md max-w-md mx-auto">
      {loading ? (
        <p className="text-white">Loading songs...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-white">Personalized Songs</h2>
          <div className="h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            <ul className="space-y-2 text-white">
              {songs.map((song, index) => (
                <li key={song.id}>
                  <a
                    href={`https://open.spotify.com/track/${song.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {index + 1}. {song.name} by {song.artists.map((artist) => artist.name).join(', ')}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
