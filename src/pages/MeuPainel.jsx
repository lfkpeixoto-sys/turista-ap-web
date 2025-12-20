import "../styles/painel.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

function safeUrl(u) {
  if (!u) return "";
  const v = u.trim();
  if (!v) return "";
  if (v.startsWith("http://") || v.startsWith("https://")) return v;
  if (v.startsWith("@")) return `https://instagram.com/${v.slice(1)}`;
  return `https://${v}`;
}

export default function MeuPainel() {
  const nav = useNavigate();
  const { user, profile } = useAuth();

  const name = profile?.displayName || user?.displayName || "Usuário";
  const username = profile?.username ? `@${profile.username}` : "@seu_usuario";
  const bio = profile?.bio || "Edite seu perfil para adicionar sua bio 🌎✨";
  const city = profile?.city || "Sua cidade";
  const avatarLetter = name.trim().charAt(0).toUpperCase();

  const instagramUrl = safeUrl(profile?.instagramUrl);
  const tiktokUrl = safeUrl(profile?.tiktokUrl);
  const youtubeUrl = safeUrl(profile?.youtubeUrl);

  const whatsappOk = !!profile?.whatsappVerified && !!profile?.whatsappE164;
  const whatsappUrl = whatsappOk ? `https://wa.me/${profile.whatsappE164.replace("+", "")}` : "";

  return (
    <div className="painelPage">
      <div className="painelHeader">
        <h1>
          Olá, {name}! <span className="wave">👋</span>
        </h1>
        <p>Bem-vindo ao seu painel de turista.</p>
      </div>

      <div className="painelGrid">
        {/* ESQUERDA */}
        <div className="painelMain">
          <div className="placeholderCard">
            <h3>Resumo</h3>
            <p>
              Próximo passo: vamos colocar <b>(2)</b> Próxima viagem/rolê aqui.
            </p>
          </div>
        </div>

        {/* DIREITA: PERFIL + REDES */}
        <aside className="painelSide">
          <div className="profileCard">
            <div className="profileTop">
              <div className="profileAvatar">{avatarLetter}</div>

              <div className="profileInfo">
                <div className="profileName">{name}</div>
                <div className="profileUser">{username}</div>
                <div className="profileBio">{bio}</div>

                <div className="profileMeta">
                  <span>📍 {city}</span>
                  <span>📧 {user?.email || "—"}</span>
                </div>
              </div>
            </div>

            <div className="profileActions">
              <button className="profileEditBtn" type="button" onClick={() => nav("/perfil/editar")}>
                Editar perfil
              </button>

              <button
                className="profileShareBtn"
                type="button"
                onClick={() => alert("Depois a gente faz o compartilhar ✅")}
              >
                Compartilhar
              </button>
            </div>

            <div className="profileSocial">
              <a
                className={`socialBtn ig ${instagramUrl ? "" : "disabled"}`}
                href={instagramUrl || "#"}
                onClick={(e) => {
                  if (!instagramUrl) {
                    e.preventDefault();
                    alert("Adicione seu Instagram em Editar Perfil ✅");
                  }
                }}
                target="_blank"
                rel="noreferrer"
              >
                📷 Instagram
              </a>

              <a
                className={`socialBtn wa ${whatsappOk ? "" : "disabled"}`}
                href={whatsappOk ? whatsappUrl : "#"}
                onClick={(e) => {
                  if (!whatsappOk) {
                    e.preventDefault();
                    alert("Verifique seu WhatsApp por SMS em Editar Perfil ✅");
                  }
                }}
                target="_blank"
                rel="noreferrer"
              >
                💬 WhatsApp
              </a>

              <a
                className={`socialBtn tt ${tiktokUrl ? "" : "disabled"}`}
                href={tiktokUrl || "#"}
                onClick={(e) => {
                  if (!tiktokUrl) {
                    e.preventDefault();
                    alert("Adicione seu TikTok em Editar Perfil ✅");
                  }
                }}
                target="_blank"
                rel="noreferrer"
              >
                🎵 TikTok
              </a>

              <a
                className={`socialBtn yt ${youtubeUrl ? "" : "disabled"}`}
                href={youtubeUrl || "#"}
                onClick={(e) => {
                  if (!youtubeUrl) {
                    e.preventDefault();
                    alert("Adicione seu YouTube em Editar Perfil ✅");
                  }
                }}
                target="_blank"
                rel="noreferrer"
              >
                ▶️ YouTube
              </a>
            </div>

            {!whatsappOk && (
              <div className="verifyHint">
                Para liberar o WhatsApp, verifique seu número por SMS em <b>Editar perfil</b>.
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}