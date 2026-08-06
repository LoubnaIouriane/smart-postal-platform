package ma.barid.backend.facturation.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class FactureCreateRequest {
    @NotNull
    private Long clientId;
    @NotNull
    private LocalDate dateDebut;
    @NotNull
    private LocalDate dateFin;
    private Double tauxTVA = 20.0;

    @Valid
    private List<LigneFactureRequest> lignes = new ArrayList<>();

    public Long getClientId() { return clientId; }
    public void setClientId(Long clientId) { this.clientId = clientId; }
    public LocalDate getDateDebut() { return dateDebut; }
    public void setDateDebut(LocalDate dateDebut) { this.dateDebut = dateDebut; }
    public LocalDate getDateFin() { return dateFin; }
    public void setDateFin(LocalDate dateFin) { this.dateFin = dateFin; }
    public Double getTauxTVA() { return tauxTVA; }
    public void setTauxTVA(Double tauxTVA) { this.tauxTVA = tauxTVA; }
    public List<LigneFactureRequest> getLignes() { return lignes; }
    public void setLignes(List<LigneFactureRequest> lignes) { this.lignes = lignes; }

    public static class LigneFactureRequest {
        @NotNull
        private String designation;
        @NotNull
        @Positive
        private Integer quantite;
        @NotNull
        @Positive
        private Double prixUnitaire;
        private Long expeditionId;

        public String getDesignation() { return designation; }
        public void setDesignation(String designation) { this.designation = designation; }
        public Integer getQuantite() { return quantite; }
        public void setQuantite(Integer quantite) { this.quantite = quantite; }
        public Double getPrixUnitaire() { return prixUnitaire; }
        public void setPrixUnitaire(Double prixUnitaire) { this.prixUnitaire = prixUnitaire; }
        public Long getExpeditionId() { return expeditionId; }
        public void setExpeditionId(Long expeditionId) { this.expeditionId = expeditionId; }
    }
}
