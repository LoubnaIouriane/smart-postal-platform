import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import CommercialLayout from "../../components/commercial/CommercialLayout";

import { getContratById } from "../../services/commercialApi";


export default function ContratDetails(){


    const { id } = useParams();


    const [contrat,setContrat] = useState(null);



    useEffect(()=>{

        getContratById(id)
            .then(setContrat)
            .catch(console.error);


    },[id]);




    if(!contrat){

        return (

            <CommercialLayout title="Détails contrat">

                <p>Chargement...</p>

            </CommercialLayout>

        );

    }




    return (

        <CommercialLayout
            title="Détails contrat"
            description="Informations du contrat client"
        >


            <div className="commercial-stat-card">


                <h3>
                    Numéro contrat
                </h3>

                <p>
                    {contrat.numeroContrat}
                </p>



                <h3>
                    Dates
                </h3>

                <p>
                    {contrat.dateDebut}
                    {" → "}
                    {contrat.dateFin}
                </p>




                <h3>
                    Statut
                </h3>

                <p>
                    {contrat.statut}
                </p>




                <h3>
                    Conditions
                </h3>


                <p>
                    {contrat.conditions || "Aucune condition"}
                </p>



            </div>


        </CommercialLayout>

    );

}