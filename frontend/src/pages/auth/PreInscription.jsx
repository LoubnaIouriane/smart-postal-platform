import { useState } from "react";
import api from "../../services/api";
import Navbar from "../../components/layout/Navbar";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

const VILLES = [
    { id: 1, nom: "RABAT" }, { id: 2, nom: "CASABLANCA" }, { id: 3, nom: "TANGER" },
    { id: 4, nom: "OUJDA" }, { id: 5, nom: "FES" }, { id: 6, nom: "AGADIR" },
    { id: 7, nom: "MARRAKECH" }, { id: 8, nom: "LAAYOUNE" },
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

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError(""); setMessage("");
        try {
            const response = await api.post("/auth/pre-inscription", { ...form, idVille: Number(form.idVille) });
            setMessage(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de l'envoi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div style={{ display: "flex", justifyContent: "center", padding: "var(--space-xl) var(--space-md)" }}>
                <Card title="Pré-inscription — Personne Morale" style={{ width: "100%", maxWidth: 640 }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                            <Input label="ICE" name="ice" value={form.ice} onChange={handleChange} />
                            <Input label="RC" name="rc" value={form.rc} onChange={handleChange} />
                            <Input label="Patente" name="patente" value={form.patente} onChange={handleChange} />
                            <Input label="Raison sociale *" name="raisonSociale" value={form.raisonSociale} onChange={handleChange} required />
                            <Input label="Activité principale" name="activitePrincipale" value={form.activitePrincipale} onChange={handleChange} />
                            <Input label="Téléphone *" name="telephone" value={form.telephone} onChange={handleChange} required />
                            <Input label="Email *" type="email" name="email" value={form.email} onChange={handleChange} required />
                            <Input label="Code postal" name="codePostal" value={form.codePostal} onChange={handleChange} />
                        </div>

                        <Input label="Adresse *" name="adresse" value={form.adresse} onChange={handleChange} required />

                        <Select label="Ville *" name="idVille" value={form.idVille} onChange={handleChange} required>
                            <option value="">-- Choisir une ville --</option>
                            {VILLES.map((v) => <option key={v.id} value={v.id}>{v.nom}</option>)}
                        </Select>

                        {error && <p style={{ color: "var(--color-status-danger)", fontSize: 13 }}>{error}</p>}
                        {message && <p style={{ color: "var(--color-status-success)", fontSize: 13 }}>{message}</p>}

                        <Button type="submit" variant="brand" disabled={loading}>
                            {loading ? "Envoi..." : "Envoyer ma demande"}
                        </Button>
                    </form>
                </Card>
            </div>
        </>
    );
}