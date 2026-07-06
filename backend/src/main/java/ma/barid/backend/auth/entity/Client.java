package ma.barid.backend.auth.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import ma.barid.backend.auth.enums.StatutClient;

import java.time.LocalDate;

@Entity
@Table(name = "client")
@PrimaryKeyJoinColumn(name = "id_utilisateur") // FK vers utilisateur.id_utilisateur
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = false)
public class Client extends Utilisateur {

    // --- Identification (un des 3 documents) ---
    private String ice;
    private String rc;
    private String patente;

    // --- Informations entreprise ---
    @Column(nullable = false)
    private String raisonSociale;

    private String activitePrincipale;
    private String telephone;
    private String adresse;
    private String codePostal;

    @Column(nullable = false)
    private LocalDate dateInscription;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutClient statut;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_ville", nullable = false)
    private Ville ville;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_agence")
    private Agence agence; // rempli automatiquement selon la ville
}