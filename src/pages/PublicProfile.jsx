
import "../styles/publicProfile.css";
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// 🔥 IMPORTANTE: ajuste esse import para o seu firebase
// Você precisa ter um arquivo que exporta "db" do Firestore
import { db } from "../services/firebase"; // <- se não existir, me diga onde está seu firebase

import { collection, getDocs, query, where, limit } from "firebase/firestore";

function uniqueCountriesCount(items) {
  const set = new Set();
  (items || []).forEach((c) => {
    if (c?.country) set.add(String(c.country).toUpperCase());
  });
  return set.size;
}

export default function PublicProfile() {
  const { username } = useParams();
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);

        const qy = query(collection(db, "users"), where("username", "==", username), limit(1));
        const snap = await getDocs(qy);

        if (!alive) return;

        if (snap.empty) {
          setProfile(null);
          return;
        }

        const doc = snap.docs[0];
        setProfile(doc.data());
      } catch (e) {
        console.log(e);
        setProfile(null);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [username]);

  const wishlist = profile?.wishlistCities || [];
  const visited = profile?.visitedCities || [];
  const countriesVisited = useMemo(() => uniqueCountriesCount(visited), [visited]);

  if (loading) {
    return (
      <div className="publicProfilePage">
        <div className="ppCard">
          <div className="ppLoading">Carregando perfil...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="publicProfilePage">
        <div className="ppCard">
          <div className="ppTitle">Perfil não encontrado</div>
          <div className="ppSub">Esse usuário não existe ou não tem username ainda.</div>

          <div className="ppActions">
            <button className="btnPrimary" onClick={() => nav("/login")}>
              Ir para login
            </button>
            <button className="btnGhost" onClick={() => nav(-1)}>
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const displayName = profile.displayName || "Usuário";
  const photoURL =
    profile.photoURL ||
    "https://ui-avatars.com/api/?name=" + encodeURIComponent(displayName) + "&background=111827&color=fff";
  const bio = profile.bio || "Sem bio ainda.";

  return (
    <div className="publicProfilePage">
      <div className="ppCard">
        <div className="ppHeader">
          <div className="ppLeft">
            <img className="ppAvatar" src={photoURL} alt={displayName} />
            <div className="ppIdentity">
              <div className="ppName">{displayName}</div>
              <div className="ppHandle">@{profile.username}</div>
              <div className="ppBio">{bio}</div>
            </div>
          </div>

          <div className="ppRight">
            <button className="btnGhost" onClick={() => nav("/login")}>
              Entrar
            </button>
          </div>
        </div>

        <div className="ppStats">
          <div className="ppStat">
            <div className="ppStatLabel">Quero visitar</div>
            <div className="ppStatValue">{wishlist.length}</div>
          </div>
          <div className="ppStat">
            <div className="ppStatLabel">Visitados</div>
            <div className="ppStatValue">{visited.length}</div>
          </div>
          <div className="ppStat">
            <div className="ppStatLabel">Países</div>
            <div className="ppStatValue">{countriesVisited}</div>
          </div>
        </div>

        <div className="ppSectionTop">
          <div className="ppSectionTitle">Cidades visitadas</div>
        </div>

        {visited.length === 0 ? (
          <div className="ppEmpty">
            <div className="ppEmptyTitle">Ainda não tem cidades visitadas</div>
            <div className="ppEmptySub">Quando esse usuário marcar como visitada, vai aparecer aqui.</div>
          </div>
        ) : (
          <div className="ppGrid">
            {visited.slice(0, 60).map((c) => (
              <div key={c.id || c.name} className="ppTile">
                <div className="ppTileName">{c.name}</div>
                <div className="ppTileMeta">{(c.state ? `${c.state} • ` : "")}{c.country || "BR"}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
