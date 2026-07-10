package ma.barid.backend.zaineb.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import ma.barid.backend.auth.entity.Agence;
import ma.barid.backend.auth.entity.Utilisateur;

@Entity
@Table(name = "commercial")
@PrimaryKeyJoinColumn(name = "id_utilisateur") // FK vers utilisateur.id_utilisateur, PAS de nouvel @Id
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = false)
public class Commercial extends Utilisateur {

    private String nom;
    private String prenom;
    private String telephone;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_agence")
    private Agence agence;
}