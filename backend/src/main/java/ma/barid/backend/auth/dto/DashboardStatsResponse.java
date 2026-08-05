package ma.barid.backend.auth.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DashboardStatsResponse {
    private long nombreClients;
    private long nombreCommerciaux;
    private long nombreFacteurs;
    private long nombreAgences;
}
