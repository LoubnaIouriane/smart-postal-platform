import { useEffect, useState } from "react";
import CommercialLayout from "../../components/commercial/CommercialLayout";
import DataTable from "../../components/commercial/DataTable";
import { useNavigate } from "react-router-dom";
import { getClients } from "../../services/commercialApi";

const COLUMNS = [
    { key: "raisonSociale", label: "Raison sociale" },
    { key: "email", label: "Email" },
    { key: "telephone", label: "Téléphone" },
    // CORRIGE : ville/agence sont des chaines directes, pas des objets imbriques
    { key: "ville", label: "Ville", render: (row) => row.ville || "-" },
    { key: "agence", label: "Agence", render: (row) => row.agence || "-" },
    { key: "statut", label: "Statut" }
];

export default function ClientList() {
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    const load = () => {
        getClients().then(setData).catch(console.error);
    };

    useEffect(() => { load(); }, []);

    return (
        <CommercialLayout title="Clients" description="Portefeuille client">
            <DataTable
                columns={COLUMNS}
                data={data}
                actions={(row) => (
                    row.statut === "ACTIF" || row.statut === "VALIDE" ? (
                        <button
                            className="commercial-btn-add"
                            onClick={() => navigate(`/commercial/client-remise/${row.idUtilisateur}`)}
                        >
                            Ajouter remise
                        </button>
                    ) : null
                )}
            />
        </CommercialLayout>
    );
}