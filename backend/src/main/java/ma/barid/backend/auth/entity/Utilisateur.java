package ma.barid.backend.auth.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Entity
@Table(name = "utilisateur")
@Inheritance(strategy = InheritanceType.JOINED)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@SuperBuilder
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUtilisateur;

    @Column(unique = true)
    private String identifiant; // null tant que la pre-inscription n'est pas validee

    private String motDePasse; // hash BCrypt, null tant que non valide

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private Boolean actif = false; // false par defaut : active uniquement apres validation

    private LocalDateTime dateCreation;

    private LocalDateTime derniereConnexion;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_role", nullable = false)
    private Role role;
}