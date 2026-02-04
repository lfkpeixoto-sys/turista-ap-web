import "../styles/usernameOnboarding.css";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../contexts/AuthContext.jsx";

function normalizeUsername(s) {
  return String(s || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9._]/g, "");
}

function isValidUsername(u) {
  if (!u) return false;
  if (u.length < 3 || u.length > 20) return false;
  if (!/^[a-z0-9]/.test(u)) return false;
  if (/\.$/.test(u)) return false;
  if (u.includes("..")) return false;
  if (!/^[a-z0-9._]+$/.test(u)) return false;
  return true;
}

export default function UsernameOnboarding() {
  const nav = useNavigate();
  const { user, profile, updateProfileData, loading } = useAuth();

  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const username = useMemo(() => normalizeUsername(value), [value]);
  const valid = useMemo(() => isValidUsername(username), [username]);

  if (loading) return null;

  if (!user) {
    nav("/login", { replace: true });
    return null;
  }

  if (profile?.username) {
    nav("/", { replace: true });
    return null;
  }

  async function reserve() {
    setError("");

    if (!valid) {
      setError("Username inválido. Use 3–20 chars: letras/números, ponto e _ (sem espaço).");
      return;
    }

    const reserved = ["admin", "root", "support", "turistaapp", "login", "signup", "onboarding", "ranking"];
    if (reserved.includes(username)) {
      setError("Esse username não está disponível.");
      return;
    }

    try {
      setSaving(true);

      const usernameRef = doc(db, "usernames", username);
      const userRef = doc(db, "users", user.uid);

      await runTransaction(db, async (tx) => {
        const unameSnap = await tx.get(usernameRef);
        if (unameSnap.exists()) throw new Error("TAKEN");

        tx.set(usernameRef, { uid: user.uid, createdAt: serverTimestamp() });
        tx.update(userRef, { username, updatedAt: serverTimestamp() });
      });

      await updateProfileData({ username });
      nav("/", { replace: true });
    } catch (e) {
      if (e?.message === "TAKEN") setError("Esse username já está sendo usado. Tente outro.");
      else {
        console.error(e);
        setError("Erro ao salvar. Tente novamente.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="uobPage">
      <div className="uobCard">
        <div className="uobTitle">Escolha seu @username</div>
        <div className="uobSub">
          Seu perfil público será: <b>turistaapp.com/u/{username || "kubota"}</b>
        </div>

        <label className="uobLabel">Username</label>
        <div className="uobInputWrap">
          <span className="uobAt">@</span>
          <input
            className="uobInput"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError("");
            }}
            placeholder="ex: kubota"
            autoFocus
          />
        </div>

        <div className="uobHint">
          {valid ? (
            <span className="uobOk">Formato ok ✅</span>
          ) : (
            <span className="uobWarn">3–20 chars: letras/números, ponto e _ (sem espaço)</span>
          )}
        </div>

        {error ? <div className="uobError">{error}</div> : null}

        <button className="uobBtn" disabled={!valid || saving} onClick={reserve}>
          {saving ? "Salvando..." : "Continuar"}
        </button>

        <div className="uobFooter">Escolha algo curto. Isso aparece no ranking 😄</div>
      </div>
    </div>
  );
}
