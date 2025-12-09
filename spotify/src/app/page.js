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
    <>
      <h1>🎵 Spotify Taste Mixer</h1>
      {!isAuthenticated() ? (
        <button onClick={handleLogin}>Login with Spotify</button>  
      ) : (
        <ArtistWidget />  
      )}
    </>
  );
}

