import { useState } from "react";
import CommercialLayout from "../../components/commercial/CommercialLayout";
import { saveGrilleRemise } from "../../services/commercialApi";


export default function GrilleRemiseList() {


    const [remises, setRemises] = useState([
        {
            montantAvant: 10000,
            montantApres: 20000,
            tauxRemise: "",
            couleur: "#EAF1F8"
        },
        {
            montantAvant: 20000,
            montantApres: 40000,
            tauxRemise: "",
            couleur: "#D2E1F0"
        },
        {
            montantAvant: 40000,
            montantApres: 60000,
            tauxRemise: "",
            couleur: "#7EA9D3"
        },
        {
            montantAvant: 60000,
            montantApres: null,
            tauxRemise: "",
            couleur: "#3D6EA5"
        }
    ]);




    const handleChange = (index, value) => {

        const newRemises = [...remises];

        newRemises[index].tauxRemise = value;

        setRemises(newRemises);

    };



const [error, setError] = useState("");

const handleSubmit = async () => {
    setError("");
    try {
        for (const remise of remises) {
            if (remise.tauxRemise === "") continue; // ignore les lignes non remplies

            await saveGrilleRemise({
                nomGrille: remise.montantApres
                    ? `${remise.montantAvant}-${remise.montantApres}`
                    : `${remise.montantAvant}+`,
                poids: 0,
                montantAvant: remise.montantAvant,
                montantApres: remise.montantApres,
                tauxRemise: Number(remise.tauxRemise),
                couleur: remise.couleur,
            });
        }
        alert("Les remises ont été enregistrées");
    } catch (error) {
        console.error("Erreur enregistrement grille :", error.response?.data || error.message);
        setError(
            error.response?.data?.message ||
            (typeof error.response?.data === "object" ? JSON.stringify(error.response.data) : "Erreur lors de l'enregistrement")
        );
    }
};

    





    return (

        <CommercialLayout
            title="Grille de remise"
            description="Affectation des taux de remise selon le chiffre d'affaires"
        >


            <div className="commercial-table-wrap">


                <table className="commercial-table">


                    <thead>

                    <tr>

                        <th>
                            Chiffre d'affaires
                        </th>


                        <th>
                            Taux de remise (%)
                        </th>


                        <th>
                            Couleur
                        </th>


                    </tr>

                    </thead>



                    <tbody>


                    {remises.map((item,index)=>(


                        <tr key={index}>


                            <td>

                                {
                                    item.montantApres
                                        ?
                                        `${item.montantAvant} DH - ${item.montantApres} DH`
                                        :
                                        `${item.montantAvant} DH et plus`
                                }


                            </td>



                            <td>

                                <input

                                    type="number"

                                    min="0"

                                    max="100"

                                    className="commercial-form-input"

                                    value={item.tauxRemise}

                                    onChange={(e)=>
                                        handleChange(index,e.target.value)
                                    }

                                    placeholder="Ex: 10"

                                />

                            </td>



                            <td>

                                <span

                                    style={{
                                        display:"inline-block",
                                        width:"25px",
                                        height:"25px",
                                        borderRadius:"50%",
                                        background:item.couleur
                                    }}

                                ></span>


                            </td>



                        </tr>


                    ))}


                    </tbody>


                </table>


            </div>


       {error && <p style={{ color: "#D9534F", marginTop: 12 }}>{error}</p>}

            <button

                className="commercial-btn-add"

                style={{marginTop:20}}

                onClick={handleSubmit}

            >

                Valider remise

            </button>



        </CommercialLayout>

    );


}