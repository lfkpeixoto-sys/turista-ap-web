import { useParams, Link } from "react-router-dom";
import "../index.css";

export default function CityPage() {
  const { cityName } = useParams();

  // Lista de atrações genéricas
  const attractions = [
    "Museu XYZ",
    "Praça Central",
    "Parque ABC",
    "Teatro Municipal",
    "Catedral da Cidade",
    "Praia do Sol",
    "Mirante do Horizonte",
    "Centro Histórico",
    "Parque das Águas",
    "Shopping Popular",
    "Feira de Artesanato",
    "Museu de Arte Contemporânea",
    "Jardim Botânico",
    "Estádio Municipal",
    "Mercado Local",
  ];

  return (
    <div className="page city-page">
      <h1>{decodeURIComponent(cityName)}</h1>
      <p>Explore os principais pontos turísticos desta cidade!</p>

      <div className="city-info">
        {attractions.map((a) => (
          <p key={a}>• {a}</p>
        ))}
      </div>

      <Link to="/" className="button button-green">
        Voltar
      </Link>
    </div>
  );
}
