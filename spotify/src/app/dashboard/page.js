'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth'; 
import ArtistWidget from '../../components/Widgets/ArtistWidget';
import DecadeWidget from '../../components/widgets/DecadeWidget';
import GenreWidget from '../../components/widgets/GenreWidget';
import TrackWidget from '../../components/widgets/TrackWidget';
import ArtistSearchWidget from '..//components/widgets/ArtistSearchwidget';
  
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
    <div className="dashboard-container">
      <div className="widget">
        <ArtistWidget accessToken={accessToken} />
      </div>
      <div className="widget">
        <ArtistSearchWidget accessToken={accessToken} />
      </div>
      <div className="widget">
        <DecadeWidget accessToken={accessToken} />
      </div>
      <div className="widget">
        <GenreWidget accessToken={accessToken} />
      </div>
      <div className="widget">
        <TrackWidget accessToken={accessToken} />
      </div>
    </div>
  );
}
