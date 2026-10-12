package ma.barid.backend.expedition;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ma.barid.backend.auth.entity.Facteur;
import ma.barid.backend.auth.entity.Ville;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;
import ma.barid.backend.auth.entity.Client;
@Entity
@Table(name = "expedition")
@Getter
@Setter
@NoArgsConstructor
public class Expedition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idExpedition;

    @Column(unique = true, nullable = false)
    private String codeTracking;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeEnvoi typeEnvoi;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutExpedition statut;

    private Double poids;

    private Double poidsReel;

    @ManyToOne
    @JoinColumn(name = "id_ville_depart", nullable = false)
    private Ville villeDepart;

    @ManyToOne
    @JoinColumn(name = "id_ville_destination", nullable = false)
    private Ville villeDestination;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_facteur")
    private Facteur facteurAssigne;
    // Client propriétaire de l'envoi (null pour les anciens envois). @JsonIgnore : ne jamais exposer Client (mot de passe hashé)
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id")
    private Client client;

    private String telephoneExpediteur;
    private String adresseExpediteur;

    private String nomDestinataire;
    private String telephoneDestinataire;
    private String adresseDestinataire;

    private LocalDateTime heureCollecte;

    private LocalDateTime dateCreation;

    private LocalDateTime dateAnnulation;

    private BigDecimal montant;
}