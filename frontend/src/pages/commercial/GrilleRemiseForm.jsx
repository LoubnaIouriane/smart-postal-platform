import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CommercialLayout from "../../components/commercial/CommercialLayout";
import { saveGrilleRemise } from "../../services/commercialApi";

export default function GrilleRemiseForm() {


    const navigate = useNavigate();


    const [form,setForm] = useState({

        montantAvant:"",
        montantApres:"",
        tauxRemise:""

    });




    const handleChange=(e)=>{

        setForm({

            ...form,

            [e.target.name]:e.target.value

        });

    };





    const handleSubmit=async(e)=>{

        e.preventDefault();


        await saveGrilleRemise({

            nomGrille:
                `${form.montantAvant}-${form.montantApres}`,

            poids:0,

            montantAvant:Number(form.montantAvant),

            montantApres:
                form.montantApres
                    ?
                    Number(form.montantApres)
                    :
                    null,


            tauxRemise:Number(form.tauxRemise),


            couleur:"#0B3D6B"

        });


        navigate("/commercial/grilles-remise");


    };





    return (

        <CommercialLayout
            title="Ajouter une tranche de remise"
        >


            <form
                onSubmit={handleSubmit}
                style={{maxWidth:400}}
            >


                <div className="commercial-form-field">

                    <label className="commercial-form-label">
                        Chiffre d'affaires minimum
                    </label>

                    <input

                        type="number"

                        name="montantAvant"

                        className="commercial-form-input"

                        value={form.montantAvant}

                        onChange={handleChange}

                        required

                    />

                </div>



                <div className="commercial-form-field">

                    <label className="commercial-form-label">
                        Chiffre d'affaires maximum
                    </label>


                    <input

                        type="number"

                        name="montantApres"

                        className="commercial-form-input"

                        value={form.montantApres}

                        onChange={handleChange}

                    />

                </div>




                <div className="commercial-form-field">

                    <label className="commercial-form-label">
                        Taux remise (%)
                    </label>


                    <input

                        type="number"

                        name="tauxRemise"

                        className="commercial-form-input"

                        value={form.tauxRemise}

                        onChange={handleChange}

                        required

                    />

                </div>



                <button
                    className="commercial-form-submit"
                >

                    Enregistrer

                </button>



            </form>


        </CommercialLayout>

    );

}