'use client';
import { useState } from 'react';
import axios from 'axios';

export default function TrackWidget() {
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
    <div className="widget p-4 bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-white">Search Tracks</h2>
      <input
        type="text"
        placeholder="Search for songs..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}  
        className="w-full p-2 mb-4 border rounded-lg bg-gray-700 text-white"
      />
      <div className="h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        <ul className="space-y-2">
          {tracks.map((track) => (
            <li
              key={track.id}
              onClick={() => handleTrackSelection(track)}
              className={`cursor-pointer p-2 rounded-lg ${selectedTracks.includes(track.id) ? 'bg-green-600 text-white' : 'bg-gray-600'}`}
            >
              <img src={track.album.images[0].url} alt={track.name} className="w-12 h-12 rounded-full" />
              <div>
                <span>{track.name}</span>
                <span>{track.artists[0].name}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
