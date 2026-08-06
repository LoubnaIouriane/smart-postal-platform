import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatutBadge from "../../components/StatutBadge";
import { formatMontant } from "../../utils/formatMontant";
import {  getFactures,
  rechercherFactures,
  telechargerPdf,
} from "../../services/factureApi";

export default function FactureList() {
  const [factures, setFactures] = useState([]);
  const [statut, setStatut] = useState("");
  const [debut, setDebut] = useState("");
  const [fin, setFin] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setFactures(await getFactures());
    } catch (err) {
      setError(err.response?.data?.message || "Impossible de charger les factures.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleFiltrer = async () => {
    setError("");
    try {
      const resultats = await rechercherFactures({
        statut: statut || undefined,
        debut: debut || undefined,
        fin: fin || undefined,
      });
      setFactures(resultats);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors du filtrage.");
    }
  };

  const handlePdf = async (facture) => {
    const blob = await telechargerPdf(facture.idFacture);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `facture-${facture.numeroFacture}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Module Facturation</p>
          <h1>Toutes les factures</h1>
        </div>
      </div>

      <section className="toolbar">
        <select value={statut} onChange={(event) => setStatut(event.target.value)}>
          <option value="">Tous statuts</option>
          <option value="PAYEE">Payee</option>
          <option value="NON_PAYEE">Non payee</option>
        </select>
        <input type="date" value={debut} onChange={(event) => setDebut(event.target.value)} />
        <input type="date" value={fin} onChange={(event) => setFin(event.target.value)} />
        <button className="btn btn-secondary" type="button" onClick={handleFiltrer}>
          Filtrer
        </button>
        <button className="btn btn-ghost" type="button" onClick={load}>
          Reinitialiser
        </button>
      </section>

      {error && <p className="alert-error">{error}</p>}
      {loading ? (
        <p className="muted">Chargement...</p>
      ) : (
        <section className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>N Facture</th>
                <th>Client</th>
                <th>Date</th>
                <th>Remise</th>
                <th>Total TTC</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {factures.map((facture) => (
                <tr key={facture.idFacture}>
                  <td>{facture.numeroFacture}</td>
                  <td>{facture.clientRaisonSociale}</td>
                  <td>{facture.dateEmission}</td>
                  <td>{facture.tauxRemise || 0}%</td>
                  <td>{formatMontant(facture.montantTTC)}</td>
                  <td><StatutBadge statut={facture.statutPaiement} /></td>
                  <td className="actions-cell">
                    <Link to={`/commercial/factures/${facture.idFacture}`}>Details</Link>
                    <button type="button" onClick={() => handlePdf(facture)}>PDF</button>
                  </td>
                </tr>
              ))}
              {factures.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty-cell">Aucune facture trouvee.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
}

