package ma.barid.backend.facturation.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.util.ArrayList;
import java.util.List;

public class FactureCreateRequest {
    @NotNull
    private Long clientId;
    private String clientRaisonSociale;
    private String clientIdentifiant;
    private Double tauxTVA = 20.0;
    private Double tauxRemise = 0.0;

    @Valid
    @NotEmpty
    private List<LigneFactureRequest> lignes = new ArrayList<>();

    public Long getClientId() { return clientId; }
    public void setClientId(Long clientId) { this.clientId = clientId; }
    public String getClientRaisonSociale() { return clientRaisonSociale; }
    public void setClientRaisonSociale(String clientRaisonSociale) { this.clientRaisonSociale = clientRaisonSociale; }
    public String getClientIdentifiant() { return clientIdentifiant; }
    public void setClientIdentifiant(String clientIdentifiant) { this.clientIdentifiant = clientIdentifiant; }
    public Double getTauxTVA() { return tauxTVA; }
    public void setTauxTVA(Double tauxTVA) { this.tauxTVA = tauxTVA; }
    public Double getTauxRemise() { return tauxRemise; }
    public void setTauxRemise(Double tauxRemise) { this.tauxRemise = tauxRemise; }
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
