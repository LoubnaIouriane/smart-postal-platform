package ma.barid.backend.expedition;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "tranche_poids")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TranchePoids {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idTranche;

    @Column(nullable = false, precision = 10, scale = 3)
    private BigDecimal poidsMin;

    @Column(nullable = false, precision = 10, scale = 3)
    private BigDecimal poidsMax;

    @Column(nullable = false)
    private BigDecimal prix;
}