// auth/dto/RegisterRequest.java
// utile pour creer directement un Commercial/Facteur de test (compte deja actif)
package ma.barid.backend.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class RegisterRequest {
    @NotBlank private String identifiant;
    @Email @NotBlank private String email;
    @NotBlank private String motDePasse;
    @NotBlank private String role; // CLIENT / COMMERCIAL / FACTEUR
}