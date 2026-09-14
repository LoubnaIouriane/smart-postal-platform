package ma.barid.backend.facturation.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "lignes_facture")
public class LigneFacture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idLigne;

    private String designation;
    private Integer quantite;
    private Double prixUnitaire;
    private Double montantLigne;
    private Long expeditionId;
    private String codeExpedition;
    private String typeEnvoi;
    private Double poidsDeclare;
    private Double poidsReel;
    private String destinataireNom;
    private String destinataireTelephone;
    private String destinataireAdresse;
    private String motifModificationTarif;
    private Long villeDepartId;
    private Long villeDestinationId;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "facture_id", nullable = false)
    private Facture facture;

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
    public String getMotifModificationTarif() { return motifModificationTarif; }
    public void setMotifModificationTarif(String motifModificationTarif) { this.motifModificationTarif = motifModificationTarif; }
    public Long getVilleDepartId() { return villeDepartId; }
    public void setVilleDepartId(Long villeDepartId) { this.villeDepartId = villeDepartId; }
    public Long getVilleDestinationId() { return villeDestinationId; }
    public void setVilleDestinationId(Long villeDestinationId) { this.villeDestinationId = villeDestinationId; }
    public Facture getFacture() { return facture; }
    public void setFacture(Facture facture) { this.facture = facture; }
}
