import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import StatutBadge from "../../components/StatutBadge";
import { useAuth } from "../../context/AuthContext";
import { formatMontant } from "../../utils/formatMontant";
import { getIdentifiantConnecte } from "../../utils/decodeToken";
import { genererFacturePdfMock } from "../../utils/generateFacturePdf";
import { getFacturesClient } from "../../data/facturesMockData";

export default function FactureHistorique() {
  const { token } = useAuth();

  // Nom reel du client connecte, lu depuis le token JWT
  const nomClient = getIdentifiantConnecte(token) || "Client";

  // Historique (donnees constantes, identiques pour tout client)
  const factures = getFacturesClient(nomClient);

  return (
    <>
      <Navbar />

      <main className="page-shell">
        <div className="page-header">
          <div>
            <p className="eyebrow">Espace client</p>
            <h1>Mes factures</h1>
            <p className="muted">Bonjour {nomClient}, voici l'historique de vos factures.</p>
          </div>
        </div>

        <section className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>N Facture</th>
                <th>Date</th>
                <th>Echeance</th>
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
                  <td>{facture.dateEmission}</td>
                  <td>{facture.dateEcheance}</td>
                  <td>{facture.tauxRemise || 0}%</td>
                  <td>{formatMontant(facture.montantTTC)}</td>
                  <td>
                    <StatutBadge statut={facture.statutPaiement} />
                  </td>
                  <td className="actions-cell">
                    <Link to={`/client/factures/${facture.idFacture}`}>Details</Link>
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