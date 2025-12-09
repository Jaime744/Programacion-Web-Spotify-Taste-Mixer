import { useState, useEffect } from "react";
import axios from "axios";

// función que coge de la api los artistas mas escuchados y te lo muestra
export default function ArtistWidget({ accessToken }) {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const fetchArtists = async () => {
      const response = await axios.get("https://api.spotify.com/v1/me/top/artists", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setArtists(response.data.items);
    };

    if (accessToken) {
      fetchArtists();
    }
  }, [accessToken]);

  return (
    <div className="widget">
      <h2>Top Artists</h2>
      <ul>
        {artists.map((artist) => (
          <li key={artist.id}>
            <img src={artist.images[0]?.url} alt={artist.name} width={50} />
            <span>{artist.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
