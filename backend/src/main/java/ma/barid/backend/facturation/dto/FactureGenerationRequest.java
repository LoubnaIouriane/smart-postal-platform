package ma.barid.backend.facturation.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class FactureGenerationRequest {
    @NotNull
    private Long clientId;
    @NotNull
    private LocalDate dateDebut;
    @NotNull
    private LocalDate dateFin;
    private Double tauxTVA = 20.0;

    public Long getClientId() { return clientId; }
    public void setClientId(Long clientId) { this.clientId = clientId; }
    public LocalDate getDateDebut() { return dateDebut; }
    public void setDateDebut(LocalDate dateDebut) { this.dateDebut = dateDebut; }
    public LocalDate getDateFin() { return dateFin; }
    public void setDateFin(LocalDate dateFin) { this.dateFin = dateFin; }
    public Double getTauxTVA() { return tauxTVA; }
    public void setTauxTVA(Double tauxTVA) { this.tauxTVA = tauxTVA; }
}
