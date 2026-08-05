package ma.barid.backend.expedition;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExpeditionRequest {
    private TypeEnvoi typeEnvoi;
    private Double poids;
    private Long idVilleDepart;
    private Long idVilleDestination;

    private String telephoneExpediteur;
    private String adresseExpediteur;

    private String nomDestinataire;
    private String telephoneDestinataire;
    private String adresseDestinataire;
}