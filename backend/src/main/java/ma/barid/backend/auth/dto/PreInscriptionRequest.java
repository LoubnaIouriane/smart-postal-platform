package ma.barid.backend.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class PreInscriptionRequest {

    // Identification (au moins un des 3 attendu, valide cote service)
    private String ice;
    private String rc;
    private String patente;

    @NotBlank private String raisonSociale;
    private String activitePrincipale;
    @NotBlank private String telephone;
    @Email @NotBlank private String email;
    @NotBlank private String adresse;
    private String codePostal;

    @NotNull private Long idVille; // 1 a 8, cf. table des villes
}