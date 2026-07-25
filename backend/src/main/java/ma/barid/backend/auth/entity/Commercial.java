package ma.barid.backend.auth.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "commercial")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Commercial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCommercial;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    private String telephone;

    // Le compte de connexion (identifiant/mot de passe/email) du commercial.
    // cascade = ALL : supprimer le Commercial supprime aussi son compte Utilisateur.
    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "id_utilisateur", nullable = false, unique = true)
    private Utilisateur utilisateur;

    // unique = true : une agence ne peut avoir qu'UN SEUL commercial
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_agence", nullable = false, unique = true)
    private Agence agence;
}
