'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import { getAccessToken, isAuthenticated } from '../../lib/auth';

import ArtistWidget from '../../components/widgets/ArtistWidget';
import ArtistSearchWidget from '../../components/widgets/ArtistSearchwidget';
import DecadeWidget from '../../components/widgets/DecadeWidget';
import GenreWidget from '../../components/widgets/GenreWidget';
import TrackWidget from '../../components/widgets/TrackWidget';
import MoodWidget from '../../components/widgets/MoodWidget';
import PopularityWidget from '../../components/widgets/PopularityWidget';
import DisplaySongs from '../../components/widgets/DisplaySongs';

export default function Dashboard() {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState(null);

  const [artists, setArtists] = useState([]);
  const [genres, setGenres] = useState([]);
  const [decades, setDecades] = useState([]);
  const [popularity, setPopularity] = useState({ min: 50, max: 100 });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/');
      return;
    }
    setAccessToken(getAccessToken());
  }, [router]);

  if (!accessToken) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-neutral-700 border-t-emerald-500" />
          <p className="mt-4 text-sm text-neutral-200">Cargando…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Header accessToken={accessToken} />

      <div className="mx-auto w-full max-w-6xl p-6">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="mt-1 text-sm text-neutral-400">
            Selecciona tus preferencias y mira una lista de canciones.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4">
            <ArtistWidget accessToken={accessToken} onSelectArtists={setArtists} />
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4">
            <ArtistSearchWidget accessToken={accessToken} onSelectArtists={setArtists} />
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4">
            <DecadeWidget accessToken={accessToken} onSelectDecade={(d) => setDecades(d ? [d] : [])} />
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4">
            <GenreWidget onSelectGenres={setGenres} />
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4">
            <PopularityWidget value={popularity} onChange={setPopularity} />
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4">
            <TrackWidget accessToken={accessToken} />
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4 lg:col-span-3">
            <MoodWidget accessToken={accessToken} />
          </div>
        </div>

        <div className="mt-6">
          <DisplaySongs
            accessToken={accessToken}
            artists={artists}
            genres={genres}
            decades={decades}
            minPopularity={popularity.min}
            maxPopularity={popularity.max}
          />
        </div>
      </div>
    </div>
  );
}
