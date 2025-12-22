import { useMemo, useState } from "react";
import "../styles/planos.css";

const BASE_PLANOS = [
  {
    id: "basico",
    nome: "Básico",
    preco: 0,
    periodo: "Grátis",
    descricao: "Para testar o app e planejar sua primeira viagem",
    icon: "✨",
    theme: "gray",
    badge: "Comece aqui",
    rankMult: 0.5,
    beneficios: [
      "1 reserva por mês",
      "Explorar cidades limitado",
      "Favoritos (até 3)",
      "Ranking ativo (menos pontos)",
      "Mapas básicos",
    ],
    limitacoes: ["Sem modo offline", "Sem cultura detalhada", "Sem recomendações personalizadas"],
    cta: "Escolher Plano",
  },
  {
    id: "diario",
    nome: "Premium Diário",
    preco: 7.9,
    periodo: "24h",
    descricao: "Ideal para quem vai viajar agora",
    icon: "⚡",
    theme: "blue",
    rankMult: 1.0,
    beneficios: [
      "Reservas ilimitadas por 24h",
      "Explorar cidades completo",
      "Favoritos ilimitados",
      "Ranking normal",
      "Modo offline (limitado)",
    ],
    limitacoes: ["Contém anúncios leves", "Offline: 2 cidades / 10 lugares"],
    cta: "Escolher Plano",
  },
  {
    id: "mensal",
    nome: "Turista Ilimitado",
    preco: 34.9,
    periodo: "30 dias",
    descricao: "Acesso completo ao app sem limites",
    icon: "🌟",
    theme: "orange",
    destaque: true,
    badge: "Mais Popular",
    rankMult: 1.0,
    beneficios: [
      "Tudo do Premium Diário",
      "Sem anúncios",
      "Cultura e o que fazer",
      "Favoritos ilimitados",
      "Modo offline ilimitado",
      "Ranking com pontuação cheia",
      "Selo Viajante Ilimitado",
    ],
    cta: "Recomendado",
  },
  {
    id: "semestral",
    nome: "Turista Semestral",
    preco: 149.9,
    periodo: "6 meses",
    descricao: "Mais vantagens para quem viaja sempre",
    icon: "👑",
    theme: "purple",
    badge: "VIP",
    rankMult: 1.2,
    beneficios: [
      "Tudo do plano Ilimitado",
      "Suporte prioritário",
      "Ranking com bônus de pontos",
      "Acesso antecipado a novidades",
      "Descontos em parceiros",
    ],
    cta: "Escolher Plano",
  },
  {
    id: "anual",
    nome: "Turista Anual",
    preco: 249.9,
    periodo: "12 meses",
    descricao: "Melhor custo-benefício + status VIP",
    icon: "💚",
    theme: "green",
    badge: "Melhor Valor",
    rankMult: 1.5,
    beneficios: [
      "Tudo dos outros planos",
      "Badge VIP no perfil",
      "Ranking com multiplicador",
      "Recompensas exclusivas",
      "Benefícios surpresa",
      "Acesso antecipado a novos recursos",
    ],
    cta: "Melhor Valor",
  },
];

export default function Planos() {
  // plano atual persistido
  const [currentPlanId, setCurrentPlanId] = useState(() => {
    return localStorage.getItem("turistaapp_plan") || "basico";
  });

  // modal pagamento
  const [openPay, setOpenPay] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [payMethod, setPayMethod] = useState("pix"); // pix | card

  // cartao (mock)
  const [card, setCard] = useState({ name: "", number: "", exp: "", cvv: "" });

  // lista derivada (current calculado)
  const PLANOS = useMemo(() => {
    return BASE_PLANOS.map((p) => ({
      ...p,
      current: p.id === currentPlanId,
    }));
  }, [currentPlanId]);

  // pix copia e cola (mock)
  const pixCode = useMemo(() => {
    if (!selectedPlan) return "";
    return `00020101021226880014br.gov.bcb.pix2563pix.mock.turistaapp/${selectedPlan.id}520400005303986540${String(
      Math.round((selectedPlan.preco || 0) * 100)
    ).padStart(6, "0")}5802BR5920TURISTAAPP LTDA6009SAO PAULO62120508TURISTA6304ABCD`;
  }, [selectedPlan]);

  function escolherPlano(planoId) {
    if (planoId === currentPlanId) return;

    const plano = BASE_PLANOS.find((p) => p.id === planoId);
    if (!plano) return;

    // plano básico não precisa pagar
    if (plano.id === "basico") {
      ativarPlano("basico");
      return;
    }

    setSelectedPlan(plano);
    setPayMethod("pix");
    setOpenPay(true);
  }

  function ativarPlano(planoId) {
    setCurrentPlanId(planoId);
    localStorage.setItem("turistaapp_plan", planoId);
    setOpenPay(false);
    setSelectedPlan(null);
    alert("Plano ativado ✅");
  }

  function cancelarAssinatura() {
    if (currentPlanId === "basico") return;
    const ok = confirm("Tem certeza que deseja cancelar? Você voltará para o plano Básico.");
    if (!ok) return;
    ativarPlano("basico");
  }

  return (
    <div className="planos-page">
      <header className="planos-header">
        <h1>
          Planos de <span>Assinatura</span>
        </h1>
        <p>Escolha o plano ideal para sua jornada turística 🌍</p>

        <div className="planos-current">
          <span className="planos-currentLabel">Plano atual:</span>
          <strong className="planos-currentValue">
            {PLANOS.find((p) => p.id === currentPlanId)?.nome || "Básico"}
          </strong>

          {currentPlanId !== "basico" && (
            <button className="planos-cancel" type="button" onClick={cancelarAssinatura}>
              Cancelar assinatura
            </button>
          )}
        </div>
      </header>

      <div className="planos-grid">
        {PLANOS.map((plano) => (
          <div
            key={plano.id}
            className={`plano-card theme-${plano.theme} ${plano.destaque ? "destaque" : ""}`}
          >
            <div className="plano-top">
              <div className="plano-icon">{plano.icon}</div>

              <div className="plano-badges">
                {plano.current && <span className="badge green">Plano Atual</span>}
                {plano.badge && <span className="badge orange">{plano.badge}</span>}
              </div>
            </div>

            <h2 className="plano-title">{plano.nome}</h2>
            <p className="plano-desc">{plano.descricao}</p>

            <div className="plano-price">
              <div className="price-main">
                {plano.preco === 0 ? "R$ 0,00" : `R$ ${plano.preco.toFixed(2)}`}
              </div>
              <div className="price-sub">/ {plano.periodo}</div>
            </div>

            <div className="plano-rank">
              <span>Ranking</span>
              <strong>x{String(plano.rankMult).replace(".", ",")} pontos</strong>
            </div>

            <ul className="plano-list">
              {plano.beneficios.map((b, i) => (
                <li key={i}>
                  <span className="dot ok">✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            {plano.limitacoes?.length ? (
              <ul className="plano-list subtle">
                {plano.limitacoes.map((l, i) => (
                  <li key={i}>
                    <span className="dot warn">!</span>
                    <span>{l}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            <button
              className="plano-cta"
              onClick={() => escolherPlano(plano.id)}
              disabled={plano.current}
              type="button"
            >
              {plano.current ? "Plano Atual" : plano.cta}
            </button>
          </div>
        ))}
      </div>

      {/* MODAL PAGAMENTO */}
      {openPay && selectedPlan && (
        <div className="pay-overlay" role="presentation" onClick={() => setOpenPay(false)}>
          <div className="pay-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div className="pay-head">
              <div>
                <div className="pay-title">Finalizar assinatura</div>
                <div className="pay-sub">
                  Plano <strong>{selectedPlan.nome}</strong> •{" "}
                  <strong>{`R$ ${selectedPlan.preco.toFixed(2)}`}</strong> / {selectedPlan.periodo}
                </div>
              </div>

              <button className="pay-close" type="button" onClick={() => setOpenPay(false)} aria-label="Fechar">
                ✕
              </button>
            </div>

            <div className="pay-methods">
              <button
                className={`pay-tab ${payMethod === "pix" ? "active" : ""}`}
                type="button"
                onClick={() => setPayMethod("pix")}
              >
                Pix
              </button>
              <button
                className={`pay-tab ${payMethod === "card" ? "active" : ""}`}
                type="button"
                onClick={() => setPayMethod("card")}
              >
                Cartão
              </button>
            </div>

            {payMethod === "pix" ? (
              <div className="pay-body">
                <div className="pay-box">
                  <div className="pay-boxTitle">Pix Copia e Cola</div>
                  <textarea className="pay-pix" readOnly value={pixCode} />
                  <div className="pay-row">
                    <button
                      className="pay-btn"
                      type="button"
                      onClick={async () => {
                        await navigator.clipboard.writeText(pixCode);
                        alert("Código Pix copiado ✅");
                      }}
                    >
                      Copiar código
                    </button>

                    <button className="pay-btn ghost" type="button" onClick={() => ativarPlano(selectedPlan.id)}>
                      Já paguei
                    </button>
                  </div>
                  <div className="pay-hint">Pagamento via Pix. (mock) Clique “Já paguei” para ativar.</div>
                </div>

                <div className="pay-note">
                  <div className="pay-noteTitle">O que você ganha</div>
                  <ul className="pay-miniList">
                    {selectedPlan.beneficios.slice(0, 6).map((b, i) => (
                      <li key={i}>✓ {b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="pay-body">
                <div className="pay-box">
                  <div className="pay-boxTitle">Pagamento com cartão</div>

                  <div className="pay-grid">
                    <div className="pay-field">
                      <label>Nome no cartão</label>
                      <input
                        value={card.name}
                        onChange={(e) => setCard((p) => ({ ...p, name: e.target.value }))}
                        placeholder="Seu nome"
                      />
                    </div>

                    <div className="pay-field">
                      <label>Número</label>
                      <input
                        value={card.number}
                        onChange={(e) => setCard((p) => ({ ...p, number: e.target.value }))}
                        placeholder="0000 0000 0000 0000"
                      />
                    </div>

                    <div className="pay-field small">
                      <label>Validade</label>
                      <input
                        value={card.exp}
                        onChange={(e) => setCard((p) => ({ ...p, exp: e.target.value }))}
                        placeholder="MM/AA"
                      />
                    </div>

                    <div className="pay-field small">
                      <label>CVV</label>
                      <input
                        value={card.cvv}
                        onChange={(e) => setCard((p) => ({ ...p, cvv: e.target.value }))}
                        placeholder="123"
                      />
                    </div>
                  </div>

                  <button className="pay-btn full" type="button" onClick={() => ativarPlano(selectedPlan.id)}>
                    Pagar agora
                  </button>

                  <div className="pay-hint">Pagamento (mock). Clique “Pagar agora” para ativar.</div>
                </div>

                <div className="pay-note">
                  <div className="pay-noteTitle">Resumo</div>
                  <div className="pay-resume">
                    <div>
                      <span>Plano</span>
                      <strong>{selectedPlan.nome}</strong>
                    </div>
                    <div>
                      <span>Total</span>
                      <strong>{`R$ ${selectedPlan.preco.toFixed(2)}`}</strong>
                    </div>
                    <div>
                      <span>Cobrança</span>
                      <strong>{selectedPlan.periodo}</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
