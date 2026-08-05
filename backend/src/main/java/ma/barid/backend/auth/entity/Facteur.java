package ma.barid.backend.auth.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "facteur")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Facteur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idFacteur;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    private String telephone;

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "id_utilisateur", nullable = false, unique = true)
    private Utilisateur utilisateur;

    // unique = true : une agence ne peut avoir qu'UN SEUL facteur
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_agence", nullable = false, unique = true)
    private Agence agence;
}
