package ma.barid.backend.auth.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FacteurResponse {
    private Long idFacteur;
    private String nom;
    private String prenom;
    private String identifiant;
    private String email;
    private String telephone;
    private Long idAgence;
    private String nomAgence;
    private Boolean actif;
}
