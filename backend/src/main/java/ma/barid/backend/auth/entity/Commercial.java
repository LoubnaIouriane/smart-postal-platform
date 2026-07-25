package ma.barid.backend.auth.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "commercial")
@PrimaryKeyJoinColumn(name = "id_utilisateur") // FK vers utilisateur.id_utilisateur
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = false)
public class Commercial extends Utilisateur {

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String prenom;

    private String telephone;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_agence", nullable = false)
    private Agence agence;
}
