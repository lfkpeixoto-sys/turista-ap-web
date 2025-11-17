import { useState } from "react";
import { Link } from "react-router-dom";
import "../index.css";

export default function CitySearch() {
  const [query, setQuery] = useState("");

  // Lista extensa de cidades (100+ de vários países)
  const allCities = [
    "São Paulo", "Rio de Janeiro", "Salvador", "Curitiba", "Brasília",
    "Fortaleza", "Belo Horizonte", "Recife", "Porto Alegre", "Manaus",
    "Florianópolis", "Natal", "João Pessoa", "Belém", "Goiânia",
    "Vitória", "Campo Grande", "Cuiabá", "Maceió", "São Luís",
    "Buenos Aires", "Santiago", "Lima", "Bogotá", "Caracas",
    "Paris", "Londres", "Berlim", "Madri", "Roma", "Lisboa", "Dublin",
    "Nova Iorque", "Los Angeles", "Chicago", "Miami", "San Francisco",
    "Toronto", "Vancouver", "Montreal", "Cidade do México", "Cancún",
    "Bangkok", "Tóquio", "Seul", "Xangai", "Hong Kong",
    "Sydney", "Melbourne", "Auckland", "Cingapura", "Dubai",
    "Moscou", "São Petersburgo", "Estocolmo", "Oslo", "Helsinque",
    "Barcelona", "Valência", "Sevilha", "Málaga", "Bilbao",
    "Miami Beach", "Orlando", "Las Vegas", "Boston", "Houston",
    "Kyoto", "Osaka", "Nagoya", "Viena", "Praga",
    "Budapeste", "Varsóvia", "Cracóvia", "Bruxelas", "Amsterdã",
    "Zurique", "Genebra", "Milão", "Turim", "Copenhagen",
    "Reykjavik", "Lisboa", "Porto", "Funchal", "Coimbra",
    "Salvador de Bahia", "Fortaleza CE", "João Pessoa PB", "Recife PE",
    "Curitiba PR", "Belo Horizonte MG", "Brasília DF", "Manaus AM",
    "Tóquio JP", "Kyoto JP", "Osaka JP", "Seul KR", "Busan KR"
  ];

  // Filtra cidades conforme o input (autocomplete)
  const filteredCities = query
    ? allCities.filter((city) =>
        city.toLowerCase().startsWith(query.toLowerCase())
      )
    : [];

  const highlights = [
    { name: "Museu do Amanhã", city: "Rio de Janeiro" },
    { name: "Parque Ibirapuera", city: "São Paulo" },
    { name: "Pelourinho", city: "Salvador" },
  ];

  return (
    <div className="page clean-layout">
      {/* Header */}
      <header>
        <h1>Turista App</h1>
        <p>Descubra atrações e pontos turísticos de cidades do Brasil e do mundo.</p>
      </header>

      {/* Busca */}
      <section className="search-section">
        <input
          type="text"
          placeholder="Digite a cidade"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {/* Sugestões com scroll */}
        {query && (
          <div className="suggestions scrollable">
            {filteredCities.length > 0 ? (
              filteredCities.map((city) => (
                <Link
                  key={city}
                  to={`/city/${encodeURIComponent(city)}`}
                  className="button button-blue suggestion-button"
                >
                  {city}
                </Link>
              ))
            ) : (
              <p className="no-results">Nenhuma cidade encontrada</p>
            )}
          </div>
        )}
      </section>

      {/* Cidades Populares */}
      <section className="popular-cities-section">
        <h2>Cidades Populares</h2>
        <div className="popular-cities-grid">
          {["São Paulo", "Rio de Janeiro", "Salvador"].map((c) => (
            <Link
              key={c}
              to={`/city/${encodeURIComponent(c)}`}
              className="button button-blue city-button"
            >
              {c}
            </Link>
          ))}
        </div>
      </section>

      {/* Destaques */}
      <section className="highlights-section">
        <h2>Destinos em Destaque</h2>
        <div className="highlights-grid">
          {highlights.map((h) => (
            <div key={h.name} className="highlight-card">
              <h3>{h.name}</h3>
              <p>{h.city}</p>
              <Link to={`/city/${encodeURIComponent(h.city)}`} className="button button-green">
                Explorar
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
