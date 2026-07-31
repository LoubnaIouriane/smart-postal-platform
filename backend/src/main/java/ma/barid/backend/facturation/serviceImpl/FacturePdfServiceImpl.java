package ma.barid.backend.facturation.serviceImpl;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import ma.barid.backend.facturation.entity.Facture;
import ma.barid.backend.facturation.entity.LigneFacture;
import ma.barid.backend.facturation.exception.ResourceNotFoundException;
import ma.barid.backend.facturation.repository.FactureRepository;
import ma.barid.backend.facturation.service.FacturePdfService;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class FacturePdfServiceImpl implements FacturePdfService {

    private final FactureRepository factureRepository;

    public FacturePdfServiceImpl(FactureRepository factureRepository) {
        this.factureRepository = factureRepository;
    }

    @Override
    public byte[] genererPdf(Long idFacture) {
        Facture facture = factureRepository.findById(idFacture)
                .orElseThrow(() -> new ResourceNotFoundException("Facture introuvable avec id=" + idFacture));

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(out);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        document.add(new Paragraph("Barid Al-Maghrib - Smart Postal Platform").setBold());
        document.add(new Paragraph("Facture " + facture.getNumeroFacture()).setBold().setFontSize(18));
        document.add(new Paragraph("Client : " + facture.getClientRaisonSociale()));
        document.add(new Paragraph("Date emission : " + facture.getDateEmission()));
        document.add(new Paragraph("Date echeance : " + facture.getDateEcheance()));
        document.add(new Paragraph(" "));

        Table table = new Table(4);
        table.addHeaderCell("Designation");
        table.addHeaderCell("Quantite");
        table.addHeaderCell("Prix unitaire");
        table.addHeaderCell("Montant");

        for (LigneFacture ligne : facture.getLignes()) {
            table.addCell(ligne.getDesignation());
            table.addCell(String.valueOf(ligne.getQuantite()));
            table.addCell(String.format("%.2f MAD", ligne.getPrixUnitaire()));
            table.addCell(String.format("%.2f MAD", ligne.getMontantLigne()));
        }
        document.add(table);

        document.add(new Paragraph(" "));
        document.add(new Paragraph("Montant HT brut : " + String.format("%.2f MAD", facture.getMontantHT())));
        if (facture.getTauxRemise() != null && facture.getTauxRemise() > 0) {
            document.add(new Paragraph("Remise (" + facture.getTauxRemise() + "%) : -"
                    + String.format("%.2f MAD", facture.getMontantRemise())));
        }
        document.add(new Paragraph("TVA (" + facture.getTauxTVA() + "%) : "
                + String.format("%.2f MAD", facture.getMontantTVA())));
        document.add(new Paragraph("Montant TTC : " + String.format("%.2f MAD", facture.getMontantTTC())).setBold());
        document.add(new Paragraph("Statut : " + facture.getStatutPaiement()));
        if (facture.getDatePaiement() != null) {
            document.add(new Paragraph("Payee le : " + facture.getDatePaiement()));
        }

        document.close();
        return out.toByteArray();
    }
}
