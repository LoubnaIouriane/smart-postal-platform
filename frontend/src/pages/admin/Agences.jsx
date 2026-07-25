import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import { adminService } from "../../services/adminService";

const EMPTY_FORM = {
    nomAgence: "", adresse: "", telephone: "", email: "", idVille: "",
    commercialNom: "", commercialPrenom: "", commercialTelephone: "", commercialEmail: "",
    facteurNom: "", facteurPrenom: "", facteurTelephone: "", facteurEmail: "",
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
                // En modification, on n'envoie jamais les champs commercial/facteur
                const { commercialNom, commercialPrenom, commercialTelephone, commercialEmail,
                    facteurNom, facteurPrenom, facteurTelephone, facteurEmail, ...agenceSeule } = payload;
                await adminService.updateAgence(editingId, agenceSeule);
                setMessage("Agence modifiée avec succès");
            } else {
                await adminService.createAgence(payload);
                setMessage("Agence créée avec succès. Si un commercial/facteur a été renseigné, ses identifiants ont été envoyés par email.");
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
            ...EMPTY_FORM,
            nomAgence: agence.nomAgence,
            adresse: agence.adresse || "",
            telephone: agence.telephone || "",
            email: agence.email || "",
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
        <AdminLayout>
            <h1>Agences</h1>
            <p className="page-subtitle">Gérez les agences et leur ville de rattachement</p>

            <div className="crud-grid">
                <Card title={editingId ? "Modifier l'agence" : "Ajouter une agence"}>
                    <form onSubmit={handleSubmit}>
                        <Input label="Nom de l'agence" name="nomAgence" value={form.nomAgence}
                               onChange={handleChange} required />

                        <Select label="Ville" name="idVille" value={form.idVille} onChange={handleChange} required>
                            <option value="">-- Choisir une ville --</option>
                            {villes.map((v) => (
                                <option key={v.idVille} value={v.idVille}>{v.nomVille}</option>
                            ))}
                        </Select>

                        <Input label="Adresse" name="adresse" value={form.adresse} onChange={handleChange} />
                        <Input label="Téléphone" name="telephone" value={form.telephone} onChange={handleChange} />
                        <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange} />

                        {!editingId && (
                            <>
                                <hr style={{ border: "none", borderTop: "1px solid var(--color-border)", margin: "18px 0 14px" }} />

                                <h4 style={{ fontSize: 13.5, marginBottom: 10, color: "var(--color-primary)" }}>
                                    🧑‍💼 Commercial de l'agence (optionnel)
                                </h4>
                                <Input label="Nom" name="commercialNom" value={form.commercialNom} onChange={handleChange} />
                                <Input label="Prénom" name="commercialPrenom" value={form.commercialPrenom} onChange={handleChange} />
                                <Input label="Téléphone" name="commercialTelephone" value={form.commercialTelephone} onChange={handleChange} />
                                <Input label="Email" type="email" name="commercialEmail" value={form.commercialEmail} onChange={handleChange} />

                                <hr style={{ border: "none", borderTop: "1px solid var(--color-border)", margin: "18px 0 14px" }} />

                                <h4 style={{ fontSize: 13.5, marginBottom: 10, color: "var(--color-primary)" }}>
                                    📮 Facteur de l'agence (optionnel)
                                </h4>
                                <Input label="Nom" name="facteurNom" value={form.facteurNom} onChange={handleChange} />
                                <Input label="Prénom" name="facteurPrenom" value={form.facteurPrenom} onChange={handleChange} />
                                <Input label="Téléphone" name="facteurTelephone" value={form.facteurTelephone} onChange={handleChange} />
                                <Input label="Email" type="email" name="facteurEmail" value={form.facteurEmail} onChange={handleChange} />

                                <p className="form-hint">
                                    📧 Si tu renseignes un commercial et/ou un facteur, leurs identifiants seront
                                    générés automatiquement et envoyés par email. Laisse ces champs vides pour
                                    les affecter plus tard depuis les pages "Commerciaux" / "Facteurs".
                                </p>
                            </>
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

                <Card title="Liste des agences">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>ID</th><th>Nom</th><th>Ville</th><th>Commercial</th><th>Facteur</th><th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {agences.map((a) => (
                            <tr key={a.idAgence}>
                                <td>{a.idAgence}</td>
                                <td>{a.nomAgence}</td>
                                <td>{a.nomVille}</td>
                                <td>
                                    {a.hasCommercial ? (
                                        <span className="status-dot ok" title={`${a.telephoneCommercial || ""} — ${a.emailCommercial || ""}`}>
                                                {a.nomCommercial}
                                            </span>
                                    ) : (
                                        <span className="status-dot warn">Non affecté</span>
                                    )}
                                </td>
                                <td>
                                    {a.hasFacteur ? (
                                        <span className="status-dot ok" title={`${a.telephoneFacteur || ""} — ${a.emailFacteur || ""}`}>
                                                {a.nomFacteur}
                                            </span>
                                    ) : (
                                        <span className="status-dot warn">Non affecté</span>
                                    )}
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="btn-icon btn-edit" onClick={() => handleEdit(a)}>✏️ Modifier</button>
                                        <button className="btn-icon btn-delete" onClick={() => handleDelete(a.idAgence)}>🗑️ Supprimer</button>
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