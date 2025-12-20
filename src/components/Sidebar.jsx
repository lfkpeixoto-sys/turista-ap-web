import { NavLink } from "react-router-dom";
import "../index.css";

export default function Sidebar() {
  const links = [
    { name: "Explorar", path: "/explorar" },
    { name: "Favoritos", path: "/favoritos" },
    { name: "Tours", path: "/tours" },
    { name: "Ranking", path: "/ranking" },
    { name: "Modo Offline", path: "/offline" },
  ];

  return (
    <aside className="sidebar">
      <h2 className="logo">✈️ TuristaApp</h2>

      <nav>
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
