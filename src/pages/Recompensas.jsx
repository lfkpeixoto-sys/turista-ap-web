import { useEffect, useMemo, useState } from "react";
import "../styles/recompensas.css";
import { getFavoritesState } from "../services/favoritesStore";
import {
  getRewardsState,
  subscribeRewards,
  completeDailyMission,
  completeWeeklyMission,
  redeemReward,
} from "../services/rewardsStore";

const RANKS = [
  { id: "novato", name: "Novato", min: 0, max: 99, color: "gray", icon: "🎯" },
  { id: "explorador", name: "Explorador", min: 100, max: 499, color: "blue", icon: "⚡" },
  { id: "aventureiro", name: "Aventureiro", min: 500, max: 999, color: "purple", icon: "🏅" },
  { id: "mestre", name: "Mestre", min: 1000, max: 2499, color: "orange", icon: "🏵️" },
  { id: "lenda", name: "Lenda", min: 2500, max: 999999, color: "gold", icon: "👑" },
];

const DAILY = [
  { id: "d_visit", title: "Visitar 1 destino", desc: "Abrir uma cidade já conta", points: 5, icon: "🧭" },
  { id: "d_fav", title: "Favoritar 1 lugar", desc: "Marque um lugar com ❤️", points: 3, icon: "❤️" },
  { id: "d_search", title: "Pesquisar algo novo", desc: "Use a busca em Explorar/Tours/Reservas", points: 2, icon: "🔎" },
  { id: "d_map", title: "Abrir o mapa", desc: "Trocar para “Mapa” no Explorar", points: 1, icon: "🗺️" },
];

const WEEKLY = [
  { id: "w_streak3", title: "Manter 3 dias de sequência", desc: "Entre 3 dias seguidos", points: 12, icon: "🔥" },
  { id: "w_fav3", title: "Favoritar 3 lugares", desc: "Junte 3 favoritos na semana", points: 10, icon: "💖" },
  { id: "w_visit3", title: "Visitar 3 destinos", desc: "Registre 3 visitas na semana", points: 15, icon: "🧳" },
];

const SHOP = [
  { id: "frame_silver", name: "Moldura Prata", desc: "Borda especial no avatar", cost: 60, icon: "🪙" },
  { id: "frame_gold", name: "Moldura Dourada", desc: "Borda dourada no avatar", cost: 140, icon: "🏅" },
  { id: "theme_night", name: "Tema Noturno", desc: "Estilo escuro (futuro)", cost: 180, icon: "🌙" },
  { id: "badge_vip", name: "Badge VIP", desc: "Selo VIP no perfil", cost: 220, icon: "💎" },
];

function getRank(points) {
  return RANKS.find((r) => points >= r.min && points <= r.max) || RANKS[0];
}

function pct(points) {
  const r = getRank(points);
  const span = Math.max(1, r.max - r.min + 1);
  return Math.max(0, Math.min(100, ((points - r.min) / span) * 100));
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function Recompensas() {
  const [rw, setRw] = useState(() => getRewardsState());
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const unsub = subscribeRewards((s) => setRw(s));
    return () => unsub();
  }, []);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }

  const points = rw.points || 0;
  const currentRank = useMemo(() => getRank(points), [points]);
  const progress = useMemo(() => pct(points), [points]);

  const favCount = useMemo(() => {
    const s = getFavoritesState();
    return (s?.favorites || []).length;
  }, [rw]);

  const day = todayKey();
  const dailyDone = rw.dailyDone?.[day] || {};

  const weekCounters = useMemo(() => {
    const keys = Object.keys(rw.weeklyCounters || {});
    if (!keys.length) return { fav: 0, visit: 0, search: 0, map: 0 };
    const last = keys.sort().at(-1);
    return rw.weeklyCounters[last] || { fav: 0, visit: 0, search: 0, map: 0 };
  }, [rw.weeklyCounters]);

  const weeklyDone = useMemo(() => {
    const keys = Object.keys(rw.weeklyDone || {});
    if (!keys.length) return {};
    const last = keys.sort().at(-1);
    return rw.weeklyDone[last] || {};
  }, [rw.weeklyDone]);

  function completeDaily(m) {
    if (dailyDone[m.id]) return;
    completeDailyMission(m.id, m.points);
    showToast(`+${m.points} pts • ${m.title}`);
  }

  function completeWeekly(m) {
    if (weeklyDone[m.id]) return;

    let can = true;
    if (m.id === "w_streak3") can = (rw.streak || 0) >= 3;
    if (m.id === "w_fav3") can = (weekCounters.fav || 0) >= 3;
    if (m.id === "w_visit3") can = (weekCounters.visit || 0) >= 3;

    if (!can) return showToast("Ainda não dá pra completar 😅");

    completeWeeklyMission(m.id, m.points, true);
    showToast(`+${m.points} pts • ${m.title}`);
  }

  function redeem(it) {
    if (rw.unlocked?.[it.id]) return showToast("Você já tem isso ✅");
    if (points < it.cost) return showToast("Pontos insuficientes 😅");
    redeemReward(it.id, it.cost);
    showToast(`Resgatou: ${it.name} 🎁`);
  }

  return (
    <div className="rw-page">
      {toast ? <div className="rw-toast">{toast}</div> : null}

      <header className="rw-header">
        <h1 className="rw-title">
          Minhas <span>Recompensas</span>
        </h1>
        <p className="rw-sub">Conquiste badges e ganhe pontos explorando lugares</p>
      </header>

      <section className={`rw-hero rw-${currentRank.color}`}>
        <div className="rw-heroLeft">
          <div className="rw-heroLabel">Seu Rank Atual</div>
          <div className="rw-heroRank">{currentRank.name}</div>

          <div className="rw-statsRow">
            <div className="rw-stat">
              <div className="rw-statLabel">Pontos Totais</div>
              <div className="rw-statValue">{points}</div>
            </div>
            <div className="rw-stat">
              <div className="rw-statLabel">Visitas</div>
              <div className="rw-statValue">{rw.visits || 0}</div>
            </div>
            <div className="rw-stat">
              <div className="rw-statLabel">Recompensas</div>
              <div className="rw-statValue">{rw.rewardsClaimed || 0}</div>
            </div>
            <div className="rw-stat">
              <div className="rw-statLabel">Streak</div>
              <div className="rw-statValue">{rw.streak || 0} 🔥</div>
            </div>
          </div>

          <div className="rw-progressWrap">
            <div className="rw-progressTop">
              <span>Progresso para o próximo rank</span>
              <strong>{points} / {currentRank.max === 999999 ? "∞" : currentRank.max + 1}</strong>
            </div>
            <div className="rw-progressBar">
              <div className="rw-progressFill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <div className="rw-heroIcon">{currentRank.icon}</div>
      </section>

      <section className="rw-section">
        <div className="rw-sectionHead">
          <h2 className="rw-sectionTitle">Todos os Ranks</h2>
        </div>

        <div className="rw-ranks">
          {RANKS.map((r) => (
            <div key={r.id} className={`rw-rankCard rw-r-${r.color} ${r.id === currentRank.id ? "current" : ""}`}>
              <div className="rw-rankIcon">{r.icon}</div>
              <div className="rw-rankName">{r.name}</div>
              <div className="rw-rankPts">{r.min}+ pontos</div>
              {r.id === currentRank.id ? <span className="rw-pill">Atual</span> : null}
            </div>
          ))}
        </div>
      </section>

      <section className="rw-section">
        <div className="rw-sectionHead">
          <h2 className="rw-sectionTitle">🎯 Missões do Dia</h2>
          <span className="rw-muted">reseta todo dia</span>
        </div>

        <div className="rw-missionsGrid">
          {DAILY.map((m) => {
            const done = !!dailyDone[m.id];
            return (
              <div key={m.id} className={`rw-mission ${done ? "done" : ""}`}>
                <div className="rw-missionLeft">
                  <div className="rw-missionIcon">{m.icon}</div>
                  <div>
                    <div className="rw-missionTitle">{m.title}</div>
                    <div className="rw-missionDesc">{m.desc}</div>
                  </div>
                </div>
                <div className="rw-missionRight">
                  <div className="rw-missionPts">+{m.points} pts</div>
                  <button className="rw-missionBtn" type="button" onClick={() => completeDaily(m)} disabled={done}>
                    {done ? "Concluída" : "Completar"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rw-sectionHead rw-mt">
          <h2 className="rw-sectionTitle">🏆 Missões Semanais</h2>
          <span className="rw-muted">semanais</span>
        </div>

        <div className="rw-missionsGrid">
          {WEEKLY.map((m) => {
            const done = !!weeklyDone[m.id];

            let hint = "";
            if (m.id === "w_streak3") hint = `streak: ${rw.streak || 0}/3`;
            if (m.id === "w_fav3") hint = `fav semana: ${weekCounters.fav || 0}/3`;
            if (m.id === "w_visit3") hint = `visitas semana: ${weekCounters.visit || 0}/3`;

            return (
              <div key={m.id} className={`rw-mission weekly ${done ? "done" : ""}`}>
                <div className="rw-missionLeft">
                  <div className="rw-missionIcon">{m.icon}</div>
                  <div>
                    <div className="rw-missionTitle">{m.title}</div>
                    <div className="rw-missionDesc">{m.desc}</div>
                    <div className="rw-missionHint">{hint}</div>
                  </div>
                </div>
                <div className="rw-missionRight">
                  <div className="rw-missionPts">+{m.points} pts</div>
                  <button className="rw-missionBtn" type="button" onClick={() => completeWeekly(m)} disabled={done}>
                    {done ? "Concluída" : "Completar"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rw-section">
        <div className="rw-sectionHead">
          <h2 className="rw-sectionTitle">🎁 Loja</h2>
          <span className="rw-muted">troque pontos</span>
        </div>

        <div className="rw-shop">
          {SHOP.map((it) => {
            const owned = !!rw.unlocked?.[it.id];
            return (
              <div key={it.id} className={`rw-shopItem ${owned ? "owned" : ""}`}>
                <div className="rw-shopIcon">{it.icon}</div>
                <div className="rw-shopBody">
                  <div className="rw-shopName">{it.name}</div>
                  <div className="rw-shopDesc">{it.desc}</div>
                  <div className="rw-shopCost">{it.cost} pts</div>
                </div>

                <button className="rw-shopBtn" type="button" disabled={owned} onClick={() => redeem(it)}>
                  {owned ? "Desbloqueado" : "Resgatar"}
                </button>
              </div>
            );
          })}
        </div>

        <div className="rw-miniInfo">
          <div><strong>Favoritos agora:</strong> {favCount}</div>
          <div><strong>Semana:</strong> fav {weekCounters.fav || 0} • visitas {weekCounters.visit || 0} • buscas {weekCounters.search || 0} • mapa {weekCounters.map || 0}</div>
        </div>
      </section>
    </div>
  );
}
