package ma.barid.backend.zaineb.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GrilleRemiseDTO {


    private Long idGrille;


    private Double montantMin;


    private Double montantMax;


    private Double tauxRemise;

}