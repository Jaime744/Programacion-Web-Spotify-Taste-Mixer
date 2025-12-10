'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import { isAuthenticated } from '@/lib/auth';
import ArtistWidget from '../../components/Widgets/ArtistWidget';
import DecadeWidget from '../../components/widgets/DecadeWidget';
import GenreWidget from '../../components/widgets/GenreWidget';
import TrackWidget from '../../components/widgets/TrackWidget';
import ArtistSearchWidget from '../../components/widgets/ArtistSearchwidget';
import MoodWidget from '../../components/widgets/MoodWidget';
import DisplaySongs from '../../components/widgets/DisplaySongs';

export default function Dashboard() {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState(null);
  const [artists, setArtists] = useState([]);
  const [genres, setGenres] = useState([]);
  const [decades, setDecades] = useState([]);

  useEffect(() => {
    // Si no está autenticado, redirigir al login
    if (!isAuthenticated()) {
      router.push('/');  
    } else {
      const token = localStorage.getItem('spotify_token');
      setAccessToken(token);  
    }
  }, [router]);

  // Recoger artistas y géneros de los widgets
  const handleArtistData = (newArtists) => setArtists(newArtists);
  const handleGenreData = (newGenres) => setGenres(newGenres);
  const handleDecadeData = (newDecade) => setDecades([newDecade]); // Pasar solo la década seleccionada como array

  if (!accessToken) {
    return <div className="flex justify-center items-center min-h-screen bg-black text-white">Loading...</div>;  
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Header accessToken={accessToken} />
      <div className="dashboard-container p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="widget p-4 bg-gray-800 rounded-lg shadow-md">
           
            <ArtistWidget accessToken={accessToken} onSelectArtist={handleArtistData} />
          </div>
          <div className="widget p-4 bg-gray-800 rounded-lg shadow-md">
            <ArtistSearchWidget accessToken={accessToken} onSelectArtist={handleArtistData} />
          </div>
          <div className="widget p-4 bg-gray-800 rounded-lg shadow-md">
            <DecadeWidget accessToken={accessToken} onSelectDecade={handleDecadeData} />
          </div>
          <div className="widget p-4 bg-gray-800 rounded-lg shadow-md">
            <GenreWidget accessToken={accessToken} onSelectGenres={handleGenreData} />
          </div>
          <div className="widget p-4 bg-gray-800 rounded-lg shadow-md">
            <TrackWidget accessToken={accessToken} />
          </div>
          <div className="widget2 p-4 bg-gray-800 rounded-lg shadow-md">
            <MoodWidget accessToken={accessToken} />
          </div>
        </div>

        <div className="mt-6">
          <DisplaySongs accessToken={accessToken} artists={artists} genres={genres} decades={decades} />
        </div>
      </div>
    </div>
  );
}
