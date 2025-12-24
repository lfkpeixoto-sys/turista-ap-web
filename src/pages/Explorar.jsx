import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { FaStar, FaHeart } from "react-icons/fa";
import "leaflet/dist/leaflet.css";
import "../styles/explorar.css";

import { toggleFavorite, isFavorite } from "../services/favoritesStore";
import { recordSearch, recordMapOpen } from "../services/rewardsStore";

const CATEGORIES = [
  "Todos",
  "Restaurantes",
  "Museus",
  "Parques",
  "Praias",
  "Monumentos",
  "Shopping",
  "Bares",
  "Cafés",
];

const CITIES = [
  {
    name: "Rio de Janeiro",
    country: "BR",
    img: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1200&q=60",
    lat: -22.9068,
    lng: -43.1729,
    rating: 4.5,
    tags: ["Praias", "Monumentos", "Bares"],
  },
  {
    name: "São Paulo",
    country: "BR",
    img: "https://images.unsplash.com/photo-1599946347371-68eb71b16afc?auto=format&fit=crop&w=1200&q=60",
    lat: -23.5505,
    lng: -46.6333,
    rating: 4.2,
    tags: ["Museus", "Shopping", "Restaurantes"],
  },
  {
    name: "Salvador",
    country: "BR",
    img: "https://images.unsplash.com/photo-1611691543541-6b6f35f5f4d1?auto=format&fit=crop&w=1200&q=60",
    lat: -12.9777,
    lng: -38.5016,
    rating: 4.0,
    tags: ["Praias", "Bares", "Monumentos"],
  },
  {
    name: "Paris",
    country: "FR",
    img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=60",
    lat: 48.8566,
    lng: 2.3522,
    rating: 4.8,
    tags: ["Museus", "Cafés", "Monumentos"],
  },
  {
    name: "New York",
    country: "US",
    img: "https://images.unsplash.com/photo-1546436836-07a91091f160?auto=format&fit=crop&w=1200&q=60",
    lat: 40.7128,
    lng: -74.006,
    rating: 4.7,
    tags: ["Shopping", "Parques", "Restaurantes"],
  },
  {
    name: "Tokyo",
    country: "JP",
    img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=60",
    lat: 35.6895,
    lng: 139.6917,
    rating: 4.9,
    tags: ["Restaurantes", "Shopping", "Parques"],
  },
];

export default function Explorar() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [view, setView] = useState("grid"); // grid | map
  const [map, setMap] = useState(null);

  const [category, setCategory] = useState("Todos");
  const [cityFilter, setCityFilter] = useState("Todas as Cidades");

  // ✅ estado local só pra re-render quando favoritar/desfavoritar
  const [favVersion, setFavVersion] = useState(0);

  const allCitiesOptions = useMemo(() => {
    const names = [...new Set(CITIES.map((c) => c.name))];
    return ["Todas as Cidades", ...names];
  }, []);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();

    return CITIES.filter((c) => {
      const matchSearch =
        !s ||
        c.name.toLowerCase().includes(s) ||
        c.country.toLowerCase().includes(s);

      const matchCity =
        cityFilter === "Todas as Cidades" || c.name === cityFilter;

      const matchCategory =
        category === "Todos" || (c.tags && c.tags.includes(category));

      return matchSearch && matchCity && matchCategory;
    });
  }, [search, category, cityFilter]);

  // ✅ Pontuar busca (com debounce)
  useEffect(() => {
    if (!search.trim()) return;
    const t = setTimeout(() => recordSearch(), 700);
    return () => clearTimeout(t);
  }, [search]);

  // ✅ Ajustar bounds do mapa quando está em view=map
  useEffect(() => {
    if (!map || filtered.length === 0 || view !== "map") return;
    const bounds = L.latLngBounds(filtered.map((c) => [c.lat, c.lng]));
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [map, filtered, view]);

  function onHeartClick(city, e) {
    e.preventDefault();
    e.stopPropagation();

    toggleFavorite({
      id: city.name, // id estável
      title: city.name,
      subtitle: city.country,
      img: city.img,
      meta: {
        rating: city.rating,
        tags: city.tags,
        lat: city.lat,
        lng: city.lng,
      },
    });

    // força re-render pra atualizar o coração na hora
    setFavVersion((v) => v + 1);
  }

  function goMap() {
    setView("map");
    recordMapOpen();
  }

  return (
    <div className="explore">
      <header className="explore-head">
        <h1 className="explore-title">
          Explore <span>Destinos</span>
        </h1>
        <p>Descubra destinos incríveis pelo mundo</p>
      </header>

      <div className="explore-toolbar">
        <div className="searchbox">
          <span className="searchicon">🔎</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar lugares, cidades..."
          />
        </div>

        <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
          {allCitiesOptions.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>

        <div className="view-toggle">
          <button
            className={view === "grid" ? "active" : ""}
            onClick={() => setView("grid")}
            type="button"
          >
            Grade
          </button>

          <button
            className={view === "map" ? "active" : ""}
            onClick={goMap}
            type="button"
          >
            Mapa
          </button>
        </div>
      </div>

      <div className="chips">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={category === c ? "chip active" : "chip"}
          >
            {c}
          </button>
        ))}
      </div>

      {view === "map" && (
        <div className="map-wrap">
          <MapContainer center={[0, 0]} zoom={2} whenCreated={setMap}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {filtered.map((city) => (
              <Marker key={city.name} position={[city.lat, city.lng]}>
                <Popup>{city.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}

      {view === "grid" && (
        <div className="grid">
          {filtered.map((city) => {
            const fav = isFavorite(city.name); // ✅ usa store
            void favVersion; // ✅ só pra garantir re-render quando mudar

            return (
              <div
                key={city.name}
                className="card"
                onClick={() => navigate(`/cidade/${encodeURIComponent(city.name)}`)}
              >
                <img src={city.img} alt={city.name} />

                <button
                  className={"fav" + (fav ? " on" : "")}
                  onClick={(e) => onHeartClick(city, e)}
                  type="button"
                  aria-label={fav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                  title={fav ? "Favorito" : "Favoritar"}
                >
                  <FaHeart />
                </button>

                <div className="card-bottom">
                  <div className="card-name">{city.name}</div>
                  <div className="card-sub">{city.country}</div>

                  <div className="badge">
                    <FaStar /> {city.rating}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
