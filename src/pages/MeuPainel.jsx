import "../styles/painel.css";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

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

export default function MeuPainel() {
  const nav = useNavigate();
  const { user, profile, updateProfileData, logout } = useAuth();

  const displayName = profile?.displayName || user?.displayName || "Usuário";

  const wishlist = profile?.wishlistCities || [];
  const visited = profile?.visitedCities || [];

  const countriesVisited = useMemo(() => uniqueCountriesCount(visited), [visited]);

  // modal add city
  const [openAdd, setOpenAdd] = useState(false);
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("BR");
  const [saving, setSaving] = useState(false);

  async function addCity() {
    const name = cityName.trim();
    const cc = country.trim().toUpperCase();

    if (!name) return alert("Digite o nome da cidade.");
    if (!cc || cc.length < 2) return alert("Coloque o país (ex: BR, US, FR).");

    const item = {
      id: uid(),
      name,
      country: cc,
      addedAt: Date.now(),
    };

    try {
      setSaving(true);
      await updateProfileData({
        wishlistCities: [item, ...wishlist],
      });
      setCityName("");
      setCountry("BR");
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

        <button className="btnPrimary miniAdd" onClick={() => setOpenAdd(true)}>
          + Adicionar cidade
        </button>
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

        {wishlist.length === 0 ? (
          <div className="emptyBox">
            <div className="emptyTitle">Sua lista está vazia</div>
            <div className="emptySub">Adicione cidades que você quer visitar. Depois marque como “Visitei”.</div>
          </div>
        ) : (
          <div className="cityList">
            {wishlist.map((c) => (
              <div className="cityItem" key={c.id}>
                <div className="cityMain">
                  <div className="cityName">{c.name}</div>
                  <div className="cityMeta">{c.country}</div>
                </div>

                <div className="cityActions">
                  <button className="btnPrimary small" onClick={() => markVisited(c.id)}>
                    Visitei ✅
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

        {visited.length === 0 ? (
          <div className="emptyBox">
            <div className="emptyTitle">Nada por aqui ainda</div>
            <div className="emptySub">Quando você marcar uma cidade como “Visitei”, ela aparece aqui.</div>
          </div>
        ) : (
          <div className="cityList">
            {visited.map((c) => (
              <div className="cityItem visited" key={c.id}>
                <div className="cityMain">
                  <div className="cityName">{c.name}</div>
                  <div className="cityMeta">
                    {c.country} • {c.visitedAt ? new Date(c.visitedAt).toLocaleDateString("pt-BR") : ""}
                  </div>
                </div>

                <div className="cityActions">
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
        <div className="modalOverlay" onClick={() => !saving && setOpenAdd(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modalTitle">Adicionar cidade</div>

            <label className="label">Cidade</label>
            <input
              className="input"
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
              placeholder="ex: Rio de Janeiro"
              autoFocus
            />

            <label className="label">País (sigla)</label>
            <input
              className="input"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="BR"
            />

            <div className="modalActions">
              <button className="btnGhost" disabled={saving} onClick={() => setOpenAdd(false)}>
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
