'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header({ accessToken }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Obtener datos del usuario autenticado desde la API de Spotify
  useEffect(() => {
    const fetchUser = async () => {
      if (accessToken) {
        try {
          const response = await fetch('https://api.spotify.com/v1/me', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          const data = await response.json();
          setUser(data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUser();
  }, [accessToken]);

  // Función para hacer logout
  const handleLogout = () => {
    // Limpiar el token de acceso
    localStorage.removeItem('spotify_token');
    // Redirigir al inicio
    router.push('/');
  };

  return (
    <header className="p-4 bg-gray-900 text-white flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h1 className="text-3xl font-bold">Spotify-Taste-Mixer</h1>
      </div>
      {user && (
        <div className="flex items-center space-x-4">
          <img
            src={user.images[0]?.url}
            alt="User Avatar"
            className="w-10 h-10 rounded-full"
          />
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg"
          >
            Log Out
          </button>
        </div>
      )}
    </header>
  );
}
