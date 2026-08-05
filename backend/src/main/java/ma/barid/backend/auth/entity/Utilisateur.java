package ma.barid.backend.auth.entity;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;


@Entity
@Table(name = "utilisateur")
@Inheritance(strategy = InheritanceType.JOINED)

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Utilisateur {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_utilisateur")
    private Long idUtilisateur;



    @Column(unique = true)
    private String identifiant;



    @Column(name = "mot_de_passe")
    private String motDePasse;



    @Column(nullable = false, unique = true)
    private String email;



    @Column(nullable = false)
    @Builder.Default
    private Boolean actif = false;



    @Column(name = "date_creation")
    private LocalDateTime dateCreation;



    @Column(name = "derniere_connexion")
    private LocalDateTime derniereConnexion;



    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_role", nullable = false)
    private Role role;

}