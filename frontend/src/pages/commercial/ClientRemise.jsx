import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CommercialLayout from "../../components/commercial/CommercialLayout";
import { saveRemiseClient } from "../../services/commercialApi";


export default function ClientRemise() {

    const { id } = useParams();
    const navigate = useNavigate();


    const [remises, setRemises] = useState([
        {
            montantMin: 10000,
            montantMax: 20000,
            tauxRemise: ""
        },
        {
            montantMin: 20000,
            montantMax: 40000,
            tauxRemise: ""
        },
        {
            montantMin: 40000,
            montantMax: 60000,
            tauxRemise: ""
        },
        {
            montantMin: 60000,
            montantMax: null,
            tauxRemise: ""
        }
    ]);



    const handleChange = (index, value) => {

        const newRemises = [...remises];

        newRemises[index].tauxRemise = value;

        setRemises(newRemises);
    };



    const handleSubmit = async () => {

        const data = remises
            .filter(r => r.tauxRemise !== "")
            .map(r => ({
                clientId: Number(id),
                montantMin: r.montantMin,
                montantMax: r.montantMax,
                tauxRemise: Number(r.tauxRemise)
            }));


        await Promise.all(
            data.map(remise =>
                saveRemiseClient(remise)
            )
        );


        alert("Remise affectée avec succès");

        navigate("/commercial/clients");

    };



    return (

        <CommercialLayout
            title="Affecter une remise"
            description="Définir les remises du client"
        >


            <div className="commercial-table-wrap">


                <table className="commercial-table">


                    <thead>

                    <tr>
                        <th>
                            Montant du chiffre d'affaires
                        </th>

                        <th>
                            Remise affectée (%)
                        </th>

                    </tr>

                    </thead>



                    <tbody>


                    {remises.map((remise, index) => (

                        <tr key={index}>


                            <td>

                                {remise.montantMin} DH

                                {" - "}

                                {
                                    remise.montantMax
                                        ? remise.montantMax + " DH"
                                        : "et plus"
                                }

                            </td>



                            <td>

                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    className="commercial-form-input"
                                    value={remise.tauxRemise}
                                    onChange={(e) =>
                                        handleChange(
                                            index,
                                            e.target.value
                                        )
                                    }
                                    placeholder="Ex: 10"
                                />

                            </td>


                        </tr>

                    ))}



                    </tbody>


                </table>


            </div>



            <button
                className="commercial-form-submit"
                style={{marginTop:"20px"}}
                onClick={handleSubmit}
            >
                Valider remise
            </button>



        </CommercialLayout>

    );
}