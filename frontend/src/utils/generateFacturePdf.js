import { jsPDF } from "jspdf";

// Genere et telecharge un PDF cote navigateur, a partir des donnees (mock) d'une facture.
// Reproduit une mise en page proche de celle generee par le backend (iText).
export function genererFacturePdfMock(facture) {
  const doc = new jsPDF();
  let y = 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Barid Al-Maghrib - Smart Postal Platform", 20, y);

  y += 12;
  doc.setFontSize(18);
  doc.text(`Facture ${facture.numeroFacture}`, 20, y);

  y += 12;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Client : ${facture.clientRaisonSociale}`, 20, y);

  y += 8;
  doc.text(`Date emission : ${facture.dateEmission}`, 20, y);

  y += 8;
  doc.text(`Date echeance : ${facture.dateEcheance}`, 20, y);

  y += 12;
  doc.setFont("helvetica", "bold");
  doc.text("Designation", 20, y);
  doc.text("Qte", 118, y);
  doc.text("Prix unit.", 138, y);
  doc.text("Montant", 168, y);
  y += 2;
  doc.line(20, y, 190, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  facture.lignes.forEach((ligne) => {
    doc.text(ligne.designation, 20, y, { maxWidth: 92 });
    doc.text(String(ligne.quantite), 118, y);
    doc.text(`${ligne.prixUnitaire.toFixed(2)} MAD`, 138, y);
    doc.text(`${ligne.montantLigne.toFixed(2)} MAD`, 168, y);
    y += 10;
  });

  y += 6;
  doc.line(20, y, 190, y);
  y += 10;

  doc.text(`Montant HT brut : ${facture.montantHT.toFixed(2)} MAD`, 20, y);
  y += 8;

  if (facture.tauxRemise > 0) {
    doc.text(`Remise (${facture.tauxRemise}%) : -${facture.montantRemise.toFixed(2)} MAD`, 20, y);
    y += 8;
  }

  doc.text(`TVA (${facture.tauxTVA}%) : ${facture.montantTVA.toFixed(2)} MAD`, 20, y);
  y += 8;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(`Montant TTC : ${facture.montantTTC.toFixed(2)} MAD`, 20, y);
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Statut : ${facture.statutPaiement === "PAYEE" ? "PAYEE" : "NON PAYEE"}`, 20, y);

  if (facture.datePaiement) {
    y += 8;
    doc.text(`Payee le : ${facture.datePaiement}`, 20, y);
  }

  doc.save(`facture-${facture.numeroFacture}.pdf`);
}