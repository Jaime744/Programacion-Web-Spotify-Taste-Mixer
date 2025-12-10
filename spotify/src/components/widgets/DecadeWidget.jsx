'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

const decades = ['1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];

const DecadeWidget = ({ onSelectDecade }) => {
  const [selectedDecade, setSelectedDecade] = useState('');
  const [decadeSongs, setDecadeSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para obtener el rango de años basado en la década seleccionada
  const getDecadeRange = (decade) => {
    const startYear = parseInt(decade.slice(0, 4));  // Año de inicio de la década (ejemplo, 1980)
    const endYear = startYear + 9;  // Año final de la década (ejemplo, 1989 para la década de 1980)
    return { startYear, endYear };
  };

  // Función para buscar canciones por la década seleccionada
  const searchDecadeSongs = async (decade) => {
    setLoading(true);
    setError(null);
    const { startYear, endYear } = getDecadeRange(decade);

    try {
      const decadeTracks = await axios.get(`https://api.spotify.com/v1/search`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('spotify_token')}`,
        },
        params: {
          q: `year:${startYear}-${endYear}`, // Buscar canciones en el rango de años
          type: 'track',
          limit: 10,
        }
      });

      setDecadeSongs(decadeTracks.data.tracks.items); // Guardar las canciones de la década
      setLoading(false);

    } catch (error) {
      console.error('Error fetching decade songs:', error);
      setError('Error fetching decade songs. Please try again later.');
      setLoading(false);
    }
  };

  const handleSelectDecade = (decade) => {
    setSelectedDecade(decade);
    onSelectDecade(decade); // Pasar la década seleccionada al componente principal
    searchDecadeSongs(decade); // Buscar canciones para la década seleccionada
  };

  return (
    <div className="widget p-4 bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-white">Selecciona una década</h2>
      <div className="h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        <select
          value={selectedDecade}
          onChange={(e) => handleSelectDecade(e.target.value)}
          className="w-full p-2 mb-4 border rounded-lg bg-gray-700 text-white"
        >
          <option value="">Seleccionar década</option>
          {decades.map((decade) => (
            <option key={decade} value={decade}>
              {decade}
            </option>
          ))}
        </select>

        {loading && <p className="text-white">Cargando canciones...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {/* Mostrar canciones de la década seleccionada */}
        {decadeSongs.length > 0 && (
          <ul className="space-y-2 text-white">
            {decadeSongs.map((song, index) => (
              <li key={`${song.id}-${index}`} className="hover:underline">
                <a href={`https://open.spotify.com/track/${song.id}`} target="_blank" rel="noopener noreferrer">
                  {song.name} by {song.artists.map((artist) => artist.name).join(', ')}
                </a>
              </li>
            ))}
          </ul>
        )}

      </div>
    </div>
  );
};

export default DecadeWidget;
