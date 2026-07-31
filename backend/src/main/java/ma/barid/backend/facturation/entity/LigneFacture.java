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
    public Facture getFacture() { return facture; }
    public void setFacture(Facture facture) { this.facture = facture; }
}
