import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { FaStar, FaHeart } from "react-icons/fa";
import "../index.css";
import "leaflet/dist/leaflet.css";

export default function Explorar() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [map, setMap] = useState(null);
  const cities = [
    // Cidades do Brasil
    { name: "Rio de Janeiro", country: "BR", img: "https://source.unsplash.com/400x300/?rio", lat: -22.9068, lng: -43.1729, rating: 4.5 },
    { name: "São Paulo", country: "BR", img: "https://source.unsplash.com/400x300/?saopaulo", lat: -23.5505, lng: -46.6333, rating: 4.2 },
    { name: "Salvador", country: "BR", img: "https://source.unsplash.com/400x300/?salvador", lat: -12.9777, lng: -38.5016, rating: 4.0 },
    { name: "Brasília", country: "BR", img: "https://source.unsplash.com/400x300/?brasilia", lat: -15.7939, lng: -47.8828, rating: 4.1 },
    { name: "Fortaleza", country: "BR", img: "https://source.unsplash.com/400x300/?fortaleza", lat: -3.7172, lng: -38.5431, rating: 4.0 },
    { name: "Recife", country: "BR", img: "https://source.unsplash.com/400x300/?recife", lat: -8.0476, lng: -34.877, rating: 4.1 },
    { name: "Curitiba", country: "BR", img: "https://source.unsplash.com/400x300/?curitiba", lat: -25.4284, lng: -49.2733, rating: 4.2 },
    { name: "Porto Alegre", country: "BR", img: "https://source.unsplash.com/400x300/?portoalegre", lat: -30.0346, lng: -51.2177, rating: 4.0 },
    { name: "Belo Horizonte", country: "BR", img: "https://source.unsplash.com/400x300/?belohorizonte", lat: -19.9167, lng: -43.9345, rating: 4.1 },
    { name: "Manaus", country: "BR", img: "https://source.unsplash.com/400x300/?manaus", lat: -3.1190, lng: -60.0217, rating: 4.0 },

    // Cidades internacionais
    { name: "Paris", country: "FR", img: "https://source.unsplash.com/400x300/?paris", lat: 48.8566, lng: 2.3522, rating: 4.8 },
    { name: "London", country: "UK", img: "https://source.unsplash.com/400x300/?london", lat: 51.5074, lng: -0.1278, rating: 4.6 },
    { name: "New York", country: "US", img: "https://source.unsplash.com/400x300/?newyork", lat: 40.7128, lng: -74.006, rating: 4.7 },
    { name: "Tokyo", country: "JP", img: "https://source.unsplash.com/400x300/?tokyo", lat: 35.6895, lng: 139.6917, rating: 4.9 },
    { name: "Barcelona", country: "ES", img: "https://source.unsplash.com/400x300/?barcelona", lat: 41.3851, lng: 2.1734, rating: 4.4 },
    { name: "Buenos Aires", country: "AR", img: "https://source.unsplash.com/400x300/?buenosaires", lat: -34.6037, lng: -58.3816, rating: 4.3 },
    { name: "Lisboa", country: "PT", img: "https://source.unsplash.com/400x300/?lisbon", lat: 38.7169, lng: -9.139, rating: 4.5 },
    { name: "Roma", country: "IT", img: "https://source.unsplash.com/400x300/?rome", lat: 41.9028, lng: 12.4964, rating: 4.5 },
    { name: "Amsterdã", country: "NL", img: "https://source.unsplash.com/400x300/?amsterdam", lat: 52.3676, lng: 4.9041, rating: 4.4 },
    { name: "Berlim", country: "DE", img: "https://source.unsplash.com/400x300/?berlin", lat: 52.52, lng: 13.405, rating: 4.3 },
    { name: "Cidade do Cabo", country: "ZA", img: "https://source.unsplash.com/400x300/?capetown", lat: -33.9249, lng: 18.4241, rating: 4.2 },
    { name: "Sydney", country: "AU", img: "https://source.unsplash.com/400x300/?sydney", lat: -33.8688, lng: 151.2093, rating: 4.6 },
    { name: "Moscou", country: "RU", img: "https://source.unsplash.com/400x300/?moscow", lat: 55.7558, lng: 37.6173, rating: 4.5 },
    { name: "Dubai", country: "AE", img: "https://source.unsplash.com/400x300/?dubai", lat: 25.2048, lng: 55.2708, rating: 4.7 },
  ];

  const filteredCities = cities.filter(
    city =>
      city.name.toLowerCase().includes(search.toLowerCase()) ||
      city.country.toLowerCase().includes(search.toLowerCase())
  );

  const handleCityClick = (cityName) => {
    navigate(`/cidade/${encodeURIComponent(cityName)}`);
  };

  const toggleFavorite = (cityName, e) => {
    e.stopPropagation();
    setFavorites(prev =>
      prev.includes(cityName) ? prev.filter(f => f !== cityName) : [...prev, cityName]
    );
  };

  useEffect(() => {
    if (!map || filteredCities.length === 0) return;
    const bounds = L.latLngBounds(filteredCities.map(c => [c.lat, c.lng]));
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [map, filteredCities]);

  return (
    <div className="page explorar-page">
      <h1>Explorar Cidades</h1>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Pesquisar cidade ou país..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: "50%", padding: "8px" }}
        />
        <button onClick={() => setShowMap(prev => !prev)}>Mostrar Mapa</button>
      </div>

      {showMap && (
        <div style={{ height: "400px", marginBottom: "20px" }}>
          <MapContainer center={[0, 0]} zoom={2} whenCreated={setMap} style={{ width: "100%", height: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {filteredCities.map(city => (
              <Marker key={city.name} position={[city.lat, city.lng]}>
                <Popup>{city.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
        {filteredCities.map(city => (
          <div
            key={city.name}
            className="city-card"
            onClick={() => handleCityClick(city.name)}
            style={{ position: "relative", cursor: "pointer", borderRadius: "8px", overflow: "hidden", border: "1px solid #ccc" }}
          >
            <FaHeart
              onClick={(e) => toggleFavorite(city.name, e)}
              style={{ position: "absolute", top: "10px", right: "10px", fontSize: "24px", color: favorites.includes(city.name) ? "red" : "white", zIndex: 10 }}
            />
            <img src={city.img} alt={city.name} style={{ width: "100%", height: "150px", objectFit: "cover" }} />
            <div style={{ position: "absolute", bottom: "40px", left: "10px", backgroundColor: "rgba(0,0,0,0.5)", color: "white", padding: "2px 6px", borderRadius: "4px" }}>
              <h2 style={{ margin: 0, fontSize: "16px" }}>{city.name}</h2>
              <p style={{ margin: 0, fontSize: "12px" }}>{city.country}</p>
            </div>
            <div style={{ position: "absolute", bottom: "10px", left: "10px", backgroundColor: "rgba(0,0,0,0.6)", color: "white", padding: "2px 6px", borderRadius: "4px", fontSize: "14px", display: "flex", alignItems: "center" }}>
              <FaStar style={{ color: "gold", marginRight: "4px" }} /> {city.rating}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}