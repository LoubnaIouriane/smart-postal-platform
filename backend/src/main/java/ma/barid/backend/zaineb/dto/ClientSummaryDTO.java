package ma.barid.backend.zaineb.dto;

import lombok.*;
import java.time.LocalDateTime;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ClientSummaryDTO {
    private Long idClient;
    private String raisonSociale;
    private String email;
    private String telephone;
    private String ville;
    private String agence;
    private String statut;
    private LocalDateTime dateInscription;
}