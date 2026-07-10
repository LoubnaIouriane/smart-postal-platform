import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CommercialLayout from "../../components/commercial/CommercialLayout";
import { createGrille, updateGrille } from "../../services/commercialApi";

export default function GrilleRemiseForm() {
    const { id } = useParams();
    const isEdit = id !== "nouveau";
    const navigate = useNavigate();
    const [form, setForm] = useState({ nomGrille: "", tauxRemise: "" });

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...form, tauxRemise: Number(form.tauxRemise) };
        if (isEdit) await updateGrille(id, payload);
        else await createGrille(payload);
        navigate("/commercial/grilles-remise");
    };

    return (
        <CommercialLayout title={isEdit ? "Modifier une grille" : "Nouvelle grille de remise"}>
            <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
                <div className="commercial-form-field">
                    <label className="commercial-form-label">Nom de la grille</label>
                    <input className="commercial-form-input" name="nomGrille" value={form.nomGrille} onChange={handleChange} required />
                </div>
                <div className="commercial-form-field">
                    <label className="commercial-form-label">Taux de remise (%)</label>
                    <input type="number" step="0.1" className="commercial-form-input" name="tauxRemise" value={form.tauxRemise} onChange={handleChange} required />
                </div>
                <button type="submit" className="commercial-form-submit">Enregistrer</button>
            </form>
        </CommercialLayout>
    );
}