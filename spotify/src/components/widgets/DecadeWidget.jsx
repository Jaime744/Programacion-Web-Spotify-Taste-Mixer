'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function DecadeWidget({ accessToken }) {
  const [decade, setDecade] = useState('');
  const [tracks, setTracks] = useState([]);
  const [selectedTracks, setSelectedTracks] = useState([]);

  const handleSearch = async () => {
    if (decade) {
      try {
        const response = await axios.get(
          `https://api.spotify.com/v1/search?type=track&q=year:${decade}`,
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

  const handleToggleTrack = (trackId) => {
    setSelectedTracks((prevSelected) => {
      if (prevSelected.includes(trackId)) {
        return prevSelected.filter((id) => id !== trackId);
      }
      return [...prevSelected, trackId];
    });
  };

  useEffect(() => {
    if (decade) {
      handleSearch();
    }
  }, [decade]);

  return (
    <div className="widget">
      <h2>Busca por decada</h2>
      <input
        type="text"
        value={decade}
        onChange={(e) => setDecade(e.target.value)}
        placeholder=" (ej: 2010)"
      />
      <ul>
        {tracks.map((track) => (
          <li
            key={track.id}
            className={selectedTracks.includes(track.id) ? 'Seleccionada' : ''}
            onClick={() => handleToggleTrack(track.id)}
          >
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
