package ma.barid.backend.facturation.dto;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class FactureDTO {
    private Long idFacture;
    private String numeroFacture;
    private Long clientId;
    private String clientRaisonSociale;
    private LocalDate dateEmission;
    private LocalDate dateEcheance;
    private LocalDate dateDebutFacturation;
    private LocalDate dateFinFacturation;
    private String sourceGeneration;
    private Double montantHT;
    private Double tauxTVA;
    private Double montantTVA;
    private Double montantTTC;
    private Double tauxRemise;
    private Double montantRemise;
    private LocalDate datePaiement;
    private String statutPaiement;
    private List<LigneFactureDTO> lignes = new ArrayList<>();

    public Long getIdFacture() { return idFacture; }
    public void setIdFacture(Long idFacture) { this.idFacture = idFacture; }
    public String getNumeroFacture() { return numeroFacture; }
    public void setNumeroFacture(String numeroFacture) { this.numeroFacture = numeroFacture; }
    public Long getClientId() { return clientId; }
    public void setClientId(Long clientId) { this.clientId = clientId; }
    public String getClientRaisonSociale() { return clientRaisonSociale; }
    public void setClientRaisonSociale(String clientRaisonSociale) { this.clientRaisonSociale = clientRaisonSociale; }
    public LocalDate getDateEmission() { return dateEmission; }
    public void setDateEmission(LocalDate dateEmission) { this.dateEmission = dateEmission; }
    public LocalDate getDateEcheance() { return dateEcheance; }
    public void setDateEcheance(LocalDate dateEcheance) { this.dateEcheance = dateEcheance; }
    public LocalDate getDateDebutFacturation() { return dateDebutFacturation; }
    public void setDateDebutFacturation(LocalDate dateDebutFacturation) { this.dateDebutFacturation = dateDebutFacturation; }
    public LocalDate getDateFinFacturation() { return dateFinFacturation; }
    public void setDateFinFacturation(LocalDate dateFinFacturation) { this.dateFinFacturation = dateFinFacturation; }
    public String getSourceGeneration() { return sourceGeneration; }
    public void setSourceGeneration(String sourceGeneration) { this.sourceGeneration = sourceGeneration; }
    public Double getMontantHT() { return montantHT; }
    public void setMontantHT(Double montantHT) { this.montantHT = montantHT; }
    public Double getTauxTVA() { return tauxTVA; }
    public void setTauxTVA(Double tauxTVA) { this.tauxTVA = tauxTVA; }
    public Double getMontantTVA() { return montantTVA; }
    public void setMontantTVA(Double montantTVA) { this.montantTVA = montantTVA; }
    public Double getMontantTTC() { return montantTTC; }
    public void setMontantTTC(Double montantTTC) { this.montantTTC = montantTTC; }
    public Double getTauxRemise() { return tauxRemise; }
    public void setTauxRemise(Double tauxRemise) { this.tauxRemise = tauxRemise; }
    public Double getMontantRemise() { return montantRemise; }
    public void setMontantRemise(Double montantRemise) { this.montantRemise = montantRemise; }
    public LocalDate getDatePaiement() { return datePaiement; }
    public void setDatePaiement(LocalDate datePaiement) { this.datePaiement = datePaiement; }
    public String getStatutPaiement() { return statutPaiement; }
    public void setStatutPaiement(String statutPaiement) { this.statutPaiement = statutPaiement; }
    public List<LigneFactureDTO> getLignes() { return lignes; }
    public void setLignes(List<LigneFactureDTO> lignes) { this.lignes = lignes; }
}
