import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/layout/Navbar";
import { expeditionService } from "../../services/expeditionService";
import factureService from "../../services/factureService";
import {
    PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, LineChart, Line,
} from "recharts";

const COLORS = ["#F58220", "#3D6EA5", "#2F9E63", "#D9534F"];

const MENUS = {
    CLIENT: [
        { label: "Nouvelle expédition", desc: "Créer une nouvelle demande d'envoi", to: "/client/expeditions", icon: "📦" },
        { label: "Mes expéditions", desc: "Suivre l'état de mes colis", to: "/client/expeditions", icon: "🚚" },
        { label: "Suivre mes expéditions", desc: "Rechercher un colis par code de suivi", to: "/tracking", icon: "🔍" },
        { label: "Mes factures", desc: "Consulter mon historique de facturation", to: "/client/factures", icon: "🧾" },
        { label: "Mon profil", desc: "Modifier mes informations", to: "/profile", icon: "👤" },
    ],
    FACTEUR: [
        { label: "Collectes du jour", desc: "Expéditions à récupérer", to: "/facteur/collecte", icon: "📮", large: true },
    ],
};

function PostierIllustration() {
    return (
        <svg width="120" height="120" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="95" fill="var(--yellow-50, #FFF4E8)" />
            <circle cx="100" cy="70" r="26" fill="var(--orange-400, #F58220)" />
            <rect x="74" y="95" width="52" height="60" rx="14" fill="var(--blue-500, #14315C)" />
            <rect x="60" y="100" width="18" height="45" rx="8" fill="var(--blue-500, #14315C)" />
            <rect x="120" y="100" width="18" height="30" rx="8" fill="var(--blue-500, #14315C)" />
            <rect x="118" y="118" width="26" height="20" rx="3" fill="var(--orange-400, #F58220)" />
            <path d="M60 62 q40 -30 80 0 l-6 16 q-34 -22 -68 0 z" fill="var(--blue-500, #14315C)" />
            <circle cx="100" cy="58" r="3" fill="#fff" />
        </svg>
    );
}

export default function Dashboard() {
    const { role, userId } = useAuth();
    const navigate = useNavigate();
    const items = MENUS[role] || [];
    const isFacteur = role === "FACTEUR";
    const isClient = role === "CLIENT";

    const [expeditions, setExpeditions] = useState([]);
    const [factures, setFactures] = useState([]);

    useEffect(() => {
        if (isClient) {
            expeditionService.getAll().then((data) => {
                setExpeditions(data);
                if (data.length > 0) console.log("Structure d'une expedition (dashboard client) :", data[0]);
            }).catch(console.error);

            if (userId) {
                factureService.getByClient(userId).then(setFactures).catch(console.error);
            }
        }
    }, [isClient, userId]);

    // ---- CLIENT : 1. Donut expeditions par statut ----
    const parStatut = {};
    expeditions.forEach((e) => { parStatut[e.statut] = (parStatut[e.statut] || 0) + 1; });
    const donutExpeditions = Object.entries(parStatut).map(([name, value]) => ({ name, value }));

    // ---- CLIENT : 2. Histogramme expeditions par mois ----
    function getDateExpedition(e) {
        return e.dateCreation ?? e.dateEnvoi ?? e.createdAt ?? null;
    }
    const expeditionsParMois = {};
    expeditions.forEach((e) => {
        const date = getDateExpedition(e);
        if (!date) return;
        const mois = date.slice(0, 7);
        expeditionsParMois[mois] = (expeditionsParMois[mois] || 0) + 1;
    });
    const barExpeditions = Object.entries(expeditionsParMois)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([mois, valeur]) => ({ mois, valeur }));

    // ---- CLIENT : 3. Courbe depenses par mois ----
    const depensesParMois = {};
    factures.forEach((f) => {
        if (!f.dateEmission) return;
        const mois = f.dateEmission.slice(0, 7);
        depensesParMois[mois] = (depensesParMois[mois] || 0) + (f.montantTTC || 0);
    });
    const lineDepenses = Object.entries(depensesParMois)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([mois, total]) => ({ mois, total }));

    return (
        <>
            <Navbar />
            <div style={{ padding: "40px 48px", minHeight: "calc(100vh - 60px)" }}>
                <h1 style={{ marginBottom: 8, fontSize: 28 }}>Tableau de bord — {role}</h1>
                <p style={{ color: "var(--color-text-muted)", marginBottom: 32 }}>
                    Bienvenue sur votre espace Smart Postal Platform
                </p>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: isFacteur ? "1fr" : "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: 24,
                    maxWidth: isFacteur ? 720 : "100%",
                    marginBottom: 40,
                }}>
                    {items.map((item) => (
                        <div
                            key={item.label}
                            onClick={() => navigate(item.to)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === "Enter" && navigate(item.to)}
                            style={{
                                background: "var(--color-surface)",
                                border: "1px solid var(--color-border)",
                                borderRadius: 18,
                                boxShadow: "0 4px 16px rgba(20,49,92,0.08)",
                                padding: item.large ? "36px 40px" : "28px 24px",
                                cursor: "pointer",
                                transition: "transform 0.15s ease, box-shadow 0.15s ease",
                                display: "flex",
                                alignItems: "center",
                                gap: 24,
                                minHeight: item.large ? 160 : 130,
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-4px)";
                                e.currentTarget.style.boxShadow = "0 10px 28px rgba(20,49,92,0.16)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 4px 16px rgba(20,49,92,0.08)";
                            }}
                        >
                            <div style={{ fontSize: item.large ? 40 : 30 }}>{item.icon}</div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: item.large ? 22 : 17, marginBottom: 6, color: "var(--color-primary)" }}>
                                    {item.label}
                                </h3>
                                <p style={{ fontSize: item.large ? 15 : 13, color: "var(--color-text-muted)", margin: 0 }}>
                                    {item.desc}
                                </p>
                            </div>
                            {item.large && <PostierIllustration />}
                        </div>
                    ))}
                </div>

                {isClient && (
                    <>
                        <h2 style={{ fontSize: 20, marginBottom: 20 }}>Mes statistiques</h2>
                        <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
                            {donutExpeditions.length > 0 && (
                                <div style={{ width: 340, height: 300 }}>
                                    <h3>Mes expéditions</h3>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={donutExpeditions} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90}>
                                                {donutExpeditions.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                            </Pie>
                                            <Legend /><Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            )}

                            {barExpeditions.length > 0 ? (
                                <div style={{ width: 420, height: 300 }}>
                                    <h3>Expéditions par mois</h3>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={barExpeditions}>
                                            <XAxis dataKey="mois" /><YAxis allowDecimals={false} /><Tooltip />
                                            <Bar dataKey="valeur" fill="#3D6EA5" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : expeditions.length > 0 && (
                                <p style={{ color: "#9098b0", alignSelf: "center" }}>
                                    Graphique "par mois" indisponible — aucune date exploitable (voir Console).
                                </p>
                            )}

                            {lineDepenses.length > 0 && (
                                <div style={{ width: 420, height: 300 }}>
                                    <h3>Dépenses par mois (DH)</h3>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={lineDepenses}>
                                            <XAxis dataKey="mois" /><YAxis /><Tooltip />
                                            <Line type="monotone" dataKey="total" stroke="#F58220" strokeWidth={2} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </>
    );
}