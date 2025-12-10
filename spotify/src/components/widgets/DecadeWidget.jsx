'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function DecadeWidget({ accessToken }) {
  const [decades, setDecades] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [selectedDecades, setSelectedDecades] = useState([]);

  const handleToggleDecade = (decade) => {
    setSelectedDecades((prevSelected) => {
      if (prevSelected.includes(decade)) {
        return prevSelected.filter((item) => item !== decade);
      }
      return [...prevSelected, decade];
    });
  };

  const handleSearch = async () => {
    if (selectedDecades.length > 0) {
      const queries = selectedDecades.map((decade) => `year:${decade}`);
      try {
        const response = await axios.get(
          `https://api.spotify.com/v1/search?type=track&q=${queries.join(' OR ')}`,
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
    if (selectedDecades.length > 0) {
      handleSearch();
    }
  }, [selectedDecades]);

  return (
    <div className="widget">
      <h2>Selecciona tus décadas/eras musicales preferidas</h2>
      
      <div className="decade-selector">
        {['1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'].map((decade) => (
          <label key={decade}>
            <input
              type="checkbox"
              value={decade}
              checked={selectedDecades.includes(decade)}
              onChange={() => handleToggleDecade(decade)}
            />
            {decade}
          </label>
        ))}
      </div>

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
