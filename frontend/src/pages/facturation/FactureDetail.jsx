import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import StatutBadge from "../../components/StatutBadge";
import { formatMontant } from "../../utils/formatMontant";
import { getFactureById, marquerFacturePayee, telechargerPdf } from "../../services/factureApi";

export default function FactureDetail() {
  const { id } = useParams();
  const [facture, setFacture] = useState(null);
  const [error, setError] = useState("");

  const charger = async () => {
    setError("");
    try {
      setFacture(await getFactureById(id));
    } catch (err) {
      setError(err.response?.data?.message || "Facture introuvable.");
    }
  };

  useEffect(() => {
    charger();
  }, [id]);

  const marquerPayee = async () => {
    await marquerFacturePayee(id);
    await charger();
  };

  const handlePdf = async () => {
    const blob = await telechargerPdf(id);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `facture-${facture.numeroFacture}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (error) return <main className="page-shell"><p className="alert-error">{error}</p></main>;
  if (!facture) return <main className="page-shell"><p className="muted">Chargement...</p></main>;

  return (
    <main className="page-shell detail-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Detail facture</p>
          <h1>{facture.numeroFacture}</h1>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" type="button" onClick={handlePdf}>Telecharger PDF</button>
          {facture.statutPaiement !== "PAYEE" && (
            <button className="btn btn-primary" type="button" onClick={marquerPayee}>
              Marquer payee
            </button>
          )}
        </div>
      </div>

      <section className="summary-grid">
        <div><span>Client</span><strong>{facture.clientRaisonSociale}</strong></div>
        <div><span>Emission</span><strong>{facture.dateEmission}</strong></div>
        <div><span>Echeance</span><strong>{facture.dateEcheance}</strong></div>
        <div><span>Statut</span><strong><StatutBadge statut={facture.statutPaiement} /></strong></div>
      </section>

      <section className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Designation</th>
              <th>Qte</th>
              <th>Prix unit.</th>
              <th>Montant</th>
            </tr>
          </thead>
          <tbody>
            {facture.lignes.map((ligne) => (
              <tr key={ligne.idLigne}>
                <td>{ligne.designation}</td>
                <td>{ligne.quantite}</td>
                <td>{formatMontant(ligne.prixUnitaire)}</td>
                <td>{formatMontant(ligne.montantLigne)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="totals">
        <p>Montant HT brut <strong>{formatMontant(facture.montantHT)}</strong></p>
        {facture.tauxRemise > 0 && (
          <p>Remise ({facture.tauxRemise}%) <strong>-{formatMontant(facture.montantRemise)}</strong></p>
        )}
        <p>TVA ({facture.tauxTVA}%) <strong>{formatMontant(facture.montantTVA)}</strong></p>
        <p className="grand-total">Total TTC <strong>{formatMontant(facture.montantTTC)}</strong></p>
        {facture.datePaiement && <p>Payee le <strong>{facture.datePaiement}</strong></p>}
      </section>

      <Link className="back-link" to="/commercial/factures">Retour aux factures</Link>
    </main>
  );
}
