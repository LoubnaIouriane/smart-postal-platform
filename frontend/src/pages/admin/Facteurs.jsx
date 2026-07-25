import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import { adminService } from "../../services/adminService";

const EMPTY_FORM = { nom: "", prenom: "", email: "", telephone: "", idAgence: "" };

export default function Facteurs() {
    const [facteurs, setFacteurs] = useState([]);
    const [agences, setAgences] = useState([]);
    const [form, setForm] = useState(EMPTY_FORM);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const loadData = () => {
        adminService.getFacteurs().then(setFacteurs);
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
                await adminService.updateFacteur(editingId, form);
                setMessage("Facteur modifié avec succès");
            } else {
                await adminService.createFacteur(form);
                setMessage("Facteur créé avec succès. Ses identifiants ont été envoyés par email.");
            }
            resetForm();
            loadData();
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de l'enregistrement");
        }
    };

    const handleEdit = (f) => {
        setEditingId(f.idUtilisateur);
        setForm({ nom: f.nom, prenom: f.prenom, email: f.email, telephone: f.telephone || "", idAgence: f.idAgence });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Supprimer ce facteur ?")) return;
        setError("");
        try {
            await adminService.deleteFacteur(id);
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
                <Card title={editingId ? "Modifier le facteur" : "Ajouter un facteur"}>
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

                <Card title="Liste des facteurs">
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                        <tr style={{ textAlign: "left" }}>
                            <th>Identifiant</th><th>Nom</th><th>Email</th><th>Agence</th><th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {facteurs.map((f) => (
                            <tr key={f.idUtilisateur}>
                                <td>{f.identifiant}</td>
                                <td>{f.prenom} {f.nom}</td>
                                <td>{f.email}</td>
                                <td>{f.nomAgence}</td>
                                <td style={{ display: "flex", gap: 8 }}>
                                    <button onClick={() => handleEdit(f)}>Modifier</button>
                                    <button onClick={() => handleDelete(f.idUtilisateur)}>Supprimer</button>
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
