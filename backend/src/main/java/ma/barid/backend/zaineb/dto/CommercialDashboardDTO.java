
        package ma.barid.backend.zaineb.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommercialDashboardDTO {

    private Long nombreClients;

    private Long nombreContrats;

    private Long demandesEnAttente;

    private Double chiffreAffaire;

}
