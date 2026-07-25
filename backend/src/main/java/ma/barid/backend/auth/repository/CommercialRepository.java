package ma.barid.backend.auth.repository;

import ma.barid.backend.auth.entity.Commercial;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CommercialRepository extends JpaRepository<Commercial, Long> {
    boolean existsByAgence_IdAgence(Long idAgence);
    Optional<Commercial> findByAgence_IdAgence(Long idAgence);
}
