package ma.barid.backend.auth.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "agence")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Agence {

    @Id
    private String idAgence; // ex : "C001"

    @Column(nullable = false)
    private String nomAgence;

    private String adresse;
    private String codePostal;
    private String telephone;
    private String email;
    private String contactCommercial;

    @OneToOne
    @JoinColumn(name = "id_ville", nullable = false, unique = true)
    private Ville ville;
}