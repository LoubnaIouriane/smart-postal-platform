package ma.barid.backend.zaineb.mapper;

import ma.barid.backend.zaineb.dto.CommercialDTO;
import ma.barid.backend.zaineb.entity.Commercial;
import org.springframework.stereotype.Component;

@Component
public class CommercialMapper {

    public CommercialDTO toDTO(Commercial commercial) {
        if (commercial == null) return null;

        return CommercialDTO.builder()
                .idCommercial(commercial.getIdUtilisateur()) // ID herite d'Utilisateur
                .nom(commercial.getNom())
                .prenom(commercial.getPrenom())
                .email(commercial.getEmail())
                .telephone(commercial.getTelephone())
                .identifiant(commercial.getIdentifiant())
                .actif(commercial.getActif())
                .agenceId(commercial.getAgence() != null ? commercial.getAgence().getIdAgence() : null)
                .agenceNom(commercial.getAgence() != null ? commercial.getAgence().getNomAgence() : null)
                .build();
    }
}