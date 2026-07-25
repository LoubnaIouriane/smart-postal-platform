package ma.barid.backend.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class FacteurRequest {
    @NotBlank private String nom;
    @NotBlank private String prenom;
    @NotBlank @Email private String email;
    private String telephone;
    @NotNull private Long idAgence;
}
