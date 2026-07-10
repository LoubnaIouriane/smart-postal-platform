import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CommercialLayout from "../../components/commercial/CommercialLayout";
import DataTable from "../../components/commercial/DataTable";
import { getGrilles, deleteGrille } from "../../services/commercialApi";

const COLUMNS = [
    { key: "nomGrille", label: "Nom" },
    { key: "tauxRemise", label: "Taux de remise (%)" },
];

export default function GrilleRemiseList() {
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const load = () => getGrilles().then(setData);
    useEffect(() => { load(); }, []);

    const handleDelete = async (row) => {
        if (confirm(`Supprimer la grille ${row.nomGrille} ?`)) {
            await deleteGrille(row.idGrille);
            load();
        }
    };

    return (
        <CommercialLayout title="Grilles de remise">
            <div style={{ marginBottom: 16, textAlign: "right" }}>
                <button className="commercial-btn-add" onClick={() => navigate("/commercial/grilles-remise/nouveau")}>
                    + Ajouter une grille
                </button>
            </div>
            <DataTable
                columns={COLUMNS}
                data={data}
                onEdit={(row) => navigate(`/commercial/grilles-remise/${row.idGrille}`)}
                onDelete={handleDelete}
            />
        </CommercialLayout>
    );
}