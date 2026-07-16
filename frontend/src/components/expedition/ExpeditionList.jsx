import { useEffect, useState } from "react";
import { expeditionService } from "../../services/expeditionService";
import "./expedition.css";

export default function ExpeditionList({ refreshTrigger }) {
    const [expeditions, setExpeditions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        expeditionService
            .getAll()
            .then(setExpeditions)
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
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
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}