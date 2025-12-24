import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/reservas.css";
import { toggleFavorite, isFavorite } from "../services/favoritesStore";

// Reservas começam vazias (Opção B)
const SUGESTOES = [
  {
    id: "s1",
    title: "Apto charmoso com vista",
    city: "Rio de Janeiro",
    country: "Brasil",
    type: "Apartamento",
    img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=60",
    rating: 4.8,
    priceNight: 320,
    currency: "R$",
    pill: "SUPERHOST",
    tags: ["Praia", "Cidade"],
  },
  {
    id: "s2",
    title: "Casa pé na areia",
    city: "Florianópolis",
    country: "Brasil",
    type: "Casa",
    img: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=60",
    rating: 4.7,
    priceNight: 560,
    currency: "R$",
    pill: "Recomendado",
    tags: ["Praia", "Natureza"],
  },
  {
    id: "s3",
    title: "Hotel boutique no centro",
    city: "Buenos Aires",
    country: "Argentina",
    type: "Hotel",
    img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=60",
    rating: 4.6,
    priceNight: 110,
    currency: "US$",
    pill: "Top da semana",
    tags: ["Cidade"],
  },
  {
    id: "s4",
    title: "Chalé na serra com lareira",
    city: "Campos do Jordão",
    country: "Brasil",
    type: "Casa",
    img: "https://images.unsplash.com/photo-1505691723518-36a5ac3b2a18?auto=format&fit=crop&w=1200&q=60",
    rating: 4.9,
    priceNight: 690,
    currency: "R$",
    pill: "Luxo",
    tags: ["Natureza", "Luxo"],
  },
];

const TABS = ["Todas", "Confirmada", "Em andamento", "Finalizada", "Cancelada"];

function formatDateBR(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y}`;
}

function nightsBetween(checkIn, checkOut) {
  const a = new Date(checkIn);
  const b = new Date(checkOut);
  const ms = b.getTime() - a.getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}

export default function Reservas() {
  const navigate = useNavigate();

  // Opção B: começa zerado
  const [reservas, setReservas] = useState([]);

  // UI state
  const [tab, setTab] = useState("Todas");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Todos");
  const [country, setCountry] = useState("Todos");
  const [type, setType] = useState("Todos");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // categoria para deixar mais divertido
  const CATS = ["Tudo", "Praia", "Cidade", "Natureza", "Luxo"];
  const [cat, setCat] = useState("Tudo");

  // ✅ força re-render quando favoritar/desfavoritar (pra coração atualizar na hora)
  const [favTick, setFavTick] = useState(0);

  // carrossel ref simples (sem useRef)
  const scrollRef = (node) => {
    window.__mrCarousel = node;
  };

  function scrollCarousel(dir) {
    const el = window.__mrCarousel;
    if (!el) return;
    const step = 320;
    el.scrollBy({ left: dir === "left" ? -step : step, behavior: "smooth" });
  }

  // ❤️ Favorito nas sugestões usando store (NÃO navega)
  function onHeartSuggestion(p, e) {
    e?.stopPropagation?.();

    const favId = `stay-${p.id}`;

    toggleFavorite({
      id: favId,
      title: p.title,
      subtitle: `${p.city}, ${p.country} • ${p.type}`,
      img: p.img,
      meta: {
        rating: p.rating,
        priceNight: p.priceNight,
        currency: p.currency,
        tags: p.tags,
        pill: p.pill,
      },
    });

    setFavTick((v) => v + 1); // ✅ atualiza ícone na hora
  }

  const countries = useMemo(() => {
    const list = Array.from(new Set(reservas.map((r) => r.country))).sort();
    return ["Todos", ...list];
  }, [reservas]);

  const types = useMemo(() => {
    const list = Array.from(new Set(reservas.map((r) => r.type))).sort();
    return ["Todos", ...list];
  }, [reservas]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return reservas.filter((r) => {
      const tabOk = tab === "Todas" ? true : r.status === tab;
      const statusOk = status === "Todos" ? true : r.status === status;
      const countryOk = country === "Todos" ? true : r.country === country;
      const typeOk = type === "Todos" ? true : r.type === type;

      const searchOk =
        term.length === 0
          ? true
          : `${r.title} ${r.city} ${r.country} ${r.type}`
              .toLowerCase()
              .includes(term);

      const fromOk = from ? new Date(r.checkIn) >= new Date(from) : true;
      const toOk = to ? new Date(r.checkIn) <= new Date(to) : true;

      return tabOk && statusOk && countryOk && typeOk && searchOk && fromOk && toOk;
    });
  }, [reservas, tab, search, status, country, type, from, to]);

  const stats = useMemo(() => {
    const total = reservas.length;
    const by = (s) => reservas.filter((r) => r.status === s).length;
    return {
      total,
      confirmadas: by("Confirmada"),
      emAndamento: by("Em andamento"),
      finalizadas: by("Finalizada"),
      canceladas: by("Cancelada"),
    };
  }, [reservas]);

  function resetFilters() {
    setSearch("");
    setStatus("Todos");
    setCountry("Todos");
    setType("Todos");
    setFrom("");
    setTo("");
    setTab("Todas");
  }

  function cancelReserva(id) {
    setReservas((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Cancelada" } : r))
    );
  }

  return (
    <div className="mr-page">
      <header className="mr-header">
        <div className="mr-titleWrap">
          <h1 className="mr-title">Minhas Reservas</h1>

          <p className="mr-subtitle">
            Acompanhe suas hospedagens e status — e veja sugestões tipo Airbnb.
          </p>
        </div>

        <div className="mr-stats">
          <div className="mr-stat">
            <span className="mr-statLabel">Total</span>
            <span className="mr-statValue">{stats.total}</span>
          </div>
          <div className="mr-stat">
            <span className="mr-statLabel">Confirmadas</span>
            <span className="mr-statValue">{stats.confirmadas}</span>
          </div>
          <div className="mr-stat">
            <span className="mr-statLabel">Em andamento</span>
            <span className="mr-statValue">{stats.emAndamento}</span>
          </div>
          <div className="mr-stat">
            <span className="mr-statLabel">Finalizadas</span>
            <span className="mr-statValue">{stats.finalizadas}</span>
          </div>
        </div>
      </header>

      <div className="mr-tabs">
        {TABS.map((t) => (
          <button
            key={t}
            className={`mr-tab ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
            type="button"
          >
            {t}
          </button>
        ))}
      </div>

      <section className="mr-filters">
        <div className="mr-search">
          <span className="mr-icon">🔎</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por cidade, país, tipo ou nome do imóvel..."
          />
        </div>

        <div className="mr-filterRow">
          <div className="mr-field">
            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option>Todos</option>
              <option>Confirmada</option>
              <option>Em andamento</option>
              <option>Finalizada</option>
              <option>Cancelada</option>
            </select>
          </div>

          <div className="mr-field">
            <label>País</label>
            <select value={country} onChange={(e) => setCountry(e.target.value)}>
              {countries.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="mr-field">
            <label>Tipo</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              {types.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="mr-field">
            <label>De</label>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>

          <div className="mr-field">
            <label>Até</label>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>

          <div className="mr-actions">
            <button className="mr-btnGhost" onClick={resetFilters} type="button">
              Limpar
            </button>
            <button className="mr-btnPrimary" onClick={() => navigate("/explorar")} type="button">
              Explorar
            </button>
          </div>
        </div>
      </section>

      {/* SUGESTÕES (AIRBNB STYLE) */}
      <section className="mr-suggestions">
        <div className="mr-sugHeader">
          <div>
            <h2 className="mr-sectionTitle">Sugestões pra você</h2>
            <p className="mr-sectionSub">
              Achadinhos com vibe Airbnb pra sua próxima viagem ✨
            </p>
          </div>

          <div className="mr-sugActions">
            <button
              className="mr-arrow"
              type="button"
              onClick={() => scrollCarousel("left")}
              aria-label="Voltar"
            >
              ‹
            </button>
            <button
              className="mr-arrow"
              type="button"
              onClick={() => scrollCarousel("right")}
              aria-label="Avançar"
            >
              ›
            </button>
          </div>
        </div>

        <div className="mr-chips">
          {CATS.map((c) => (
            <button
              key={c}
              className={`mr-chip ${cat === c ? "active" : ""}`}
              type="button"
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mr-carousel" ref={scrollRef}>
          {SUGESTOES
            .filter((p) => (cat === "Tudo" ? true : (p.tags || []).includes(cat)))
            .map((p) => {
              const favId = `stay-${p.id}`;
              const fav = isFavorite(favId);

              return (
                <article key={p.id} className="mr-card mr-card--air">
                  <div className="mr-cardImgWrap mr-cardImgWrap--air">
                    <img className="mr-cardImg" src={p.img} alt={p.title} loading="lazy" />

                    <span className="mr-pill">{p.pill || "Recomendado"}</span>

                    <button
                      className={`mr-heart ${fav ? "saved" : ""}`}
                      type="button"
                      onClick={(e) => onHeartSuggestion(p, e)}
                      aria-label={fav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                      title={fav ? "Favorito" : "Favoritar"}
                    >
                      {fav ? "♥" : "♡"}
                    </button>
                  </div>

                  <div className="mr-cardBody mr-cardBody--air">
                    <div className="mr-airTop">
                      <h3 className="mr-cardTitle mr-cardTitle--air">{p.title}</h3>
                      <div className="mr-rating">★ {p.rating}</div>
                    </div>

                    <p className="mr-airMeta">
                      {p.city}, {p.country} • {p.type}
                    </p>

                    <p className="mr-airPrice">
                      <strong>
                        {p.currency} {p.priceNight}
                      </strong>{" "}
                      noite
                    </p>

                    <div className="mr-airActions">
                      <button className="mr-linkBtn" type="button" onClick={() => alert("Detalhes (futuro)")}>
                        Ver detalhes
                      </button>
                      <button className="mr-linkBtn" type="button" onClick={(e) => onHeartSuggestion(p, e)}>
                        {fav ? "Salvo" : "Salvar"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
        </div>
      </section>

      {/* LISTA / EMPTY */}
      {filtered.length === 0 ? (
        <div className="mr-empty">
          <div className="mr-emptyIcon">🧳</div>
          <h2>Você ainda não tem reservas</h2>
          <p>Quando você reservar, elas vão aparecer aqui automaticamente.</p>
          <div className="mr-emptyActions">
            <button className="mr-btnPrimary" onClick={() => navigate("/explorar")} type="button">
              Ir para Explorar
            </button>
            <button className="mr-btnGhost" onClick={resetFilters} type="button">
              Limpar filtros
            </button>
          </div>
        </div>
      ) : (
        <div className="mr-grid">
          {filtered.map((r) => (
            <article key={r.id} className="mr-card">
              <div className="mr-cardImgWrap">
                <img className="mr-cardImg" src={r.img} alt={r.title} loading="lazy" />
                <span className={`mr-badge ${r.status.replace(" ", "-")}`}>{r.status}</span>
              </div>

              <div className="mr-cardBody">
                <div className="mr-cardTop">
                  <div>
                    <h3 className="mr-cardTitle">{r.title}</h3>
                    <p className="mr-cardMeta">
                      📍 {r.city}, {r.country} • 🏷️ {r.type} • 👥 {r.guests}
                    </p>
                  </div>
                  <div className="mr-cardPrice">
                    <span className="mr-price">
                      {r.currency} {r.total}
                    </span>
                    <span className="mr-nights">
                      {nightsBetween(r.checkIn, r.checkOut)} noites
                    </span>
                  </div>
                </div>

                <div className="mr-dates">
                  <div className="mr-dateBox">
                    <span className="mr-dateLabel">Check-in</span>
                    <span className="mr-dateValue">{formatDateBR(r.checkIn)}</span>
                  </div>
                  <div className="mr-dateBox">
                    <span className="mr-dateLabel">Check-out</span>
                    <span className="mr-dateValue">{formatDateBR(r.checkOut)}</span>
                  </div>
                </div>

                <div className="mr-cardActions">
                  <button className="mr-btnGhost" onClick={() => alert(`Abrir detalhes: ${r.id}`)} type="button">
                    Ver detalhes
                  </button>

                  <button className="mr-btnGhost" onClick={() => alert("Contato (mock)")} type="button">
                    Contatar anfitrião
                  </button>

                  {r.status !== "Cancelada" ? (
                    <button className="mr-btnDanger" onClick={() => cancelReserva(r.id)} type="button">
                      Cancelar
                    </button>
                  ) : (
                    <button className="mr-btnDisabled" type="button" disabled>
                      Cancelada
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* só pra não ficar “unused” em alguns lints */}
      <span style={{ display: "none" }}>{favTick}</span>
    </div>
  );
}
