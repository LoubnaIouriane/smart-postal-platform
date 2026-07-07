import { useState } from "react";
import api from "../../services/api.js";

const VILLES = [
    { id: 1, nom: "RABAT" },
    { id: 2, nom: "CASABLANCA" },
    { id: 3, nom: "TANGER" },
    { id: 4, nom: "OUJDA" },
    { id: 5, nom: "FES" },
    { id: 6, nom: "AGADIR" },
    { id: 7, nom: "MARRAKECH" },
    { id: 8, nom: "LAAYOUNE" },
];

export default function PreInscription() {
    const [form, setForm] = useState({
        ice: "", rc: "", patente: "",
        raisonSociale: "", activitePrincipale: "",
        telephone: "", email: "", adresse: "", codePostal: "",
        idVille: "",
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");
        try {
            const response = await api.post("/auth/pre-inscription", {
                ...form,
                idVille: Number(form.idVille),
            });
            setMessage(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de l'envoi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: 480, margin: "40px auto" }}>
            <h2>Pre-inscription — Personne Morale</h2>

            <label>ICE</label>
            <input name="ice" value={form.ice} onChange={handleChange} />

            <label>RC</label>
            <input name="rc" value={form.rc} onChange={handleChange} />

            <label>Patente</label>
            <input name="patente" value={form.patente} onChange={handleChange} />

            <label>Raison sociale *</label>
            <input name="raisonSociale" value={form.raisonSociale} onChange={handleChange} required />

            <label>Activite principale</label>
            <input name="activitePrincipale" value={form.activitePrincipale} onChange={handleChange} />

            <label>Telephone *</label>
            <input name="telephone" value={form.telephone} onChange={handleChange} required />

            <label>Email *</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />

            <label>Adresse *</label>
            <input name="adresse" value={form.adresse} onChange={handleChange} required />

            <label>Code postal</label>
            <input name="codePostal" value={form.codePostal} onChange={handleChange} />

            <label>Ville *</label>
            <select name="idVille" value={form.idVille} onChange={handleChange} required>
                <option value="">-- Choisir une ville --</option>
                {VILLES.map((v) => (
                    <option key={v.id} value={v.id}>{v.nom}</option>
                ))}
            </select>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {message && <p style={{ color: "green" }}>{message}</p>}

            <button type="submit" disabled={loading}>
                {loading ? "Envoi..." : "Envoyer ma demande"}
            </button>
        </form>
    );
}