import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // CSS obrigatório para o mapa aparecer
import MapBounds from "../components/MapBounds"; // ajuste o caminho se necessário
import "../index.css";
export default function Explorar() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todas");

  const countryCodes = {
    "Brasil": "BR",
    "Estados Unidos": "US",
    "Reino Unido": "UK",
    "França": "FR",
    "Itália": "IT",
    "Alemanha": "DE",
    "Japão": "JP",
    "China": "CN",
    "Canadá": "CA",
    "Austrália": "AU",
    "Portugal": "PT",
    "Países Baixos": "NL",
    "Bélgica": "BE",
    "Hungria": "HU",
    "Grécia": "GR",
    "Rússia": "RU",
    "Turquia": "TR",
    "Tailândia": "TH",
    "Singapura": "SG",
    "África do Sul": "ZA",
    "Argentina": "AR",
    "Chile": "CL",
    "Peru": "PE",
    "Colômbia": "CO",
    "Irlanda": "IE",
  };

  // Categorias
  const categories = ["Todas", "Praia", "Cidade", "Montanha"];

  // Todas as cidades
  const cities = [
  // Brasileiras
  { name: "Rio de Janeiro", country: "Brasil", category: "Praia", img: "https://images.unsplash.com/photo-1505253217523-23b0a07e7dc3?auto=format&fit=crop&w=800&q=80", lat: -22.9068, lng: -43.1729 },
  { name: "São Paulo", country: "Brasil", category: "Cidade", img: "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=800&q=80", lat: -23.5505, lng: -46.6333 },
  { name: "Salvador", country: "Brasil", category: "Praia", img: "https://images.unsplash.com/photo-1501612780327-4504553875a2?auto=format&fit=crop&w=800&q=80", lat: -12.9714, lng: -38.5014 },
  { name: "Fortaleza", country: "Brasil", category: "Praia", img: "https://images.unsplash.com/photo-1582719478179-7c6c96c5ec99?auto=format&fit=crop&w=800&q=80", lat: -3.7172, lng: -38.5434 },
  { name: "Brasília", country: "Brasil", category: "Cidade", img: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&w=800&q=80", lat: -15.7939, lng: -47.8828 },
  { name: "Belo Horizonte", country: "Brasil", category: "Cidade", img: "https://images.unsplash.com/photo-1601758123927-7bc0d3e6fa90?auto=format&fit=crop&w=800&q=80", lat: -19.9167, lng: -43.9345 },
  { name: "Curitiba", country: "Brasil", category: "Cidade", img: "https://images.unsplash.com/photo-1557682250-9e7e1a1b76e1?auto=format&fit=crop&w=800&q=80", lat: -25.4284, lng: -49.2733 },
  { name: "Porto Alegre", country: "Brasil", category: "Cidade", img: "https://images.unsplash.com/photo-1603782951840-4aaee97a82f6?auto=format&fit=crop&w=800&q=80", lat: -30.0346, lng: -51.2177 },
  { name: "Recife", country: "Brasil", category: "Praia", img: "https://images.unsplash.com/photo-1559929282-431a4c4b1c07?auto=format&fit=crop&w=800&q=80", lat: -8.0476, lng: -34.8770 },
  { name: "Manaus", country: "Brasil", category: "Montanha", img: "https://images.unsplash.com/photo-1563720224380-cd3fa863a273?auto=format&fit=crop&w=800&q=80", lat: -3.1190, lng: -60.0217 },
  { name: "Florianópolis", country: "Brasil", category: "Praia", img: "https://images.unsplash.com/photo-1557682250-1f1b6b2d7f9d?auto=format&fit=crop&w=800&q=80", lat: -27.5954, lng: -48.5480 },
  { name: "Natal", country: "Brasil", category: "Praia", img: "https://images.unsplash.com/photo-1563720224380-3472387a2f1a?auto=format&fit=crop&w=800&q=80", lat: -5.7945, lng: -35.2110 },
  { name: "João Pessoa", country: "Brasil", category: "Praia", img: "https://images.unsplash.com/photo-1549924231-2d5f9dbe3a2e?auto=format&fit=crop&w=800&q=80", lat: -7.1153, lng: -34.8610 },

  // Internacionais
  { name: "Nova York", country: "Estados Unidos", category: "Cidade", img: "https://images.unsplash.com/photo-1533106418980-5253c0c2b4f7?auto=format&fit=crop&w=800&q=80", lat: 40.7128, lng: -74.0060 },
  { name: "Los Angeles", country: "Estados Unidos", category: "Praia", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80", lat: 34.0522, lng: -118.2437 },
  { name: "Miami", country: "Estados Unidos", category: "Praia", img: "https://images.unsplash.com/photo-1511732352923-9c75f6f4146f?auto=format&fit=crop&w=800&q=80", lat: 25.7617, lng: -80.1918 },
  { name: "Chicago", country: "Estados Unidos", category: "Cidade", img: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80", lat: 41.8781, lng: -87.6298 },
  { name: "Paris", country: "França", category: "Cidade", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80", lat: 48.8566, lng: 2.3522 },
  { name: "Londres", country: "Reino Unido", category: "Cidade", img: "https://images.unsplash.com/photo-1506976785307-8732a18d3554?auto=format&fit=crop&w=800&q=80", lat: 51.5074, lng: -0.1278 },
  { name: "Tóquio", country: "Japão", category: "Cidade", img: "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=800&q=80", lat: 35.6895, lng: 139.6917 },
  { name: "Lima", country: "Peru", category: "Montanha", img: "https://images.unsplash.com/photo-1573273018310-3472387a2f1a?auto=format&fit=crop&w=800&q=80", lat: -12.0464, lng: -77.0428 },
  { name: "Roma", country: "Itália", category: "Cidade", img: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=800&q=80", lat: 41.9028, lng: 12.4964 },
  { name: "Barcelona", country: "Espanha", category: "Cidade", img: "https://images.unsplash.com/photo-1505842465776-3d9e3c1f67a0?auto=format&fit=crop&w=800&q=80", lat: 41.3851, lng: 2.1734 },
  { name: "Sydney", country: "Austrália", category: "Praia", img: "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=800&q=80", lat: -33.8688, lng: 151.2093 },
  { name: "Berlim", country: "Alemanha", category: "Cidade", img: "https://images.unsplash.com/photo-1508051123996-69f8caf4891b?auto=format&fit=crop&w=800&q=80", lat: 52.5200, lng: 13.4050 },
  { name: "Toronto", country: "Canadá", category: "Cidade", img: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=800&q=80", lat: 43.651070, lng: -79.347015 },
  { name: "Lisboa", country: "Portugal", category: "Cidade", img: "https://images.unsplash.com/photo-1533198140585-9e0f319b4d3e?auto=format&fit=crop&w=800&q=80", lat: 38.7223, lng: -9.1393 },
  { name: "Buenos Aires", country: "Argentina", category: "Cidade", img: "https://images.unsplash.com/photo-1506986945394-3e42796d848d?auto=format&fit=crop&w=800&q=80", lat: -34.6037, lng: -58.3816 },
  { name: "Amsterdã", country: "Países Baixos", category: "Cidade", img: "https://images.unsplash.com/photo-1503437313881-503a91226419?auto=format&fit=crop&w=800&q=80", lat: 52.3676, lng: 4.9041 },
  { name: "Viena", country: "Áustria", category: "Cidade", img: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80", lat: 48.2082, lng: 16.3738 },
  { name: "Praga", country: "República Tcheca", category: "Cidade", img: "https://images.unsplash.com/photo-1501820488142-1a6e4e814f8b?auto=format&fit=crop&w=800&q=80", lat: 50.0755, lng: 14.4378 },
  { name: "Pequim", country: "China", category: "Cidade", img: "https://images.unsplash.com/photo-1533198140567-8e623c1f7d5f?auto=format&fit=crop&w=800&q=80", lat: 39.9042, lng: 116.4074 },
  { name: "Bangkok", country: "Tailândia", category: "Cidade", img: "https://images.unsplash.com/photo-1540206395-68808572332f?auto=format&fit=crop&w=800&q=80", lat: 13.7563, lng: 100.5018 },
  { name: "Singapura", country: "Singapura", category: "Cidade", img: "https://images.unsplash.com/photo-1490593080382-9f9293dba05b?auto=format&fit=crop&w=800&q=80", lat: 1.3521, lng: 103.8198 },
  { name: "Istambul", country: "Turquia", category: "Cidade", img: "https://images.unsplash.com/photo-1518684079-170f9f1fc270?auto=format&fit=crop&w=800&q=80", lat: 41.0082, lng: 28.9784 },
];

    // adicione as outras cidades com a propriedade `category`
;

  // Filtragem por categoria e pesquisa
  const filteredCities = cities.filter(city => {
    const matchesFilter = filter === "Todas" || city.category === filter;
    const matchesSearch =
      city.name.toLowerCase().includes(search.toLowerCase()) ||
      city.country.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="explore-page">
      <h1>Explorar Cidades</h1>

      {/* Filtros */}
      <div className="filters">
        {categories.map(cat => (
          <button
            key={cat}
            className={filter === cat ? "active" : ""}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Pesquisar cidade ou país"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Grid vertical de cidades */}
      <div className="cities-grid">
        {filteredCities.map((city, idx) => (
          <div className="city-card" key={idx}>
            <img src={city.img} alt={city.name} />
            <div className="city-info">
              <h3>{city.name}</h3>
              <p>{countryCodes[city.country] || city.country}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";