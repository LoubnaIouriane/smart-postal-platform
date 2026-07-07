package ma.barid.backend.zaineb.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

import ma.barid.backend.auth.entity.Agence;
import ma.barid.backend.auth.entity.Utilisateur;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Commercial extends Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCommercial;

    @ManyToOne
    @JoinColumn(name = "agence_id")
    private Agence agence;

    @OneToMany(mappedBy = "commercial")
    private List<ContratClient> contrats;

}