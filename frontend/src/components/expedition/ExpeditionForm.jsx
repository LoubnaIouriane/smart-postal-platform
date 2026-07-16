import { useState, useEffect } from "react";
import { expeditionService } from "../../services/expeditionService";
import "./expedition.css";

export default function ExpeditionForm({ onCreated }) {
    const [villes, setVilles] = useState([]);
    const [form, setForm] = useState({
        typeEnvoi: "COLIS",
        poids: "",
        idVilleDepart: "",
        idVilleDestination: "",
        nomDestinataire: "",
        telephoneDestinataire: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        expeditionService.getVilles()
            .then(setVilles)
            .catch((err) => console.error("Erreur chargement villes:", err));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const created = await expeditionService.create(form);
            onCreated(created);
            setForm({
                typeEnvoi: "COLIS",
                poids: "",
                idVilleDepart: "",
                idVilleDestination: "",
                nomDestinataire: "",
                telephoneDestinataire: "",
            });
        } catch (err) {
            const message = err.response?.data?.error || "Erreur lors de la création de l'expédition.";
            setError(message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="expedition-form" onSubmit={handleSubmit}>
            <h2>Nouvelle expédition</h2>

            {error && <p className="expedition-error">{error}</p>}

            <div className="form-group">
                <label>Type d'envoi</label>
                <select name="typeEnvoi" value={form.typeEnvoi} onChange={handleChange}>
                    <option value="COLIS">Colis</option>
                    <option value="COURRIER">Courrier</option>
                </select>
            </div>

            <div className="form-group">
                <label>Poids (kg) — entre 0,001 et 31 kg</label>
                <input
                    type="number"
                    step="0.001"
                    min="0.001"
                    max="31"
                    name="poids"
                    value={form.poids}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label>Ville de départ</label>
                <select
                    name="idVilleDepart"
                    value={form.idVilleDepart}
                    onChange={handleChange}
                    required
                >
                    <option value="">-- Sélectionner --</option>
                    {villes.map((v) => (
                        <option key={v.idVille} value={v.idVille}>
                            {v.nomVille}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label>Ville de destination</label>
                <select
                    name="idVilleDestination"
                    value={form.idVilleDestination}
                    onChange={handleChange}
                    required
                >
                    <option value="">-- Sélectionner --</option>
                    {villes.map((v) => (
                        <option key={v.idVille} value={v.idVille}>
                            {v.nomVille}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label>Nom du destinataire</label>
                <input
                    type="text"
                    name="nomDestinataire"
                    value={form.nomDestinataire}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label>Téléphone du destinataire</label>
                <input
                    type="tel"
                    name="telephoneDestinataire"
                    value={form.telephoneDestinataire}
                    onChange={handleChange}
                    required
                />
            </div>

            <button type="submit" disabled={loading}>
                {loading ? "Création..." : "Créer l'expédition"}
            </button>
        </form>
    );
}