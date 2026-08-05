import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CommercialLayout from "../../components/commercial/CommercialLayout";
import { createContrat, updateContrat } from "../../services/commercialApi";

export default function ContratForm() {

    const { id } = useParams();

    const isEdit = id !== "nouveau";

    const navigate = useNavigate();



    const [form, setForm] = useState({

        numeroContrat: "",
        dateDebut: "",
        dateFin: "",
        statut: "EN_ATTENTE",

        conditions: "",   // AJOUT

        clientId: "",
        grilleRemiseId: "",

    });




    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };




    const handleSubmit = async (e) => {

        e.preventDefault();


        const payload = {

            ...form,

            clientId: Number(form.clientId),

            grilleRemiseId: form.grilleRemiseId
                ? Number(form.grilleRemiseId)
                : null

        };



        if (isEdit) {

            await updateContrat(id, payload);

        } else {

            await createContrat(payload);

        }


        navigate("/commercial/contrats");

    };




    return (

        <CommercialLayout
            title={
                isEdit
                    ? "Modifier un contrat"
                    : "Nouveau contrat"
            }
        >


            <form
                onSubmit={handleSubmit}
                style={{maxWidth:480}}
            >



                <div className="commercial-form-field">

                    <label className="commercial-form-label">
                        N° Contrat
                    </label>


                    <input
                        className="commercial-form-input"
                        name="numeroContrat"
                        value={form.numeroContrat}
                        onChange={handleChange}
                        required
                    />

                </div>





                <div className="commercial-form-field">

                    <label className="commercial-form-label">
                        Date début
                    </label>


                    <input
                        type="date"
                        className="commercial-form-input"
                        name="dateDebut"
                        value={form.dateDebut}
                        onChange={handleChange}
                        required
                    />

                </div>





                <div className="commercial-form-field">

                    <label className="commercial-form-label">
                        Date fin
                    </label>


                    <input
                        type="date"
                        className="commercial-form-input"
                        name="dateFin"
                        value={form.dateFin}
                        onChange={handleChange}
                        required
                    />

                </div>





                <div className="commercial-form-field">

                    <label className="commercial-form-label">
                        Statut
                    </label>


                    <select
                        className="commercial-form-input"
                        name="statut"
                        value={form.statut}
                        onChange={handleChange}
                    >

                        <option value="EN_ATTENTE">
                            En attente
                        </option>

                        <option value="ACTIF">
                            Actif
                        </option>

                        <option value="EXPIRE">
                            Expiré
                        </option>


                    </select>


                </div>





                {/* NOUVEAU CHAMP */}

                <div className="commercial-form-field">

                    <label className="commercial-form-label">
                        Conditions du contrat
                    </label>


                    <textarea

                        className="commercial-form-input"

                        name="conditions"

                        value={form.conditions}

                        onChange={handleChange}

                        placeholder="Ex: Remise 10%, paiement mensuel, livraison sous 48h..."

                        rows="5"

                    />

                </div>






                <div className="commercial-form-field">

                    <label className="commercial-form-label">
                        ID Client
                    </label>


                    <input

                        className="commercial-form-input"

                        name="clientId"

                        value={form.clientId}

                        onChange={handleChange}

                        required

                    />

                </div>






                <div className="commercial-form-field">

                    <label className="commercial-form-label">
                        ID Grille de remise
                    </label>


                    <input

                        className="commercial-form-input"

                        name="grilleRemiseId"

                        value={form.grilleRemiseId}

                        onChange={handleChange}

                    />

                </div>





                <button
                    type="submit"
                    className="commercial-form-submit"
                >

                    Enregistrer

                </button>


            </form>


        </CommercialLayout>

    );

}