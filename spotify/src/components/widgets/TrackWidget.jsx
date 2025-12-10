'use client'; 
import React, { useState } from 'react';
import axios from 'axios';

const TrackWidget = () => {
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState([]);
  const [selectedTracks, setSelectedTracks] = useState([]);

  const handleSearch = async () => {
    if (query.trim() !== '') {
      try {
        const response = await axios.get(
          `https://api.spotify.com/v1/search?type=track&q=${query}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('spotify_token')}`,
            },
          }
        );
        setTracks(response.data.tracks.items);
      } catch (error) {
        console.error('Error fetching tracks:', error);
      }
    }
  };

  const handleTrackSelection = (track) => {
    if (selectedTracks.includes(track.id)) {
      setSelectedTracks(selectedTracks.filter((id) => id !== track.id));
    } else {
      setSelectedTracks([...selectedTracks, track.id]);
    }
  };

  return (
    <div className="widget">
      <h2>Search Tracks</h2>
      <input
        type="text"
        placeholder="Search for songs..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        className="search-input"
      />
      <ul>
        {tracks.map((track) => (
          <li
            key={track.id}
            onClick={() => handleTrackSelection(track)}
            className={selectedTracks.includes(track.id) ? 'selected' : ''}
          >
            <img src={track.album.images[0].url} alt={track.name} />
            <div>
              <span>{track.name}</span>
              <span>{track.artists[0].name}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrackWidget;
