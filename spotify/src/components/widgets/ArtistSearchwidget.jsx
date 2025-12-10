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
    <div className="widget">
      <h2>Buscar Artistas</h2>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Busca un artista (Ej: Anuel)"
      />
      <ul>
        {artists.map((artist) => (
          <li key={artist.id}>
            <img src={artist.images[2]?.url} alt={artist.name} />
            <div>
              <span>{artist.name}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
