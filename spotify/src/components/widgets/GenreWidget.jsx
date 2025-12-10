'use client';
import React, { useState } from 'react';

const genres = [
  'acoustic', 'afrobeat', 'alt-rock', 'alternative', 'ambient', 'anime', 
  'black-metal', 'bluegrass', 'blues', 'bossanova', 'brazil', 'breakbeat', 
  'british', 'cantopop', 'chicago-house', 'children', 'chill', 'classical', 
  'club', 'comedy', 'country', 'dance', 'dancehall', 'death-metal', 
  'deep-house', 'detroit-techno', 'disco', 'disney', 'drum-and-bass', 
  'dub', 'dubstep', 'edm', 'electro', 'electronic', 'emo', 'folk', 'forro', 
  'french', 'funk', 'garage', 'german', 'gospel', 'goth', 'grindcore', 
  'groove', 'grunge', 'guitar', 'happy', 'hard-rock', 'hardcore', 'hardstyle', 
  'heavy-metal', 'hip-hop', 'house', 'idm', 'indian', 'indie', 'indie-pop', 
  'industrial', 'iranian', 'j-dance', 'j-idol', 'j-pop', 'j-rock', 'jazz', 
  'k-pop', 'kids', 'latin', 'latino', 'malay', 'mandopop', 'metal', 'metal-misc', 
  'metalcore', 'minimal-techno', 'movies', 'mpb', 'new-age', 'new-release', 
  'opera', 'pagode', 'party', 'philippines-opm', 'piano', 'pop', 'pop-film', 
  'post-dubstep', 'power-pop', 'progressive-house', 'psych-rock', 'punk', 
  'punk-rock', 'r-n-b', 'rainy-day', 'reggae', 'reggaeton', 'road-trip', 'rock', 
  'rock-n-roll', 'rockabilly', 'romance', 'sad', 'salsa', 'samba', 'sertanejo', 
  'show-tunes', 'singer-songwriter', 'ska', 'sleep', 'songwriter', 'soul', 
  'soundtracks', 'spanish', 'study', 'summer', 'swedish', 'synth-pop', 'tango', 
  'techno', 'trance', 'trip-hop', 'turkish', 'work-out', 'world-music'
];

const GenreWidget = ({ onSelectGenres }) => {
  const [selectedGenres, setSelectedGenres] = useState([]);

  const handleGenreSelection = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(item => item !== genre));
    } else {
      if (selectedGenres.length < 5) {
        setSelectedGenres([...selectedGenres, genre]);
      }
    }
    onSelectGenres(selectedGenres);
  };

  return (
    <div className="widget p-4 bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-white">Select Genres</h2>
      <div className="h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        <ul className="space-y-2">
          {genres.map((genre) => (
            <li
              key={genre}
              onClick={() => handleGenreSelection(genre)}
              className={`cursor-pointer p-2 rounded-lg ${selectedGenres.includes(genre) ? 'bg-green-600' : 'bg-gray-600'}`}
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
