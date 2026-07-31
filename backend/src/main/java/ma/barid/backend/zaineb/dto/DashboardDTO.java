package ma.barid.backend.zaineb.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardDTO {

    private Long nbClients;

    private Long nbContrats;

    private Long nbDemandes;

    private Double chiffreAffaire;

}