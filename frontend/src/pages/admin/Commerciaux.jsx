import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
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
    const [editingAgenceId, setEditingAgenceId] = useState(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const loadData = () => {
        adminService.getCommerciaux().then(setCommerciaux);
        adminService.getAgences().then(setAgences);
    };

    useEffect(loadData, []);

    // Agences disponibles : sans commercial, ou l'agence actuellement affectee en edition
    const agencesDisponibles = agences.filter(
        (a) => !a.hasCommercial || a.idAgence === editingAgenceId
    );

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const resetForm = () => { setForm(EMPTY_FORM); setEditingId(null); setEditingAgenceId(null); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); setMessage("");
        try {
            const payload = { ...form, idAgence: Number(form.idAgence) };
            if (editingId) {
                await adminService.updateCommercial(editingId, payload);
                setMessage("Commercial modifié avec succès");
            } else {
                await adminService.createCommercial(payload);
                setMessage("Commercial créé avec succès. Ses identifiants ont été envoyés par email.");
            }
            resetForm();
            loadData();
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de l'enregistrement");
        }
    };

    const handleEdit = (c) => {
        setEditingId(c.idCommercial);
        setEditingAgenceId(c.idAgence);
        setForm({ nom: c.nom, prenom: c.prenom, email: c.email, telephone: c.telephone || "", idAgence: c.idAgence });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Supprimer ce commercial ? Son compte de connexion sera aussi supprimé.")) return;
        setError("");
        try {
            await adminService.deleteCommercial(id);
            loadData();
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de la suppression");
        }
    };

    return (
        <AdminLayout>
            <h1>Commerciaux</h1>
            <p className="page-subtitle">Un commercial est affecté à une seule agence</p>

            <div className="crud-grid">
                <Card title={editingId ? "Modifier le commercial" : "Ajouter un commercial"}>
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
                            <p className="form-hint">Toutes les agences ont déjà un commercial affecté.</p>
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

                <Card title="Liste des commerciaux">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Identifiant</th><th>Nom</th><th>Email</th><th>Téléphone</th><th>Agence</th><th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {commerciaux.map((c) => (
                            <tr key={c.idCommercial}>
                                <td>{c.identifiant}</td>
                                <td>{c.prenom} {c.nom}</td>
                                <td>{c.email}</td>
                                <td>{c.telephone || "—"}</td>
                                <td>{c.nomAgence}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="btn-icon btn-edit" onClick={() => handleEdit(c)}>✏️ Modifier</button>
                                        <button className="btn-icon btn-delete" onClick={() => handleDelete(c.idCommercial)}>🗑️ Supprimer</button>
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
