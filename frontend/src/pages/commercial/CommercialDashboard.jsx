import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import CommercialLayout from "../../components/commercial/CommercialLayout";

import {
    getDashboardStatistiques,
    getPreInscriptions,
    getClients,
    getContrats,
} from "../../services/commercialApi";

import {
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, BarChart, Bar,
} from "recharts";

const COLORS = ["#0B3D6B", "#F58220", "#2F9E63", "#D9534F"];

export default function CommercialDashboard() {
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        nombreClients: 0,
        nombreContrats: 0,
        demandesEnAttente: 0,
    });

    const [notifications, setNotifications] = useState(0);
    const [clients, setClients] = useState([]);
    const [contrats, setContrats] = useState([]);
    const [preInscriptions, setPreInscriptions] = useState([]);

    useEffect(() => {
        getDashboardStatistiques().then(setStats).catch(console.error);

        getPreInscriptions().then((data) => {
            setNotifications(data.length);
            setPreInscriptions(data);
        }).catch(console.error);

        getClients().then((data) => {
            setClients(data);
            if (data.length > 0) {
                // DIAGNOSTIC : verifie si un champ date existe pour les graphiques par periode
                console.log("Structure d'un client (dashboard) :", data[0]);
            }
        }).catch(console.error);

        getContrats().then(setContrats).catch(console.error);
    }, []);

    // ---- PIE CHART : nbre clients / nbre demandes pre-inscription / nbre contrats ----
    const pieData = [
        { name: "Clients", value: stats.nombreClients },
        { name: "Pré-inscriptions", value: stats.demandesEnAttente },
        { name: "Contrats", value: stats.nombreContrats },
    ].filter((d) => d.value > 0);

    // ---- LINE CHART : nombre de clients par mois ----
    // Cherche un champ date parmi les noms possibles renvoyes par le backend
    function getDateClient(c) {
        return c.dateCreation ?? c.dateInscription ?? c.dateAdhesion ?? null;
    }
    const clientsParMois = {};
    clients.forEach((c) => {
        const date = getDateClient(c);
        if (!date) return;
        const mois = date.slice(0, 7); // "2026-08"
        clientsParMois[mois] = (clientsParMois[mois] || 0) + 1;
    });
    const lineData = Object.entries(clientsParMois)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([mois, valeur]) => ({ mois, valeur }));

    // ---- BAR CHART : nombre de pre-inscriptions par jour ----
    function getDatePreInscription(p) {
        return p.dateCreation ?? p.dateDemande ?? p.dateInscription ?? null;
    }
    const preInscriptionsParJour = {};
    preInscriptions.forEach((p) => {
        const date = getDatePreInscription(p);
        if (!date) return;
        const jour = date.slice(0, 10); // "2026-08-29"
        preInscriptionsParJour[jour] = (preInscriptionsParJour[jour] || 0) + 1;
    });
    const barData = Object.entries(preInscriptionsParJour)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([jour, valeur]) => ({ jour, valeur }));

    return (
        <CommercialLayout title="Dashboard Commercial" description="Vue générale de votre activité">

            {notifications > 0 && (
                <div
                    onClick={() => navigate("/commercial/preinscriptions")}
                    style={{
                        background: "#fff3cd",
                        padding: "15px",
                        borderRadius: "8px",
                        marginBottom: "25px",
                        cursor: "pointer",
                        fontWeight: "bold",
                    }}
                >
                    🔔 {notifications} nouvelle(s) demande(s) de pré-inscription à valider
                </div>
            )}

            <div className="commercial-stat-grid">
                <div className="commercial-stat-card" onClick={() => navigate("/commercial/clients")} style={{ cursor: "pointer" }}>
                    <h3>Clients</h3>
                    <h1>{stats.nombreClients}</h1>
                </div>

                <div className="commercial-stat-card" onClick={() => navigate("/commercial/contrats")} style={{ cursor: "pointer" }}>
                    <h3>Contrats</h3>
                    <h1> {stats.nombreContrats}</h1>
                </div>

                <div className="commercial-stat-card" onClick={() => navigate("/commercial/preinscriptions")} style={{ cursor: "pointer" }}>
                    <h3>Pré-inscriptions</h3>
                    <h1>{stats.demandesEnAttente}</h1>
                </div>
            </div>

             <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 20 }}>
                <button className="commercial-btn-add" onClick={() => navigate("/commercial/clients")}>👥 Gérer les clients</button>
                <button className="commercial-btn-add" onClick={() => navigate("/commercial/preinscriptions")}>📝 Valider les pré-inscriptions</button>
                <button className="commercial-btn-add" onClick={() => navigate("/commercial/contrats")}>📄 Gérer les contrats</button>
                
            </div>

            {/* ==================== GRAPHIQUES ==================== */}
            <div style={{ display: "flex", gap: 32, flexWrap: "wrap", marginTop: 40 }}>

                {pieData.length > 0 && (
                    <div style={{ width: 340, height: 300 }}>
                        <h3>Répartition globale</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90}>
                                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Legend /><Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {lineData.length > 0 ? (
                    <div style={{ width: 420, height: 300 }}>
                        <h3>Nombre de clients par mois</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={lineData}>
                                <XAxis dataKey="mois" /><YAxis allowDecimals={false} /><Tooltip />
                                <Line type="monotone" dataKey="valeur" stroke="#0B3D6B" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <p style={{ color: "#9098b0", alignSelf: "center" }}>
                        Graphique "clients par mois" indisponible — aucune date exploitable trouvée (voir Console).
                    </p>
                )}

                {barData.length > 0 ? (
                    <div style={{ width: 420, height: 300 }}>
                        <h3>Pré-inscriptions par jour</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData}>
                                <XAxis dataKey="jour" /><YAxis allowDecimals={false} /><Tooltip />
                                <Bar dataKey="valeur" fill="#F58220" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <p style={{ color: "#9098b0", alignSelf: "center" }}>
                        Graphique "pré-inscriptions par jour" indisponible — aucune date exploitable trouvée (voir Console).
                    </p>
                )}
            </div>

           
        </CommercialLayout>
    );
}