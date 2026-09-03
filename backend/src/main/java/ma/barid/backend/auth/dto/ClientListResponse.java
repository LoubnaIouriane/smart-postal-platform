package ma.barid.backend.auth.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ClientListResponse {
    private Long idUtilisateur;
    private String raisonSociale;
    private String email;
    private String telephone;
    private String ville;
    private String statut;
    private LocalDateTime dateCreation; // AJOUTE : necessaire pour le graphique "par jour"
}