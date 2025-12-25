import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/offline.css";

const KEY = "turistaapp_offline_v1";

function safeParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function loadOffline() {
  const raw = localStorage.getItem(KEY);
  const parsed = raw ? safeParse(raw) : null;

  return {
    tours: Array.isArray(parsed?.tours) ? parsed.tours : [],
    places: Array.isArray(parsed?.places) ? parsed.places : [],
  };
}

function saveOffline(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

function estimateSizeMB(data) {
  // ✅ sem Blob (às vezes dá erro dependendo do ambiente)
  const str = JSON.stringify(data);
  const bytes = encodeURIComponent(str).length; // estimativa boa o bastante
  return (bytes / (1024 * 1024)).toFixed(1);
}

export default function Offline() {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  const [data, setData] = useState(() => loadOffline());

  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  const usedMB = useMemo(() => estimateSizeMB(data), [data]);
  const totalItems = data.tours.length + data.places.length;

  function clearAll() {
    const ok = window.confirm("Remover todo conteúdo offline (simulado) desta conta?");
    if (!ok) return;
    const empty = { tours: [], places: [] };
    saveOffline(empty);
    setData(empty);
  }

  return (
    <div className="offline-page">
      <header className="offline-header">
        <div className="offline-titleWrap">
          <h1 className="offline-title">
            Modo <span>Offline</span>
          </h1>
          <p className="offline-sub">Gerencie seu conteúdo para acesso offline</p>
        </div>

        <span className={`offline-status ${isOnline ? "on" : "off"}`}>
          <span className="dot" />
          {isOnline ? "Online" : "Offline"}
        </span>
      </header>

      <section className="offline-stats">
        <div className="offline-statCard blue">
          <div className="statIcon">💾</div>
          <div className="statText">
            <div className="statLabel">Armazenamento Usado</div>
            <div className="statValue">{usedMB} MB</div>
          </div>
        </div>

        <div className="offline-statCard orange">
          <div className="statIcon">🎟️</div>
          <div className="statText">
            <div className="statLabel">Tours Offline</div>
            <div className="statValue">{data.tours.length}</div>
          </div>
        </div>

        <div className="offline-statCard green">
          <div className="statIcon">📍</div>
          <div className="statText">
            <div className="statLabel">Lugares Offline</div>
            <div className="statValue">{data.places.length}</div>
          </div>
        </div>

        <div className="offline-statCard purple">
          <div className="statIcon">⬇️</div>
          <div className="statText">
            <div className="statLabel">Total de Itens</div>
            <div className="statValue">{totalItems}</div>
          </div>
        </div>
      </section>

      <section className="offline-warning">
        <div className="warnBadge">🚧</div>
        <div className="warnText">
          <div className="warnTitle">Em desenvolvimento</div>
          <div className="warnDesc">
            O offline completo (mapas, tours e lugares) vai funcionar <strong>no app</strong>.
            <br />
            No site, esta tela é <strong>inspiração</strong> e <strong>planejamento</strong>.
          </div>
        </div>

        <div className="warnActions">
          <button className="btnGhost" type="button" onClick={() => navigate("/explorar")}>
            Explorar
          </button>
          <button className="btnGhost" type="button" onClick={() => navigate("/tours")}>
            Ver Tours
          </button>
          <button className="btnDanger" type="button" onClick={clearAll} disabled={totalItems === 0}>
            Limpar offline
          </button>
        </div>
      </section>

      {totalItems === 0 ? (
        <section className="offline-empty">
          <div className="emptyIcon">📴</div>
          <h2>Nenhum conteúdo offline</h2>
          <p>Baixe tours e lugares no app para acessar sem internet.</p>

          <div className="emptyActions">
            <button className="btnPrimary" type="button" onClick={() => navigate("/explorar")}>
              Explorar Lugares
            </button>
            <button className="btnPrimary soft" type="button" onClick={() => navigate("/tours")}>
              Explorar Tours
            </button>
          </div>
        </section>
      ) : (
        <section className="offline-list">
          <div className="listHeader">
            <h2>Conteúdo Offline (simulado)</h2>
            <span className="listHint">No app isso vira download real.</span>
          </div>

          <div className="listGrid">
            <div className="listBox">
              <div className="listBoxTitle">Tours</div>
              {data.tours.length === 0 ? (
                <div className="listEmpty">Nenhum tour salvo</div>
              ) : (
                <ul className="miniList">
                  {data.tours.slice(0, 6).map((t) => (
                    <li key={t.id}>
                      <span className="miniDot" /> {t.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="listBox">
              <div className="listBoxTitle">Lugares</div>
              {data.places.length === 0 ? (
                <div className="listEmpty">Nenhum lugar salvo</div>
              ) : (
                <ul className="miniList">
                  {data.places.slice(0, 6).map((p) => (
                    <li key={p.id}>
                      <span className="miniDot" /> {p.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
