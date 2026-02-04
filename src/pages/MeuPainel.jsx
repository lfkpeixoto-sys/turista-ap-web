import "../styles/painel.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { CIDADES_BR } from "../data/cidadesBR";

function uid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function uniqueCountriesCount(items) {
  const set = new Set();
  (items || []).forEach((c) => {
    if (c?.country) set.add(String(c.country).toUpperCase());
  });
  return set.size;
}

function normalizeText(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export default function MeuPainel() {
  const nav = useNavigate();
  const { user, profile, updateProfileData, logout } = useAuth();

  const displayName = profile?.displayName || user?.displayName || "Usuário";

  const wishlist = profile?.wishlistCities || [];
  const visited = profile?.visitedCities || [];

  const countriesVisited = useMemo(() => uniqueCountriesCount(visited), [visited]);

  // topo: busca + ordenação
  const [query, setQuery] = useState("");
  const [sortMode, setSortMode] = useState("recent"); // recent | az
  const q = useMemo(() => normalizeText(query), [query]);

  const wishlistFiltered = useMemo(() => {
    let items = wishlist.filter((c) => {
      if (!q) return true;
      const hay = normalizeText(`${c?.name} ${c?.state || ""} ${c?.country || ""}`);
      return hay.includes(q);
    });

    if (sortMode === "az") {
      items = [...items].sort((a, b) => String(a?.name).localeCompare(String(b?.name), "pt-BR"));
    } else {
      items = [...items].sort((a, b) => (b?.addedAt || 0) - (a?.addedAt || 0));
    }
    return items;
  }, [wishlist, q, sortMode]);

  const visitedFiltered = useMemo(() => {
    let items = visited.filter((c) => {
      if (!q) return true;
      const hay = normalizeText(`${c?.name} ${c?.state || ""} ${c?.country || ""}`);
      return hay.includes(q);
    });

    if (sortMode === "az") {
      items = [...items].sort((a, b) => String(a?.name).localeCompare(String(b?.name), "pt-BR"));
    } else {
      items = [...items].sort((a, b) => (b?.visitedAt || 0) - (a?.visitedAt || 0));
    }
    return items;
  }, [visited, q, sortMode]);

  // meta (gamificação leve)
  const goal = 10;
  const progress = Math.min(visited.length / goal, 1);
  const remaining = Math.max(goal - visited.length, 0);

  // modal adicionar cidade (COM AUTOCOMPLETE)
  const [openAdd, setOpenAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [cityQuery, setCityQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState(null); // {name,state,country}
  const [showSug, setShowSug] = useState(false);

  const cityInputRef = useRef(null);

  const suggestions = useMemo(() => {
    const t = normalizeText(cityQuery);
    if (!t || t.length < 2) return [];
    return CIDADES_BR
      .filter((c) => normalizeText(`${c.name} ${c.state}`).includes(t))
      .slice(0, 8);
  }, [cityQuery]);

  function openModal() {
    setOpenAdd(true);
    setFormError("");
    setCityQuery("");
    setSelectedCity(null);
    setShowSug(false);
    setTimeout(() => cityInputRef.current?.focus(), 50);
  }

  function closeModal() {
    if (saving) return;
    setOpenAdd(false);
    setFormError("");
  }

  useEffect(() => {
    function onKeyDown(e) {
      if (!openAdd) return;

      if (e.key === "Escape") closeModal();

      if (e.key === "Enter") {
        const tag = document.activeElement?.tagName?.toLowerCase();
        if (tag === "input" || tag === "button") addCity();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openAdd, saving, selectedCity, cityQuery]);

  async function addCity() {
    setFormError("");

    if (!selectedCity) {
      return setFormError("Escolha uma cidade da lista para salvar com o nome correto.");
    }

    const name = selectedCity.name;
    const cc = String(selectedCity.country).toUpperCase();
    const st = selectedCity.state;

    const exists = wishlist.some(
      (c) => normalizeText(c?.name) === normalizeText(name) && String(c?.country).toUpperCase() === cc
    );
    if (exists) return setFormError("Essa cidade já está na sua lista de “Quero visitar”.");

    const item = { id: uid(), name, country: cc, state: st, addedAt: Date.now() };

    try {
      setSaving(true);
      await updateProfileData({
        wishlistCities: [item, ...wishlist],
      });

      setCityQuery("");
      setSelectedCity(null);
      setShowSug(false);
      setOpenAdd(false);
    } finally {
      setSaving(false);
    }
  }

  async function removeFromWishlist(id) {
    const next = wishlist.filter((c) => c.id !== id);
    await updateProfileData({ wishlistCities: next });
  }

  async function markVisited(id) {
    const city = wishlist.find((c) => c.id === id);
    if (!city) return;

    const nextWishlist = wishlist.filter((c) => c.id !== id);
    const nextVisited = [{ ...city, visitedAt: Date.now() }, ...visited];

    await updateProfileData({
      wishlistCities: nextWishlist,
      visitedCities: nextVisited,
    });
  }

  async function undoVisited(id) {
    const city = visited.find((c) => c.id === id);
    if (!city) return;

    const nextVisited = visited.filter((c) => c.id !== id);
    const nextWishlist = [{ ...city, visitedAt: undefined, addedAt: Date.now() }, ...wishlist];

    await updateProfileData({
      visitedCities: nextVisited,
      wishlistCities: nextWishlist,
    });
  }

  async function removeVisited(id) {
    const next = visited.filter((c) => c.id !== id);
    await updateProfileData({ visitedCities: next });
  }

  return (
    <div className="painelPage">
      <div className="painelHeader cleanHeader">
        <div>
          <h1>Olá, {displayName}! 👋</h1>
          <p>Seu painel — simples, organizado e com suas viagens em um só lugar.</p>
        </div>

        <div className="painelHeaderActions">
          <button className="btnGhost" onClick={() => nav("/perfil/editar")}>
            Editar perfil
          </button>

          <button
            className="btnDanger"
            onClick={async () => {
              await logout();
              nav("/login", { replace: true });
            }}
          >
            Sair
          </button>
        </div>
      </div>

      {/* barra rápida */}
      <div className="panelTopBar">
        <div className="searchWrap">
          <input
            className="searchInput"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar cidade, UF ou país…"
          />
        </div>

        <div className="segmented">
          <button
            className={sortMode === "recent" ? "segBtn active" : "segBtn"}
            onClick={() => setSortMode("recent")}
            type="button"
          >
            Recentes
          </button>
          <button
            className={sortMode === "az" ? "segBtn active" : "segBtn"}
            onClick={() => setSortMode("az")}
            type="button"
          >
            A–Z
          </button>
        </div>
      </div>

      {/* stats clean */}
      <div className="miniStats">
        <div className="miniStat">
          <div className="miniLabel">Quero visitar</div>
          <div className="miniValue">{wishlist.length}</div>
        </div>
        <div className="miniStat">
          <div className="miniLabel">Visitados</div>
          <div className="miniValue">{visited.length}</div>
        </div>
        <div className="miniStat">
          <div className="miniLabel">Países visitados</div>
          <div className="miniValue">{countriesVisited}</div>
        </div>

        <button className="btnPrimary miniAdd" onClick={openModal}>
          + Adicionar cidade
        </button>
      </div>

      {/* meta / progresso */}
      <div className="goalCard">
        <div className="goalTop">
          <div className="goalTitle">Meta rápida</div>
          <div className="goalMeta">
            {visited.length}/{goal} cidades
          </div>
        </div>
        <div className="goalBar">
          <div className="goalFill" style={{ width: `${progress * 100}%` }} />
        </div>
        <div className="goalHint">
          {remaining === 0 ? "Meta concluída! Bora definir outra? 🚀" : `Faltam ${remaining} para bater sua meta.`}
        </div>
      </div>

      {/* Quero visitar */}
      <div className="panelCard cleanCard">
        <div className="panelCardTitleRow">
          <div className="panelCardTitle">
            Quero visitar <span className="badgeCount">{wishlist.length}</span>
          </div>

          <button className="btnGhost" onClick={() => nav("/explorar")}>
            Explorar cidades
          </button>
        </div>

        {wishlistFiltered.length === 0 ? (
          <div className="emptyBox">
            <div className="emptyTitle">{wishlist.length === 0 ? "Sua lista está vazia" : "Nada encontrado"}</div>
            <div className="emptySub">
              {wishlist.length === 0
                ? "Adicione cidades que você quer visitar. Depois marque como “Visitei”."
                : "Tente buscar por outro nome/UF."}
            </div>

            <div className="emptyActions">
              <button className="btnPrimary" onClick={openModal}>
                + Adicionar cidade
              </button>
              <button className="btnGhost" onClick={() => nav("/explorar")}>
                Explorar
              </button>
            </div>
          </div>
        ) : (
          <div className="cityList">
            {wishlistFiltered.map((c) => (
              <div className="cityItem" key={c.id}>
                <div className="cityMain">
                  <div className="cityName">{c.name}</div>
                  <div className="cityMeta">
                    {c.state ? `${c.state} • ` : ""}
                    {String(c.country).toUpperCase()}
                  </div>
                </div>

                <div className="cityActions">
                  <button className="btnPrimary small" onClick={() => markVisited(c.id)}>
                    Marcar como visitada ✅
                  </button>
                  <button className="btnGhost small" onClick={() => removeFromWishlist(c.id)}>
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Visitados */}
      <div className="panelCard cleanCard">
        <div className="panelCardTitleRow">
          <div className="panelCardTitle">
            Visitados <span className="badgeCount">{visited.length}</span>
          </div>

          <div className="muted">
            Países únicos: <b>{countriesVisited}</b>
          </div>
        </div>

        {visitedFiltered.length === 0 ? (
          <div className="emptyBox">
            <div className="emptyTitle">{visited.length === 0 ? "Nada por aqui ainda" : "Nada encontrado"}</div>
            <div className="emptySub">
              {visited.length === 0
                ? "Quando você marcar uma cidade como “visitada”, ela aparece aqui."
                : "Tente buscar por outro nome/UF."}
            </div>
          </div>
        ) : (
          <div className="cityList">
            {visitedFiltered.map((c) => (
              <div className="cityItem visited" key={c.id}>
                <div className="cityMain">
                  <div className="cityName">{c.name}</div>
                  <div className="cityMeta">
                    {c.state ? `${c.state} • ` : ""}
                    {String(c.country).toUpperCase()}
                    {c.visitedAt ? ` • ${new Date(c.visitedAt).toLocaleDateString("pt-BR")}` : ""}
                  </div>
                </div>

                <div className="cityActions">
                  <button className="btnGhost small" onClick={() => undoVisited(c.id)}>
                    Desfazer
                  </button>
                  <button className="btnGhost small" onClick={() => removeVisited(c.id)}>
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* modal adicionar */}
      {openAdd && (
        <div className="modalOverlay" onMouseDown={closeModal}>
          <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modalTitle">Adicionar cidade</div>

            <label className="label">Cidade (selecione da lista)</label>
            <div className="autoWrap">
              <input
                ref={cityInputRef}
                className="input"
                value={cityQuery}
                onChange={(e) => {
                  setCityQuery(e.target.value);
                  setSelectedCity(null);
                  setShowSug(true);
                  setFormError("");
                }}
                placeholder="Digite para buscar (ex: Fortaleza)"
                onFocus={() => setShowSug(true)}
                onBlur={() => setTimeout(() => setShowSug(false), 120)}
                autoFocus
              />

              {showSug && suggestions.length > 0 && (
                <div className="autoList">
                  {suggestions.map((c) => (
                    <button
                      key={`${c.name}-${c.state}`}
                      type="button"
                      className="autoItem"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setSelectedCity(c);
                        setCityQuery(`${c.name} - ${c.state}`);
                        setShowSug(false);
                        setFormError("");
                      }}
                    >
                      <span className="autoCity">{c.name}</span>
                      <span className="autoMeta">
                        {c.state} • {c.country}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedCity ? (
              <div className="pickedHint">
                Selecionado: <b>{selectedCity.name}</b> ({selectedCity.state}) • {selectedCity.country}
              </div>
            ) : (
              <div className="pickedHint warn">Dica: escolha uma opção da lista para salvar corretamente.</div>
            )}

            {formError ? <div className="formError">{formError}</div> : null}

            <div className="modalActions">
              <button className="btnGhost" disabled={saving} onClick={closeModal}>
                Cancelar
              </button>
              <button className="btnPrimary" disabled={saving} onClick={addCity}>
                {saving ? "Salvando..." : "Adicionar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
