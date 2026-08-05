package ma.barid.backend.zaineb.entity;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import ma.barid.backend.auth.entity.Agence;
import ma.barid.backend.auth.entity.Utilisateur;



@Entity
@Table(name="commercial")

@PrimaryKeyJoinColumn(name="id_utilisateur")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Commercial extends Utilisateur {


    @Column(nullable = false)
    private String nom;


    @Column(nullable = false)
    private String prenom;


    private String telephone;



    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="id_agence")
    private Agence agence;

}