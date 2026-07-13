package ma.barid.backend.expedition;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

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

    private String villeDepart;

    private String villeDestination;

    private String nomDestinataire;

    private String telephoneDestinataire;

    private LocalDateTime heureCollecte;

    private LocalDateTime dateCreation;

    private LocalDateTime dateAnnulation;
}