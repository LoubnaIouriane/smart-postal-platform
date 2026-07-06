// auth/dto/LoginResponse.java
package ma.barid.backend.auth.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LoginResponse {
    private String token;
    private String role;
    private Long userId;
}