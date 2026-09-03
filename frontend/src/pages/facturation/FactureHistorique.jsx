import { useState } from "react";
import { Link } from "react-router-dom";
import StatutBadge from "../../components/StatutBadge";
import { getFacturesByClient } from "../../services/factureApi";
import { formatMontant } from "../../utils/formatMontant";

export default function FactureHistorique() {
  const [clientId, setClientId] = useState("");
  const [factures, setFactures] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const charger = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      setFactures(await getFacturesByClient(clientId));
      setSearched(true);
    } catch (err) {
      setError(err.response?.data?.message || "Impossible de charger l'historique.");
      setFactures([]);
    } finally {
      setLoading(false);
    }
  };

  const totalTTC = factures.reduce((sum, f) => sum + (f.montantTTC || 0), 0);
  const totalPaye = factures
    .filter((f) => f.statutPaiement === "PAYEE")
    .reduce((sum, f) => sum + (f.montantTTC || 0), 0);
  const totalImpaye = totalTTC - totalPaye;
  const nbEnRetard = factures.filter(
    (f) => f.statutPaiement !== "PAYEE" && new Date(f.dateEcheance) < new Date()
  ).length;

  return (
    <main className="client-invoices-page">
      <style>{`
        .client-invoices-page {
          max-width: 1100px;
          margin: 0 auto;
          padding: 32px 24px 64px;
          font-family: inherit;
        }
        .ci-eyebrow {
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 12px;
          font-weight: 700;
          color: #7A8194;
          margin: 0 0 6px;
        }
        .ci-title {
          font-size: 34px;
          font-weight: 800;
          margin: 0 0 24px;
          color: #16213E;
        }
        .ci-search-card {
          display: flex;
          gap: 12px;
          align-items: center;
          background: #fff;
          border: 1px solid #E3E6EA;
          border-radius: 12px;
          padding: 16px 20px;
          margin-bottom: 24px;
          box-shadow: 0 2px 10px rgba(20,30,60,0.04);
        }
        .ci-search-card input {
          flex: 1;
          max-width: 220px;
          padding: 10px 14px;
          border: 1px solid #D6DAE2;
          border-radius: 8px;
          font-size: 14px;
        }
        .ci-search-card input:focus {
          outline: none;
          border-color: #0057B8;
          box-shadow: 0 0 0 3px rgba(0,87,184,0.12);
        }
        .ci-btn {
          background: #0057B8;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 10px 22px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .ci-btn:hover { background: #00408A; }
        .ci-btn:disabled { opacity: 0.6; cursor: default; }
        .ci-alert {
          background: #FEECEC;
          border: 1px solid #F5B4B4;
          color: #B3261E;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 14px;
        }
        .ci-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }
        .ci-stat {
          background: #fff;
          border: 1px solid #E3E6EA;
          border-radius: 12px;
          padding: 18px 20px;
          box-shadow: 0 2px 10px rgba(20,30,60,0.04);
        }
        .ci-stat .label {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #7A8194;
          margin: 0 0 8px;
        }
        .ci-stat .value {
          font-size: 22px;
          font-weight: 800;
          color: #16213E;
        }
        .ci-stat.paid .value { color: #2F9E63; }
        .ci-stat.unpaid .value { color: #E0A800; }
        .ci-stat.late .value { color: #D64545; }
        .ci-table-card {
          background: #fff;
          border: 1px solid #E3E6EA;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(20,30,60,0.04);
        }
        .ci-table-card table { width: 100%; border-collapse: collapse; }
        .ci-table-card thead th {
          text-align: left;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #7A8194;
          font-weight: 700;
          padding: 14px 20px;
          background: #F7F8FA;
          border-bottom: 1px solid #E3E6EA;
        }
        .ci-table-card tbody td {
          padding: 16px 20px;
          font-size: 14px;
          color: #333;
          border-bottom: 1px solid #F0F1F3;
        }
        .ci-table-card tbody tr:last-child td { border-bottom: none; }
        .ci-table-card tbody tr:hover { background: #FAFBFC; }
        .ci-numero { font-weight: 700; color: #16213E; }
        .ci-link {
          color: #0057B8;
          font-weight: 600;
          text-decoration: none;
          font-size: 13px;
        }
        .ci-link:hover { text-decoration: underline; }
        .ci-empty {
          padding: 48px 20px;
          text-align: center;
          color: #7A8194;
          font-size: 14px;
        }
      `}</style>

      <p className="ci-eyebrow">Espace client</p>
      <h1 className="ci-title">Mes factures</h1>

      <form className="ci-search-card" onSubmit={charger}>
        <input
          value={clientId}
          onChange={(event) => setClientId(event.target.value)}
          placeholder="ID client"
          required
        />
        <button className="ci-btn" type="submit" disabled={loading}>
          {loading ? "Chargement..." : "Consulter"}
        </button>
      </form>

      {error && <p className="ci-alert">{error}</p>}

      {searched && !error && (
        <div className="ci-stats">
          <div className="ci-stat">
            <p className="label">Factures</p>
            <p className="value">{factures.length}</p>
          </div>
          <div className="ci-stat paid">
            <p className="label">Total payé</p>
            <p className="value">{formatMontant(totalPaye)}</p>
          </div>
          <div className="ci-stat unpaid">
            <p className="label">Total impayé</p>
            <p className="value">{formatMontant(totalImpaye)}</p>
          </div>
          <div className="ci-stat late">
            <p className="label">En retard</p>
            <p className="value">{nbEnRetard}</p>
          </div>
        </div>
      )}

      <div className="ci-table-card">
        {factures.length === 0 ? (
          <p className="ci-empty">
            {searched ? "Aucune facture trouvee pour ce client." : "Entrez un ID client puis cliquez sur Consulter."}
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>N Facture</th>
                <th>Date</th>
                <th>Total TTC</th>
                <th>Statut</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {factures.map((facture) => (
                <tr key={facture.idFacture}>
                  <td className="ci-numero">{facture.numeroFacture}</td>
                  <td>{facture.dateEmission}</td>
                  <td>{formatMontant(facture.montantTTC)}</td>
                  <td><StatutBadge statut={facture.statutPaiement} /></td>
                  <td>
                    <Link className="ci-link" to={`/client/factures/${facture.idFacture}`}>
                      Voir le detail →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
