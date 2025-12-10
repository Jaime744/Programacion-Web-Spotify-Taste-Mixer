'use client';
import { useState } from 'react';
import axios from 'axios';

export default function MoodWidget({ accessToken }) {
  const [mood, setMood] = useState('happy');
  const [energy, setEnergy] = useState(50); // 0 a 100
  const [valence, setValence] = useState(0.5); // 0 a 1
  const [danceability, setDanceability] = useState(0.5); // 0 a 1
  const [acousticness, setAcousticness] = useState(0.5); // 0 a 1
  const [tracks, setTracks] = useState([]); // Para almacenar las canciones generadas
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      let fetchedTracks = [];

      // Obtener canciones de acuerdo con el estado de ánimo y las características
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
    <div className="widget2">
  <h2>Buscar Canciones según tu Estado de Ánimo y Características Musicales</h2>
  
  {/* Contenedor de controles */}
    <div className="inputs-container">
        <label>Energy</label>
        <input
        type="range"
        min="0"
        max="100"
        value={energy}
        onChange={(e) => setEnergy(e.target.value)}
        />

        <label>Valence</label>
        <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={valence}
        onChange={(e) => setValence(e.target.value)}
        />

        <label>Danceability</label>
        <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={danceability}
        onChange={(e) => setDanceability(e.target.value)}
        />

        <label>Acousticness</label>
        <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={acousticness}
        onChange={(e) => setAcousticness(e.target.value)}
        />

        <label>Estado de ánimo</label>
        <select value={mood} onChange={(e) => setMood(e.target.value)}>
        <option value="happy">Happy</option>
        <option value="sad">Sad</option>
        <option value="energetic">Energetic</option>
        <option value="calm">Calm</option>
        </select>

        <button onClick={handleSearch}>Buscar Canciones</button>
    </div>

    {/* Contenedor de los resultados */}
    <div className="results-container">
        <ul>
        {tracks.length > 0 ? (
            tracks.map((track) => (
            <li key={track.id}>
                <img src={track.album.images[2]?.url} alt={track.name} />
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
