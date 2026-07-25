package ma.barid.backend.auth.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "agence")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Agence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAgence;

    @Column(nullable = false)
    private String nomAgence;

    private String adresse;
    private String telephone;
    private String email;

    // Une ville peut desormais avoir PLUSIEURS agences (ManyToOne, plus de OneToOne)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_ville", nullable = false)
    private Ville ville;
}
