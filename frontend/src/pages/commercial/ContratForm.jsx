import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CommercialLayout from "../../components/commercial/CommercialLayout";
import { createContrat, updateContrat, getClients, getContrats } from "../../services/commercialApi";

function genererNumeroContrat() {
    const annee = new Date().getFullYear();
    const suffixe = Math.floor(100000 + Math.random() * 900000);
    return `CTR-${annee}-${suffixe}`;
}

function getClientId(client) {
    return client.idUtilisateur ?? client.id ?? client.idClient ?? null;
}

function getClientIdFromContrat(contrat) {
    return contrat.clientId ?? contrat.idClient ?? contrat.client_id ?? contrat.client?.idUtilisateur ?? null;
}

export default function ContratForm() {
    const { id } = useParams();
    const isEdit = id !== "nouveau" && id !== "undefined" && id !== undefined;

    const navigate = useNavigate();

    const [clientsDisponibles, setClientsDisponibles] = useState([]);
    const [numeroContrat] = useState(() => genererNumeroContrat());
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        dateDebut: "",
        dateFin: "",
        clientId: "",
    });

    useEffect(() => {
        Promise.all([getClients(), getContrats()])
            .then(([clients, contrats]) => {
                const idsClientsAvecContrat = new Set(
                    contrats
                        .filter((c) => !isEdit) // en edition on ne filtre pas (le client courant a deja son contrat)
                        .map(getClientIdFromContrat)
                        .filter((cid) => cid !== null)
                );

                const clientsActifs = clients.filter((c) => c.statut === "ACTIF" || c.statut === "VALIDE");
                const clientsSansContrat = clientsActifs.filter(
                    (c) => !idsClientsAvecContrat.has(getClientId(c))
                );

                setClientsDisponibles(clientsSansContrat);

                if (clientsActifs.length > 0) {
                    console.log("Structure d'un client recu du backend :", clientsActifs[0]);
                }
            })
            .catch(console.error);
    }, [isEdit]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

   const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.clientId) {
        setError("Merci de choisir un client");
        return;
    }

    setLoading(true);

    const payload = {
        numeroContrat,
        dateDebut: form.dateDebut,
        dateFin: form.dateFin,
        statut: "ACTIF",
        clientId: Number(form.clientId),
        idClient: Number(form.clientId), // alias : au cas ou le backend attend ce nom (comme pour Client)
    };

    try {
        if (isEdit) {
            await updateContrat(id, payload);
        } else {
            await createContrat(payload);
        }
        navigate("/commercial/contrats");
    } catch (err) {
        console.error("Erreur creation/maj contrat :", err.response?.data || err.message);
        setError(
            err.response?.data?.message ||
            (typeof err.response?.data === "object" ? JSON.stringify(err.response.data) : "Erreur lors de l'enregistrement du contrat")
        );
    } finally {
        setLoading(false);
    }
};
    return (
        <CommercialLayout title={isEdit ? "Modifier un contrat" : "Nouveau contrat"}>
            <form onSubmit={handleSubmit} style={{ maxWidth: 480 }}>

                <div className="commercial-form-field">
                    <label className="commercial-form-label">N° Contrat (généré automatiquement)</label>
                    <input className="commercial-form-input" value={numeroContrat} disabled
                           style={{ background: "#F4F5F7", color: "#5C6773" }} />
                </div>

                <div className="commercial-form-field">
                    <label className="commercial-form-label">Client *</label>
                    <select
                        className="commercial-form-input"
                        name="clientId"
                        value={form.clientId}
                        onChange={handleChange}
                        required
                    >
                        <option key="empty" value="">-- Choisir un client --</option>
                        {clientsDisponibles.map((c, index) => {
                            const cid = getClientId(c);
                            return (
                                <option key={cid ?? `client-${index}`} value={cid ?? ""}>
                                    {c.raisonSociale}
                                </option>
                            );
                        })}
                    </select>
                    {clientsDisponibles.length === 0 && (
                        <p style={{ fontSize: 12, color: "#9098b0", marginTop: 4 }}>
                            Tous les clients actifs ont déjà un contrat.
                        </p>
                    )}
                </div>

                <div className="commercial-form-field">
                    <label className="commercial-form-label">Date début *</label>
                    <input type="date" className="commercial-form-input" name="dateDebut"
                           value={form.dateDebut} onChange={handleChange} required />
                </div>

                <div className="commercial-form-field">
                    <label className="commercial-form-label">Date fin *</label>
                    <input type="date" className="commercial-form-input" name="dateFin"
                           value={form.dateFin} onChange={handleChange} required />
                </div>

                <div className="commercial-form-field">
                    <label className="commercial-form-label">Statut</label>
                    <input className="commercial-form-input" value="ACTIF (généré automatiquement)" disabled
                           style={{ background: "#F4F5F7", color: "#5C6773" }} />
                </div>

                {error && <p style={{ color: "#D9534F", fontSize: 13, marginBottom: 12 }}>{error}</p>}

                <button type="submit" className="commercial-form-submit" disabled={loading}>
                    {loading ? "Enregistrement..." : "Enregistrer"}
                </button>
            </form>
        </CommercialLayout>
    );
}