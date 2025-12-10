'use client';
import { useState } from 'react';
import axios from 'axios';

export default function MoodWidget({ accessToken }) {
  const [mood, setMood] = useState('happy');
  const [energy, setEnergy] = useState(50);
  const [valence, setValence] = useState(0.5);
  const [danceability, setDanceability] = useState(0.5);
  const [acousticness, setAcousticness] = useState(0.5);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      let fetchedTracks = [];
      const response = await axios.get(
        `https://api.spotify.com/v1/search?type=track&q=energy:${energy}&valence:${valence}&danceability:${danceability}&acousticness:${acousticness}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      fetchedTracks = response.data.tracks.items;
      setTracks(fetchedTracks);
    } catch (error) {
      console.error("Error fetching tracks:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="widget2 p-4 bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-white">Buscar Canciones según tu Estado de Ánimo y Características Musicales</h2>
      <div className="inputs-container space-y-4">
        <label className="text-white">Energy</label>
        <input
          type="range"
          min="0"
          max="100"
          value={energy}
          onChange={(e) => setEnergy(e.target.value)}
          className="w-full"
        />
        <label className="text-white">Valence</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={valence}
          onChange={(e) => setValence(e.target.value)}
          className="w-full"
        />
        <label className="text-white">Danceability</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={danceability}
          onChange={(e) => setDanceability(e.target.value)}
          className="w-full"
        />
        <label className="text-white">Acousticness</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={acousticness}
          onChange={(e) => setAcousticness(e.target.value)}
          className="w-full"
        />
        <label className="text-white">Estado de ánimo</label>
        <select value={mood} onChange={(e) => setMood(e.target.value)} className="w-full p-2 border rounded-lg bg-gray-700 text-white">
          <option value="happy">Happy</option>
          <option value="sad">Sad</option>
          <option value="energetic">Energetic</option>
          <option value="calm">Calm</option>
        </select>
        <button onClick={handleSearch} className="w-full p-2 bg-green-600 text-white rounded-lg">Buscar Canciones</button>
      </div>
      <div className="results-container mt-4 h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        <ul>
          {tracks.length > 0 ? (
            tracks.map((track) => (
              <li key={track.id} className="flex items-center space-x-4 mb-2 text-white">
                <img src={track.album.images[2]?.url} alt={track.name} className="w-12 h-12 rounded-full" />
                <div>
                  <span>{track.name}</span>
                  <span>{track.artists[0].name}</span>
                </div>
              </li>
            ))
          ) : (
            <p>No songs found</p>
          )}
        </ul>
      </div>
    </div>
  );
}
