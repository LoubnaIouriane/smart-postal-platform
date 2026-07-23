package ma.barid.backend.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class AgenceRequest {
    @NotBlank private String nomAgence;
    private String adresse;
    private String codePostal;
    private String telephone;
    private String email;
    private String contactCommercial;
    @NotNull private Long idVille;
}
