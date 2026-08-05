package ma.barid.backend.facturation.dto;

public class LigneFactureDTO {
    private Long idLigne;
    private String designation;
    private Integer quantite;
    private Double prixUnitaire;
    private Double montantLigne;
    private Long expeditionId;

    public Long getIdLigne() { return idLigne; }
    public void setIdLigne(Long idLigne) { this.idLigne = idLigne; }
    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }
    public Integer getQuantite() { return quantite; }
    public void setQuantite(Integer quantite) { this.quantite = quantite; }
    public Double getPrixUnitaire() { return prixUnitaire; }
    public void setPrixUnitaire(Double prixUnitaire) { this.prixUnitaire = prixUnitaire; }
    public Double getMontantLigne() { return montantLigne; }
    public void setMontantLigne(Double montantLigne) { this.montantLigne = montantLigne; }
    public Long getExpeditionId() { return expeditionId; }
    public void setExpeditionId(Long expeditionId) { this.expeditionId = expeditionId; }
}
