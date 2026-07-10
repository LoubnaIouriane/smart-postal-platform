// auth/dto/ResetPasswordRequest.java
package ma.barid.backend.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ResetPasswordRequest {
    @NotBlank private String token;
    @NotBlank private String nouveauMotDePasse;
}