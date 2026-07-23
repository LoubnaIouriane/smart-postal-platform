package ma.barid.backend.auth.repository;

import ma.barid.backend.auth.entity.Facteur;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FacteurRepository extends JpaRepository<Facteur, Long> {
}
