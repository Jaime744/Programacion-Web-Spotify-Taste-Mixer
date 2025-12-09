'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';  
import ArtistWidget from '../../components/widgets/ArtistWidget';  


export default function Dashboard() {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    // Si no está autenticado, redirigir al login
    if (!isAuthenticated()) {
      router.push('/');  
    } else {
      const token = localStorage.getItem('spotify_token');
      setAccessToken(token);  
    }
  }, [router]);

  if (!accessToken) {
    return <div>Loading...</div>;  
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <ArtistWidget accessToken={accessToken} />
      
    </div>
  );
}
