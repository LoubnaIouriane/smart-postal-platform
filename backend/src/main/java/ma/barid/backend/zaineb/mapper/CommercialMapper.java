package ma.barid.backend.zaineb.mapper;

import ma.barid.backend.zaineb.dto.CommercialDTO;
import ma.barid.backend.zaineb.entity.Commercial;
import org.springframework.stereotype.Component;

@Component
public class CommercialMapper {


    public CommercialDTO toDTO(Commercial commercial) {

        if (commercial == null) {
            return null;
        }


        return CommercialDTO.builder()

                .idCommercial(commercial.getIdCommercial())

                .nom(commercial.getNom())

                .prenom(commercial.getPrenom())

                .email(commercial.getEmail())

                .telephone(commercial.getTelephone())

                .agenceId(
                        commercial.getAgence() != null
                                ? commercial.getAgence().getIdAgence()
                                : null
                )

                .build();
    }



    public Commercial toEntity(CommercialDTO dto) {

        if (dto == null) {
            return null;
        }


        Commercial commercial = new Commercial();


        commercial.setIdCommercial(dto.getIdCommercial());

        commercial.setNom(dto.getNom());

        commercial.setPrenom(dto.getPrenom());

        commercial.setEmail(dto.getEmail());

        commercial.setTelephone(dto.getTelephone());


        return commercial;
    }
}