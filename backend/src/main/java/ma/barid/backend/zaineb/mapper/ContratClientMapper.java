package ma.barid.backend.zaineb.mapper;

import ma.barid.backend.zaineb.dto.ContratClientDTO;
import ma.barid.backend.zaineb.entity.ContratClient;
import org.springframework.stereotype.Component;

@Component
public class ContratClientMapper {


    public ContratClientDTO toDTO(ContratClient contrat) {

        ContratClientDTO dto = new ContratClientDTO();

        dto.setIdContrat(contrat.getIdContrat());
        dto.setNumeroContrat(contrat.getNumeroContrat());
        dto.setDateDebut(contrat.getDateDebut());
        dto.setDateFin(contrat.getDateFin());
        dto.setStatut(contrat.getStatut());

        return dto;
    }


    public ContratClient toEntity(ContratClientDTO dto) {

        ContratClient contrat = new ContratClient();

        contrat.setNumeroContrat(dto.getNumeroContrat());
        contrat.setDateDebut(dto.getDateDebut());
        contrat.setDateFin(dto.getDateFin());
        contrat.setStatut(dto.getStatut());

        return contrat;
    }

}