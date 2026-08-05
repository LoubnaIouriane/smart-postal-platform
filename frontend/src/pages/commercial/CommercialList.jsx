import { useEffect, useState } from "react";

import CommercialLayout from "../../components/commercial/CommercialLayout";
import DataTable from "../../components/commercial/DataTable";
import { getCommerciaux } from "../../services/commercialApi";


const COLUMNS = [
    { key: "nom", label: "Nom" },
    { key: "prenom", label: "Prenom" },
    { key: "email", label: "Email" },
    { key: "telephone", label: "Telephone" },
    { key: "agenceNom", label: "Agence" },
];


export default function CommercialList() {


    const [data, setData] = useState([]);



    const load = () => {

        getCommerciaux()
            .then(setData)
            .catch(console.error);

    };



    useEffect(() => {

        load();

    }, []);




    return (

        <CommercialLayout
            title="Commerciaux"
            description="Liste des comptes commerciaux"
        >


            <DataTable
                columns={COLUMNS}
                data={data}
            />


        </CommercialLayout>

    );

}