import { Link, useParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import StatutBadge from "../../components/StatutBadge";
import { useAuth } from "../../context/AuthContext";
import { formatMontant } from "../../utils/formatMontant";
import { getIdentifiantConnecte } from "../../utils/decodeToken";
import { genererFacturePdfMock } from "../../utils/generateFacturePdf";
import { getFactureClientById } from "../../data/facturesMockData";

export default function FactureDetailClient() {
  const { id } = useParams();
  const { token } = useAuth();

  const nomClient = getIdentifiantConnecte(token) || "Client";
  const facture = getFactureClientById(id, nomClient);

  if (!facture) {
    return (
      <>
        <Navbar />
        <main className="page-shell">
          <p className="alert-error">Facture introuvable.</p>
          <Link className="back-link" to="/client/factures">
            Retour a mes factures
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="page-shell detail-page">
        <div className="page-header">
          <div>
            <p className="eyebrow">Detail facture</p>
            <h1>{facture.numeroFacture}</h1>
          </div>
          <div className="header-actions">
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => genererFacturePdfMock(facture)}
            >
              Telecharger PDF
            </button>
          </div>
        </div>

        <section className="summary-grid">
          <div>
            <span>Client</span>
            <strong>{facture.clientRaisonSociale}</strong>
          </div>
          <div>
            <span>Emission</span>
            <strong>{facture.dateEmission}</strong>
          </div>
          <div>
            <span>Echeance</span>
            <strong>{facture.dateEcheance}</strong>
          </div>
          <div>
            <span>Statut</span>
            <strong>
              <StatutBadge statut={facture.statutPaiement} />
            </strong>
          </div>
        </section>

        <section className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Designation</th>
                <th>Code Expedition</th>
                <th>Poids Reel</th>
                <th>Destinataire</th>
                <th>Qte</th>
                <th>Prix unit.</th>
                <th>Montant</th>
              </tr>
            </thead>
            <tbody>
              {facture.lignes.map((ligne) => (
                <tr key={ligne.idLigne}>
                  <td>{ligne.designation}</td>
                  <td>{ligne.codeExpedition}</td>
                  <td>{ligne.poidsReel}</td>
                  <td>{ligne.destinataire}</td>
                  <td>{ligne.quantite}</td>
                  <td>{formatMontant(ligne.prixUnitaire)}</td>
                  <td>{formatMontant(ligne.montantLigne)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="totals">
          <p>
            Montant HT brut <strong>{formatMontant(facture.montantHT)}</strong>
          </p>
          {facture.tauxRemise > 0 && (
            <p>
              Remise ({facture.tauxRemise}%){" "}
              <strong>-{formatMontant(facture.montantRemise)}</strong>
            </p>
          )}
          <p>
            TVA ({facture.tauxTVA}%) <strong>{formatMontant(facture.montantTVA)}</strong>
          </p>
          <p className="grand-total">
            Total TTC <strong>{formatMontant(facture.montantTTC)}</strong>
          </p>
          {facture.datePaiement && (
            <p>
              Payee le <strong>{facture.datePaiement}</strong>
            </p>
          )}
        </section>

        <Link className="back-link" to="/client/factures">
          Retour a mes factures
        </Link>
      </main>
    </>
  );
}