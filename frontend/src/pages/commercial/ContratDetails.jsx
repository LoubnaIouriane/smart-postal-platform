import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CommercialLayout from "../../components/commercial/CommercialLayout";
import ContractStatusBadge from "../../components/commercial/ContractStatusBadge";
import api from "../../services/api";
import { getRemisesByClient } from "../../services/commercialApi";

export default function ContratDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [contrat, setContrat] = useState(null);
    const [remises, setRemises] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        api.get(`/commercial/contrats/${id}`)
            .then((res) => {
                setContrat(res.data);
                if (res.data.clientId) {
                    return getRemisesByClient(res.data.clientId);
                }
                return [];
            })
            .then(setRemises)
            .catch((err) => {
                console.error("Erreur chargement details contrat :", err);
                setError("Impossible de charger les détails de ce contrat");
            });
    }, [id]);

    if (error) {
        return (
            <CommercialLayout title="Détails du contrat">
                <p style={{ color: "#D9534F" }}>{error}</p>
            </CommercialLayout>
        );
    }

    if (!contrat) {
        return (
            <CommercialLayout title="Détails du contrat">
                <p>Chargement...</p>
            </CommercialLayout>
        );
    }

    // CORRIGE : tri par chiffre d'affaires minimum croissant
    const remisesTriees = [...remises].sort((a, b) => a.montantMin - b.montantMin);

    return (
        <CommercialLayout
            title={`Contrat ${contrat.numeroContrat}`}
            description="Détails du contrat et remises associées"
        >
            <div className="commercial-table-wrap" style={{ padding: 24, marginBottom: 24 }}>
                <h3 style={{ marginTop: 0, color: "#0B3D6B" }}>Informations générales</h3>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
                    <div>
                        <strong>N° Contrat :</strong> {contrat.numeroContrat}
                    </div>
                    <div>
                        <strong>Statut :</strong> <ContractStatusBadge statut={contrat.statut} />
                    </div>
                    <div>
                        <strong>Client :</strong> {contrat.clientNom || "-"}
                    </div>
                    <div>
                        <strong>N° Client :</strong> {contrat.clientId || "-"}
                    </div>
                    <div>
                        <strong>Date début :</strong> {contrat.dateDebut}
                    </div>
                    <div>
                        <strong>Date fin :</strong> {contrat.dateFin}
                    </div>
                </div>

                {contrat.conditions && (
                    <div style={{ marginTop: 16 }}>
                        <strong>Conditions du contrat :</strong>
                        <p style={{ whiteSpace: "pre-wrap", marginTop: 4, color: "#5C6773" }}>
                            {contrat.conditions}
                        </p>
                    </div>
                )}
            </div>

            <div className="commercial-table-wrap" style={{ padding: 24 }}>
                <h3 style={{ marginTop: 0, color: "#0B3D6B" }}>Remises affectées à ce client</h3>

                {remisesTriees.length === 0 ? (
                    <p style={{ color: "#9098b0" }}>Aucune remise affectée pour ce client.</p>
                ) : (
                    <table className="commercial-table">
                        <thead>
                            <tr>
                                <th>Chiffre d'affaires min</th>
                                <th>Chiffre d'affaires max</th>
                                <th>Taux de remise</th>
                            </tr>
                        </thead>
                        <tbody>
                            {remisesTriees.map((r, index) => (
                                <tr key={r.id ?? r.idRemise ?? index}>
                                    <td>{r.montantMin} DH</td>
                                    <td>{r.montantMax ? `${r.montantMax} DH` : "et plus"}</td>
                                    <td>{r.tauxRemise} %</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <button
                className="commercial-btn-add"
                style={{ marginTop: 20 }}
                onClick={() => navigate("/commercial/contrats")}
            >
                ⬅ Retour à la liste
            </button>
        </CommercialLayout>
    );
}