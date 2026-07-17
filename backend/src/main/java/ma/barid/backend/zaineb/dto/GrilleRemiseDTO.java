package ma.barid.backend.zaineb.dto;


import lombok.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GrilleRemiseDTO {


    private Long idGrille;


    private String nomGrille;


    private Double tauxRemise;

}