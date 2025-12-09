'use client'; 
import { useState, useEffect } from "react";
import axios from "axios";

// función que coge de la api los artistas mas escuchados y te lo muestra
export default function ArtistWidget({ accessToken }) {
  const [artists, setArtists] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);  
  }, []);

  useEffect(() => {
    if (accessToken && isClient) {
      const fetchArtists = async () => {
        try {
          const response = await axios.get("https://api.spotify.com/v1/me/top/artists", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setArtists(response.data.items);
        } catch (error) {
          console.error("Error fetching artists:", error);
        }
      };
      fetchArtists();
    }
  }, [accessToken, isClient]);

  if (!isClient) {
    return null;
  }

  return (
    <div className="widget">
      <ul>
        {artists.length > 0 ? (
          artists.map((artist) => (
            <li key={artist.id}>
              <img src={artist.images[0]?.url} alt={artist.name} width={50} />
              <span>{artist.name}</span>
            </li>
          ))
        ) : (
          <p>Loading artists...</p>
        )}
      </ul>
    </div>
  );
}
