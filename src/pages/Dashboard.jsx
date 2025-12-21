import { useEffect, useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import "../styles/dashboard.css";
import { useAuth } from "../contexts/AuthContext.jsx";

const NAV = [
  { label: "Meu Painel", to: "/", end: true },
  { label: "Explorar", to: "explorar" },
  { label: "Tours", to: "tours" },

  { label: "Minhas Reservas", to: "reservas", disabled: true },
  { label: "Planos", to: "planos", disabled: true },
  { label: "Favoritos", to: "favoritos", disabled: true },
  { label: "Recompensas", to: "recompensas", disabled: true },
  { label: "Ranking", to: "ranking", disabled: true },
  { label: "Modo Offline", to: "offline", disabled: true },
];

export default function Dashboard() {
  const { user, profile, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  // Dados do usuário (ESTAVA FALTANDO)
  const displayName = profile?.displayName || user?.displayName || "Usuário";
  const email = user?.email || "";
  const avatarLetter = (displayName || "U").trim().charAt(0).toUpperCase();

  // Em breve (ESTAVA FALTANDO)
  function comingSoon(e) {
    e.preventDefault();
    alert("Em breve ✅");
  }

  // trava o scroll do body só no desktop
useEffect(() => {
  const prev = document.body.style.overflow;

  const apply = () => {
    const mobile = window.innerWidth <= 900;

    document.body.classList.toggle("isMobile", mobile);
    document.body.style.overflow = mobile ? "auto" : "hidden";
  };

  apply();
  window.addEventListener("resize", apply);

  return () => {
    window.removeEventListener("resize", apply);
    document.body.classList.remove("isMobile");
    document.body.style.overflow = prev || "auto";
  };
}, []);

  // sidebar reutilizável (desktop e drawer mobile)
  const SidebarContent = () => (
    <>
      <div className="brand">
        <div className="brandIcon">✈️</div>
        <div className="brandText">
          <div className="brandTitle">TuristaApp</div>
          <div className="brandSub">Explore o mundo</div>
        </div>
      </div>

      <div className="navTitle">NAVEGAÇÃO</div>

      <div className="menuScroll">
        <nav className="navList">
          {NAV.map((item) =>
            item.disabled ? (
              <a
                key={item.label}
                href={item.to}
                onClick={comingSoon}
                className="navItem disabled"
              >
                <span className="navIcon">•</span>
                <span className="navLabel">{item.label}</span>
                <span className="soon">Em breve</span>
              </a>
            ) : (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `navItem ${isActive ? "active" : ""}`
                }
                onClick={() => setMenuOpen(false)} // fecha o menu ao navegar no mobile
              >
                <span className="navIcon">•</span>
                <span className="navLabel">{item.label}</span>
              </NavLink>
            )
          )}
        </nav>
      </div>

      <div className="userBox">
        <div className="userAvatar">{avatarLetter}</div>
        <div className="userInfo">
          <div className="userName">{displayName}</div>
          <div className="userEmail">{email}</div>
        </div>

        <button className="logoutBtn" type="button" onClick={logout}>
          Sair
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* TOPBAR MOBILE */}
<header
  className="mobileTopbar"
  style={{
    display: "flex",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    background: "red",
    zIndex: 999999,
    color: "white",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 900
  }}
      {/* DRAWER MOBILE */}
      {menuOpen && (
        <div
          className="drawerOverlay"
          onClick={() => setMenuOpen(false)}
          role="presentation"
        >
          <aside
            className="drawer"
            onClick={(e) => e.stopPropagation()}
            role="dialog
            aria-modal="true"
          >
            <div className="drawerHeader">
              <div className="drawerTitle">Menu</div>
              <button
                className="drawerCloseBtn"
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Fechar menu"
              >
                ✕
              </button>
            </div>

            <div className="drawerBody">
              <SidebarContent />
            </div>
          </aside>
        </div>
      )}

      {/* LAYOUT (DESKTOP NORMAL) */}
      <div className="dashLayout">
        <aside className="dashSidebar">
          <SidebarContent />
        </aside>

        <main className="dashMain">
          <div className="dashScroll">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}
