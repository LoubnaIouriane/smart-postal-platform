package ma.barid.backend.auth.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VilleResponse {
    private Long idVille;
    private String nomVille;
    private String codeVille;
}
