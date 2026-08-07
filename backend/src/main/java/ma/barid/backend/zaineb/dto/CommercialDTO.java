package ma.barid.backend.zaineb.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommercialDTO {

    private Long idCommercial;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String identifiant;
    private Boolean actif;

    private Long agenceId;
    private String agenceNom;
}
