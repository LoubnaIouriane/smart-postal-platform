import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CommercialLayout from "../../components/commercial/CommercialLayout";
import { createCommercial, updateCommercial, getCommercialById } from "../../services/commercialApi";

export default function CommercialForm() {
    const { id } = useParams();
    const isEdit = id !== "nouveau";
    const navigate = useNavigate();

    const [form, setForm] = useState({
        nom: "", prenom: "", email: "", telephone: "",
        identifiant: "", motDePasse: "", agenceId: "",
    });
    const [error, setError] = useState("");

    useEffect(() => {
        if (isEdit) getCommercialById(id).then((data) => setForm({ ...form, ...data }));
    }, [id]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            if (isEdit) await updateCommercial(id, form);
            else await createCommercial(form);
            navigate("/commercial/commerciaux");
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de l'enregistrement");
        }
    };

    return (
        <CommercialLayout title={isEdit ? "Modifier un commercial" : "Nouveau commercial"}>
            <form onSubmit={handleSubmit} style={{ maxWidth: 480 }}>
                {["nom", "prenom", "email", "telephone"].map((field) => (
                    <div className="commercial-form-field" key={field}>
                        <label className="commercial-form-label">{field}</label>
                        <input className="commercial-form-input" name={field} value={form[field]} onChange={handleChange} required />
                    </div>
                ))}

                {!isEdit && (
                    <>
                        <div className="commercial-form-field">
                            <label className="commercial-form-label">Identifiant</label>
                            <input className="commercial-form-input" name="identifiant" value={form.identifiant} onChange={handleChange} required />
                        </div>
                        <div className="commercial-form-field">
                            <label className="commercial-form-label">Mot de passe</label>
                            <input type="password" className="commercial-form-input" name="motDePasse" value={form.motDePasse} onChange={handleChange} required />
                        </div>
                    </>
                )}

                <div className="commercial-form-field">
                    <label className="commercial-form-label">Code agence (ex: C001)</label>
                    <input className="commercial-form-input" name="agenceId" value={form.agenceId} onChange={handleChange} required />
                </div>

                {error && <p style={{ color: "var(--c-danger)", fontSize: 13 }}>{error}</p>}

                <button type="submit" className="commercial-form-submit">Enregistrer</button>
            </form>
        </CommercialLayout>
    );
}