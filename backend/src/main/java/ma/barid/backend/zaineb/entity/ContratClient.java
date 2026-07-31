package ma.barid.backend.zaineb.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

import ma.barid.backend.auth.entity.Client;

@Entity
@Table(name = "contrat_client")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContratClient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idContrat;


    private String numeroContrat;


    private LocalDate dateDebut;


    private LocalDate dateFin;


    private String statut;


    // Nouveau champ : conditions / description du contrat
    @Column(length = 2000)
    private String conditions;



    @OneToOne
    @JoinColumn(name = "client_id")
    private Client client;



    @ManyToOne
    @JoinColumn(name = "grille_remise_id")
    private GrilleRemise grilleRemise;

}