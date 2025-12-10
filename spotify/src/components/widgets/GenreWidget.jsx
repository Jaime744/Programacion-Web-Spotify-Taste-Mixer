'use client';
import React, { useState } from 'react';

const genres = [
  'acoustic', 'afrobeat', 'alt-rock', 'alternative', 'ambient', 'anime',
  // add the rest of the genres here...
];

const GenreWidget = () => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleGenreSelection = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(item => item !== genre));
    } else {
      if (selectedGenres.length < 5) {
        setSelectedGenres([...selectedGenres, genre]);
      }
    }
  };

  const filteredGenres = genres.filter(genre => 
    genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="widget p-4 bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-white">Genres</h2>
      <input
        type="text"
        placeholder="Search genres..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input w-full p-2 mb-4 border rounded-lg bg-gray-700 text-white"
      />
      <div className="h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        <ul className="space-y-2">
          {filteredGenres.map((genre) => (
            <li
              key={genre}
              onClick={() => handleGenreSelection(genre)}
              className={`cursor-pointer p-2 rounded-lg ${selectedGenres.includes(genre) ? 'bg-green-600 text-white' : 'bg-gray-600'}`}
            >
              {genre}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GenreWidget;
