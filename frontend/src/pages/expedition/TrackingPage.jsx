import { useState } from "react";
import Navbar from "../../components/layout/Navbar";
import { expeditionService } from "../../services/expeditionService";
import StatusTimeline from "../../components/expedition/StatusTimeline";
import "../../components/expedition/expedition.css";
import "../../components/expedition/tracking.css";

const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return date.toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export default function TrackingPage() {
    const [code, setCode] = useState("");
    const [expedition, setExpedition] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!code.trim()) return;
        setLoading(true);
        setError(null);
        setExpedition(null);
        setSearched(true);
        try {
            const result = await expeditionService.trackByCode(code.trim().toUpperCase());
            setExpedition(result);
        } catch (err) {
            const message = err.response?.data?.error || "Aucune expédition trouvée avec ce code.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <Navbar />
        <div className="tracking-page">
            <div className="tracking-hero">
                <h1>Suivi d'expédition</h1>
                <p>Entrez votre code de suivi pour connaître le statut de votre envoi</p>

                <form className="tracking-search" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="EXP000000001"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? "Recherche..." : "Suivre"}
                    </button>
                </form>
            </div>

            {error && (
                <div className="tracking-result">
                    <div className="tracking-error-box">
                        <span className="tracking-error-icon">⚠</span>
                        <div>
                            <strong>Expédition introuvable</strong>
                            <p>{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {expedition && (
                <div className="tracking-result">
                    <div className="tracking-card">
                        <div className="tracking-card-header">
                            <div>
                                <span className="tracking-code-label">Code de suivi</span>
                                <h2>{expedition.codeTracking}</h2>
                            </div>
                            <span className={`tracking-status-pill status-${expedition.statut.toLowerCase()}`}>
                {expedition.statut.replace("_", " ")}
              </span>
                        </div>

                        <StatusTimeline statut={expedition.statut} />

                        <div className="tracking-route">
                            <div className="tracking-route-point">
                                <span className="tracking-dot-icon">●</span>
                                <div>
                                    <span className="tracking-route-label">Départ</span>
                                    <strong>{expedition.villeDepart?.nomVille}</strong>
                                </div>
                            </div>
                            <div className="tracking-route-line" />
                            <div className="tracking-route-point">
                                <span className="tracking-dot-icon">📍</span>
                                <div>
                                    <span className="tracking-route-label">Destination</span>
                                    <strong>{expedition.villeDestination?.nomVille}</strong>
                                </div>
                            </div>
                        </div>

                        <div className="tracking-details-grid">
                            <div className="tracking-detail-item">
                                <span>Type d'envoi</span>
                                <strong>{expedition.typeEnvoi === "COLIS" ? "📦 Colis" : "✉️ Courrier"}</strong>
                            </div>
                            <div className="tracking-detail-item">
                                <span>Poids déclaré</span>
                                <strong>{expedition.poids} kg</strong>
                            </div>
                            {expedition.poidsReel && expedition.poidsReel !== expedition.poids && (
                                <div className="tracking-detail-item">
                                    <span>Poids réel constaté</span>
                                    <strong>{expedition.poidsReel} kg</strong>
                                </div>
                            )}
                            <div className="tracking-detail-item">
                                <span>Montant</span>
                                <strong>{expedition.montant} DH</strong>
                            </div>
                            <div className="tracking-detail-item">
                                <span>Destinataire</span>
                                <strong>{expedition.nomDestinataire}</strong>
                            </div>
                            <div className="tracking-detail-item">
                                <span>Téléphone</span>
                                <strong>{expedition.telephoneDestinataire}</strong>
                            </div>
                            <div className="tracking-detail-item">
                                <span>Date de création</span>
                                <strong>{formatDate(expedition.dateCreation)}</strong>
                            </div>
                            {expedition.dateAnnulation && (
                                <div className="tracking-detail-item">
                                    <span>Date d'annulation</span>
                                    <strong>{formatDate(expedition.dateAnnulation)}</strong>
                                </div>
                            )}
                            {expedition.facteurAssigne && (
                                <div className="tracking-detail-item">
                                    <span>Facteur assigné</span>
                                    <strong>{expedition.facteurAssigne.nom} {expedition.facteurAssigne.prenom}</strong>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {!searched && !expedition && !error && (
                <div className="tracking-placeholder">
                    <span>📦</span>
                    <p>Entrez un code de suivi pour voir les détails de votre expédition</p>
                </div>
            )}
        </div>
        </>
    );
}
