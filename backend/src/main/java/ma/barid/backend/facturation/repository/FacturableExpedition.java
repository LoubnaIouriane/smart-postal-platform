package ma.barid.backend.facturation.repository;

import java.time.LocalDate;

public class FacturableExpedition {
    private Long idExpedition;
    private String codeExpedition;
    private String typeEnvoi;
    private Double poidsDeclare;
    private Double poidsReel;
    private String destinataireNom;
    private String destinataireTelephone;
    private String destinataireAdresse;
    private LocalDate dateCreation;
    private Double coutCalcule;
    private String motifModificationTarif;
    private Long clientId;
    private Long villeDepartId;
    private Long villeDestinationId;

    public Long getIdExpedition() { return idExpedition; }
    public void setIdExpedition(Long idExpedition) { this.idExpedition = idExpedition; }
    public String getCodeExpedition() { return codeExpedition; }
    public void setCodeExpedition(String codeExpedition) { this.codeExpedition = codeExpedition; }
    public String getTypeEnvoi() { return typeEnvoi; }
    public void setTypeEnvoi(String typeEnvoi) { this.typeEnvoi = typeEnvoi; }
    public Double getPoidsDeclare() { return poidsDeclare; }
    public void setPoidsDeclare(Double poidsDeclare) { this.poidsDeclare = poidsDeclare; }
    public Double getPoidsReel() { return poidsReel; }
    public void setPoidsReel(Double poidsReel) { this.poidsReel = poidsReel; }
    public String getDestinataireNom() { return destinataireNom; }
    public void setDestinataireNom(String destinataireNom) { this.destinataireNom = destinataireNom; }
    public String getDestinataireTelephone() { return destinataireTelephone; }
    public void setDestinataireTelephone(String destinataireTelephone) { this.destinataireTelephone = destinataireTelephone; }
    public String getDestinataireAdresse() { return destinataireAdresse; }
    public void setDestinataireAdresse(String destinataireAdresse) { this.destinataireAdresse = destinataireAdresse; }
    public LocalDate getDateCreation() { return dateCreation; }
    public void setDateCreation(LocalDate dateCreation) { this.dateCreation = dateCreation; }
    public Double getCoutCalcule() { return coutCalcule; }
    public void setCoutCalcule(Double coutCalcule) { this.coutCalcule = coutCalcule; }
    public String getMotifModificationTarif() { return motifModificationTarif; }
    public void setMotifModificationTarif(String motifModificationTarif) { this.motifModificationTarif = motifModificationTarif; }
    public Long getClientId() { return clientId; }
    public void setClientId(Long clientId) { this.clientId = clientId; }
    public Long getVilleDepartId() { return villeDepartId; }
    public void setVilleDepartId(Long villeDepartId) { this.villeDepartId = villeDepartId; }
    public Long getVilleDestinationId() { return villeDestinationId; }
    public void setVilleDestinationId(Long villeDestinationId) { this.villeDestinationId = villeDestinationId; }
}
