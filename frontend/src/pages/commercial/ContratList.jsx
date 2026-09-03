import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CommercialLayout from "../../components/commercial/CommercialLayout";
import { getContrats, deleteContrat } from "../../services/commercialApi";
import ContractStatusBadge from "../../components/commercial/ContractStatusBadge";

function getContratId(contrat) {
    return contrat.idContrat ?? contrat.id ?? contrat.contratId ?? null;
}

function getClientIdFromContrat(contrat) {
    return contrat.clientId ?? contrat.idClient ?? contrat.client_id ?? contrat.client?.idClient ?? null;
}

export default function ContratList() {
    const [data, setData] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const load = () => {
        getContrats()
            .then(setData)
            .catch((err) => {
                console.error("Erreur chargement contrats :", err);
                setError("Impossible de charger les contrats");
            });
    };

    useEffect(() => { load(); }, []);

    const allerVersGrille = (contrat) => {
        const clientId = getClientIdFromContrat(contrat);
        if (clientId === null) {
            alert("Impossible d'identifier le client de ce contrat.");
            return;
        }
        navigate(`/commercial/client-remise/${clientId}`);
    };

    const allerVersDetails = (contrat) => {
        const contratId = getContratId(contrat);
        if (contratId === null) {
            alert("Impossible d'identifier ce contrat.");
            return;
        }
        navigate(`/commercial/contrats/${contratId}/details`);
    };

    const handleSupprimer = async (contrat) => {
        const contratId = getContratId(contrat);
        if (contratId === null) return;

        if (!confirm(`Supprimer le contrat ${contrat.numeroContrat} ?`)) return;

        try {
            await deleteContrat(contratId);
            load();
        } catch (err) {
            console.error("Erreur suppression contrat :", err);
            alert("Erreur lors de la suppression du contrat");
        }
    };

    return (
        <CommercialLayout title="Contrats" description="Liste des contrats clients">

            <button
                className="commercial-btn-add"
                onClick={() => navigate("/commercial/contrats/nouveau")}
                style={{ marginBottom: 20 }}
            >
                + Ajouter contrat
            </button>

            {error && <p style={{ color: "#D9534F" }}>{error}</p>}

            <div className="commercial-table-wrap">
                <table className="commercial-table">
                    <thead>
                        <tr>
                            <th>N° Contrat</th>
                            <th>Num client</th>
                            <th>Nom client</th>
                            <th>Date début</th>
                            <th>Date fin</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 && !error && (
                            <tr><td colSpan={7} style={{ textAlign: "center", padding: 20, color: "#9098b0" }}>Aucun contrat pour le moment</td></tr>
                        )}
                        {data.map((contrat, index) => (
                            <tr key={getContratId(contrat) ?? `contrat-${index}`}>
                                <td>{contrat.numeroContrat}</td>
                                <td>{getClientIdFromContrat(contrat) ?? "-"}</td>
                                <td>{contrat.clientNom ?? "-"}</td>
                                <td>{contrat.dateDebut}</td>
                                <td>{contrat.dateFin}</td>
                                <td><ContractStatusBadge statut={contrat.statut} /></td>
                                <td style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                    <button
                                        className="commercial-btn-add"
                                        onClick={() => allerVersDetails(contrat)}
                                    >
                                        👁 Détails
                                    </button>
                                    <button
                                        className="commercial-btn-add"
                                        style={{ background: "#D9534F" }}
                                        onClick={() => handleSupprimer(contrat)}
                                    >
                                        🗑 Supprimer
                                    </button>
                                    <button
                                        className="commercial-btn-add"
                                        style={{ background: "#F58220" }}
                                        onClick={() => allerVersGrille(contrat)}
                                    >
                                        💳 Grille de remise
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </CommercialLayout>
    );
}