import { useEffect, useRef, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import "./AiChatWidget.css";

const CONFIG = {
  CLIENT: {
    subtitle: "Suivi et assistance de vos envois",
    hello:
      "Bonjour 👋 Je peux suivre vos colis, expliquer un statut et estimer un tarif.",
    suggestions: [
      "Quel est le statut de mon dernier colis ?",
      "Mes dernières expéditions",
      "Quel est le tarif pour 2 kg ?",
    ],
  },
  COMMERCIAL: {
    subtitle: "Assistant commercial",
    hello:
      "Bonjour 👋 Je peux résumer l'activité de vos clients et retrouver leurs expéditions.",
    suggestions: ["Liste mes clients", "Résume l'activité du client 1"],
  },
  ADMIN: {
    subtitle: "Assistant de pilotage",
    hello:
      "Bonjour 👋 Je peux analyser les statistiques, les tendances et les anomalies.",
    suggestions: [
      "Compare le nombre d'expéditions de ce mois avec celui du mois précédent",
      "Quelles anomalies dois-je examiner ?",
      "Tendance des 6 derniers mois",
    ],
  },
};

// key={token} : la conversation est réinitialisée à chaque changement d'utilisateur
export default function AiChatWidget() {
  const { isAuthenticated, role, token } = useAuth();
  if (!isAuthenticated || !CONFIG[role]) return null;
  return <Chat key={token} role={role} />;
}

function Chat({ role }) {
  const cfg = CONFIG[role];
  const [open, setOpen] = useState(false);
  const [xl, setXl] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, busy]);

  async function send(content) {
    const q = (content ?? text).trim();
    if (!q || busy) return;
    const history = msgs.map((m) => ({ role: m.role, content: m.content }));
    setMsgs((m) => [...m, { role: "user", content: q }]);
    setText("");
    setBusy(true);
    try {
      const { data } = await api.post(
        "/api/ai/chat",
        { message: q, history },
        { timeout: 180000 },
      );
      setMsgs((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch (e) {
      const msg =
        e.response?.status === 403
          ? "Accès refusé à l'assistant."
          : "Erreur de connexion à l'assistant.";
      setMsgs((m) => [...m, { role: "assistant", content: msg }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        className="ai-fab"
        onClick={() => setOpen(!open)}
        aria-label="Assistant IA"
      >
        {open ? "×" : "💬"}
      </button>
      {open && (
        <div className={`ai-box${xl ? " ai-xl" : ""}`}>
          <div className="ai-head">
            <div className="ai-avatar">IA</div>
            <div className="ai-title">
              <strong>Assistant Barid IA</strong>
              <small>{cfg.subtitle}</small>
            </div>
            {msgs.length > 0 && (
              <button onClick={() => setMsgs([])} title="Nouvelle conversation">
                ↺
              </button>
            )}
            <button
              onClick={() => setXl(!xl)}
              title={xl ? "Réduire" : "Agrandir"}
            >
              {xl ? "⤡" : "⤢"}
            </button>
            <button onClick={() => setOpen(false)} title="Fermer">
              ×
            </button>
          </div>

          <div className="ai-log">
            <div className="ai-msg assistant">{cfg.hello}</div>
            {msgs.length === 0 && (
              <>
                <div className="ai-hint">Suggestions :</div>
                <div className="ai-sugg-list">
                  {cfg.suggestions.map((q) => (
                    <button key={q} className="ai-sugg" onClick={() => send(q)}>
                      {q}
                    </button>
                  ))}
                </div>
              </>
            )}
            {msgs.map((m, i) => (
              <div key={i} className={`ai-msg ${m.role}`}>
                {m.content}
              </div>
            ))}
            {busy && (
              <div className="ai-msg assistant ai-typing">
                <span />
                <span />
                <span />
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="ai-input">
            <input
              value={text}
              maxLength={1000}
              placeholder="Posez votre question…"
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button onClick={() => send()} disabled={busy}>
              Envoyer
            </button>
          </div>
        </div>
      )}
    </>
  );
}
