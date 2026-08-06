import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { genererFactureDepuisExpeditions } from "../../services/factureApi";

export default function FactureForm() {
  const navigate = useNavigate();
  const [clientId, setClientId] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [tauxTVA, setTauxTVA] = useState(20);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const facture = await genererFactureDepuisExpeditions({
        clientId: Number(clientId),
        dateDebut,
        dateFin,
        tauxTVA: Number(tauxTVA),
      });
      navigate(`/commercial/factures/${facture.idFacture}`);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la generation automatique.");
    }
  };

  return (
    <main className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Commercial</p>
          <h1>Generer une facture</h1>
        </div>
      </div>

      <form className="invoice-form" onSubmit={handleSubmit}>
        <label>
          ID Client
          <input value={clientId} onChange={(event) => setClientId(event.target.value)} required />
        </label>
        <label>
          Date debut
          <input
            type="date"
            value={dateDebut}
            onChange={(event) => setDateDebut(event.target.value)}
            required
          />
        </label>
        <label>
          Date fin
          <input
            type="date"
            value={dateFin}
            onChange={(event) => setDateFin(event.target.value)}
            required
          />
        </label>
        <label>
          Taux TVA (%)
          <input type="number" value={tauxTVA} onChange={(event) => setTauxTVA(event.target.value)} required />
        </label>

        <p className="muted">
          Les lignes, les poids, les destinataires et les montants sont recuperes automatiquement depuis les expeditions en base de donnees.
        </p>

        {error && <p className="alert-error">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Generer depuis les expeditions</button>
        </div>
      </form>
    </main>
  );
}
