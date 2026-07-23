package ma.barid.backend.auth.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CommercialResponse {
    private Long idUtilisateur;
    private String nom;
    private String prenom;
    private String identifiant;
    private String email;
    private String telephone;
    private String idAgence;
    private String nomAgence;
    private Boolean actif;
}
