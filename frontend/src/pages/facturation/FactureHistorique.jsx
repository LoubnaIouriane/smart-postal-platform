import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import StatutBadge from "../../components/StatutBadge";
import { getFacturesByClient } from "../../services/factureApi";
import { formatMontant } from "../../utils/formatMontant";

export default function FactureHistorique() {
  const [clientId, setClientId] = useState("");
  const [factures, setFactures] = useState([]);
  const [error, setError] = useState("");

  const charger = async (event) => {
    event.preventDefault();
    setError("");
    try {
      setFactures(await getFacturesByClient(clientId));
    } catch (err) {
      setError(err.response?.data?.message || "Impossible de charger l'historique.");
    }
  };

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <div className="page-header">
          <div>
            <p className="eyebrow">Espace client</p>
            <h1>Mes factures</h1>
          </div>
        </div>

        <form className="toolbar" onSubmit={charger}>
          <input
            value={clientId}
            onChange={(event) => setClientId(event.target.value)}
            placeholder="ID client"
            required
          />
          <button className="btn btn-primary" type="submit">Consulter</button>
        </form>

        {error && <p className="alert-error">{error}</p>}

        <section className="table-wrap">
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
                  <td>{facture.numeroFacture}</td>
                  <td>{facture.dateEmission}</td>
                  <td>{formatMontant(facture.montantTTC)}</td>
                  <td><StatutBadge statut={facture.statutPaiement} /></td>
                  <td><Link to={`/client/factures/${facture.idFacture}`}>Voir le detail</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </>
  );
}