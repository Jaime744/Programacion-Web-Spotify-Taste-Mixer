'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getSpotifyAuthUrl } from '@/lib/auth';
import ArtistWidget from '../components/widgets/ArtistWidget';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Si ya está autenticado, redirigir al dashboard
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = () => {
    // Redirige a la URL de autenticación de Spotify
    window.location.href = getSpotifyAuthUrl();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-sm p-6 bg-green-600 bg-opacity-90 rounded-lg shadow-2xl text-center transform transition duration-500 ease-in-out hover:scale-105">
        <h1 className="text-5xl font-bold mb-6 tracking-wide">Spotify Taste Mixer</h1>
        
        {!isAuthenticated() ? (
          <div className="space-y-4">
            <button
              onClick={handleLogin}
              className="w-full py-3 bg-green-700 text-white font-semibold rounded-lg text-xl transition duration-300 ease-in-out transform hover:bg-green-800 hover:scale-105"
            >
              Login with Spotify
            </button>
            <p className="text-gray-200 text-sm">Connect with your Spotify account to create personalized playlists!</p>
          </div>
        ) : (
          <div className="mt-6">
            <ArtistWidget />
          </div>
        )}
      </div>
    </div>
  );
}
