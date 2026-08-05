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


    // Conditions / description du contrat
    private String conditions;


    // Client lié au contrat
    private Long clientId;

    // Nom du client pour affichage frontend
    private String clientNom;


    // Grille de remise liée
    private Long grilleRemiseId;

}