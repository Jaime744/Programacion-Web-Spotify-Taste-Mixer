'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ArtistWidget({ accessToken, onSelectArtist }) {
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (accessToken && isClient) {
      const fetchArtists = async () => {
        try {
          const response = await axios.get('https://api.spotify.com/v1/me/top/artists', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setArtists(response.data.items);
        } catch (error) {
          console.error('Error fetching artists:', error);
        }
      };
      fetchArtists();
    }
  }, [accessToken, isClient]);

  const handleSelectArtist = (artist) => {
    setSelectedArtist(artist);
    onSelectArtist(artist); // Pass the selected artist to the parent component
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="widget p-4 bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-white">Tus artistas favoritos</h2>
      <div className="h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        <ul className="space-y-2">
          {artists.length > 0 ? (
            artists.map((artist) => (
              <li
                key={artist.id}
                className={`flex items-center space-x-4 cursor-pointer ${selectedArtist?.id === artist.id ? 'bg-green-600' : 'bg-gray-600'}`}
                onClick={() => handleSelectArtist(artist)}
              >
                <img
                  src={artist.images[0]?.url}
                  alt={artist.name}
                  width={50}
                  className="w-12 h-12 rounded-full"
                />
                <span className="text-white">{artist.name}</span>
              </li>
            ))
          ) : (
            <p className="text-gray-400">Loading artists...</p>
          )}
        </ul>
      </div>
    </div>
  );
}
