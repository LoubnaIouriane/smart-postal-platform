import { useEffect, useState } from "react";
import CommercialLayout from "../../components/commercial/CommercialLayout";
import DataTable from "../../components/commercial/DataTable";
import { getClients } from "../../services/commercialApi";

const COLUMNS = [
    { key: "raisonSociale", label: "Raison sociale" },
    { key: "email", label: "Email" },
    { key: "telephone", label: "Telephone" },
    { key: "ville", label: "Ville" },
    { key: "agence", label: "Agence" },
    { key: "statut", label: "Statut" },
];

export default function ClientList() {
    const [data, setData] = useState([]);
    useEffect(() => { getClients().then(setData); }, []);

    return (
        <CommercialLayout title="Clients" description="Portefeuille client (lecture seule)">
            <DataTable columns={COLUMNS} data={data} />
        </CommercialLayout>
    );
}