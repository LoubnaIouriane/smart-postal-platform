package ma.barid.backend.zaineb.entity;


import jakarta.persistence.*;
import lombok.*;

import java.util.List;



@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GrilleRemise {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idGrille;



    private String nomGrille;


    private Double tauxRemise;



    @OneToMany(mappedBy = "grilleRemise")
    private List<ContratClient> contrats;

}