package ma.barid.backend.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class AgenceRequest {
    @NotBlank private String nomAgence;
    private String adresse;
    private String telephone;
    private String email;
    @NotNull private Long idVille;

    // ---- Commercial (optionnel a la creation de l'agence) ----
    private String commercialNom;
    private String commercialPrenom;
    private String commercialTelephone;
    @Email private String commercialEmail;

    // ---- Facteur (optionnel a la creation de l'agence) ----
    private String facteurNom;
    private String facteurPrenom;
    private String facteurTelephone;
    @Email private String facteurEmail;
}