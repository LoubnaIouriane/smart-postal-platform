import { useEffect, useState } from "react";
import { expeditionService } from "../../services/expeditionService";
import "./expedition.css";

export default function ExpeditionList({ refreshTrigger }) {
    const [expeditions, setExpeditions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [annulationEnCours, setAnnulationEnCours] = useState(null);
    const [erreurAnnulation, setErreurAnnulation] = useState(null);

    const chargerListe = () => {
        setLoading(true);
        expeditionService
            .getAll()
            .then(setExpeditions)
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        chargerListe();
    }, [refreshTrigger]);

    const statutBadgeClass = (statut) => {
        switch (statut) {
            case "EN_ATTENTE": return "badge badge-attente";
            case "VALIDEE": return "badge badge-validee";
            case "ANNULEE": return "badge badge-annulee";
            case "COLLECTEE": return "badge badge-collectee";
            default: return "badge";
        }
    };

    const peutEtreAnnulee = (statut) => statut === "EN_ATTENTE" || statut === "VALIDEE";

    const handleAnnuler = async (id, codeTracking) => {
        const confirme = window.confirm(
            `Voulez-vous vraiment annuler l'expédition ${codeTracking} ?`
        );
        if (!confirme) return;

        setAnnulationEnCours(id);
        setErreurAnnulation(null);
        try {
            await expeditionService.annuler(id);
            chargerListe(); // rafraîchit la liste pour voir le nouveau statut
        } catch (err) {
            const message = err.response?.data?.error || "Erreur lors de l'annulation.";
            setErreurAnnulation({ id, message });
        } finally {
            setAnnulationEnCours(null);
        }
    };

    if (loading) return <p>Chargement des expéditions...</p>;

    return (
        <div className="expedition-list">
            <h2>Mes expéditions</h2>
            {expeditions.length === 0 ? (
                <p>Aucune expédition pour le moment.</p>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th>Code</th>
                        <th>Type</th>
                        <th>Statut</th>
                        <th>Départ</th>
                        <th>Destination</th>
                        <th>Poids</th>
                        <th>Montant</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {expeditions.map((exp) => (
                        <tr key={exp.idExpedition}>
                            <td>{exp.codeTracking}</td>
                            <td>{exp.typeEnvoi}</td>
                            <td><span className={statutBadgeClass(exp.statut)}>{exp.statut}</span></td>
                            <td>{exp.villeDepart?.nomVille}</td>
                            <td>{exp.villeDestination?.nomVille}</td>
                            <td>{exp.poids} kg</td>
                            <td>{exp.montant} DH</td>
                            <td>
                                {peutEtreAnnulee(exp.statut) ? (
                                    <>
                                        <button
                                            onClick={() => handleAnnuler(exp.idExpedition, exp.codeTracking)}
                                            disabled={annulationEnCours === exp.idExpedition}
                                            style={{
                                                width: "auto",
                                                padding: "6px 12px",
                                                fontSize: "12px",
                                                background: "#C0392B",
                                            }}
                                        >
                                            {annulationEnCours === exp.idExpedition ? "..." : "Annuler"}
                                        </button>
                                        {erreurAnnulation?.id === exp.idExpedition && (
                                            <p style={{ fontSize: "11px", color: "#C0392B", marginTop: "4px" }}>
                                                {erreurAnnulation.message}
                                            </p>
                                        )}
                                    </>
                                ) : (
                                    <span style={{ fontSize: "12px", color: "#999" }}>—</span>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}