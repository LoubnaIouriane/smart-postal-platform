import { useEffect, useState } from "react";

import CommercialLayout from "../../components/commercial/CommercialLayout";

import {
    getPreInscriptions,
    validerPreInscription,
    refuserPreInscription
} from "../../services/commercialApi";



export default function PreInscriptionList() {


    const [demandes, setDemandes] = useState([]);





    const loadDemandes = () => {

        getPreInscriptions()

            .then(setDemandes)

            .catch(console.error);

    };





    useEffect(() => {

        loadDemandes();

    }, []);







    const handleValider = async (id) => {


        if(window.confirm("Valider cette demande ?")) {


            try {


                await validerPreInscription(id);


                alert(
                    "Client validé, identifiants envoyés par email"
                );


                loadDemandes();



            } catch(error) {


                console.error(error);


                alert(
                    "Erreur lors de la validation"
                );


            }


        }


    };








    const handleRefuser = async (id) => {


        if(window.confirm("Refuser cette demande ?")) {


            try {


                await refuserPreInscription(id);


                alert(
                    "Demande refusée"
                );


                loadDemandes();



            } catch(error) {


                console.error(error);


                alert(
                    "Erreur lors du refus"
                );


            }


        }


    };








    return (


        <CommercialLayout

            title="Demandes de pré-inscription"

            description="Validation des nouveaux clients"

        >



            <div className="commercial-table-wrap">



                <table className="commercial-table">



                    <thead>

                    <tr>


                        <th>
                            Raison sociale
                        </th>


                        <th>
                            Email
                        </th>


                        <th>
                            Téléphone
                        </th>


                        <th>
                            Statut
                        </th>


                        <th>
                            Actions
                        </th>


                    </tr>


                    </thead>





                    <tbody>



                    {

                        demandes.length === 0 ?



                            <tr>


                                <td colSpan="5">

                                    Aucune demande en attente

                                </td>


                            </tr>



                            :



                            demandes.map((client) => (



                                <tr key={client.idUtilisateur}>


                                    <td>

                                        {client.raisonSociale}

                                    </td>



                                    <td>

                                        {client.email}

                                    </td>



                                    <td>

                                        {client.telephone}

                                    </td>



                                    <td>

                                        {client.statut}

                                    </td>





                                    <td>



                                        <button

                                            className="commercial-btn-add"

                                            onClick={() =>
                                                handleValider(
                                                    client.idUtilisateur
                                                )
                                            }

                                        >

                                            ✅ Valider

                                        </button>





                                        <button

                                            className="commercial-btn-delete"

                                            style={{
                                                marginLeft:"10px"
                                            }}

                                            onClick={() =>
                                                handleRefuser(
                                                    client.idUtilisateur
                                                )
                                            }

                                        >

                                            ❌ Refuser

                                        </button>



                                    </td>




                                </tr>



                            ))



                    }



                    </tbody>



                </table>



            </div>




        </CommercialLayout>


    );


}