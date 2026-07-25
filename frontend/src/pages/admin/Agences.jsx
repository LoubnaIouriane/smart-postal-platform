import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import { adminService } from "../../services/adminService";

const EMPTY_FORM = {
    nomAgence: "", adresse: "", codePostal: "", telephone: "",
    email: "", contactCommercial: "", idVille: "",
};

export default function Agences() {
    const [agences, setAgences] = useState([]);
    const [villes, setVilles] = useState([]);
    const [form, setForm] = useState(EMPTY_FORM);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const loadData = () => {
        adminService.getAgences().then(setAgences);
        adminService.getVilles().then(setVilles);
    };

    useEffect(loadData, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const resetForm = () => { setForm(EMPTY_FORM); setEditingId(null); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); setMessage("");
        try {
            const payload = { ...form, idVille: Number(form.idVille) };
            if (editingId) {
                await adminService.updateAgence(editingId, payload);
                setMessage("Agence modifiée avec succès");
            } else {
                await adminService.createAgence(payload);
                setMessage("Agence créée avec succès");
            }
            resetForm();
            loadData();
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de l'enregistrement");
        }
    };

    const handleEdit = (agence) => {
        setEditingId(agence.idAgence);
        setForm({
            nomAgence: agence.nomAgence,
            adresse: agence.adresse || "",
            codePostal: agence.codePostal || "",
            telephone: agence.telephone || "",
            email: agence.email || "",
            contactCommercial: agence.contactCommercial || "",
            idVille: agence.idVille,
        });
    };

    const handleDelete = async (idAgence) => {
        if (!window.confirm("Supprimer cette agence ?")) return;
        setError("");
        try {
            await adminService.deleteAgence(idAgence);
            loadData();
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la suppression");
        }
    };

    return (
        <>
            <Navbar />
            <div style={{
                padding: "var(--space-xl)", display: "grid",
                gridTemplateColumns: "380px 1fr", gap: "var(--space-lg)",
            }}>
                <Card title={editingId ? "Modifier l'agence" : "Ajouter une agence"}>
                    <form onSubmit={handleSubmit}>
                        <Input label="Nom de l'agence" name="nomAgence" value={form.nomAgence}
                               onChange={handleChange} required />

                        <Select label="Ville" name="idVille" value={form.idVille}
                                onChange={handleChange} required>
                            <option value="">-- Choisir une ville --</option>
                            {villes.map((v) => (
                                <option key={v.idVille} value={v.idVille}>{v.nomVille}</option>
                            ))}
                        </Select>

                        <Input label="Adresse" name="adresse" value={form.adresse} onChange={handleChange} />
                        <Input label="Code postal" name="codePostal" value={form.codePostal} onChange={handleChange} />
                        <Input label="Téléphone" name="telephone" value={form.telephone} onChange={handleChange} />
                        <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange} />
                        <Input label="Contact commercial" name="contactCommercial" value={form.contactCommercial} onChange={handleChange} />

                        {error && <p style={{ color: "var(--color-status-danger)", fontSize: 13 }}>{error}</p>}
                        {message && <p style={{ color: "var(--color-status-success)", fontSize: 13 }}>{message}</p>}

                        <Button type="submit">{editingId ? "Enregistrer" : "Ajouter"}</Button>
                        {editingId && (
                            <Button type="button" variant="secondary" onClick={resetForm}>Annuler</Button>
                        )}
                    </form>
                </Card>

                <Card title="Liste des agences">
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                        <tr style={{ textAlign: "left" }}>
                            <th>ID</th><th>Nom</th><th>Ville</th><th>Téléphone</th><th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {agences.map((a) => (
                            <tr key={a.idAgence}>
                                <td>{a.idAgence}</td>
                                <td>{a.nomAgence}</td>
                                <td>{a.nomVille}</td>
                                <td>{a.telephone}</td>
                                <td style={{ display: "flex", gap: 8 }}>
                                    <button onClick={() => handleEdit(a)}>Modifier</button>
                                    <button onClick={() => handleDelete(a.idAgence)}>Supprimer</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </Card>
            </div>
        </>
    );
}
