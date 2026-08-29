package ma.barid.backend.zaineb.mapper;

import ma.barid.backend.auth.entity.Client;
import ma.barid.backend.zaineb.dto.ContratClientDTO;
import ma.barid.backend.zaineb.entity.ContratClient;
import ma.barid.backend.zaineb.entity.GrilleRemise;
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
        dto.setConditions(contrat.getConditions());

        // CORRIGE : ces 3 lignes manquaient entierement, d'ou client_id toujours NULL en base
        if (contrat.getClient() != null) {
            dto.setClientId(contrat.getClient().getIdUtilisateur());
            dto.setClientNom(contrat.getClient().getRaisonSociale());
        }
        if (contrat.getGrilleRemise() != null) {
            dto.setGrilleRemiseId(contrat.getGrilleRemise().getIdGrille());
        }

        return dto;
    }

    public ContratClient toEntity(ContratClientDTO dto, Client client, GrilleRemise grilleRemise) {
        ContratClient contrat = new ContratClient();
        contrat.setIdContrat(dto.getIdContrat()); // important pour que updateContrat() modifie bien la ligne existante
        contrat.setNumeroContrat(dto.getNumeroContrat());
        contrat.setDateDebut(dto.getDateDebut());
        contrat.setDateFin(dto.getDateFin());
        contrat.setStatut(dto.getStatut());
        contrat.setConditions(dto.getConditions());

        // CORRIGE : c'etait entierement absent avant
        contrat.setClient(client);
        contrat.setGrilleRemise(grilleRemise);

        return contrat;
    }
}