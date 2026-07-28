package ma.barid.backend.facteur;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import ma.barid.backend.auth.entity.Agence;
import ma.barid.backend.auth.entity.Utilisateur;

@Entity
@Table(name = "facteur")
@PrimaryKeyJoinColumn(name = "id_utilisateur")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = false)
public class Facteur extends Utilisateur {

    private String nom;
    private String prenom;
    private String telephone;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_agence")
    private Agence agence;
}