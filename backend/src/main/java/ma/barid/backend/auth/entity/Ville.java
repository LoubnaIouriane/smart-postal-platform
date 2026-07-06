package ma.barid.backend.auth.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ville")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Ville {

    @Id
    private Long idVille; // on reutilise le CODE VILLE fourni (1 a 8)

    @Column(nullable = false)
    private String nomVille;

    @Column(nullable = false, unique = true)
    private String codeVille;
}