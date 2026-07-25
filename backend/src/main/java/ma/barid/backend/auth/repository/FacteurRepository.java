package ma.barid.backend.auth.repository;

import ma.barid.backend.auth.entity.Facteur;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FacteurRepository extends JpaRepository<Facteur, Long> {
    boolean existsByAgence_IdAgence(Long idAgence);
    Optional<Facteur> findByAgence_IdAgence(Long idAgence);
}
