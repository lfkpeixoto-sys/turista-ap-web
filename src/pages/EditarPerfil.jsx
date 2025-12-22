import "../styles/editarPerfil.css";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

function normalizeUrl(input) {
  const v = (input || "").trim();
  if (!v) return "";
  if (v.startsWith("http://") || v.startsWith("https://")) return v;
  if (v.startsWith("@")) return `https://instagram.com/${v.slice(1)}`;
  return `https://${v}`;
}

function onlyDigits(str) {
  return (str || "").replace(/\D/g, "");
}

function toE164BR(raw) {
  const d = onlyDigits(raw);
  if (!d) return "";
  if (d.startsWith("55") && d.length >= 12) return `+${d}`;
  if (d.length === 11) return `+55${d}`;
  if (d.length >= 10) return `+${d}`;
  return "";
}

export default function EditarPerfil() {
  const nav = useNavigate();
  const { user, profile, updateProfileData } = useAuth();

  const initial = useMemo(() => {
    return {
      displayName: profile?.displayName || user?.displayName || "",
      username: profile?.username || "",
      bio: profile?.bio || "",
      city: profile?.city || "",
      instagramUrl: profile?.instagramUrl || "",
      tiktokUrl: profile?.tiktokUrl || "",
      youtubeUrl: profile?.youtubeUrl || "",
      whatsappInput: profile?.whatsappE164 ? profile.whatsappE164.replace("+55", "") : "",
    };
  }, [profile, user]);

  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);

  useEffect(() => setForm(initial), [initial]);

  const whatsappVerified = !!profile?.whatsappVerified;

  function setField(key, value) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  async function save() {
    try {
      setSaving(true);

      const usernameClean = form.username.trim().replace(/^@/, "").replace(/\s+/g, "");
      const whatsappE164 = toE164BR(form.whatsappInput);

      await updateProfileData({
        displayName: form.displayName.trim(),
        username: usernameClean,
        bio: form.bio.trim(),
        city: form.city.trim(),

        instagramUrl: normalizeUrl(form.instagramUrl),
        tiktokUrl: normalizeUrl(form.tiktokUrl),
        youtubeUrl: normalizeUrl(form.youtubeUrl),

        whatsappE164: whatsappE164 || "",
        whatsappVerified: profile?.whatsappVerified || false,
      });

      alert("Perfil salvo ✅");
      nav("/", { replace: true });
    } catch (e) {
      console.error(e);
      alert("Erro ao salvar. Veja o console (F12).");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="editPage">
      <div className="editTop">
        <div>
          <h1>Editar Perfil</h1>
          <p>Deixe seu perfil completo. O WhatsApp só aparece após verificação.</p>
        </div>

        <div className="editActions">
          <button className="btnGhost" type="button" onClick={() => nav(-1)} disabled={saving}>
            Voltar
          </button>
          <button className="btnPrimary" type="button" onClick={save} disabled={saving}>
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>

      <div className="editGrid">
        <section className="editCard">
          <div className="cardTitle">Dados do perfil</div>

          <label className="label">Nome</label>
          <input
            className="input"
            value={form.displayName}
            onChange={(e) => setField("displayName", e.target.value)}
            placeholder="Seu nome"
          />

          <label className="label">Usuário</label>
          <input
            className="input"
            value={form.username}
            onChange={(e) => setField("username", e.target.value)}
            placeholder="ex: luis.turista"
          />

          <label className="label">Bio</label>
          <textarea
            className="textarea"
            value={form.bio}
            onChange={(e) => setField("bio", e.target.value)}
            placeholder="Fale sobre você..."
            rows={4}
          />

          <label className="label">Cidade</label>
          <input
            className="input"
            value={form.city}
            onChange={(e) => setField("city", e.target.value)}
            placeholder="ex: São Paulo, BR"
          />
        </section>

        <section className="editCard">
          <div className="cardTitle">Redes sociais</div>

          <label className="label">Instagram</label>
          <input
            className="input"
            value={form.instagramUrl}
            onChange={(e) => setField("instagramUrl", e.target.value)}
            placeholder="https://instagram.com/seuuser ou @seuuser"
          />

          <label className="label">TikTok</label>
          <input
            className="input"
            value={form.tiktokUrl}
            onChange={(e) => setField("tiktokUrl", e.target.value)}
            placeholder="https://tiktok.com/@seuuser"
          />

          <label className="label">YouTube</label>
          <input
            className="input"
            value={form.youtubeUrl}
            onChange={(e) => setField("youtubeUrl", e.target.value)}
            placeholder="https://youtube.com/@seucanal"
          />

          <div className="divider" />

          <div className="waRow">
            <div>
              <div className="labelRow">
                <span className="label">WhatsApp (Brasil)</span>
                <span className={`badge ${whatsappVerified ? "ok" : "no"}`}>
                  {whatsappVerified ? "Verificado" : "Não verificado"}
                </span>
              </div>

              <input
                className="input"
                value={form.whatsappInput}
                onChange={(e) => setField("whatsappInput", e.target.value)}
                placeholder="DDD + número (ex: 11999999999)"
              />

              {!whatsappVerified && (
                <div className="hint">
                  Para liberar o Whats no perfil, vamos fazer verificação por SMS (OTP) no próximo passo.
                </div>
              )}
            </div>

            <button
              className="btnGhost"
              type="button"
              onClick={() => alert("Próximo passo: verificação SMS (OTP) ✅")}
            >
              Verificar
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
