import React from "react";
import { Link } from "react-router-dom";
import "../index.css";

export default function Sidebar() {
  const menuItems = [
    "Meu Painel",
    "Explorar",
    "Tours",
    "Minhas Reservas",
    "Planos",
    "Favoritos",
    "Recompensas",
    "Ranking",
    "Modo Offline"
  ];

  return (
    <div className="sidebar">
      <h2>Turista App</h2>
      <nav>
        <ul>
          {menuItems.map((item, idx) => (
            <li key={idx}>
              <Link to={`/${item.toLowerCase().replace(/\s+/g, "-")}`}>
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
