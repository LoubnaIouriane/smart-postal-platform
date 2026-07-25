package ma.barid.backend.auth.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AgenceResponse {
    private String idAgence;
    private String nomAgence;
    private String adresse;
    private String codePostal;
    private String telephone;
    private String email;
    private String contactCommercial;
    private Long idVille;
    private String nomVille;
}
