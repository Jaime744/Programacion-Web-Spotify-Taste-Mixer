'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function DisplaySongs({ accessToken, artists, genres, decades, minPopularity = 50, maxPopularity = 100 }) {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para obtener el rango de años basado en la década seleccionada
  const getDecadeRange = (decade) => {
    const startYear = parseInt(decade.slice(0, 4));
    const endYear = startYear + 9;  
    return { startYear, endYear };
  };

  // Función para buscar canciones basadas en las preferencias del usuario
  const searchSongs = async () => {
    setLoading(true);
    setError(null);
    let trackList = [];

    try {
      // Verificar que artists, genres y decades son arrays válidos
      if (!Array.isArray(artists) || !Array.isArray(genres) || !Array.isArray(decades)) {
        setError('Invalid data provided');
        setLoading(false);
        return;
      }

      // 1. Buscar canciones por artistas
      for (const artist of artists) {
        const artistTracks = await axios.get(`https://api.spotify.com/v1/artists/${artist.id}/top-tracks`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            market: 'US', // O el mercado que prefieras
          }
        });
        trackList.push(...artistTracks.data.tracks); // Agregar canciones del artista
      }

      // 2. Buscar canciones por géneros
      for (const genre of genres) {
        const genreTracks = await axios.get(`https://api.spotify.com/v1/search`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            q: `genre:${genre}`,
            type: 'track',
            limit: 10,
          }
        });
        trackList.push(...genreTracks.data.tracks.items); // Agregar canciones del género
      }

      // 3. Buscar canciones por décadas
      for (const decade of decades) {
        const { startYear, endYear } = getDecadeRange(decade); // Obtener el rango de años de la década
        const decadeTracks = await axios.get(`https://api.spotify.com/v1/search`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            q: `year:${startYear}-${endYear}`, // Buscar canciones en el rango de años
            type: 'track',
            limit: 10,
          }
        });
        trackList.push(...decadeTracks.data.tracks.items); // Agregar canciones de la década
      }

      // 4. Filtrar por popularidad
      trackList = trackList.filter(track => {
        return track.popularity >= minPopularity && track.popularity <= maxPopularity;
      });

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
    // Solo buscar canciones si los artistas, géneros o décadas están disponibles y son válidos
    if ((Array.isArray(artists) && artists.length > 0) || (Array.isArray(genres) && genres.length > 0) || (Array.isArray(decades) && decades.length > 0)) {
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
                <li key={`${song.id}-${index}`}> 
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
