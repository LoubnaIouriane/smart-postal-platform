import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import { expeditionService } from "../../services/expeditionService";
import "../../components/expedition/expedition.css";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#F58220", "#D9534F", "#2F9E63"];

export default function FacteurCollectePage() {
    const [expeditions, setExpeditions] = useState([]);
    const [toutes, setToutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [poidsSaisis, setPoidsSaisis] = useState({});
    const [messageParExpedition, setMessageParExpedition] = useState({});
    const [enCoursId, setEnCoursId] = useState(null);

    const chargerListe = () => {
        setLoading(true);
        Promise.all([expeditionService.getACollecter(), expeditionService.getAll()])
            .then(([aCollecter, all]) => {
                setExpeditions(aCollecter);
                setToutes(all);
                if (all.length > 0) {
                    console.log("Structure d'une expedition (facteur) :", all[0]);
                }
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        chargerListe();
    }, []);

    const handlePoidsChange = (id, value) => {
        setPoidsSaisis({ ...poidsSaisis, [id]: value });
    };

    const statutBadgeClass = (statut) => {
        switch (statut) {
            case "EN_ATTENTE": return "badge badge-attente";
            case "VALIDEE": return "badge badge-validee";
            default: return "badge";
        }
    };

    const handleValider = async (id) => {
        const poidsReel = parseFloat(poidsSaisis[id]);

        if (!poidsReel || poidsReel <= 0) {
            setMessageParExpedition({
                ...messageParExpedition,
                [id]: { type: "error", texte: "Merci de saisir un poids réel valide." },
            });
            return;
        }

        setEnCoursId(id);
        try {
            await expeditionService.enregistrerPoidsReel(id, poidsReel);
            setMessageParExpedition({
                ...messageParExpedition,
                [id]: { type: "success", texte: "Expédition validée et collectée avec succès !" },
            });
            setTimeout(() => chargerListe(), 1000);
        } catch (err) {
            const msg = err.response?.data?.error || "Erreur lors de la validation.";
            setMessageParExpedition({
                ...messageParExpedition,
                [id]: { type: "error", texte: msg },
            });
        } finally {
            setEnCoursId(null);
        }
    };

    // ---- Calendrier du jour ----
    function getDateExpedition(e) {
        return e.dateCreation ?? e.dateEnvoi ?? e.createdAt ?? null;
    }
    const aujourdHui = new Date().toISOString().slice(0, 10);
    const expeditionsAujourdHui = toutes.filter((e) => {
        const d = getDateExpedition(e);
        return d && d.slice(0, 10) === aujourdHui;
    });

    const colisADistribuer = expeditions.length; // deja calcule via getACollecter()
    const colisAnnulesAujourdHui = expeditionsAujourdHui.filter((e) => e.statut === "ANNULEE").length;
    const colisDejaDistribuesAujourdHui = expeditionsAujourdHui.filter(
        (e) => e.statut === "VALIDEE" || e.statut === "COLLECTEE"
    ).length;

    const donutData = [
        { name: "À collecter", value: colisADistribuer },
        { name: "Annulées (aujourd'hui)", value: colisAnnulesAujourdHui },
        { name: "Déjà distribuées (aujourd'hui)", value: colisDejaDistribuesAujourdHui },
    ].filter((d) => d.value > 0);

    if (loading) {
        return (
            <>
                <Navbar />
                <p style={{ padding: "24px" }}>Chargement des expéditions...</p>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div style={{ padding: "24px" }}>

                {/* ==================== CALENDRIER DU JOUR ==================== */}
                <h2 style={{ marginBottom: 16 }}>Aujourd'hui</h2>
                <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 32 }}>
                    <CalCard label="Colis à distribuer" value={colisADistribuer} color="#F58220" />
                    <CalCard label="Colis annulés" value={colisAnnulesAujourdHui} color="#D9534F" />
                    <CalCard label="Déjà distribués" value={colisDejaDistribuesAujourdHui} color="#2F9E63" />
                </div>

                {/* ==================== DONUT ==================== */}
                {donutData.length > 0 && (
                    <div style={{ width: 340, height: 300, marginBottom: 32 }}>
                        <h3>Mes collectes du jour</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={donutData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90}>
                                    {donutData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Legend /><Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* ==================== TABLEAU EXISTANT (inchange) ==================== */}
                <div className="expedition-list">
                    <h2>Expéditions à traiter</h2>

                    {expeditions.length === 0 ? (
                        <p>Aucune expédition à traiter pour le moment.</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Code</th>
                                    <th>Statut</th>
                                    <th>Type</th>
                                    <th>Départ</th>
                                    <th>Destination</th>
                                    <th>Destinataire</th>
                                    <th>Poids déclaré</th>
                                    <th>Poids réel</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expeditions.map((exp) => (
                                    <tr key={exp.idExpedition}>
                                        <td>{exp.codeTracking}</td>
                                        <td><span className={statutBadgeClass(exp.statut)}>{exp.statut.replace("_", " ")}</span></td>
                                        <td>{exp.typeEnvoi}</td>
                                        <td>{exp.villeDepart?.nomVille}</td>
                                        <td>{exp.villeDestination?.nomVille}</td>
                                        <td>{exp.nomDestinataire}</td>
                                        <td>{exp.poids} kg</td>
                                        <td>
                                            <input
                                                type="number"
                                                step="0.001"
                                                min="0.001"
                                                placeholder="kg"
                                                style={{ width: "80px", padding: "6px" }}
                                                value={poidsSaisis[exp.idExpedition] || ""}
                                                onChange={(e) => handlePoidsChange(exp.idExpedition, e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleValider(exp.idExpedition)}
                                                disabled={enCoursId === exp.idExpedition}
                                                style={{ width: "auto", padding: "8px 16px" }}
                                            >
                                                {enCoursId === exp.idExpedition ? "..." : "Valider la collecte"}
                                            </button>
                                            {messageParExpedition[exp.idExpedition] && (
                                                <p style={{
                                                    fontSize: "12px", marginTop: "4px",
                                                    color: messageParExpedition[exp.idExpedition].type === "success" ? "#2E7D32" : "#C0392B",
                                                }}>
                                                    {messageParExpedition[exp.idExpedition].texte}
                                                </p>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
}

function CalCard({ label, value, color }) {
    return (
        <div style={{
            background: "#fff", borderRadius: 12, padding: "20px 24px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)", minWidth: 180,
            borderLeft: `4px solid ${color}`,
        }}>
            <div style={{ fontSize: 28, fontWeight: 700, color }}>{value}</div>
            <div style={{ fontSize: 13, color: "#666" }}>{label}</div>
        </div>
    );
}