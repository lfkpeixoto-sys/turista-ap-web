import { useParams, Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { FaHeart, FaStar } from "react-icons/fa";
import { useState, useEffect } from "react";
import "../index.css";
import "leaflet/dist/leaflet.css";

export default function CityPage() {
  const { cityName } = useParams();
  const [city, setCity] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  // Lista de cidades com coordenadas, rating e país
  const cities = [
    { name: "Rio de Janeiro", country: "BR", lat: -22.9068, lng: -43.1729, rating: 4.5 },
    { name: "São Paulo", country: "BR", lat: -23.5505, lng: -46.6333, rating: 4.2 },
    { name: "Salvador", country: "BR", lat: -12.9777, lng: -38.5016, rating: 4.0 },
    { name: "Brasília", country: "BR", lat: -15.7939, lng: -47.8828, rating: 4.1 },
    { name: "Fortaleza", country: "BR", lat: -3.7172, lng: -38.5431, rating: 4.0 },
    { name: "Recife", country: "BR", lat: -8.0476, lng: -34.877, rating: 4.1 },
    { name: "Curitiba", country: "BR", lat: -25.4284, lng: -49.2733, rating: 4.2 },
    { name: "Porto Alegre", country: "BR", lat: -30.0346, lng: -51.2177, rating: 4.0 },
    { name: "Belo Horizonte", country: "BR", lat: -19.9167, lng: -43.9345, rating: 4.1 },
    { name: "Manaus", country: "BR", lat: -3.1190, lng: -60.0217, rating: 4.0 },
    { name: "Paris", country: "FR", lat: 48.8566, lng: 2.3522, rating: 4.8 },
    { name: "London", country: "UK", lat: 51.5074, lng: -0.1278, rating: 4.6 },
    { name: "New York", country: "US", lat: 40.7128, lng: -74.006, rating: 4.7 },
    { name: "Tokyo", country: "JP", lat: 35.6895, lng: 139.6917, rating: 4.9 },
    { name: "Barcelona", country: "ES", lat: 41.3851, lng: 2.1734, rating: 4.4 },
    { name: "Buenos Aires", country: "AR", lat: -34.6037, lng: -58.3816, rating: 4.3 },
    { name: "Lisboa", country: "PT", lat: 38.7169, lng: -9.139, rating: 4.5 },
    { name: "Roma", country: "IT", lat: 41.9028, lng: 12.4964, rating: 4.5 },
    { name: "Amsterdã", country: "NL", lat: 52.3676, lng: 4.9041, rating: 4.4 },
    { name: "Berlim", country: "DE", lat: 52.52, lng: 13.405, rating: 4.3 },
    { name: "Cidade do Cabo", country: "ZA", lat: -33.9249, lng: 18.4241, rating: 4.2 },
    { name: "Sydney", country: "AU", lat: -33.8688, lng: 151.2093, rating: 4.6 },
    { name: "Moscou", country: "RU", lat: 55.7558, lng: 37.6173, rating: 4.5 },
    { name: "Dubai", country: "AE", lat: 25.2048, lng: 55.2708, rating: 4.7 },
  ];

  // Atrações por cidade com coordenadas
  const cityAttractions = {
    "Rio de Janeiro": [
      { name: "Cristo Redentor", lat: -22.9519, lng: -43.2105 },
      { name: "Pão de Açúcar", lat: -22.9486, lng: -43.1566 },
      { name: "Copacabana", lat: -22.9711, lng: -43.1822 },
      { name: "Ipanema", lat: -22.9839, lng: -43.2047 },
      { name: "Jardim Botânico", lat: -22.9656, lng: -43.2245 },
    ],
    "São Paulo": [
      { name: "Avenida Paulista", lat: -23.5617, lng: -46.6551 },
      { name: "Parque do Ibirapuera", lat: -23.5874, lng: -46.6576 },
      { name: "Mercadão", lat: -23.5411, lng: -46.6319 },
    ],
    "Salvador": [
      { name: "Pelourinho", lat: -12.9714, lng: -38.5108 },
      { name: "Elevador Lacerda", lat: -12.9731, lng: -38.5104 },
    ],
    "Brasília": [
      { name: "Congresso Nacional", lat: -15.7990, lng: -47.8648 },
      { name: "Catedral de Brasília", lat: -15.7942, lng: -47.8822 },
    ],
    "Fortaleza": [
      { name: "Praia do Futuro", lat: -3.7184, lng: -38.4667 },
      { name: "Centro Dragão do Mar", lat: -3.7312, lng: -38.5267 },
    ],
    "Paris": [
      { name: "Torre Eiffel", lat: 48.8584, lng: 2.2945 },
      { name: "Louvre", lat: 48.8606, lng: 2.3376 },
    ],
    "New York": [
      { name: "Central Park", lat: 40.7851, lng: -73.9683 },
      { name: "Times Square", lat: 40.7580, lng: -73.9855 },
    ],
    // Adicione mais atrações para cada cidade conforme desejar
  };

  useEffect(() => {
    const foundCity = cities.find(c => c.name === decodeURIComponent(cityName));
    setCity(foundCity);
  }, [cityName]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = () => {
    if (!city) return;
    setFavorites(prev =>
      prev.includes(city.name)
        ? prev.filter(f => f !== city.name)
        : [...prev, city.name]
    );
  };

  if (!city) return <p>Carregando cidade...</p>;

  const attractions = cityAttractions[city.name] || [];

  return (
    <div className="page city-page">
      <h1>{city.name} - {city.country}</h1>

      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
        <FaStar style={{ color: "gold", fontSize: "20px" }} />
        <span>{city.rating}</span>
        <FaHeart
          onClick={toggleFavorite}
          style={{
            color: favorites.includes(city.name) ? "red" : "gray",
            fontSize: "28px",
            cursor: "pointer",
            marginLeft: "auto"
          }}
        />
      </div>

      <MapContainer
        center={[city.lat, city.lng]}
        zoom={12}
        style={{ height: "400px", marginBottom: "20px" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[city.lat, city.lng]}>
          <Popup>{city.name}</Popup>
        </Marker>
        {attractions.map(a => (
          <Marker key={a.name} position={[a.lat, a.lng]}>
            <Popup>{a.name}</Popup>
          </Marker>
        ))}
      </MapContainer>

      <h2>Atrações:</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "10px" }}>
        {attractions.map(a => (
          <div key={a.name} style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "8px", backgroundColor: "#f9f9f9" }}>
            {a.name}
          </div>
        ))}
      </div>

      <Link to="/" className="button button-green" style={{ marginTop: "20px", display: "inline-block" }}>
        Voltar
      </Link>
    </div>
  );
}
