import { useEffect, useState } from "react";
import CommercialLayout from "../../components/commercial/CommercialLayout";
import DataTable from "../../components/commercial/DataTable";
import { useNavigate } from "react-router-dom";
import { getClients } from "../../services/commercialApi";


const COLUMNS = [
    {
        key: "raisonSociale",
        label: "Raison sociale"
    },
    {
        key: "email",
        label: "Email"
    },
    {
        key: "telephone",
        label: "Téléphone"
    },
    {
        key: "ville",
        label: "Ville",
        render: (row) => row.ville?.nomVille || "-"
    },
    {
        key: "agence",
        label: "Agence",
        render: (row) => row.agence?.nomAgence || "-"
    },
    {
        key: "statut",
        label: "Statut"
    }
];


export default function ClientList(){

    const [data,setData] = useState([]);

    const navigate = useNavigate();


    const load = () => {

        getClients()
            .then(setData);

    };


    useEffect(()=>{

        load();

    },[]);



    return (

        <CommercialLayout
            title="Clients"
            description="Portefeuille client"
        >


            <DataTable

                columns={COLUMNS}

                data={data}

                // pas de onEdit
                // pas de onDelete

                actions={(row)=>(

                    row.statut === "ACTIF" && (

                        <button
                            className="commercial-btn-add"
                            onClick={() =>
                                navigate(`/commercial/clients/${row.idUtilisateur}/remise`)
                            }
                        >
                            Ajouter remise
                        </button>

                    )

                )}

            />


        </CommercialLayout>

    );

}