import { useEffect, useState } from "react";
import { expeditionService } from "../../services/expeditionService";
import "../../components/expedition/expedition.css";

export default function FacteurCollectePage() {
    const [expeditions, setExpeditions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [poidsSaisis, setPoidsSaisis] = useState({});
    const [messageParExpedition, setMessageParExpedition] = useState({});
    const [enCoursId, setEnCoursId] = useState(null);

    const chargerListe = () => {
        setLoading(true);
        expeditionService
            .getACollecter()
            .then(setExpeditions)
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        chargerListe();
    }, []);

    const handlePoidsChange = (id, value) => {
        setPoidsSaisis({ ...poidsSaisis, [id]: value });
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
                [id]: { type: "success", texte: "Collecte validée avec succès !" },
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

    if (loading) return <p style={{ padding: "24px" }}>Chargement des expéditions à collecter...</p>;

    return (
        <div style={{ padding: "24px" }}>
            <div className="expedition-list">
                <h2>Expéditions à collecter</h2>

                {expeditions.length === 0 ? (
                    <p>Aucune expédition en attente de collecte pour le moment.</p>
                ) : (
                    <table>
                        <thead>
                        <tr>
                            <th>Code</th>
                            <th>Type</th>
                            <th>Départ</th>
                            <th>Destination</th>
                            <th>Poids déclaré</th>
                            <th>Poids réel</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {expeditions.map((exp) => (
                            <tr key={exp.idExpedition}>
                                <td>{exp.codeTracking}</td>
                                <td>{exp.typeEnvoi}</td>
                                <td>{exp.villeDepart?.nomVille}</td>
                                <td>{exp.villeDestination?.nomVille}</td>
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
                                        <p
                                            style={{
                                                fontSize: "12px",
                                                marginTop: "4px",
                                                color:
                                                    messageParExpedition[exp.idExpedition].type === "success"
                                                        ? "#2E7D32"
                                                        : "#C0392B",
                                            }}
                                        >
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
    );
}