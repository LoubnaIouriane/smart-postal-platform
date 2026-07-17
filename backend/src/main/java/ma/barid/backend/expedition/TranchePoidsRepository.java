package ma.barid.backend.expedition;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.Optional;

public interface TranchePoidsRepository extends JpaRepository<TranchePoids, Long> {

    @Query("SELECT t FROM TranchePoids t WHERE :poids BETWEEN t.poidsMin AND t.poidsMax")
    Optional<TranchePoids> findTrancheForPoids(@Param("poids") BigDecimal poids);
}