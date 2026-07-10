import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CommercialLayout from "../../components/commercial/CommercialLayout";
import DataTable from "../../components/commercial/DataTable";
import { getCommerciaux, deleteCommercial } from "../../services/commercialApi";

const COLUMNS = [
    { key: "nom", label: "Nom" },
    { key: "prenom", label: "Prenom" },
    { key: "email", label: "Email" },
    { key: "telephone", label: "Telephone" },
    { key: "agenceNom", label: "Agence" },
];

export default function CommercialList() {
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    const load = () => getCommerciaux().then(setData);
    useEffect(() => { load(); }, []);

    const handleDelete = async (row) => {
        if (confirm(`Supprimer ${row.nom} ${row.prenom} ?`)) {
            await deleteCommercial(row.idCommercial);
            load();
        }
    };

    return (
        <CommercialLayout title="Commerciaux" description="Gestion des comptes commerciaux">
            <div style={{ marginBottom: 16, textAlign: "right" }}>
                <button className="commercial-btn-add" onClick={() => navigate("/commercial/commerciaux/nouveau")}>
                    + Ajouter un commercial
                </button>
            </div>
            <DataTable
                columns={COLUMNS}
                data={data}
                onEdit={(row) => navigate(`/commercial/commerciaux/${row.idCommercial}`)}
                onDelete={handleDelete}
            />
        </CommercialLayout>
    );
}