package ma.barid.backend.auth.dto;

import lombok.*;
import java.util.Map;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DashboardStatsResponse {
    private long nombreClients;
    private long nombreCommerciaux;
    private long nombreFacteurs;
    private long nombreAgences;

    // Line chart : evolution des pre-inscriptions par mois (6 derniers mois)
    private Map<String, Long> preInscriptionsParMois;

    // Bar chart : expeditions regroupees par statut
    private Map<String, Long> statutExpeditions;

    // Bar chart : clients regroupes par ville
    private Map<String, Long> clientsParVille;

    // Activite (nombre de pre-inscriptions creees sur chaque periode)
    private long activiteAujourdHui;
    private long activiteCetteSemaine;
    private long activiteCeMois;

    // Team performance
    private Double tauxLivraisonFacteurs;
    private Double tauxValidationCommerciaux;
    private Double tauxAgencesCompletes;

    // Calendrier du jour
    private long colisADistribuerAujourdHui;
    private long preInscriptionsAValider;
    private long expeditionsCreesAujourdHui;
}