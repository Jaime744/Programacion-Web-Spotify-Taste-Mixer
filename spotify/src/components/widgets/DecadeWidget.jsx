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
    <div className="widget">
      <h2>Selecciona una década</h2>
      <select 
        className="decade-dropdown" 
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
      
      <ul>
        {tracks.map((track) => (
          <li key={track.id}>
            <img src={track.album.images[2]?.url} alt={track.name} />
            <div>
              <span>{track.name}</span>
              <span>{track.artists[0].name}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
