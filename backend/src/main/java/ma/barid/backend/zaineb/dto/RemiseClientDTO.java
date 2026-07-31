package ma.barid.backend.zaineb.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RemiseClientDTO {

    private Long idRemiseClient;

    private Double montantMin;

    private Double montantMax;

    private Double tauxRemise;

    private Long clientId;

    private Long grilleRemiseId;
}