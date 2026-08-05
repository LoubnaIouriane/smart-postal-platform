import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
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
    const [editingAgenceId, setEditingAgenceId] = useState(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const loadData = () => {
        adminService.getFacteurs().then(setFacteurs);
        adminService.getAgences().then(setAgences);
    };

    useEffect(loadData, []);

    const agencesDisponibles = agences.filter(
        (a) => !a.hasFacteur || a.idAgence === editingAgenceId
    );

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const resetForm = () => { setForm(EMPTY_FORM); setEditingId(null); setEditingAgenceId(null); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); setMessage("");
        try {
            const payload = { ...form, idAgence: Number(form.idAgence) };
            if (editingId) {
                await adminService.updateFacteur(editingId, payload);
                setMessage("Facteur modifié avec succès");
            } else {
                await adminService.createFacteur(payload);
                setMessage("Facteur créé avec succès. Ses identifiants ont été envoyés par email.");
            }
            resetForm();
            loadData();
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de l'enregistrement");
        }
    };

    const handleEdit = (f) => {
        setEditingId(f.idFacteur);
        setEditingAgenceId(f.idAgence);
        setForm({ nom: f.nom, prenom: f.prenom, email: f.email, telephone: f.telephone || "", idAgence: f.idAgence });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Supprimer ce facteur ? Son compte de connexion sera aussi supprimé.")) return;
        setError("");
        try {
            await adminService.deleteFacteur(id);
            loadData();
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la suppression");
        }
    };

    return (
        <AdminLayout>
            <h1>Facteurs</h1>
            <p className="page-subtitle">Un facteur est affecté à une seule agence</p>

            <div className="crud-grid">
                <Card title={editingId ? "Modifier le facteur" : "Ajouter un facteur"}>
                    <form onSubmit={handleSubmit}>
                        <Input label="Nom" name="nom" value={form.nom} onChange={handleChange} required />
                        <Input label="Prénom" name="prenom" value={form.prenom} onChange={handleChange} required />
                        <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange} required />
                        <Input label="Téléphone" name="telephone" value={form.telephone} onChange={handleChange} />

                        <Select label="Agence" name="idAgence" value={form.idAgence} onChange={handleChange} required>
                            <option value="">-- Choisir une agence --</option>
                            {agencesDisponibles.map((a) => (
                                <option key={a.idAgence} value={a.idAgence}>{a.nomAgence} ({a.nomVille})</option>
                            ))}
                        </Select>
                        {agencesDisponibles.length === 0 && (
                            <p className="form-hint">Toutes les agences ont déjà un facteur affecté.</p>
                        )}

                        {!editingId && (
                            <p className="form-hint">📧 L'identifiant et le mot de passe seront générés automatiquement et envoyés par email.</p>
                        )}

                        {error && <p className="form-error">{error}</p>}
                        {message && <p className="form-success">{message}</p>}

                        <div className="form-actions">
                            <Button type="submit">{editingId ? "Enregistrer" : "Ajouter"}</Button>
                            {editingId && (
                                <Button type="button" variant="outline" onClick={resetForm}>Annuler</Button>
                            )}
                        </div>
                    </form>
                </Card>

                <Card title="Liste des facteurs">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Identifiant</th><th>Nom</th><th>Email</th><th>Téléphone</th><th>Agence</th><th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {facteurs.map((f) => (
                            <tr key={f.idFacteur}>
                                <td>{f.identifiant}</td>
                                <td>{f.prenom} {f.nom}</td>
                                <td>{f.email}</td>
                                <td>{f.telephone || "—"}</td>
                                <td>{f.nomAgence}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="btn-icon btn-edit" onClick={() => handleEdit(f)}>✏️ Modifier</button>
                                        <button className="btn-icon btn-delete" onClick={() => handleDelete(f.idFacteur)}>🗑️ Supprimer</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </Card>
            </div>
        </AdminLayout>
    );
}
