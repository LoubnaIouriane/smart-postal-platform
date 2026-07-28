import { useState } from "react";
import { expeditionService } from "../../services/expeditionService";
import StatusTimeline from "../../components/expedition/StatusTimeline";
import "../../components/expedition/expedition.css";

export default function TrackingPage() {
    const [code, setCode] = useState("");
    const [expedition, setExpedition] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setExpedition(null);
        try {
            const result = await expeditionService.trackByCode(code.trim());
            setExpedition(result);
        } catch (err) {
            const message = err.response?.data?.error || "Expédition introuvable.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto" }}>
            <div className="expedition-form">
                <h2>Suivi d'expédition</h2>
                <form onSubmit={handleSearch}>
                    <div className="form-group">
                        <label>Code de tracking</label>
                        <input
                            type="text"
                            placeholder="Ex: EXP000000001"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? "Recherche..." : "Suivre l'expédition"}
                    </button>
                </form>

                {error && <p className="expedition-error" style={{ marginTop: "16px" }}>{error}</p>}
            </div>

            {expedition && (
                <div className="expedition-list" style={{ marginTop: "24px" }}>
                    <h2>Détails de l'expédition</h2>

                    <StatusTimeline statut={expedition.statut} />

                    <table style={{ marginTop: "24px" }}>
                        <tbody>
                        <tr>
                            <td><strong>Code tracking</strong></td>
                            <td>{expedition.codeTracking}</td>
                        </tr>
                        <tr>
                            <td><strong>Type</strong></td>
                            <td>{expedition.typeEnvoi}</td>
                        </tr>
                        <tr>
                            <td><strong>Ville de départ</strong></td>
                            <td>{expedition.villeDepart?.nomVille}</td>
                        </tr>
                        <tr>
                            <td><strong>Ville de destination</strong></td>
                            <td>{expedition.villeDestination?.nomVille}</td>
                        </tr>
                        <tr>
                            <td><strong>Poids déclaré</strong></td>
                            <td>{expedition.poids} kg</td>
                        </tr>
                        {expedition.poidsReel && (
                            <tr>
                                <td><strong>Poids réel</strong></td>
                                <td>{expedition.poidsReel} kg</td>
                            </tr>
                        )}
                        <tr>
                            <td><strong>Montant</strong></td>
                            <td>{expedition.montant} DH</td>
                        </tr>
                        <tr>
                            <td><strong>Destinataire</strong></td>
                            <td>{expedition.nomDestinataire} — {expedition.telephoneDestinataire}</td>
                        </tr>
                        {expedition.facteurAssigne && (
                            <tr>
                                <td><strong>Facteur assigné</strong></td>
                                <td>{expedition.facteurAssigne.nom} {expedition.facteurAssigne.prenom}</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}