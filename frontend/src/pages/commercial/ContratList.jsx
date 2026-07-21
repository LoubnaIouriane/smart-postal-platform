import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CommercialLayout from "../../components/commercial/CommercialLayout";
import { getContrats } from "../../services/commercialApi";
import ContractStatusBadge from "../../components/commercial/ContractStatusBadge";


export default function ContratList() {


    const [data, setData] = useState([]);

    const navigate = useNavigate();



    useEffect(() => {

        getContrats()
            .then(setData)
            .catch(console.error);

    }, []);



    return (

        <CommercialLayout
            title="Contrats"
            description="Liste des contrats clients"
        >


            <button
                className="commercial-btn-add"
                onClick={() => navigate("/commercial/contrats/nouveau")}
                style={{ marginBottom: 20 }}
            >

                + Ajouter contrat

            </button>



            <div className="commercial-table-wrap">


                <table className="commercial-table">


                    <thead>

                    <tr>

                        <th>
                            N° Contrat
                        </th>


                        <th>
                            Num client
                        </th>


                        <th>
                            Nom client
                        </th>


                        <th>
                            Date début
                        </th>


                        <th>
                            Date fin
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


                    {data.map((contrat)=>(


                        <tr key={contrat.idContrat || contrat.id}>


                            <td>
                                {contrat.numeroContrat}
                            </td>


                            <td>
                                {contrat.clientId}
                            </td>


                            <td>
                                {contrat.clientNom}
                            </td>


                            <td>
                                {contrat.dateDebut}
                            </td>


                            <td>
                                {contrat.dateFin}
                            </td>


                            <td>

                                <ContractStatusBadge
                                    statut={contrat.statut}
                                />

                            </td>



                            <td>


                                <button

                                    className="commercial-btn-add"

                                    onClick={() =>
                                        navigate(
                                            `/commercial/contrats/${contrat.idContrat || contrat.id}`
                                        )
                                    }

                                >

                                    👁 Détails

                                </button>


                            </td>


                        </tr>


                    ))}


                    </tbody>


                </table>


            </div>


        </CommercialLayout>

    );

}