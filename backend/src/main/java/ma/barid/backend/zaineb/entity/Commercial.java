package ma.barid.backend.zaineb.entity;

import jakarta.persistence.*;
import lombok.*;
import ma.barid.backend.auth.entity.Agence;
import ma.barid.backend.auth.entity.Utilisateur;

@Entity
@Table(name = "commercial")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Commercial extends Utilisateur {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCommercial;


    private String nom;

    private String prenom;

    private String telephone;


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_agence")
    private Agence agence;

}