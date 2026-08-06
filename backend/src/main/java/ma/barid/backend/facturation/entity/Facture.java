package ma.barid.backend.facturation.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import ma.barid.backend.facturation.enums.StatutPaiement;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "factures")
public class Facture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idFacture;

    @Column(nullable = false, unique = true)
    private String numeroFacture;

    @Column(nullable = false)
    private Long clientId;

    @Column(nullable = false)
    private String clientRaisonSociale;

    @Column(nullable = false)
    private String clientIdentifiant;

    @Column(nullable = false)
    private LocalDate dateEmission;

    @Column(nullable = false)
    private LocalDate dateEcheance;

    private LocalDate dateDebutFacturation;
    private LocalDate dateFinFacturation;

    @Column(nullable = false)
    private String sourceGeneration = "EXPEDITIONS";

    @Column(nullable = false)
    private Double montantHT = 0.0;

    @Column(nullable = false)
    private Double tauxTVA = 20.0;

    @Column(nullable = false)
    private Double montantTVA = 0.0;

    @Column(nullable = false)
    private Double montantTTC = 0.0;

    @Column(nullable = false)
    private Double tauxRemise = 0.0;

    @Column(nullable = false)
    private Double montantRemise = 0.0;

    private LocalDate datePaiement;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutPaiement statutPaiement = StatutPaiement.NON_PAYEE;

    @OneToMany(mappedBy = "facture", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LigneFacture> lignes = new ArrayList<>();

    public Long getIdFacture() { return idFacture; }
    public void setIdFacture(Long idFacture) { this.idFacture = idFacture; }
    public String getNumeroFacture() { return numeroFacture; }
    public void setNumeroFacture(String numeroFacture) { this.numeroFacture = numeroFacture; }
    public Long getClientId() { return clientId; }
    public void setClientId(Long clientId) { this.clientId = clientId; }
    public String getClientRaisonSociale() { return clientRaisonSociale; }
    public void setClientRaisonSociale(String clientRaisonSociale) { this.clientRaisonSociale = clientRaisonSociale; }
    public String getClientIdentifiant() { return clientIdentifiant; }
    public void setClientIdentifiant(String clientIdentifiant) { this.clientIdentifiant = clientIdentifiant; }
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
    public StatutPaiement getStatutPaiement() { return statutPaiement; }
    public void setStatutPaiement(StatutPaiement statutPaiement) { this.statutPaiement = statutPaiement; }
    public List<LigneFacture> getLignes() { return lignes; }
    public void setLignes(List<LigneFacture> lignes) { this.lignes = lignes; }
}
