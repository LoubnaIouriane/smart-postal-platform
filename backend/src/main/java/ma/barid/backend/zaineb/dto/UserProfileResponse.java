// auth/dto/UserProfileResponse.java
package ma.barid.backend.auth.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserProfileResponse {
    private Long userId;
    private String identifiant;
    private String email;
    private String role;
    private Boolean actif;
}