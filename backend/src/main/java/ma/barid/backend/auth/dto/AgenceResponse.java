package ma.barid.backend.auth.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AgenceResponse {
    private Long idAgence;
    private String nomAgence;
    private String adresse;
    private String telephone;
    private String email;
    private Long idVille;
    private String nomVille;

    private boolean hasCommercial;
    private String nomCommercial;
    private String telephoneCommercial;
    private String emailCommercial;

    private boolean hasFacteur;
    private String nomFacteur;
    private String telephoneFacteur;
    private String emailFacteur;
}