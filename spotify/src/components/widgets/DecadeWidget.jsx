'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function DecadeWidget({ accessToken }) {
  const [decades, setDecades] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [selectedDecade, setSelectedDecade] = useState('');

  const handleSearch = async () => {
    if (selectedDecade) {
      try {
        const response = await axios.get(
          `https://api.spotify.com/v1/search?type=track&q=year:${selectedDecade}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setTracks(response.data.tracks.items);
      } catch (error) {
        console.error('Error fetching tracks:', error);
      }
    }
  };

  useEffect(() => {
    if (selectedDecade) {
      handleSearch();
    }
  }, [selectedDecade]);

  return (
    <div className="widget p-4 bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-white">Selecciona una década</h2>
      <select
        className="decade-dropdown w-full p-2 mb-4 border rounded-lg bg-gray-700 text-white"
        value={selectedDecade}
        onChange={(e) => setSelectedDecade(e.target.value)}
      >
        <option value="">Seleccionar década</option>
        {['1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'].map((decade) => (
          <option key={decade} value={decade}>
            {decade}
          </option>
        ))}
      </select>

      <div className="h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        <ul className="space-y-2">
          {tracks.length > 0 ? (
            tracks.map((track) => (
              <li key={track.id} className="flex items-center space-x-4 text-white">
                <img
                  src={track.album.images[2]?.url}
                  alt={track.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <span>{track.name}</span>
                  <span>{track.artists[0].name}</span>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-400">No tracks found</p>
          )}
        </ul>
      </div>
    </div>
  );
}
