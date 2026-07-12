package ma.barid.backend.zaineb.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "grille_remise")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GrilleRemise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idGrille;

    @Column(nullable = false)
    private String nomGrille;

    @Column(nullable = false)
    private Double tauxRemise;


    @OneToMany(mappedBy = "grilleRemise")
    private List<ContratClient> contrats;
}