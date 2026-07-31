package ma.barid.backend.zaineb.entity;
import ma.barid.backend.auth.entity.Client;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "remise_client")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RemiseClient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idRemiseClient;


    private Double montantMin;


    private Double montantMax;


    private Double tauxRemise;


    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;


    @ManyToOne
    @JoinColumn(name = "grille_id")
    private GrilleRemise grilleRemise;
}