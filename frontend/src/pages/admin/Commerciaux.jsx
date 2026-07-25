import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import { adminService } from "../../services/adminService";

const EMPTY_FORM = { nom: "", prenom: "", email: "", telephone: "", idAgence: "" };

export default function Commerciaux() {
    const [commerciaux, setCommerciaux] = useState([]);
    const [agences, setAgences] = useState([]);
    const [form, setForm] = useState(EMPTY_FORM);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const loadData = () => {
        adminService.getCommerciaux().then(setCommerciaux);
        adminService.getAgences().then(setAgences);
    };

    useEffect(loadData, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const resetForm = () => { setForm(EMPTY_FORM); setEditingId(null); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); setMessage("");
        try {
            if (editingId) {
                await adminService.updateCommercial(editingId, form);
                setMessage("Commercial modifié avec succès");
            } else {
                await adminService.createCommercial(form);
                setMessage("Commercial créé avec succès. Ses identifiants ont été envoyés par email.");
            }
            resetForm();
            loadData();
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de l'enregistrement");
        }
    };

    const handleEdit = (c) => {
        setEditingId(c.idUtilisateur);
        setForm({ nom: c.nom, prenom: c.prenom, email: c.email, telephone: c.telephone || "", idAgence: c.idAgence });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Supprimer ce commercial ?")) return;
        setError("");
        try {
            await adminService.deleteCommercial(id);
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
                <Card title={editingId ? "Modifier le commercial" : "Ajouter un commercial"}>
                    <form onSubmit={handleSubmit}>
                        <Input label="Nom" name="nom" value={form.nom} onChange={handleChange} required />
                        <Input label="Prénom" name="prenom" value={form.prenom} onChange={handleChange} required />
                        <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange} required />
                        <Input label="Téléphone" name="telephone" value={form.telephone} onChange={handleChange} />

                        <Select label="Agence" name="idAgence" value={form.idAgence} onChange={handleChange} required>
                            <option value="">-- Choisir une agence --</option>
                            {agences.map((a) => (
                                <option key={a.idAgence} value={a.idAgence}>{a.nomAgence} ({a.nomVille})</option>
                            ))}
                        </Select>

                        {!editingId && (
                            <p style={{ fontSize: 12, color: "var(--color-text-muted)", marginBottom: 12 }}>
                                📧 L'identifiant et le mot de passe seront générés automatiquement
                                et envoyés à l'adresse email indiquée.
                            </p>
                        )}

                        {error && <p style={{ color: "var(--color-status-danger)", fontSize: 13 }}>{error}</p>}
                        {message && <p style={{ color: "var(--color-status-success)", fontSize: 13 }}>{message}</p>}

                        <Button type="submit">{editingId ? "Enregistrer" : "Ajouter"}</Button>
                        {editingId && (
                            <Button type="button" variant="secondary" onClick={resetForm}>Annuler</Button>
                        )}
                    </form>
                </Card>

                <Card title="Liste des commerciaux">
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                        <tr style={{ textAlign: "left" }}>
                            <th>Identifiant</th><th>Nom</th><th>Email</th><th>Agence</th><th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {commerciaux.map((c) => (
                            <tr key={c.idUtilisateur}>
                                <td>{c.identifiant}</td>
                                <td>{c.prenom} {c.nom}</td>
                                <td>{c.email}</td>
                                <td>{c.nomAgence}</td>
                                <td style={{ display: "flex", gap: 8 }}>
                                    <button onClick={() => handleEdit(c)}>Modifier</button>
                                    <button onClick={() => handleDelete(c.idUtilisateur)}>Supprimer</button>
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
