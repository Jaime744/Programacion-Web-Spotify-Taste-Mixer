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
    <div className="widget">
      <h2>Genres</h2>
      <input
        type="text"
        placeholder="Search genres..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <ul>
        {filteredGenres.map((genre) => (
          <li
            key={genre}
            onClick={() => handleGenreSelection(genre)}
            className={selectedGenres.includes(genre) ? 'selected' : ''}
          >
            {genre}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GenreWidget;
