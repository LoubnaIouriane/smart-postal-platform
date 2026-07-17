package ma.barid.backend.facturation.service;

public interface FacturePdfService {
    byte[] genererPdf(Long idFacture);
}
