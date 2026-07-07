package ma.barid.backend.zaineb.mapper;


import ma.barid.backend.zaineb.dto.ContratClientDTO;
import ma.barid.backend.zaineb.entity.ContratClient;
import org.springframework.stereotype.Component;


@Component
public class ContratClientMapper {



    public ContratClientDTO toDTO(ContratClient contrat){


        return ContratClientDTO.builder()

                .idContrat(contrat.getIdContrat())

                .numeroContrat(contrat.getNumeroContrat())

                .dateDebut(contrat.getDateDebut())

                .dateFin(contrat.getDateFin())

                .statut(contrat.getStatut())


                .clientId(
                        contrat.getClient() != null ?
                                contrat.getClient().getIdClient()
                                : null
                )


                .grilleRemiseId(
                        contrat.getGrilleRemise() != null ?
                                contrat.getGrilleRemise().getIdGrille()
                                : null
                )

                .build();

    }





    public ContratClient toEntity(ContratClientDTO dto){


        ContratClient contrat = new ContratClient();


        contrat.setIdContrat(dto.getIdContrat());

        contrat.setNumeroContrat(dto.getNumeroContrat());

        contrat.setDateDebut(dto.getDateDebut());

        contrat.setDateFin(dto.getDateFin());

        contrat.setStatut(dto.getStatut());


        return contrat;

    }

}