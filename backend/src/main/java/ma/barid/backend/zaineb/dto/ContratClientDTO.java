package ma.barid.backend.zaineb.dto;


import lombok.*;

import java.time.LocalDate;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContratClientDTO {


    private Long idContrat;


    private String numeroContrat;


    private LocalDate dateDebut;


    private LocalDate dateFin;


    private String statut;



    // Relation avec Client
    private Long clientId;



    // Relation avec GrilleRemise
    private Long grilleRemiseId;

}