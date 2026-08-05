package ma.barid.backend.zaineb.mapper;

import ma.barid.backend.zaineb.dto.GrilleRemiseDTO;
import ma.barid.backend.zaineb.entity.GrilleRemise;
import org.springframework.stereotype.Component;

@Component
public class GrilleRemiseMapper {


    public GrilleRemiseDTO toDTO(GrilleRemise grille) {


        if (grille == null) {
            return null;
        }


        return GrilleRemiseDTO.builder()
                .idGrille(grille.getIdGrille())
                .montantMin(grille.getMontantMin())
                .montantMax(grille.getMontantMax())
                .tauxRemise(grille.getTauxRemise())
                .build();

    }




    public GrilleRemise toEntity(GrilleRemiseDTO dto) {


        if (dto == null) {
            return null;
        }


        GrilleRemise grille = new GrilleRemise();


        grille.setIdGrille(dto.getIdGrille());

        grille.setMontantMin(dto.getMontantMin());

        grille.setMontantMax(dto.getMontantMax());

        grille.setTauxRemise(dto.getTauxRemise());


        return grille;

    }

}