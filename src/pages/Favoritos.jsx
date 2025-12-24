import { useEffect, useMemo, useState } from "react";
import "../index.css";
import "../styles/favoritos.css";
import { getFavoritesState, toggleFavorite } from "../services/favoritesStore";

export default function Favoritos() {
  const [tab, setTab] = useState("fav"); // fav | hist
  const [state, setState] = useState(() => getFavoritesState());

  useEffect(() => {
    // Atualiza quando voltar pra tela
    setState(getFavoritesState());

    // Atualiza quando mudar em outra aba/janela
    const onStorage = (e) => {
      if (e.key === "turistaapp_favorites_v1") setState(getFavoritesState());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const favorites = state.favorites || [];
  const history = state.history || [];

  const list = useMemo(() => (tab === "fav" ? favorites : history), [tab, favorites, history]);

  function onToggle(item) {
    const res = toggleFavorite(item);
    setState(res.state);
  }

  return (
    <div className="fav-page">
      <h1 className="fav-title">
        Meus <span>Favoritos</span>
      </h1>
      <p className="fav-sub">Seus lugares favoritos e histórico de visitas</p>

      <div className="fav-tabs">
        <button
          className={`fav-tab ${tab === "fav" ? "active" : ""}`}
          onClick={() => setTab("fav")}
          type="button"
        >
          ❤️ Favoritos ({favorites.length})
        </button>

        <button
          className={`fav-tab ${tab === "hist" ? "active" : ""}`}
          onClick={() => setTab("hist")}
          type="button"
        >
          🕘 Histórico ({history.length})
        </button>
      </div>

      <div className="fav-card">
        {list.length === 0 ? (
          <div className="fav-empty">
            <div className="fav-emptyIcon">♡</div>
            <div className="fav-emptyTitle">
              {tab === "fav" ? "Nenhum favorito ainda" : "Nenhum histórico ainda"}
            </div>
            <div className="fav-emptyText">
              {tab === "fav"
                ? "Visite lugares e marque como favoritos para vê-los aqui"
                : "Quando você tirar o coração de um lugar, ele aparece aqui por até 4 dias"}
            </div>
          </div>
        ) : (
          <div className="fav-grid">
            {list.map((item) => (
              <div key={item.id} className="fav-item">
                <div className="fav-imgWrap">
                  {item.img ? <img src={item.img} alt={item.title} /> : <div className="fav-imgPh" />}
                  <button className="fav-heart" type="button" onClick={() => onToggle(item)}>
                    ❤️
                  </button>
                </div>

                <div className="fav-info">
                  <div className="fav-itemTitle">{item.title}</div>
                  {item.subtitle ? <div className="fav-itemSub">{item.subtitle}</div> : null}

                  {tab === "hist" && item.removedAt ? (
                    <div className="fav-meta">Removido em {new Date(item.removedAt).toLocaleDateString("pt-BR")}</div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
