import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CommercialLayout from "../../components/commercial/CommercialLayout";
import DataTable from "../../components/commercial/DataTable";
import ContractStatusBadge from "../../components/commercial/ContractStatusBadge";
import { getContrats, deleteContrat } from "../../services/commercialApi";

const COLUMNS = [
    { key: "numeroContrat", label: "N° Contrat" },
    { key: "dateDebut", label: "Debut" },
    { key: "dateFin", label: "Fin" },
    { key: "statut", label: "Statut", render: (row) => <ContractStatusBadge statut={row.statut} /> },
];

export default function ContratList() {
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const load = () => getContrats().then(setData);
    useEffect(() => { load(); }, []);

    const handleDelete = async (row) => {
        if (confirm(`Supprimer le contrat ${row.numeroContrat} ?`)) {
            await deleteContrat(row.idContrat);
            load();
        }
    };

    return (
        <CommercialLayout title="Contrats" description="Gestion des contrats clients">
            <div style={{ marginBottom: 16, textAlign: "right" }}>
                <button className="commercial-btn-add" onClick={() => navigate("/commercial/contrats/nouveau")}>
                    + Ajouter un contrat
                </button>
            </div>
            <DataTable
                columns={COLUMNS}
                data={data}
                onEdit={(row) => navigate(`/commercial/contrats/${row.idContrat}`)}
                onDelete={handleDelete}
            />
        </CommercialLayout>
    );
}