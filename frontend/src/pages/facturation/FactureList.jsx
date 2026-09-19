import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import StatutBadge from "../../components/StatutBadge";
import { formatMontant } from "../../utils/formatMontant";
import { genererFacturePdfMock } from "../../utils/generateFacturePdf";
import { FACTURES_MOCK } from "../../data/facturesMockData";

export default function FactureList() {
  const [statut, setStatut] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("");

  // Filtrage 100% local (aucun appel reseau) sur les donnees constantes
  const factures = useMemo(() => {
    if (!filtreStatut) return FACTURES_MOCK;
    return FACTURES_MOCK.filter((facture) => facture.statutPaiement === filtreStatut);
  }, [filtreStatut]);

  const handleFiltrer = () => setFiltreStatut(statut);

  const handleReset = () => {
    setStatut("");
    setFiltreStatut("");
  };

  return (
    <>
      <Navbar />

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

          <button className="btn btn-secondary" type="button" onClick={handleFiltrer}>
            Filtrer
          </button>
          <button className="btn btn-ghost" type="button" onClick={handleReset}>
            Reinitialiser
          </button>
        </section>

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
                  <td>
                    <StatutBadge statut={facture.statutPaiement} />
                  </td>
                  <td className="actions-cell">
                    <Link to={`/commercial/factures/${facture.idFacture}`}>Details</Link>
                    <button type="button" onClick={() => genererFacturePdfMock(facture)}>
                      PDF
                    </button>
                  </td>
                </tr>
              ))}

              {factures.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty-cell">
                    Aucune facture trouvee.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>
    </>
  );
}