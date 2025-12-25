// src/pages/Ranking.jsx
import { useMemo, useState } from "react";
import "../styles/ranking.css";
import { useAuth } from "../contexts/AuthContext.jsx";
import { getLeaderboard } from "../services/rankingStore";

export default function Ranking() {
  const { user, profile } = useAuth();

  const displayName = profile?.displayName || user?.displayName || "Usuário";
  const avatarLetter = (displayName || "U").trim().charAt(0).toUpperCase();

  const [mode, setMode] = useState("points"); // points | visits

  const data = useMemo(() => getLeaderboard(mode, { displayName }), [mode, displayName]);

  const top10 = data.list.slice(0, 10);

  return (
    <div className="rk-page">
      <header className="rk-header">
        <h1 className="rk-title">
          Ranking <span>Global</span>
        </h1>
        <p className="rk-sub">Os maiores exploradores da comunidade</p>

        <div className="rk-switch">
          <button
            className={`rk-switchBtn ${mode === "points" ? "active" : ""}`}
            type="button"
            onClick={() => setMode("points")}
          >
            🔥 Pontos
          </button>
          <button
            className={`rk-switchBtn ${mode === "visits" ? "active" : ""}`}
            type="button"
            onClick={() => setMode("visits")}
          >
            📍 Visitas
          </button>
        </div>
      </header>

      {/* SUA POSIÇÃO */}
      {data.me && (
        <section className="rk-meCard">
          <div className="rk-meLeft">
            <div className="rk-mePos">#{data.me.pos}</div>
            <div className="rk-meInfo">
              <div className="rk-meLabel">Sua Posição</div>
              <div className="rk-meName">{displayName}</div>
              <span className="rk-pill">{data.me.rank.label}</span>
            </div>
          </div>

          <div className="rk-meRight">
            <div className="rk-score">
              <div className="rk-scoreValue">
                {mode === "points" ? data.me.points : data.me.visits}
              </div>
              <div className="rk-scoreLabel">{mode === "points" ? "pontos" : "visitas"}</div>
            </div>
          </div>
        </section>
      )}

      {/* RANKING COMPLETO */}
      <section className="rk-board">
        <div className="rk-boardHead">
          <div className="rk-boardTitle">📈 Ranking Completo</div>
        </div>

        <div className="rk-list">
          {top10.map((p) => {
            const isMe = p.id === "me";
            const crown = p.pos === 1 ? "👑" : p.pos === 2 ? "🥈" : p.pos === 3 ? "🥉" : "";

            return (
              <div key={p.id} className={`rk-row ${isMe ? "me" : ""}`}>
                <div className="rk-colPos">
                  <div className={`rk-posBadge pos-${p.pos <= 3 ? p.pos : "x"}`}>
                    {crown || `#${p.pos}`}
                  </div>
                </div>

                <div className="rk-colUser">
                  <div className="rk-avatar">{p.id === "me" ? avatarLetter : p.avatar}</div>
                  <div className="rk-userText">
                    <div className="rk-userTop">
                      <div className="rk-userName">{p.name}</div>
                      {isMe && <span className="rk-you">Você</span>}
                    </div>

                    <div className="rk-userMeta">
                      <span className="rk-rank">{p.rank.id}</span>
                      <span className="rk-dot">•</span>
                      <span>{p.visits} visitas</span>
                    </div>
                  </div>
                </div>

                <div className="rk-colScore">
                  <div className="rk-scoreNum">
                    {mode === "points" ? p.points : p.visits}
                  </div>
                  <div className="rk-scoreTxt">{mode === "points" ? "pontos" : "visitas"}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rk-footHint">
          Dica: os pontos e visitas sobem conforme você usa o app (Explorar, Mapa, Favoritos, etc).
        </div>
      </section>
    </div>
  );
}
