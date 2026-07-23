package ma.barid.backend.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class CommercialRequest {
    @NotBlank private String nom;
    @NotBlank private String prenom;
    @NotBlank @Email private String email;
    private String telephone;
    @NotBlank private String idAgence;
}