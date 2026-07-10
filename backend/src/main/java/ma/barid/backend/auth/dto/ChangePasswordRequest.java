// auth/dto/ChangePasswordRequest.java
package ma.barid.backend.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ChangePasswordRequest {
    @NotBlank private String ancienMotDePasse;
    @NotBlank private String nouveauMotDePasse;
}