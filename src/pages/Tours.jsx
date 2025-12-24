import { useMemo, useState } from "react";
import {
  FaStar,
  FaRegHeart,
  FaHeart,
  FaSearch,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";
import "../styles/tours.css";
import { toggleFavorite, isFavorite } from "../services/favoritesStore";

const CATEGORIES = [
  "Todos",
  "Tours Guiados",
  "Atividades",
  "Experiências",
  "Workshops",
  "Excursões",
  "Shows",
];

const DATA = [
  {
    id: 1,
    title: "Ópera no Teatro Amazonas",
    city: "Manaus",
    uf: "AM",
    category: "Shows",
    difficulty: "fácil",
    rating: 5.0,
    priceFrom: 65,
    duration: "2h",
    highlight: true,
    tags: ["Cultura", "Noite"],
    image:
      "https://images.unsplash.com/photo-1507924538820-ede94a04019d?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: 2,
    title: "Menu Degustação (Experiência Gastronômica)",
    city: "São Paulo",
    uf: "SP",
    category: "Experiências",
    difficulty: "médio",
    rating: 4.9,
    priceFrom: 220,
    duration: "3h",
    highlight: true,
    tags: ["Gastronomia", "Premium"],
    image:
      "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: 3,
    title: "Tour Cultural no Pelourinho",
    city: "Salvador",
    uf: "BA",
    category: "Tours Guiados",
    difficulty: "fácil",
    rating: 4.8,
    priceFrom: 55,
    duration: "2h",
    highlight: true,
    tags: ["História", "Centro"],
    image:
      "https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: 4,
    title: "Passeio de Barco (Pôr do Sol)",
    city: "Rio de Janeiro",
    uf: "RJ",
    category: "Atividades",
    difficulty: "fácil",
    rating: 4.7,
    priceFrom: 90,
    duration: "1h30",
    highlight: false,
    tags: ["Mar", "Romântico"],
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: 5,
    title: "Trilha + Mirante (Amanhecer)",
    city: "Florianópolis",
    uf: "SC",
    category: "Excursões",
    difficulty: "difícil",
    rating: 4.6,
    priceFrom: 80,
    duration: "4h",
    highlight: false,
    tags: ["Natureza", "Aventura"],
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: 6,
    title: "Workshop de Fotografia Urbana",
    city: "Curitiba",
    uf: "PR",
    category: "Workshops",
    difficulty: "médio",
    rating: 4.5,
    priceFrom: 70,
    duration: "3h",
    highlight: false,
    tags: ["Criativo", "Cidade"],
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: 7,
    title: "Passeio Histórico no Centro Antigo",
    city: "Recife",
    uf: "PE",
    category: "Tours Guiados",
    difficulty: "fácil",
    rating: 4.4,
    priceFrom: 45,
    duration: "2h",
    highlight: false,
    tags: ["História", "Arte"],
    image:
      "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=1200&q=60",
  },
  {
    id: 8,
    title: "Noite de Samba (Casa de Show)",
    city: "Rio de Janeiro",
    uf: "RJ",
    category: "Shows",
    difficulty: "fácil",
    rating: 4.7,
    priceFrom: 60,
    duration: "3h",
    highlight: true,
    tags: ["Música", "Noite"],
    image:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=60",
  },
];

function formatBRL(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function Tours() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [city, setCity] = useState("Todas");
  const [bookedToday, setBookedToday] = useState(0);

  // ✅ força re-render quando favoritar/desfavoritar
  const [favTick, setFavTick] = useState(0);

  const cities = useMemo(() => {
    const unique = Array.from(new Set(DATA.map((i) => i.city))).sort((a, b) =>
      a.localeCompare(b)
    );
    return ["Todas", ...unique];
  }, []);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();

    return DATA.filter((item) => {
      const matchCategory =
        activeCategory === "Todos" ? true : item.category === activeCategory;
      const matchCity = city === "Todas" ? true : item.city === city;
      const matchSearch =
        s.length === 0
          ? true
          : `${item.title} ${item.city} ${item.uf} ${item.category} ${item.tags.join(
              " "
            )}`
              .toLowerCase()
              .includes(s);

      return matchCategory && matchCity && matchSearch;
    });
  }, [search, activeCategory, city]);

  const topRated = useMemo(() => Math.max(...DATA.map((i) => i.rating)), []);
  const minPrice = useMemo(() => Math.min(...DATA.map((i) => i.priceFrom)), []);

  const bestRatedSection = useMemo(() => {
    return [...DATA].sort((a, b) => b.rating - a.rating).slice(0, 6);
  }, []);

  function onHeartClick(item, e) {
    e?.stopPropagation?.();

    const favId = `tour-${item.id}`;

    toggleFavorite({
      id: favId,
      title: item.title,
      subtitle: `${item.city}/${item.uf}`,
      img: item.image,
      meta: {
        category: item.category,
        duration: item.duration,
        priceFrom: item.priceFrom,
      },
    });

    setFavTick((v) => v + 1); // ✅ atualiza ícone na hora
  }

  function reserveTour(item) {
    setBookedToday((v) => v + 1);
    alert(
      `Reserva simulada ✅\n\n${item.title} — ${item.city}/${item.uf}\nA partir de ${formatBRL(
        item.priceFrom
      )}`
    );
  }

  return (
    <div className="toursPage">
      <div className="toursHeader">
        <h1 className="toursTitle">
          Tours & <span>Atividades</span>
        </h1>
        <p className="toursSubtitle">
          Reserve experiências inesquecíveis nos melhores destinos
        </p>
      </div>

      <div className="toursStats">
        <div className="statCard">
          <div className="statTop">
            <span className="statDot orange" />
            <span className="statLabel">Total de Tours</span>
          </div>
          <div className="statValue">{DATA.length}</div>
        </div>

        <div className="statCard">
          <div className="statTop">
            <span className="statDot blue" />
            <span className="statLabel">Reservas Hoje</span>
          </div>
          <div className="statValue">{bookedToday}</div>
        </div>

        <div className="statCard">
          <div className="statTop">
            <span className="statDot green" />
            <span className="statLabel">Melhor Avaliado</span>
          </div>
          <div className="statValue">
            {topRated.toFixed(1)} <FaStar className="starIcon" />
          </div>
        </div>

        <div className="statCard">
          <div className="statTop">
            <span className="statDot purple" />
            <span className="statLabel">A partir de</span>
          </div>
          <div className="statValue">{formatBRL(minPrice)}</div>
        </div>
      </div>

      <div className="toursControls">
        <div className="searchWrap">
          <FaSearch className="searchIcon" />
          <input
            className="searchInput"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar tours, atividades, shows..."
          />
        </div>

        <div className="cityWrap">
          <FaMapMarkerAlt className="cityIcon" />
          <select
            className="citySelect"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="toursTabs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`tabBtn ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
            type="button"
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="sectionTitle">
        <h2>Mais Bem Avaliados</h2>
      </div>

      <div className="cardsGrid">
        {bestRatedSection.map((item) => {
          const favId = `tour-${item.id}`;
          const fav = isFavorite(favId);

          return (
            <div key={item.id} className="tourCard">
              <div className="cardImage">
                <img src={item.image} alt={item.title} />
                <div className="badgesTop">
                  <span className="badge soft">
                    {item.category.slice(0, -1) || item.category}
                  </span>
                  <span className="badge soft">{item.difficulty}</span>
                </div>

                {item.highlight && (
                  <span className="badge highlight">⭐ Destaque</span>
                )}

                <button
                  className="favBtn"
                  onClick={(e) => onHeartClick(item, e)}
                  aria-label="Favoritar"
                  type="button"
                >
                  {fav ? <FaHeart /> : <FaRegHeart />}
                </button>
              </div>

              <div className="cardBody">
                <div className="cardMeta">
                  <span className="place">
                    {item.city}/{item.uf}
                  </span>
                  <span className="rating">
                    <FaStar /> {item.rating.toFixed(1)}
                  </span>
                </div>

                <h3 className="cardTitle">{item.title}</h3>

                <div className="cardInfo">
                  <span className="infoItem">
                    <FaClock /> {item.duration}
                  </span>
                  <span className="priceFrom">
                    A partir de {formatBRL(item.priceFrom)}
                  </span>
                </div>

                <div className="tagsRow">
                  {item.tags.slice(0, 3).map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>

                <button
                  className="reserveBtn"
                  onClick={() => reserveTour(item)}
                  type="button"
                >
                  Reservar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="sectionTitle">
        <h2>Resultados</h2>
        <span className="muted">{filtered.length} opções</span>
      </div>

      <div className="cardsGrid">
        {filtered.map((item) => {
          const favId = `tour-${item.id}`;
          const fav = isFavorite(favId);

          return (
            <div key={item.id} className="tourCard">
              <div className="cardImage">
                <img src={item.image} alt={item.title} />
                <div className="badgesTop">
                  <span className="badge soft">
                    {item.category.slice(0, -1) || item.category}
                  </span>
                  <span className="badge soft">{item.difficulty}</span>
                </div>

                {item.highlight && (
                  <span className="badge highlight">⭐ Destaque</span>
                )}

                <button
                  className="favBtn"
                  onClick={(e) => onHeartClick(item, e)}
                  aria-label="Favoritar"
                  type="button"
                >
                  {fav ? <FaHeart /> : <FaRegHeart />}
                </button>
              </div>

              <div className="cardBody">
                <div className="cardMeta">
                  <span className="place">
                    {item.city}/{item.uf}
                  </span>
                  <span className="rating">
                    <FaStar /> {item.rating.toFixed(1)}
                  </span>
                </div>

                <h3 className="cardTitle">{item.title}</h3>

                <div className="cardInfo">
                  <span className="infoItem">
                    <FaClock /> {item.duration}
                  </span>
                  <span className="priceFrom">
                    A partir de {formatBRL(item.priceFrom)}
                  </span>
                </div>

                <div className="tagsRow">
                  {item.tags.slice(0, 3).map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>

                <button
                  className="reserveBtn"
                  onClick={() => reserveTour(item)}
                  type="button"
                >
                  Reservar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* só pra não ficar “unused” em alguns lints */}
      <span style={{ display: "none" }}>{favTick}</span>
    </div>
  );
}
