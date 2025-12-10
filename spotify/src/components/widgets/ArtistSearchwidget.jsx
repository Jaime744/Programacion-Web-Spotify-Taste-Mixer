'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ArtistSearchWidget({ accessToken }) {
  const [query, setQuery] = useState('');
  const [artists, setArtists] = useState([]);

  const handleSearch = async () => {
    if (query) {
      try {
        const response = await axios.get(
          `https://api.spotify.com/v1/search?type=artist&q=${query}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setArtists(response.data.artists.items);
      } catch (error) {
        console.error('Error fetching artists:', error);
      }
    }
  };

  useEffect(() => {
    if (query) {
      handleSearch();
    } else {
      setArtists([]);
    }
  }, [query]);

  return (
    <div className="widget p-4 bg-gray-800 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-white">Buscar Artistas</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Busca un artista (Ej: Anuel)"
        className="w-full p-2 mb-4 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-600"
      />
      <div className="h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        <ul className="space-y-2">
          {artists.length > 0 ? (
            artists.map((artist) => (
              <li key={artist.id} className="flex items-center space-x-4 text-white">
                <img
                  src={artist.images[2]?.url}
                  alt={artist.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <span className="font-medium">{artist.name}</span>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-400">No artists found</p>
          )}
        </ul>
      </div>
    </div>
  );
}
